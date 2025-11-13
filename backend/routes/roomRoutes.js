// backend/routes/roomRoutes.js
const axios = require('axios');
const express = require('express');
const { Room, Questions } = require('../models/Room'); 
const router = express.Router();

router.use(express.json());

/**
 * POST /api/run
 * Runs submitted code via Judge0 (RapidAPI).
 * Body: { code, language = 'python', input = '' }
 */
router.post('/run', async (req, res) => {
  try {
    const { code, language = 'python', questionId } = req.body;

    if (!code || !questionId) {
      return res.status(400).json({ error: 'Code and questionId are required' });
    }

    const question = await Questions.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const langMap = {
      python: 71,
      javascript: 63,
      cpp: 54,
      java: 62
    };
    const language_id = langMap[language.toLowerCase()];
    if (!language_id) return res.status(400).json({ error: 'Unsupported language' });

    const results = [];
    let allPassed = true;

    for (const testCase of question.testCases) {
      const body = {
        source_code: code,
        stdin: testCase.input,
        language_id
      };

      const response = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
        body,
        {
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const output = (response.data.stdout || response.data.stderr || response.data.compile_output || '').trim();
      const expected = testCase.expectedOutput.trim();

      const passed = output === expected;
      results.push({ input: testCase.input, expected, output, passed });

      if (!passed) allPassed = false;
    }

    return res.json({ allPassed, results });
  } catch (err) {
    console.error('Judge0 error:', err.response?.status, err.response?.data || err.message);
    return res.status(500).json({ error: 'Error executing code', details: err.message });
  }
});


/**
 * GET /api/random-question
 * Returns a random Question document
 */
router.get('/random-question', async (req, res) => {
  try {
    const count = await Questions.countDocuments();
    if (count === 0) return res.status(404).json({ message: 'No questions found in DB' });

    const random = Math.floor(Math.random() * count);
    const question = await Questions.findOne().skip(random);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    return res.json(question);
  } catch (err) {
    console.error('random-question error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/:roomId
 * Get existing room (populated) or create a new room with a random question.
 */
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    let room = await Room.findOne({ roomId }).populate('question');

  if (!room) {
    const count = await Questions.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No questions available' });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const randomQuestion = await Questions.findOne().skip(randomIndex);

    // ✅ Atomic upsert (prevents duplicates)
    room = await Room.findOneAndUpdate(
      { roomId },
      { $setOnInsert: { players: [], chat: [], question: randomQuestion._id } },
      { new: true, upsert: true }
    ).populate('question');
  }


    res.json(room);
  } catch (err) {
    console.error('GET room error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * POST /api/update-code
 * Save code snapshot for a player in a room (used on blur / periodic auto-save)
 * Body: { roomId, socketId, code }
 */
router.post('/update-code', async (req, res) => {
  try {
    const { roomId, socketId, code } = req.body;
    if (!roomId || !socketId) return res.status(400).json({ error: 'roomId and socketId required' });

    let room = await Room.findOne({ roomId });
    if (!room) {
      // create new room without question (socket flow will assign question); avoid unique collision
      room = new Room({ roomId, players: [], chat: [] });
    }

    const player = room.players.find((p) => p.socketId === socketId);
    if (player) {
      player.code = code;
      player.online = true;
    } else {
      room.players.push({ socketId, name: `Player-${socketId}`, code, online: true });
    }

    await room.save();
    return res.json({ success: true });
  } catch (err) {
    console.error('update-code error:', err);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/add-question', async (req, res) => {
  try {
    const newQ = new Questions({
      title: "Sum of Two Numbers",
      description: "Write a program that reads two integers and prints their sum.",
      sampleInput: "2 3",
      sampleOutput: "5",
      testCases: [
        { input: "1 2", expectedOutput: "3" },
        { input: "10 20", expectedOutput: "30" }
      ]
    });
    await newQ.save();
    res.json({ message: "Question added", newQ });
  } catch (err) {
    console.error('add-question error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
