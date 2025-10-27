const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  socketId: String,
  name: String,
  code: { type: String, default: '' },
  online: { type: Boolean, default: true }
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: [playerSchema],
  chat: [
    {
      playerName: String,
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', default: null },
  winner: {
    id: { type: String, default: null },
    name: { type: String, default: null }
  }
}, { timestamps: true });

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  input: String,
  expectedOutput: String,
  difficulty: { type: String, default: 'Easy' }
});

const Room = mongoose.model('Room', roomSchema);
const Questions = mongoose.model('Question', questionSchema);
module.exports = { Room, Questions };
