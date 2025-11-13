// backend/socketHandler.js
const { Room, Questions } = require('./models/Room');

function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 New connection:', socket.id);

    socket.on('join-room', async ({ roomId, playerName, oldSocketId }) => {
      try {
        if (!roomId || !playerName) {
          socket.emit('error-message', 'Missing roomId or playerName');
          return;
        }

        let room = await Room.findOne({ roomId }).populate('question');

        if (!room) {
          const qCount = await Questions.countDocuments();
          const random = Math.floor(Math.random() * qCount);
          const question = await Questions.findOne().skip(random);

          room = new Room({
            roomId,
            players: [{ socketId: socket.id, name: playerName, online: true, code: '' }],
            chat: [],
            question: question._id,
            winner: null,
          });

          console.log(`🆕 Created new room ${roomId}`);
        } else {
          // Check if reconnect
          let player = room.players.find(
            (p) => p.name === playerName || p.socketId === oldSocketId
          );

          if (player) {
            console.log(`🔁 Reconnect: ${playerName} -> new socket ${socket.id}`);
            player.socketId = socket.id;
            player.online = true;
          } else if (room.players.length < 2) {
            room.players.push({
              socketId: socket.id,
              name: playerName,
              online: true,
              code: '',
            });
            console.log(`👥 ${playerName} joined ${roomId}`);
          } else {
            socket.emit('error-message', 'Room is full');
            return;
          }
        }

        await room.save();
        await room.populate('question');
        socket.join(roomId);
        io.to(roomId).emit('room-update', room);
      } catch (err) {
        console.error('join-room error:', err.message);
        socket.emit('error-message', 'Join failed');
      }
    });

    socket.on('code-change', ({ roomId, code }) => {
      socket.to(roomId).emit('code-update', { playerId: socket.id, code });
      Room.findOne({ roomId }).then((room) => {
        if (!room) return;
        const player = room.players.find((p) => p.socketId === socket.id);
        if (player) {
          player.code = code;
          room.save().catch((e) => console.error('save error', e));
        }
      });
    });

    socket.on('send-chat', async ({ roomId, message }) => {
      const room = await Room.findOne({ roomId });
      if (!room) return;
      const player = room.players.find((p) => p.socketId === socket.id);
      room.chat.push({
        playerName: player?.name || 'Unknown',
        message,
        timestamp: new Date(),
      });
      await room.save();
      io.to(roomId).emit('chat-update', room.chat);
    });

    socket.on('player-finished', async ({ roomId, playerName }) => {
      const room = await Room.findOne({ roomId });
      if (!room) return;

      if (room.winner?.id) {
        socket.emit('announce-winner', {
          winnerId: room.winner.id,
          winnerName: room.winner.name,
        });
        return;
      }

      room.winner = { id: socket.id, name: playerName };
      await room.save();

      io.to(roomId).emit('announce-winner', {
        winnerId: socket.id,
        winnerName: playerName,
      });
      console.log(`🏆 ${playerName} (${socket.id}) won room ${roomId}`);
    });

    socket.on('leave-room', async (roomId) => {
      socket.leave(roomId);
      const room = await Room.findOne({ roomId });
      if (!room) return;
      const player = room.players.find((p) => p.socketId === socket.id);
      if (player) {
        player.online = false;
        await room.save();
        io.to(roomId).emit('room-update', room);
      }
    });

    socket.on('disconnect', async () => {
      const rooms = await Room.find({ 'players.socketId': socket.id });
      for (const room of rooms) {
        const player = room.players.find((p) => p.socketId === socket.id);
        if (player) player.online = false;
        await room.save();
        io.to(room.roomId).emit('room-update', room);
      }
      console.log('🔴 Disconnected:', socket.id);
    });
  });
}

module.exports = { initializeSocket };
