// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const router = require('./routes/roomRoutes');      // routes with /api
const { initializeSocket } = require('./socketHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

// MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codeclash', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // you can replace '*' with your frontend origin
});

// plug in socket handlers
initializeSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
