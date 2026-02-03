import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Zap, ArrowRight } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://code-clash-1-3a96.onrender.com/api/users/register",
        form
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-animated opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-[#00ff99]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <Zap className="w-10 h-10 text-[#00ff99] group-hover:drop-shadow-[0_0_15px_rgba(0,255,153,0.8)] transition-all" />
            <span className="text-2xl font-bold text-white">
              Code<span className="text-[#00ff99]">Clash</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card neon-border p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Create Your <span className="neon-text">Fighter Profile</span>
            </h1>
            <p className="text-white/50">
              Join the battle today
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  name="username"
                  type="text"
                  placeholder="codechampion"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#00ff99] focus:shadow-[0_0_15px_rgba(0,255,153,0.2)] transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#00ff99] focus:shadow-[0_0_15px_rgba(0,255,153,0.2)] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#00ff99] focus:shadow-[0_0_15px_rgba(0,255,153,0.2)] transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full glow-btn flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Profile...' : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0d1f1a] px-4 text-white/30 text-sm">Already a fighter?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full py-3.5 text-center font-semibold text-[#00ff99] bg-[#00ff99]/10 border border-[#00ff99]/30 rounded-xl hover:bg-[#00ff99]/20 transition-colors"
          >
            Sign In Instead
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-white/30 mt-8">
          © 2026 Code Clash. All rights reserved.
        </p>
      </div>
    </div>
  );
}
