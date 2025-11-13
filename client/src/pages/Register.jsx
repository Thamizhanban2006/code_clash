import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://code-clash-1-3a96.onrender.com/api/users/register",
        form
      );

      alert("✅ Registration successful!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Registration failed!");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1A1A] p-6 rounded-xl shadow-[0_0_20px_#00FF41] w-80 border border-[#00FF41]/40"
      >
        <h2 className="text-2xl mb-4 font-bold text-center text-[#39FF14]">
          Register
        </h2>

        {/* ✅ Username Input */}
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="bg-black border border-[#00FF41] p-2 rounded w-full mb-3 text-[#00FF41] focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          required
        />

        {/* ✅ Email Input */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="bg-black border border-[#00FF41] p-2 rounded w-full mb-3 text-[#00FF41] focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          required
        />

        {/* ✅ Password Input */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="bg-black border border-[#00FF41] p-2 rounded w-full mb-3 text-[#00FF41] focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          required
        />

        {/* ✅ Submit Button */}
        <button
          type="submit"
          className="bg-[#00FF41] hover:bg-[#39FF14] text-black px-4 py-2 rounded w-full font-semibold transition duration-300"
        >
          Register
        </button>

        {/* ✅ Navigation Link */}
        <div
          onClick={() => navigate("/login")}
          className="text-[#39FF14] mt-3 text-center cursor-pointer hover:underline hover:text-[#00FF41] transition"
        >
          Already have an account? Login
        </div>
      </form>
    </div>
  );
}
