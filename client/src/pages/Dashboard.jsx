import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const canvasRef = useRef(null);

  // Matrix-style falling code animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00FF41";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = () => {
    
    navigate(`/`);
  };

  return (
    <div className="relative h-screen overflow-hidden text-[#00FF41] font-mono">
      {/* Matrix animated background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      ></canvas>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <div className="bg-black/60 p-8 rounded-2xl border border-[#00FF41]/40 shadow-[0_0_30px_#00FF41]">
          <h1 className="text-4xl font-bold mb-2 text-[#00FF41] drop-shadow-[0_0_8px_#00FF41]">
            Welcome, {username}! 👾
          </h1>
          <p className="text-[#00FF41]/80 mb-6 text-lg">
            Ready to enter the code arena?
          </p>

          <button
            onClick={handlePlay}
            className="bg-[#00FF41] text-black px-8 py-3 rounded-lg hover:bg-[#39FF14] hover:scale-105 transition-transform duration-200 font-bold shadow-[0_0_20px_#00FF41]"
          >
            ⚔️ Find Match
          </button>
        </div>

        <div className="absolute bottom-8 text-sm text-[#00FF41]/60">
          <p>💡 Tip: Fastest coder wins the round!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
