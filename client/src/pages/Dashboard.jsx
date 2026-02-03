import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Play, Trophy, Zap, ArrowRight, User, Swords, Target } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handlePlay = () => {
    navigate(`/`);
  };

  return (
    <div className="min-h-screen py-8 md:py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-animated opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#00ff99]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Welcome Card */}
        <div className="glass-card neon-border p-8 md:p-12 text-center mb-8">
          {/* Avatar */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-[#00ff99] to-[#00cc7a] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,153,0.4)]">
              <User className="w-12 h-12 md:w-14 md:h-14 text-[#0a1612]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00ff99] rounded-full flex items-center justify-center border-2 border-[#0a1612]">
              <Zap className="w-4 h-4 text-[#0a1612]" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, <span className="neon-text">{username}</span>!
          </h1>
          <p className="text-white/50 text-lg mb-8">
            Ready to enter the code arena?
          </p>

          {/* Primary CTA */}
          <button
            onClick={handlePlay}
            className="glow-btn inline-flex items-center gap-3 px-8 py-4 text-lg animate-pulse-glow"
          >
            <Swords className="w-6 h-6" />
            Find Match
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/profile"
            className="group glass-card p-6 hover:border-[#00ff99]/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00ff99]/10 border border-[#00ff99]/20 rounded-xl flex items-center justify-center group-hover:bg-[#00ff99]/20 group-hover:shadow-[0_0_20px_rgba(0,255,153,0.3)] transition-all">
                <Trophy className="w-6 h-6 text-[#00ff99]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">View Profile</h3>
                <p className="text-sm text-white/50">Check your stats and history</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[#00ff99] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            to="/about"
            className="group glass-card p-6 hover:border-[#00ff99]/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-xl flex items-center justify-center group-hover:bg-[#00d4ff]/20 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all">
                <Target className="w-6 h-6 text-[#00d4ff]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">About Code Clash</h3>
                <p className="text-sm text-white/50">Learn about our platform</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[#00d4ff] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Tip Card */}
        <div className="glass-card p-6 border-[#00ff99]/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#00ff99]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-[#00ff99]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#00ff99] mb-1">Pro Tip</h3>
              <p className="text-white/50 text-sm">
                The fastest coder wins the round! Focus on writing clean, efficient code
                to maximize your score and climb the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
