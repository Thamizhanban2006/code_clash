import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    
    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://code-clash-1-3a96.onrender.com/api/users/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);

      alert("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Login failed!");
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
        className="bg-[#1A1A1A] p-6 rounded-xl shadow-[0_0_20px_#00FF41] w-80"
      >
        <h2 className="text-2xl mb-4 font-bold text-center text-[#39FF14]">
          Login
        </h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="bg-black border border-[#00FF41] p-2 rounded w-full mb-3 text-[#00FF41]"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="bg-black border border-[#00FF41] p-2 rounded w-full mb-3 text-[#00FF41]"
          required
        />

        <button
          type="submit"
          className="bg-[#00FF41] hover:bg-[#39FF14] text-black px-4 py-2 rounded w-full font-semibold"
        >
          Login
        </button>

       <div
          onClick={() => navigate("/register")}
          className="text-[#39FF14] mt-3 text-center cursor-pointer hover:underline"
        >
          Don’t have an account? Sign up
        </div>
      </form>
</div>
  );
}
