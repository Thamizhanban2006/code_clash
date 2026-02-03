import React from 'react';
import { Clock, Users, Hash, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GameHeader({ roomId, timeRemaining, gameState, playerCount, maxPlayers }) {
    // Format time display
    const formatTime = (seconds) => {
        if (seconds === null || seconds === undefined) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer color based on time remaining
    const getTimerStyles = () => {
        if (timeRemaining === null) return 'bg-white/5 text-white/50 border-white/10';
        if (timeRemaining <= 60) return 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse';
        if (timeRemaining <= 180) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        return 'bg-[#00ff99]/20 text-[#00ff99] border-[#00ff99]/30 shadow-[0_0_20px_rgba(0,255,153,0.3)]';
    };

    // Game state display
    const getStateDisplay = () => {
        switch (gameState) {
            case 'lobby':
                return { text: 'Waiting', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
            case 'countdown':
                return { text: 'Starting', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
            case 'playing':
                return { text: 'In Progress', color: 'bg-[#00ff99]/20 text-[#00ff99] border-[#00ff99]/30' };
            case 'finished':
                return { text: 'Finished', color: 'bg-white/10 text-white/60 border-white/20' };
            default:
                return { text: 'Unknown', color: 'bg-white/5 text-white/40 border-white/10' };
        }
    };

    const stateDisplay = getStateDisplay();

    return (
        <header className="bg-[#0a1612]/90 backdrop-blur-lg border-b border-white/5">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left: Back button and Room ID */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="p-2 rounded-lg text-white/50 hover:text-[#00ff99] hover:bg-white/5 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>

                        <div className="flex items-center gap-2 px-3 py-1.5 glass-card">
                            <Hash className="w-4 h-4 text-[#00ff99]" />
                            <span className="text-sm font-mono font-medium text-white">{roomId}</span>
                        </div>

                        {/* Game State Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stateDisplay.color}`}>
                            {stateDisplay.text}
                        </span>
                    </div>

                    {/* Center: Timer */}
                    {gameState === 'playing' && (
                        <div className={`flex items-center gap-2 px-5 py-2 rounded-full font-mono text-lg font-bold border ${getTimerStyles()}`}>
                            <Clock className="w-5 h-5" />
                            <span>{formatTime(timeRemaining)}</span>
                        </div>
                    )}

                    {/* Right: Player Count */}
                    <div className="flex items-center gap-2 px-3 py-1.5 glass-card">
                        <Users className="w-4 h-4 text-[#00ff99]" />
                        <span className="text-sm font-medium text-white">
                            {playerCount}/{maxPlayers}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
