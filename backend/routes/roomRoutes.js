// backend/routes/roomRoutes.js
const axios = require('axios');
const express = require('express');
const {Room} = require('../models/Room');
const {Questions} = require('../models/Room');
const router = express.Router();

router.use(express.json());

// Run code through Judge0 (RapidAPI key in env)
router.post('/run', async (req, res) => {
  const { code, language = 'python', input = '' } = req.body;
  try {
    const langMap = { python: 71, javascript: 63 };
    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      { source_code: code, stdin: input, language_id: langMap[language] },
      {
        headers: {
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Judge0 error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});


router.get("/random-question", async (req, res) => {
  try {
    const count = await Questions.countDocuments();

    if (count === 0) {
      return res.status(404).json({ message: "No questions found in the database." });
    }

    const random = Math.floor(Math.random() * count);
    const question = await Questions.findOne().skip(random);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching random question:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
// Get or create room
router.get('/:roomId', async (req, res) => {
  try {
    let room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) {
      room = new Room({ roomId: req.params.roomId, players: [], chat: [] });
      await room.save();
    }
    res.json(room);
  } catch (err) {
    console.error('GET room error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update code (called less frequently — on blur or periodic save)
router.post('/update-code', async (req, res) => {
  const { roomId, socketId, code } = req.body;
  try {
    let room = await Room.findOne({ roomId });
    if (!room) {
      room = new Room({ roomId, players: [], chat: [] });
    }
    const player = room.players.find((p) => p.socketId === socketId);
    if (player) {
      player.code = code;
      player.online = true;
    } else {
      room.players.push({ socketId, name: 'Player-'+socketId, code, online: true });
    }
    await room.save();
    res.json({ success: true });
  } catch (err) {
    console.error('update-code error:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
