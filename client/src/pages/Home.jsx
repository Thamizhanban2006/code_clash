import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Users, ArrowRight, Plus, Zap, Trophy, Timer, Brain, Shield, Cpu, Wifi } from "lucide-react";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId) navigate(`/room/${roomId}`);
  };

  const handleCreate = () => {
    const newRoomId = `room-${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem('newRoomMaxPlayers', maxPlayers.toString());
    navigate(`/room/${newRoomId}`);
  };

  const features = [
    { icon: Users, title: 'Multiplayer Rooms', desc: 'Battle with 2-4 players in real-time' },
    { icon: Timer, title: 'Live Global Timer', desc: 'Synchronized countdown for all' },
    { icon: Brain, title: 'Smart Judge', desc: 'AI-powered code evaluation' },
    { icon: Trophy, title: 'Competitive Leaderboards', desc: 'Climb the global rankings' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-animated opacity-50" />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#00ff99]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#00d4ff]/10 rounded-full blur-3xl" />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6">
                <Wifi className="w-4 h-4 text-[#00ff99]" />
                <span className="text-sm font-medium text-white/80">Live Multiplayer Battles</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Fast, <span className="neon-text">Real-Time</span>
                <br />
                Coding Battles
              </h1>

              <p className="text-lg text-white/60 mb-8 max-w-xl">
                Compete, code, and climb the leaderboard in multiplayer rooms.
                Challenge developers worldwide in intense coding showdowns.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleCreate}
                  className="glow-btn flex items-center gap-2 text-base animate-pulse-glow"
                >
                  Start Playing
                  <ArrowRight className="w-5 h-5" />
                </button>
                <Link
                  to="/about"
                  className="glow-btn-outline flex items-center gap-2 text-base"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Content - Game Card */}
            <div className="glass-card p-6 md:p-8 neon-border">
              {/* Join Room */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Join Existing Room
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#00ff99] transition"
                  />
                  <button
                    onClick={handleJoin}
                    disabled={!roomId}
                    className="flex items-center gap-2 px-6 py-3 bg-[#00ff99] text-[#0a1612] font-semibold rounded-xl hover:bg-[#00cc7a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Join
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0d1f1a] px-4 text-white/40 text-sm">or create new</span>
                </div>
              </div>

              {/* Create Room */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Create New Room
                </label>

                {/* Max Players Selector */}
                <div className="flex items-center gap-4 mb-4 p-4 bg-black/20 rounded-xl border border-white/5">
                  <Users className="w-5 h-5 text-[#00ff99]" />
                  <span className="text-white/60 text-sm">Max Players:</span>
                  <div className="flex gap-2 ml-auto">
                    {[2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setMaxPlayers(num)}
                        className={`w-10 h-10 rounded-lg font-semibold transition ${maxPlayers === num
                            ? 'bg-[#00ff99] text-[#0a1612] shadow-[0_0_15px_rgba(0,255,153,0.5)]'
                            : 'bg-white/5 text-white/60 border border-white/10 hover:border-[#00ff99]/50'
                          }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-[#00ff99]/30 transition"
                >
                  <Plus className="w-5 h-5 text-[#00ff99]" />
                  Create Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why <span className="neon-text">Code Clash</span>?
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              The ultimate platform for competitive programmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center group hover:border-[#00ff99]/40 transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#00ff99]/10 border border-[#00ff99]/20 flex items-center justify-center group-hover:bg-[#00ff99]/20 group-hover:shadow-[0_0_20px_rgba(0,255,153,0.3)] transition-all">
                  <feature.icon className="w-7 h-7 text-[#00ff99]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div>
              <p className="text-3xl font-bold neon-text">2-4</p>
              <p className="text-sm text-white/40">Players per Room</p>
            </div>
            <div>
              <p className="text-3xl font-bold neon-text">Real-time</p>
              <p className="text-sm text-white/40">Live Updates</p>
            </div>
            <div>
              <p className="text-3xl font-bold neon-text">Instant</p>
              <p className="text-sm text-white/40">Code Evaluation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
