// src/pages/Room.jsx
import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '../components/CodeEditor.jsx';
import { useSocket } from '../contexts/SocketContext.jsx';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import getPlayerName from '../utils/getPlayerName.js';
// import TestCases from '../components/testCases.jsx';


export default function Room() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  const [codes, setCodes] = useState({});
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [output, setOutput] = useState([]);
  const [question, setQuestion] = useState(null);

  const typingRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const hasJoined = useRef(false);

  // --- Persist player name ---
  const [playerName, setPlayerName] = useState(() => {
    const saved = localStorage.getItem('username');
    if (saved) return saved;
    const newName = getPlayerName();
    localStorage.setItem('username', newName);
    return newName;
  });

  // --- Join room after socket connects ---
  useEffect(() => {
    if (!socket || !roomId || hasJoined.current) return;
    hasJoined.current = true;

    const oldSocketId = localStorage.getItem('lastSocketId');

    socket.emit('join-room', { roomId, playerName, oldSocketId });

    // fallback: fetch latest room state
    axios
      .get(`http://localhost:3000/api/${roomId}`)
      .then((res) => {
        const room = res.data;
        setPlayers(room.players || []);
        const initial = {};
        (room.players || []).forEach((p) => (initial[p.socketId] = p.code || ''));
        setCodes(initial);
        setChat(room.chat || []);
        if (room.question) setQuestion(room.question);
      })
      .catch(() => {});
  }, [socket, roomId, playerName]);

  // --- Save socket ID before unload ---
  useEffect(() => {
    const handler = () => {
      localStorage.setItem('lastSocketId', socket?.id || '');
      localStorage.setItem('playerName', playerName);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [socket, playerName]);

  // --- Socket listeners ---
  useEffect(() => {
    if (!socket) return;

    const onRoomUpdate = (room) => {
      setPlayers(room.players || []);
      const updated = {};
      (room.players || []).forEach((p) => (updated[p.socketId] = p.code || ''));
      setCodes((prev) => ({ ...prev, ...updated }));
      setChat(room.chat || []);
      if (room.question) setQuestion(room.question);
    };

    const onCodeUpdate = ({ playerId, code }) => {
      setCodes((prev) => ({ ...prev, [playerId]: code }));
    };

    const onChatUpdate = (messages) => setChat(messages);

    const onAnnounce = ({ winnerId, winnerName }) => {
      if (socket.id === winnerId) alert(`🎉 You won!`);
      else alert(`😞 ${winnerName} won.`);
      setTimeout(() => navigate('/'), 2000);
    };

    socket.on('room-update', onRoomUpdate);
    socket.on('code-update', onCodeUpdate);
    socket.on('chat-update', onChatUpdate);
    socket.on('announce-winner', onAnnounce);
    socket.on('error-message', (msg) => alert(msg));

    return () => {
      socket.off('room-update', onRoomUpdate);
      socket.off('code-update', onCodeUpdate);
      socket.off('chat-update', onChatUpdate);
      socket.off('announce-winner', onAnnounce);
      socket.off('error-message');
    };
  }, [socket, navigate]);

  // --- Periodic save code ---
  useEffect(() => {
    if (!socket || !roomId) return;
    saveIntervalRef.current = setInterval(async () => {
      const myCode = codes[socket.id];
      if (myCode) {
        await axios.post('http://localhost:3000/api/update-code', {
          roomId,
          socketId: socket.id,
          code: myCode,
        });
      }
    }, 5000);
    return () => clearInterval(saveIntervalRef.current);
  }, [socket, roomId, codes]);

  // --- Code change handler ---
  const handleCodeChange = (code) => {
    if (!socket?.id) return;
    setCodes((prev) => ({ ...prev, [socket.id]: code }));
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => {
      socket.emit('code-change', { roomId, code });
    }, 60);
  };

  // --- Run code ---
  const runCode = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/run', {
        code: codes[socket.id] || '',
        language: 'python',
        questionId: question._id,
      });
      const { allPassed, results } = res.data;
      setOutput(results);
      console.log('Run results:', results);
      if (allPassed) {
        socket.emit('player-finished', { roomId, playerName });
        alert('✅ All test cases passed!');
      } else {
        alert('❌ Some test cases failed!');
      }
    } catch (err) {
      setOutput('Error running code: ' + (err.message || err.toString()));
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    socket.emit('send-chat', { roomId, message: chatInput });
    setChatInput('');
  };

  return (
   <div className="min-h-screen bg-[#0a0a0a] text-[#d1fae5] p-6 flex flex-col font-mono">
  {/* 🧑‍💻 Players Section */}
  <div className="flex justify-between mb-4">
    {players.map((p) => (
      <div
        key={p.socketId}
        className="text-lg font-semibold flex items-center gap-2 bg-[#111827] px-3 py-2 rounded-lg shadow-md border border-[#10b981]/30"
      >
        <span className="text-[#10b981]">{p.online ? '🟢' : '🔴'}</span>
        {p.name}
      </div>
    ))}
  </div>

  {/* 🧩 Question Section */}
  {question && (
    <div className="bg-[#111827] p-5 rounded-xl mb-6 border border-[#10b981]/40 shadow-lg hover:shadow-[#10b981]/20 transition">
      <h2 className="text-2xl font-bold text-[#10b981] mb-2">
        {question.title}
      </h2>
      <p className="text-gray-300">{question.description}</p>
      <div className="mt-3 space-y-1">
        <p className="text-[#a7f3d0]">
          <strong>Input:</strong> {question.sampleInput}
        </p>
        <p className="text-[#6ee7b7]">
          <strong>Expected Output:</strong> {question.sampleOutput}
        </p>
      </div>
    </div>
  )}

  {/* 💻 Code Editors */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
    {players.map((p) => (
      <div
        key={p.socketId}
        className="bg-[#111827] rounded-2xl shadow-md p-3 flex flex-col border border-[#10b981]/30 hover:border-[#10b981]/50 transition"
      >
        <h3 className="font-semibold mb-3 text-center text-[#10b981]">
          {p.name}'s Editor
        </h3>
        <CodeEditor
          language="python"
          value={codes[p.socketId] || ''}
          onChange={p.socketId === socket.id ? handleCodeChange : () => {}}
        />
      </div>
    ))}
  </div>

  {/* 🧠 Run Code + Output */}
  <div className="mt-6 bg-[#111827] p-5 rounded-xl border border-[#10b981]/30 shadow-lg">
    <button
      className="bg-[#10b981] text-black font-semibold px-5 py-2 rounded-lg hover:bg-[#34d399] transition mr-3"
      onClick={runCode}
    >
      ⚡ Run My Code
    </button>
    <pre className="bg-[#0a0a0a] p-3 rounded mt-3 h-36 overflow-y-auto text-[#86efac] border ">
      {output.map((c, i) => (
        <div key={i} className='flex flex-col border-1 border-red-500 mb-2 p-2'>
          <span>Input: {c.input}</span>
          <span>Expected Output: {c.expected}</span>
          <span>Output: {c.output}</span>
          <span>Status: {c.passed}</span>

        </div>
      ))}
    </pre>
  </div>

  {/* 💬 Chat Section */}
  <div className="mt-6 bg-[#111827] p-5 rounded-xl border border-[#10b981]/30 shadow-lg">
    <h3 className="font-semibold mb-3 text-center text-xl text-[#10b981]">
      💬 Chat Room
    </h3>
    <div className="h-52 overflow-y-auto border border-[#10b981]/20 p-3 rounded mb-3 bg-[#0a0a0a]">
      {chat.map((m, idx) => (
        <div key={idx} className="mb-1">
          <b className="text-[#34d399]">{m.playerName}:</b>{' '}
          <span className="text-gray-300">{m.message}</span>
        </div>
      ))}
    </div>
    <div className="flex gap-3">
      <input
        className="flex-1 bg-[#0a0a0a] border border-[#10b981]/30 px-4 py-2 rounded-lg text-[#d1fae5] focus:outline-none focus:border-[#10b981] placeholder-gray-500"
        placeholder="Type your message..."
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
      />
      <button
        className="bg-[#10b981] text-black font-semibold px-5 py-2 rounded-lg hover:bg-[#34d399] transition"
        onClick={sendChat}
      >
        Send
      </button>
    </div>
  </div>
</div>

  );
}
