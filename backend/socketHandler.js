// backend/socketHandler.js
const { Room, Questions } = require('./models/Room');

// Store active timers per room
const roomTimers = new Map();

function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 New connection:', socket.id);

    // Join room with multiplayer support
    socket.on('join-room', async ({ roomId, playerName, oldSocketId, maxPlayers = 4 }) => {
      try {
        if (!roomId || !playerName) {
          socket.emit('error-message', 'Missing roomId or playerName');
          return;
        }

        let room = await Room.findOne({ roomId }).populate('question');

        if (!room) {
          // Create new room with random question
          const qCount = await Questions.countDocuments();
          const random = Math.floor(Math.random() * qCount);
          const question = await Questions.findOne().skip(random);

          room = new Room({
            roomId,
            maxPlayers: Math.min(4, Math.max(2, maxPlayers)),
            players: [{
              socketId: socket.id,
              name: playerName,
              online: true,
              code: '',
              status: 'waiting',
              isHost: true // First player is host
            }],
            chat: [],
            question: question ? question._id : null,
            gameState: 'lobby'
          });

          console.log(`🆕 Created new room ${roomId} with max ${room.maxPlayers} players`);
        } else {
          // Check if game already in progress
          if (room.gameState === 'playing' || room.gameState === 'countdown') {
            // Check if reconnecting
            const existingPlayer = room.players.find(
              (p) => p.name === playerName || p.socketId === oldSocketId
            );
            if (!existingPlayer) {
              socket.emit('error-message', 'Game already in progress');
              return;
            }
          }

          // Check for duplicate username
          const duplicateName = room.players.find(
            (p) => p.name === playerName && p.socketId !== oldSocketId && p.socketId !== socket.id
          );
          if (duplicateName && duplicateName.online) {
            socket.emit('error-message', 'Username already taken in this room');
            return;
          }

          // Check if reconnecting
          let player = room.players.find(
            (p) => p.name === playerName || p.socketId === oldSocketId
          );

          if (player) {
            console.log(`🔁 Reconnect: ${playerName} -> new socket ${socket.id}`);
            player.socketId = socket.id;
            player.online = true;
          } else if (room.players.length < room.maxPlayers) {
            // Check if there's a host, if not assign this player as host
            const hasHost = room.players.some(p => p.isHost && p.online);

            room.players.push({
              socketId: socket.id,
              name: playerName,
              online: true,
              code: '',
              status: 'waiting',
              isHost: !hasHost
            });
            console.log(`👥 ${playerName} joined ${roomId}`);

            // Notify others
            socket.to(roomId).emit('player-joined', { playerName });
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

    // Player ready
    socket.on('player-ready', async ({ roomId }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        const player = room.players.find((p) => p.socketId === socket.id);
        if (player) {
          player.status = 'ready';
          await room.save();
          await room.populate('question');
          io.to(roomId).emit('room-update', room);
          io.to(roomId).emit('player-status-changed', {
            playerName: player.name,
            status: 'ready'
          });
        }
      } catch (err) {
        console.error('player-ready error:', err.message);
      }
    });

    // Start countdown (host only)
    socket.on('start-countdown', async ({ roomId }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        const player = room.players.find((p) => p.socketId === socket.id);
        if (!player || !player.isHost) {
          socket.emit('error-message', 'Only host can start the game');
          return;
        }

        // Check if all players are ready
        const allReady = room.players.every(p => !p.online || p.status === 'ready');
        if (!allReady) {
          socket.emit('error-message', 'All players must be ready');
          return;
        }

        // Check minimum players
        const onlinePlayers = room.players.filter(p => p.online);
        if (onlinePlayers.length < 2) {
          socket.emit('error-message', 'Need at least 2 players to start');
          return;
        }

        room.gameState = 'countdown';
        room.countdownStartTime = new Date();
        await room.save();

        io.to(roomId).emit('countdown-started');

        // Countdown timer (10 seconds)
        let countdown = 10;
        const countdownInterval = setInterval(async () => {
          countdown--;
          io.to(roomId).emit('countdown-tick', countdown);

          if (countdown <= 0) {
            clearInterval(countdownInterval);
            await startGame(io, roomId);
          }
        }, 1000);

        // Store timer reference
        roomTimers.set(`${roomId}-countdown`, countdownInterval);
      } catch (err) {
        console.error('start-countdown error:', err.message);
      }
    });

    // Code change handler
    socket.on('code-change', async ({ roomId, code }) => {
      socket.to(roomId).emit('code-update', { playerId: socket.id, code });

      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;
        const player = room.players.find((p) => p.socketId === socket.id);
        if (player) {
          player.code = code;
          await room.save();
        }
      } catch (e) {
        console.error('save error', e);
      }
    });

    // Player submit
    socket.on('player-submit', async ({ roomId, testsPassed, totalTests, score }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        const player = room.players.find((p) => p.socketId === socket.id);
        if (player && player.status !== 'submitted') {
          player.status = 'submitted';
          player.submittedAt = new Date();
          player.testsPassed = testsPassed;
          player.totalTests = totalTests;
          player.score = score;
          await room.save();

          io.to(roomId).emit('player-submitted', {
            playerName: player.name,
            testsPassed,
            totalTests
          });

          // Check if all online players have submitted
          const onlinePlayers = room.players.filter(p => p.online);
          const allSubmitted = onlinePlayers.every(p => p.status === 'submitted');

          if (allSubmitted) {
            await endGame(io, roomId);
          }
        }
      } catch (err) {
        console.error('player-submit error:', err.message);
      }
    });

    // Chat
    socket.on('send-chat', async ({ roomId, message }) => {
      try {
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
      } catch (err) {
        console.error('send-chat error:', err.message);
      }
    });

    // Leave room
    socket.on('leave-room', async (roomId) => {
      socket.leave(roomId);
      await handlePlayerLeave(io, socket.id, roomId);
    });

    // Disconnect
    socket.on('disconnect', async () => {
      const rooms = await Room.find({ 'players.socketId': socket.id });
      for (const room of rooms) {
        await handlePlayerLeave(io, socket.id, room.roomId);
      }
      console.log('🔴 Disconnected:', socket.id);
    });

    // Request current room state
    socket.on('request-room-state', async ({ roomId }) => {
      try {
        const room = await Room.findOne({ roomId }).populate('question');
        if (room) {
          socket.emit('room-update', room);
        }
      } catch (err) {
        console.error('request-room-state error:', err.message);
      }
    });
  });
}

// Start the game
async function startGame(io, roomId) {
  try {
    const room = await Room.findOne({ roomId });
    if (!room) return;

    room.gameState = 'playing';
    room.gameStartTime = new Date();

    // Set all online players to 'coding'
    room.players.forEach(p => {
      if (p.online) {
        p.status = 'coding';
      }
    });

    await room.save();
    await room.populate('question');

    io.to(roomId).emit('game-started', {
      startTime: room.gameStartTime,
      duration: room.gameDuration
    });
    io.to(roomId).emit('room-update', room);

    // Start game timer
    const gameTimer = setInterval(async () => {
      const currentRoom = await Room.findOne({ roomId });
      if (!currentRoom || currentRoom.gameState !== 'playing') {
        clearInterval(gameTimer);
        roomTimers.delete(`${roomId}-game`);
        return;
      }

      const elapsed = Math.floor((Date.now() - new Date(currentRoom.gameStartTime).getTime()) / 1000);
      const remaining = currentRoom.gameDuration - elapsed;

      io.to(roomId).emit('timer-sync', remaining);

      if (remaining <= 0) {
        clearInterval(gameTimer);
        roomTimers.delete(`${roomId}-game`);
        await endGame(io, roomId);
      }
    }, 1000);

    roomTimers.set(`${roomId}-game`, gameTimer);
  } catch (err) {
    console.error('startGame error:', err.message);
  }
}

// End the game and calculate leaderboard
async function endGame(io, roomId) {
  try {
    const room = await Room.findOne({ roomId });
    if (!room || room.gameState === 'finished') return;

    // Clear any existing timers
    const gameTimer = roomTimers.get(`${roomId}-game`);
    if (gameTimer) {
      clearInterval(gameTimer);
      roomTimers.delete(`${roomId}-game`);
    }

    room.gameState = 'finished';

    // Calculate scores and rankings
    const gameEndTime = new Date();
    const leaderboard = room.players
      .filter(p => p.online)
      .map(p => {
        const timeTaken = p.submittedAt
          ? Math.floor((new Date(p.submittedAt).getTime() - new Date(room.gameStartTime).getTime()) / 1000)
          : room.gameDuration;

        // Score: base 100 for correct, + time bonus (up to 50)
        const correctBonus = p.testsPassed === p.totalTests && p.totalTests > 0 ? 100 : 0;
        const timeBonus = correctBonus > 0 ? Math.max(0, Math.floor(50 * (1 - timeTaken / room.gameDuration))) : 0;
        const partialCredit = p.totalTests > 0 ? Math.floor((p.testsPassed / p.totalTests) * 50) : 0;
        const finalScore = correctBonus + timeBonus + partialCredit;

        return {
          playerId: p.socketId,
          playerName: p.name,
          testsPassed: p.testsPassed,
          totalTests: p.totalTests,
          timeTaken,
          score: finalScore
        };
      })
      .sort((a, b) => {
        // Sort by score descending, then by time ascending
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    room.leaderboard = leaderboard;
    await room.save();

    io.to(roomId).emit('game-finished', { leaderboard });
  } catch (err) {
    console.error('endGame error:', err.message);
  }
}

// Handle player leaving
async function handlePlayerLeave(io, socketId, roomId) {
  try {
    const room = await Room.findOne({ roomId });
    if (!room) return;

    const player = room.players.find((p) => p.socketId === socketId);
    if (!player) return;

    player.online = false;

    // If host left, reassign to another online player
    if (player.isHost) {
      player.isHost = false;
      const newHost = room.players.find(p => p.online && p.socketId !== socketId);
      if (newHost) {
        newHost.isHost = true;
        io.to(roomId).emit('host-changed', { newHostName: newHost.name });
      }
    }

    await room.save();

    io.to(roomId).emit('player-left', { playerName: player.name });
    io.to(roomId).emit('room-update', room);

    // Check if game should end (only one player left)
    if (room.gameState === 'playing') {
      const onlinePlayers = room.players.filter(p => p.online);
      if (onlinePlayers.length < 2) {
        await endGame(io, roomId);
      }
    }
  } catch (err) {
    console.error('handlePlayerLeave error:', err.message);
  }
}

module.exports = { initializeSocket };
