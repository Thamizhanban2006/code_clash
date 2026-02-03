const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  socketId: String,
  name: String,
  code: { type: String, default: '' },
  online: { type: Boolean, default: true },
  status: { type: String, enum: ['waiting', 'ready', 'coding', 'submitted'], default: 'waiting' },
  isHost: { type: Boolean, default: false },
  submittedAt: { type: Date, default: null },
  testsPassed: { type: Number, default: 0 },
  totalTests: { type: Number, default: 0 },
  score: { type: Number, default: 0 }
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  sampleInput: { type: String, default: '' },
  sampleOutput: { type: String, default: '' },
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ],
  difficulty: { type: String, default: 'Easy' }
});

const leaderboardEntrySchema = new mongoose.Schema({
  playerId: String,
  playerName: String,
  rank: Number,
  testsPassed: Number,
  totalTests: Number,
  timeTaken: Number, // in seconds
  score: Number
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  maxPlayers: { type: Number, default: 4, min: 2, max: 4 },
  gameState: { type: String, enum: ['lobby', 'countdown', 'playing', 'finished'], default: 'lobby' },
  gameStartTime: { type: Date, default: null },
  gameDuration: { type: Number, default: 900 }, // 15 minutes in seconds
  countdownStartTime: { type: Date, default: null },
  players: [playerSchema],
  chat: [
    {
      playerName: String,
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', default: null },
  leaderboard: [leaderboardEntrySchema]
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
const Questions = mongoose.model('Question', questionSchema);

module.exports = { Room, Questions };
