import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("playerName");
    navigate("/login");
  };

  return (
    <nav className="bg-[#0a0a0a] text-[#d1fae5] border-b border-[#10b981]/30 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-[#10b981] tracking-wider hover:text-[#34d399] transition flex items-center gap-2"
        >
          <span className="text-[#00FF41] drop-shadow-[0_0_8px_#00FF41]">{`</>`}</span>
          CodeClash
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-[#00FF41] text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wider">

          <Link
            to="/"
            className={`relative group ${
              location.pathname === "/"
                ? "text-[#39FF14]"
                : "text-[#00FF41]/80"
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

      {/* MOBILE NAV DROPDOWN */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 text-sm font-semibold tracking-wider">

          <Link
            to="/"
            className={`${
              location.pathname === "/" ? "text-[#39FF14]" : "text-[#00FF41]/80"
            } hover:text-[#39FF14] transition`}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className={`${
              location.pathname === "/dashboard"
                ? "text-[#39FF14]"
                : "text-[#00FF41]/80"
            } hover:text-[#39FF14] transition`}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="bg-[#00FF41]/10 border border-[#00FF41]/40 px-4 py-2 rounded-md hover:bg-[#00FF41]/20 hover:text-[#39FF14] transition-all duration-300 font-bold shadow-[0_0_10px_#00FF41] text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
