// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const roomRouter = require('./routes/roomRoutes');     
const { initializeSocket } = require('./socketHandler');
const userRoutes = require('./routes/userRoutes');

const app = express();
const path = require('path');

// middleware
app.use(cors());
app.use(express.json());

// --- Mount API routes FIRST ---
app.use('/api', roomRouter);
app.use('/api/users', userRoutes);

// Static serve (only after API mounted)
// Serve client build for non-API requests
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Only handle wildcard for non-API GET requests
app.use( (req, res, next) => {
  if (req.path.startsWith('/api')) return next(); // let API routes handle it
  res.sendFile(path.join(clientDist, 'index.html'));
});

// basic health check
app.get('/health', (req, res) => res.json({ ok: true }));

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // change in production to your frontend url
});

// attach socket handlers
initializeSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
