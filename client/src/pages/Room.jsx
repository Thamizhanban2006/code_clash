// src/pages/Room.jsx
import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '../components/CodeEditor.jsx';
import { useSocket } from '../contexts/SocketContext.jsx';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function Room() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  const [codes, setCodes] = useState({});
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [output, setOutput] = useState('');
  const [question, setQuestion] = useState(null);
  const mySocket = socket?.id || null;
  const typingRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const storedUsername = localStorage.getItem('username');
  const playerNameRef = useRef(storedUsername || 'Guest' + Math.floor(Math.random() * 10000));
  const playerName = playerNameRef.current;


  // join room once when mount + socket ready
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit('join-room', { roomId, playerName });

  
    axios.get(`https://code-clash-1-3a96.onrender.com/${roomId}`)
      .then(res => {
        const room = res.data;
        setPlayers(room.players || []);
        const initial = {};
        (room.players || []).forEach(p => initial[p.socketId] = p.code || '');
        setCodes(initial);
        setChat(room.chat || []);
        // question may be populated on server side via socket as well
        if (room.question) setQuestion(room.question);
      }).catch(()=>{});

    return () => {
      socket.emit('leave-room', roomId);
    };
  }, [socket, roomId, playerName]);


  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
  }
}, [navigate]);

  // socket handlers
  useEffect(() => {
    if (!socket) return;

    const onRoomUpdate = (room) => {
      setPlayers(room.players || []);
      const updated = {};
      (room.players || []).forEach(p => updated[p.socketId] = p.code || '');
      // combine: prefer room-provided values, but keep local codes if present
      setCodes(prev => ({ ...updated, ...prev }));
      setChat(room.chat || []);
      if (room.question) setQuestion(room.question);
    };

    const onCodeUpdate = ({ playerId, code }) => {
      setCodes(prev => ({ ...prev, [playerId]: code }));
    };

    const onChatUpdate = (messages) => setChat(messages);

    // winner announcement
    const onAnnounce = ({ winnerId, winnerName }) => {
      if (!socket) return;
      if (socket.id === winnerId) {
        alert(`🎉 You won! (${winnerName})`);
      } else {
        alert(`😞 You lost! ${winnerName} won.`);
      }
      // redirect after a short pause
      setTimeout(() => navigate('/'), 2500);
    };

    socket.on('room-update', onRoomUpdate);
    socket.on('code-update', onCodeUpdate);
    socket.on('chat-update', onChatUpdate);
    socket.on('announce-winner', onAnnounce);
    socket.on('error-message', (m) => alert(m));

    return () => {
      socket.off('room-update', onRoomUpdate);
      socket.off('code-update', onCodeUpdate);
      socket.off('chat-update', onChatUpdate);
      socket.off('announce-winner', onAnnounce);
      socket.off('error-message');
    };
  }, [socket, navigate]);

  // periodic DB save of my code to avoid lost edits
  useEffect(() => {
    if (!socket || !roomId) return;
    saveIntervalRef.current = setInterval(async () => {
      if (!socket.id) return;
      const myCode = codes[socket.id];
      if (typeof myCode === 'string') {
        try {
          await axios.post('https://code-clash-1-3a96.onrender.com/api/update-code', {
            roomId, socketId: socket.id, code: myCode
          });
        } catch (err) {
          // silent
        }
      }
    }, 5000);

    return () => clearInterval(saveIntervalRef.current);
  }, [socket, roomId, codes]);

  // handle local typing -> emit live update
  const handleCodeChange = (code) => {
    if (!socket || !socket.id) return;
    setCodes(prev => ({ ...prev, [socket.id]: code }));

    // small debounce to reduce spam, still near-letter-by-letter
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => {
      socket.emit('code-change', { roomId, code });
    }, 40);
  };

  const runCode = async () => {
    try {
      const res = await axios.post('https://code-clash-1-3a96.onrender.com/api/run', {
        code: codes[socket.id] || '',
        input: (question && question.input) ? question.input : '',
        language: 'python'
      });

      const result = (res.data.stdout || res.data.stderr || res.data.compile_output || '').trim();
      setOutput(result);

      // compare trimmed expected output (defensive)
      if (question && typeof question.expectedOutput === 'string' && result === question.expectedOutput.trim()) {
        socket.emit('player-finished', { roomId, playerName });
      } else {
        alert('❌ Output mismatch! Try again.');
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

  // Prepare two editor panels (if only one player present, show placeholder)
  const renderPlayers = () => {
    const list = [...players];
    if (list.length < 2) list.push({ socketId: 'empty-1', name: 'Waiting...', code: '' });
    return list.slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <div className="flex justify-between mb-4">
        {players.map(p => (
          <div key={p.socketId} className="text-lg font-semibold">
            {p.name} {p.online ? '🟢' : '🔴'}
          </div>
        ))}
      </div>

      {question && (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold text-green-400">{question.title}</h2>
          <p className="text-gray-300">{question.description}</p>
          <p className="text-yellow-400 mt-2"><strong>Input:</strong> {question.input}</p>
          <p className="text-green-400 mt-1"><strong>Expected Output:</strong> {question.expectedOutput}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 flex-grow">
        {renderPlayers().map(p => (
          <div key={p.socketId} className="bg-gray-800 rounded-xl shadow-md p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-center">{p.name}'s Editor</h3>
              {p.socketId !== 'empty-1' && p.socketId !== socket?.id && <span className="text-sm text-yellow-300">Opponent</span>}
            </div>
            <CodeEditor
              language="python"
              value={codes[p.socketId] || ''}
              onChange={p.socketId === socket?.id ? handleCodeChange : () => {}}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gray-800 p-4 rounded-lg">
        <button className="bg-blue-600 px-4 py-2 rounded mr-3 hover:bg-blue-700" onClick={runCode}>Run My Code</button>
        <pre className="bg-gray-700 p-3 rounded mt-2 h-32 overflow-y-auto text-green-300">{output}</pre>
      </div>

      <div className="mt-4 bg-gray-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 text-center text-xl">💬 Chat</h3>
        <div className="h-48 overflow-y-auto border border-gray-700 p-2 rounded mb-2 bg-gray-900">
          {chat.map((m, idx) => <div key={idx}><b className="text-blue-400">{m.playerName}:</b> <span className="text-gray-200">{m.message}</span></div>)}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 bg-gray-900 border border-gray-700 px-3 py-2 rounded text-white" placeholder="Type your message..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} />
          <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700" onClick={sendChat}>Send</button>
        </div>
      </div>
    </div>
  );
}
