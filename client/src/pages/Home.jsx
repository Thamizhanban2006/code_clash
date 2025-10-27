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
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to CodeClash ⚔️</h1>

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="p-2 border rounded mb-4"
      />

      <button onClick={handleJoin} className="bg-green-500 text-white px-4 py-2 rounded mb-2">
        Join Room
      </button>

      <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Room
      </button>
    </div>
  );
}

export default Home;
