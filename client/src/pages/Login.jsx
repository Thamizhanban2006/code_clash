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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}
