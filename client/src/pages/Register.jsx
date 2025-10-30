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
      const res = await axios.post("https://code-clash-1-3a96.onrender.com/api/users/register", form);
      
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">Register</h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
          required
        />
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
}

