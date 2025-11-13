import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId) navigate(`/room/${roomId}`);
  };

  const handleCreate = () => {
    const newRoomId = `room-${Math.floor(Math.random() * 10000)}`;
    navigate(`/room/${newRoomId}`);
  };

  return (
   <div
      className="relative flex flex-col items-center justify-center min-h-screen text-[#00FF41] overflow-hidden"
    >
      {/* Background - Matrix code effect */}
      <div
        className="absolute inset-0 bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKgXdUbiboduh99tT7ldzL5ULsOpUMQ3VgAw&s')] bg-cover bg-center opacity-50"
      ></div>

      {/* Overlay Glow */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 text-center animate-fadeIn">
        <h1 className="text-5xl font-extrabold mb-4 tracking-widest text-[#39FF14] glitch">
          CODE<span className="text-[#00FF41]">CLASH ⚔️</span>
        </h1>
        <p className="text-lg mb-8 text-[#00FF41]/80 italic">
          Enter the digital arena. Code. Compete. Conquer.
        </p>

        <div className="bg-[#0D0D0D]/80 border border-[#00FF41] rounded-2xl p-8 shadow-[0_0_25px_#00FF41] w-80 mx-auto hover:shadow-[0_0_35px_#39FF14] transition-all duration-300">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-3 mb-4 bg-black border border-[#39FF14] rounded text-[#00FF41] placeholder-[#00FF41]/50 focus:outline-none focus:ring-2 focus:ring-[#39FF14] transition"
          />

          <button
            onClick={handleJoin}
            className="w-full bg-[#00FF41] text-black font-semibold py-2 rounded mb-3 hover:bg-[#39FF14] transition-all"
          >
            Join Room
          </button>

          <button
            onClick={handleCreate}
            className="w-full bg-transparent border border-[#39FF14] text-[#00FF41] font-semibold py-2 rounded hover:bg-[#00FF41] hover:text-black transition-all"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
