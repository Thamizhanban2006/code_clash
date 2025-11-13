⚔️ CodeClash — Real-Time Code Battle Platform

💡 Overview

CodeClash is a real-time coding battle platform where two players compete head-to-head by solving coding problems simultaneously.
The app combines live collaboration, real-time chat, automated code evaluation, and a Matrix-themed gaming UI to make learning and coding fun, competitive, and futuristic. 💚

🚀 Features


👨‍💻 Real-Time Code Battle

Players join or create a room and receive the same coding question.

Both code live in their own Monaco editor panes.

Code execution runs through a backend API and shows live results.

Automatic evaluation of test cases with ✅ green for pass and ❌ red for fail, LeetCode-style.

💬 Live Chat System

Built-in Socket.io chat for players to talk, share hints, or trash-talk their rivals.

🧠 Authentication System

Secure JWT-based authentication.

Users can Register, Login, and Logout.

User progress like XP, matches, and levels can be extended later.

🧩 Problem System

Each room gets one random coding problem (title, description, sample input/output).

Questions stored on the backend for easy extensibility.

🎨 Matrix-Themed UI

Neon green on black “Matrix” theme with glowing effects.

Animated backgrounds and futuristic styling.

Consistent design across all pages — Login, Register, Dashboard, and Room.

🛠️ Tech Stack
🧩 Frontend

React.js

React Router DOM

Tailwind CSS

Monaco Editor (@monaco-editor/react)

Socket.IO Client

Axios

⚙️ Backend

Node.js + Express.js

MongoDB Atlas (via Mongoose)

Socket.IO for real-time communication

JWT for authentication

bcrypt.js for password hashing

📁 Folder Structure
CodeClash/
│
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Room.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── App.jsx
│   └── package.json
│
├── server/                  # Express Backend
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── codeRoutes.js
│   ├── models/
│   │   └── Users.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── package.json
│
└── README.md

⚙️ Setup Instructions
🖥️ Backend Setup
cd server
npm install


Create a .env file inside server/:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Start the backend:

npm start

🌐 Frontend Setup
cd client
npm install
npm run dev


Your frontend will run at:

http://localhost:5173


Your backend will run at:

http://localhost:5000

🔄 Deployment

Frontend: Deployed on Netlify

Backend: Deployed on Render

Example API Base URL:
https://code-clash-1-3a96.onrender.com/api

💬 Core Pages
Page	Description
Login / Register	User authentication system with Matrix glow theme.
Dashboard	Displays welcome message and game launch button.
Home	Create or join a room with cool Matrix animation.
Room	Real-time coding battle environment with editor, output, and chat.
🧠 Future Enhancements

🔥 Match History & XP System

🧩 Leaderboards

⚙️ Language support (C++, JavaScript, Java, Python)

🧑‍💻 AI-based code scoring

🌍 Multiplayer tournaments

🖤 Credits

Developed by: Thamizhanban M
Frameworks: MERN Stack
Theme: Inspired by The Matrix (1999) 💚
Special thanks: Kalvium Sprints 🚀