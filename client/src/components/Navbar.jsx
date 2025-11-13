import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("playerName");
    navigate("/login");
  };


  return (
    <nav className="bg-[#0a0a0a] text-[#d1fae5] border-b border-[#10b981]/30 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-1 py-4">
         
        <Link to="/" className="text-2xl font-bold text-[#10b981] tracking-wider hover:text-[#34d399] transition">
         <span className="text-[#00FF41] drop-shadow-[0_0_8px_#00FF41]">{`</>`}</span> CodeClash 
        </Link>

          {/* NAV LINKS */}
        <div className="flex gap-8 text-sm font-semibold tracking-wider">
          <Link
            to="/"
            className={`relative group ${
              location.pathname === "/" ? "text-[#39FF14]" : "text-[#00FF41]/80"
            } hover:text-[#39FF14] transition`}
          >
            Home
            <span className="absolute bottom-[-4px] left-0 w-0 group-hover:w-full h-[2px] bg-[#00FF41] transition-all duration-300"></span>
          </Link>

          <Link
            to="/dashboard"
            className={`relative group ${
              location.pathname === "/dashboard"
                ? "text-[#39FF14]"
                : "text-[#00FF41]/80"
            } hover:text-[#39FF14] transition`}
          >
            Dashboard
            <span className="absolute bottom-[-4px] left-0 w-0 group-hover:w-full h-[2px] bg-[#00FF41] transition-all duration-300"></span>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-[#00FF41]/10 border border-[#00FF41]/40 px-4 py-1 rounded-md hover:bg-[#00FF41]/20 hover:text-[#39FF14] transition-all duration-300 font-bold shadow-[0_0_10px_#00FF41]"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
