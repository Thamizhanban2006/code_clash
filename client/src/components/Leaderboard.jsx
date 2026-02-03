import React from 'react';
import { Trophy, Medal, Award, X, Home, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard({ leaderboard, onClose }) {
    const navigate = useNavigate();

    // Get medal/rank display
    const getRankDisplay = (index) => {
        switch (index) {
            case 0:
                return {
                    icon: Trophy,
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-500/20',
                    border: 'border-yellow-500/30',
                    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                };
            case 1:
                return {
                    icon: Medal,
                    color: 'text-gray-300',
                    bg: 'bg-gray-500/20',
                    border: 'border-gray-500/30',
                    glow: ''
                };
            case 2:
                return {
                    icon: Award,
                    color: 'text-amber-600',
                    bg: 'bg-amber-600/20',
                    border: 'border-amber-600/30',
                    glow: ''
                };
            default:
                return {
                    icon: null,
                    color: 'text-white/50',
                    bg: 'bg-white/5',
                    border: 'border-white/10',
                    glow: ''
                };
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg">
            <div className="glass-card neon-border w-full max-w-md overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#00ff99]/20 to-[#00d4ff]/20 p-6 text-center relative border-b border-white/10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <Trophy className="w-12 h-12 mx-auto text-[#00ff99] mb-3 drop-shadow-[0_0_15px_rgba(0,255,153,0.5)]" />
                    <h2 className="text-2xl font-bold text-white">Game Over!</h2>
                    <p className="text-white/40 text-sm mt-1">Final Results</p>
                </div>

                {/* Leaderboard */}
                <div className="p-6">
                    <div className="space-y-3">
                        {leaderboard.map((player, index) => {
                            const rankDisplay = getRankDisplay(index);
                            const RankIcon = rankDisplay.icon;

                            return (
                                <div
                                    key={player.socketId || index}
                                    className={`flex items-center gap-4 p-4 rounded-xl border ${rankDisplay.bg} ${rankDisplay.border} ${rankDisplay.glow} transition-all`}
                                >
                                    {/* Rank */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index < 3 ? 'bg-white/10' : 'bg-white/5'
                                        }`}>
                                        {RankIcon ? (
                                            <RankIcon className={`w-5 h-5 ${rankDisplay.color}`} />
                                        ) : (
                                            <span className="text-sm font-bold text-white/50">{index + 1}</span>
                                        )}
                                    </div>

                                    {/* Player Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold truncate ${index === 0 ? 'text-yellow-400' : 'text-white'
                                            }`}>
                                            {player.name}
                                        </p>
                                        <p className="text-xs text-white/40">
                                            {player.testsPassed}/{player.totalTests} tests passed
                                        </p>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right">
                                        <p className={`text-xl font-bold ${index === 0 ? 'text-yellow-400' : 'neon-text'
                                            }`}>
                                            {player.score}
                                        </p>
                                        <p className="text-xs text-white/30">points</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 glow-btn flex items-center justify-center gap-2 py-3"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Play Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
