// src/pages/Room.jsx
import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '../components/CodeEditor.jsx';
import GameHeader from '../components/GameHeader.jsx';
import PlayersSidebar from '../components/PlayersSidebar.jsx';
import CountdownOverlay from '../components/CountdownOverlay.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import { useSocket } from '../contexts/SocketContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import getPlayerName from '../utils/getPlayerName.js';
import { Play, Send, MessageSquare, CheckCircle, X, Zap } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Room() {
  const socket = useSocket();
  const navigate = useNavigate();
  const toast = useToast();
  const { roomId } = useParams();

  // Game state
  const [gameState, setGameState] = useState('lobby');
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [myCode, setMyCode] = useState('');
  const [output, setOutput] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [myStatus, setMyStatus] = useState('waiting');

  // Chat state
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  const typingRef = useRef(null);
  const hasJoined = useRef(false);

  // Player name
  const [playerName] = useState(() => {
    const saved = localStorage.getItem('username');
    if (saved) return saved;
    const newName = getPlayerName();
    localStorage.setItem('username', newName);
    return newName;
  });

  // Computed values
  const isEditorLocked = gameState === 'lobby' || gameState === 'countdown' || gameState === 'finished' || myStatus === 'submitted';

  // Join room
  useEffect(() => {
    if (!socket || !roomId || hasJoined.current) return;
    hasJoined.current = true;

    const oldSocketId = localStorage.getItem('lastSocketId');
    socket.emit('join-room', { roomId, playerName, oldSocketId });

    // Fallback: fetch room state via HTTP
    axios.get(`${API_URL}/api/${roomId}`)
      .then((res) => {
        const room = res.data;
        updateRoomState(room);
      })
      .catch(() => { });
  }, [socket, roomId, playerName]);

  // Save socket ID before unload
  useEffect(() => {
    const handler = () => {
      localStorage.setItem('lastSocketId', socket?.id || '');
      localStorage.setItem('playerName', playerName);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [socket, playerName]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onRoomUpdate = (room) => {
      updateRoomState(room);
    };

    const onCodeUpdate = ({ playerId, code }) => {
      // We only show our own editor now, so ignore others' code
    };

    const onChatUpdate = (messages) => setChat(messages);

    const onCountdownStarted = () => {
      setShowCountdown(true);
      setCountdown(10);
      setGameState('countdown');
      toast.info('Game starting soon!');
    };

    const onCountdownTick = (value) => {
      setCountdown(value);
    };

    const onGameStarted = ({ startTime, duration }) => {
      setShowCountdown(false);
      setGameState('playing');
      setTimeRemaining(duration);
      setMyStatus('coding');
      toast.success('Game started! Good luck!');
    };

    const onTimerSync = (remaining) => {
      setTimeRemaining(remaining);
      if (remaining === 60) {
        toast.warning('1 minute remaining!');
      }
    };

    const onPlayerJoined = ({ playerName: name }) => {
      toast.info(`${name} joined the room`);
    };

    const onPlayerLeft = ({ playerName: name }) => {
      toast.warning(`${name} left the room`);
    };

    const onPlayerSubmitted = ({ playerName: name, testsPassed, totalTests }) => {
      toast.info(`${name} submitted: ${testsPassed}/${totalTests} tests passed`);
    };

    const onPlayerStatusChanged = ({ playerName: name, status }) => {
      if (status === 'ready') {
        toast.info(`${name} is ready`);
      }
    };

    const onHostChanged = ({ newHostName }) => {
      toast.info(`${newHostName} is now the host`);
    };

    const onGameFinished = ({ leaderboard: lb }) => {
      setGameState('finished');
      setLeaderboard(lb);
      toast.success('Game finished!');
    };

    const onErrorMessage = (msg) => {
      toast.error(msg);
    };

    socket.on('room-update', onRoomUpdate);
    socket.on('code-update', onCodeUpdate);
    socket.on('chat-update', onChatUpdate);
    socket.on('countdown-started', onCountdownStarted);
    socket.on('countdown-tick', onCountdownTick);
    socket.on('game-started', onGameStarted);
    socket.on('timer-sync', onTimerSync);
    socket.on('player-joined', onPlayerJoined);
    socket.on('player-left', onPlayerLeft);
    socket.on('player-submitted', onPlayerSubmitted);
    socket.on('player-status-changed', onPlayerStatusChanged);
    socket.on('host-changed', onHostChanged);
    socket.on('game-finished', onGameFinished);
    socket.on('error-message', onErrorMessage);

    return () => {
      socket.off('room-update', onRoomUpdate);
      socket.off('code-update', onCodeUpdate);
      socket.off('chat-update', onChatUpdate);
      socket.off('countdown-started', onCountdownStarted);
      socket.off('countdown-tick', onCountdownTick);
      socket.off('game-started', onGameStarted);
      socket.off('timer-sync', onTimerSync);
      socket.off('player-joined', onPlayerJoined);
      socket.off('player-left', onPlayerLeft);
      socket.off('player-submitted', onPlayerSubmitted);
      socket.off('player-status-changed', onPlayerStatusChanged);
      socket.off('host-changed', onHostChanged);
      socket.off('game-finished', onGameFinished);
      socket.off('error-message', onErrorMessage);
    };
  }, [socket, toast]);

  // Update state from room data
  const updateRoomState = (room) => {
    setPlayers(room.players || []);
    setChat(room.chat || []);
    setMaxPlayers(room.maxPlayers || 4);
    setGameState(room.gameState || 'lobby');
    if (room.question) setQuestion(room.question);
    if (room.leaderboard?.length) setLeaderboard(room.leaderboard);

    // Update my status
    const me = room.players?.find(p => p.socketId === socket?.id);
    if (me) {
      setIsHost(me.isHost);
      setMyStatus(me.status);
      if (me.code && !myCode) setMyCode(me.code);
    }
  };

  // Code change handler
  const handleCodeChange = (code) => {
    if (!socket?.id || isEditorLocked) return;
    setMyCode(code);
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => {
      socket.emit('code-change', { roomId, code });
    }, 100);
  };

  // Ready button
  const handleReady = () => {
    socket.emit('player-ready', { roomId });
    setMyStatus('ready');
  };

  // Start game (host only)
  const handleStartGame = () => {
    socket.emit('start-countdown', { roomId });
  };

  // Run code
  const runCode = async () => {
    if (!question?._id) {
      toast.error('No question loaded');
      return;
    }

    try {
      toast.info('Running code...');
      const res = await axios.post(`${API_URL}/api/run`, {
        code: myCode,
        language: 'python',
        questionId: question._id,
      });
      const { allPassed, results } = res.data;
      setOutput(results);

      if (allPassed) {
        toast.success('All test cases passed!');
      } else {
        const passed = results.filter(r => r.passed).length;
        toast.warning(`${passed}/${results.length} test cases passed`);
      }
    } catch (err) {
      toast.error('Error running code: ' + (err.response?.data?.error || err.message));
    }
  };

  // Submit code
  const submitCode = async () => {
    if (myStatus === 'submitted') {
      toast.warning('Already submitted');
      return;
    }

    try {
      toast.info('Submitting...');
      const res = await axios.post(`${API_URL}/api/run`, {
        code: myCode,
        language: 'python',
        questionId: question._id,
      });
      const { results } = res.data;
      setOutput(results);

      const testsPassed = results.filter(r => r.passed).length;
      const totalTests = results.length;

      // Calculate score
      const correctBonus = testsPassed === totalTests ? 100 : 0;
      const partialCredit = totalTests > 0 ? Math.floor((testsPassed / totalTests) * 50) : 0;
      const score = correctBonus + partialCredit;

      socket.emit('player-submit', { roomId, testsPassed, totalTests, score });
      setMyStatus('submitted');
      toast.success('Code submitted successfully!');
    } catch (err) {
      toast.error('Submission failed: ' + (err.response?.data?.error || err.message));
    }
  };

  // Send chat
  const sendChat = () => {
    if (!chatInput.trim()) return;
    socket.emit('send-chat', { roomId, message: chatInput });
    setChatInput('');
  };

  // Check if all players ready
  const allPlayersReady = players.length >= 2 && players.filter(p => p.online).every(p => p.status === 'ready');

  return (
    <div className="h-screen bg-[#0a1612] flex flex-col overflow-hidden relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-animated opacity-20 pointer-events-none" />

      {/* Countdown Overlay */}
      <CountdownOverlay countdown={countdown} visible={showCountdown} />

      {/* Leaderboard Modal */}
      {leaderboard && gameState === 'finished' && (
        <Leaderboard
          leaderboard={leaderboard}
          onClose={() => setLeaderboard(null)}
        />
      )}

      {/* Header */}
      <GameHeader
        roomId={roomId}
        timeRemaining={timeRemaining}
        gameState={gameState}
        playerCount={players.filter(p => p.online).length}
        maxPlayers={maxPlayers}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Players Sidebar */}
        <PlayersSidebar players={players} currentPlayerId={socket?.id} />

        {/* Center Panel - Problem & Editor */}
        <main className="flex-1 p-4 overflow-y-auto">
          {/* Lobby Actions */}
          {gameState === 'lobby' && (
            <div className="glass-card neon-border p-6 mb-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#00ff99]" />
                Waiting Room
              </h3>
              <div className="flex flex-wrap gap-4">
                {myStatus === 'waiting' && (
                  <button
                    onClick={handleReady}
                    className="flex items-center gap-2 px-6 py-3 bg-[#00ff99]/20 border border-[#00ff99]/30 text-[#00ff99] rounded-xl hover:bg-[#00ff99]/30 transition-colors font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    I'm Ready
                  </button>
                )}
                {myStatus === 'ready' && (
                  <span className="flex items-center gap-2 px-6 py-3 bg-[#00ff99]/10 text-[#00ff99] rounded-xl border border-[#00ff99]/20 font-medium">
                    <CheckCircle className="w-5 h-5" />
                    You're Ready
                  </span>
                )}
                {isHost && (
                  <button
                    onClick={handleStartGame}
                    disabled={!allPlayersReady}
                    className={`glow-btn flex items-center gap-2 ${!allPlayersReady ? 'opacity-50 cursor-not-allowed' : 'animate-pulse-glow'}`}
                  >
                    <Play className="w-5 h-5" />
                    Start Game
                  </button>
                )}
              </div>
              {!allPlayersReady && players.length >= 2 && (
                <p className="text-white/40 text-sm mt-3">
                  Waiting for all players to be ready...
                </p>
              )}
              {players.length < 2 && (
                <p className="text-white/40 text-sm mt-3">
                  Need at least 2 players to start
                </p>
              )}
            </div>
          )}

          {/* Question */}
          {question && (
            <div className="glass-card p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-white">{question.title}</h2>
                {question.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${question.difficulty === 'Easy' ? 'bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/30' :
                      question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                    {question.difficulty}
                  </span>
                )}
              </div>
              <p className="text-white/60 mb-4 whitespace-pre-wrap">{question.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="terminal-output p-4">
                  <span className="text-white/40 text-xs uppercase tracking-wide">Sample Input</span>
                  <pre className="text-[#00ff99] mt-2 font-mono">{question.sampleInput}</pre>
                </div>
                <div className="terminal-output p-4">
                  <span className="text-white/40 text-xs uppercase tracking-wide">Expected Output</span>
                  <pre className="text-[#00ff99] mt-2 font-mono">{question.sampleOutput}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Code Editor */}
          <div className="glass-card p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Your Code</h3>
              <span className="neon-badge">Python</span>
            </div>
            <div className="editor-container">
              <CodeEditor
                language="python"
                value={myCode}
                onChange={handleCodeChange}
                readOnly={isEditorLocked}
              />
            </div>
            {isEditorLocked && gameState === 'lobby' && (
              <p className="text-yellow-400/60 text-sm mt-2">Editor locked until game starts</p>
            )}
            {myStatus === 'submitted' && (
              <p className="text-[#00d4ff]/60 text-sm mt-2">Code submitted - waiting for other players</p>
            )}
          </div>

          {/* Actions */}
          {gameState === 'playing' && myStatus !== 'submitted' && (
            <div className="flex gap-4 mb-4">
              <button
                onClick={runCode}
                className="glow-btn-outline flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Run Code
              </button>
              <button
                onClick={submitCode}
                className="glow-btn flex items-center gap-2 animate-pulse-glow"
              >
                <Send className="w-5 h-5" />
                Submit
              </button>
            </div>
          )}

          {/* Output */}
          {output.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Test Results</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {output.map((c, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${c.passed
                        ? 'border-[#00ff99]/20 bg-[#00ff99]/5'
                        : 'border-red-500/20 bg-red-500/5'
                      }`}
                  >
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-white/30 text-xs uppercase">Input</span>
                        <pre className="text-white/80 font-mono mt-1">{c.input}</pre>
                      </div>
                      <div>
                        <span className="text-white/30 text-xs uppercase">Expected</span>
                        <pre className="text-white/80 font-mono mt-1">{c.expected}</pre>
                      </div>
                      <div>
                        <span className="text-white/30 text-xs uppercase">Output</span>
                        <pre className="text-white/80 font-mono mt-1">{c.output}</pre>
                      </div>
                    </div>
                    <p className={`font-medium mt-2 ${c.passed ? 'status-ready' : 'text-red-400'}`}>
                      {c.passed ? '✓ Passed' : '✗ Failed'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Chat Sidebar */}
        <aside className={`w-80 bg-[#0a1612]/80 backdrop-blur-lg border-l border-white/5 flex flex-col ${showChat ? '' : 'hidden lg:flex'}`}>
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00ff99]" />
              Chat
            </h3>
            <button
              onClick={() => setShowChat(false)}
              className="lg:hidden p-1 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.map((m, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-medium neon-text">{m.playerName}:</span>{' '}
                <span className="text-white/60">{m.message}</span>
              </div>
            ))}
            {chat.length === 0 && (
              <p className="text-white/30 text-sm text-center py-4">No messages yet</p>
            )}
          </div>
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <input
                className="flex-1 bg-black/30 border border-white/10 px-3 py-2 rounded-xl text-white placeholder-white/30 focus:border-[#00ff99] focus:shadow-[0_0_15px_rgba(0,255,153,0.2)] transition"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChat()}
              />
              <button
                onClick={sendChat}
                className="px-4 py-2 bg-[#00ff99] text-[#0a1612] font-semibold rounded-xl hover:bg-[#00cc7a] transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Chat Toggle */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="lg:hidden fixed bottom-4 right-4 w-14 h-14 bg-[#00ff99] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,153,0.5)] z-40"
      >
        <MessageSquare className="w-6 h-6 text-[#0a1612]" />
      </button>
    </div>
  );
}
