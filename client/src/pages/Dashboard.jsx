import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handlePlay = () => {
    const randomRoom = "room-" + Math.floor(Math.random() * 9000 + 1000);
    navigate(`/`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome, {username}! 👋</h1>
      <p className="text-gray-600 mb-6">Ready to battle with your code?</p>
      <button
        onClick={handlePlay}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        🎮 Play Game
      </button>
    </div>
  );
};

export default Dashboard;
