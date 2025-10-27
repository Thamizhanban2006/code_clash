// backend/socketHandler.js
const { Room, Questions } = require('./models/Room');

function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 New connection:', socket.id);

    // Join room: payload { roomId, playerName }
    socket.on('join-room', async ({ roomId, playerName }) => {
      try {
        if (!roomId) {
          socket.emit('error-message', 'Missing roomId');
          return;
        }

        // Find room and populate question
        let room = await Room.findOne({ roomId }).populate('question');

        // Create room if not exists
        if (!room) {
          const qCount = await Questions.countDocuments();
          if (qCount === 0) {
            socket.emit('error-message', 'No questions in DB');
            return;
          }
          const random = Math.floor(Math.random() * qCount);
          const randomQuestion = await Questions.findOne().skip(random);

          room = new Room({
            roomId,
            players: [{ socketId: socket.id, name: playerName, online: true, code: '' }],
            chat: [],
            question: randomQuestion ? randomQuestion._id : null,
            winner: null
          });
        } else {
          // add player if not already present, keep max 2
          if (!room.players.some(p => p.socketId === socket.id)) {
            if (room.players.length >= 2) {
              socket.emit('room-full');
              return;
            }
            room.players.push({ socketId: socket.id, name: playerName, online: true, code: '' });
          } else {
            // mark online if reconnect
            const p = room.players.find(p => p.socketId === socket.id);
            if (p) p.online = true;
          }
        }

        await room.save();
        await room.populate('question');
        socket.join(roomId);

        // Emit room state (with populated question) to all in room
        io.to(roomId).emit('room-update', room);

        console.log(`👥 Player ${playerName} joined room ${roomId}`);
      } catch (err) {
        console.error('join-room error:', err);
        socket.emit('error-message', 'Failed to join room.');
      }
    });

    // Real-time code sync: payload { roomId, code }
    socket.on('code-change', ({ roomId, code }) => {
      // broadcast to others in the room immediately
      socket.to(roomId).emit('code-update', { playerId: socket.id, code });

      // persist to DB in background (non-blocking)
      Room.findOne({ roomId }).then(room => {
        if (!room) return;
        const player = room.players.find(p => p.socketId === socket.id);
        if (player) {
          player.code = code;
          room.save().catch(err => console.error('save error:', err.message));
        }
      }).catch(err => console.error('room find error:', err.message));
    });

    // Chat: payload { roomId, message }
    socket.on('send-chat', async ({ roomId, message }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;
        const player = room.players.find(p => p.socketId === socket.id);
        const chatMessage = {
          playerName: player?.name || 'Unknown',
          message,
          timestamp: new Date()
        };
        room.chat.push(chatMessage);
        await room.save();
        io.to(roomId).emit('chat-update', room.chat);
      } catch (err) {
        console.error('send-chat error:', err);
      }
    });

    // Player finished: payload { roomId, playerName }
    socket.on('player-finished', async ({ roomId, playerName }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        // if winner already decided, just notify the emitter they lost
        if (room.winner && room.winner.id) {
          socket.emit('announce-winner', { winnerId: room.winner.id, winnerName: room.winner.name });
          return;
        }

        // declare winner
        room.winner = { id: socket.id, name: playerName };
        await room.save();

        // Broadcast winner info to everyone in the room
        io.to(roomId).emit('announce-winner', { winnerId: socket.id, winnerName: playerName });

        console.log(`🏆 ${playerName} (${socket.id}) won room ${roomId}`);

        // optional: cleanup room after 20s (uncomment if desired)
        // setTimeout(() => Room.deleteOne({ roomId }).catch(e=>{}), 20000);
      } catch (err) {
        console.error('player-finished error:', err.message);
      }
    });

    // leave-room (optional explicit leave)
    socket.on('leave-room', async (roomId) => {
      try {
        socket.leave(roomId);
        const room = await Room.findOne({ roomId });
        if (!room) return;
        const player = room.players.find(p => p.socketId === socket.id);
        if (player) {
          player.online = false;
          await room.save();
          io.to(roomId).emit('room-update', room);
        }
      } catch (err) {
        console.error('leave-room error:', err);
      }
    });

    // disconnect
    socket.on('disconnect', async () => {
      try {
        const rooms = await Room.find({ 'players.socketId': socket.id });
        for (let room of rooms) {
          const player = room.players.find((p) => p.socketId === socket.id);
          if (player) player.online = false;
          await room.save();
          io.to(room.roomId).emit('room-update', room);
        }
        console.log('🔴 Disconnected:', socket.id);
      } catch (err) {
        console.error('disconnect error:', err);
      }
    });
  });
}

module.exports = { initializeSocket };
