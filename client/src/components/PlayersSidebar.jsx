import React from 'react';
import { User, Crown, CheckCircle, Code, Send, Wifi, WifiOff } from 'lucide-react';

export default function PlayersSidebar({ players, currentPlayerId }) {
    // Get status icon and styling
    const getStatusDisplay = (status, isOnline) => {
        if (!isOnline) {
            return {
                icon: WifiOff,
                color: 'text-white/30',
                glow: '',
                label: 'Offline'
            };
        }

        switch (status) {
            case 'ready':
                return {
                    icon: CheckCircle,
                    color: 'text-[#00ff99]',
                    glow: 'shadow-[0_0_8px_rgba(0,255,153,0.5)]',
                    label: 'Ready'
                };
            case 'coding':
                return {
                    icon: Code,
                    color: 'text-yellow-400',
                    glow: 'shadow-[0_0_8px_rgba(250,204,21,0.5)]',
                    label: 'Coding'
                };
            case 'submitted':
                return {
                    icon: Send,
                    color: 'text-[#00d4ff]',
                    glow: 'shadow-[0_0_8px_rgba(0,212,255,0.5)]',
                    label: 'Submitted'
                };
            default:
                return {
                    icon: Wifi,
                    color: 'text-white/40',
                    glow: '',
                    label: 'Waiting'
                };
        }
    };

    return (
        <aside className="w-64 bg-[#0a1612]/80 backdrop-blur-lg border-r border-white/5 flex-shrink-0 overflow-hidden">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00ff99]" />
                    Players ({players.filter(p => p.online).length})
                </h3>
            </div>

            <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                {players.map((player) => {
                    const isMe = player.socketId === currentPlayerId;
                    const statusDisplay = getStatusDisplay(player.status, player.online);
                    const StatusIcon = statusDisplay.icon;

                    return (
                        <div
                            key={player.socketId}
                            className={`glass-card p-3 transition-all ${isMe
                                    ? 'border-[#00ff99]/30 bg-[#00ff99]/5'
                                    : ''
                                } ${!player.online ? 'opacity-50' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${isMe
                                        ? 'bg-gradient-to-br from-[#00ff99] to-[#00cc7a] shadow-[0_0_15px_rgba(0,255,153,0.4)]'
                                        : 'bg-white/10 border border-white/10'
                                    }`}>
                                    <User className={`w-5 h-5 ${isMe ? 'text-[#0a1612]' : 'text-white/60'}`} />

                                    {/* Host Crown */}
                                    {player.isHost && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                                            <Crown className="w-3 h-3 text-[#0a1612]" />
                                        </div>
                                    )}
                                </div>

                                {/* Player Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-medium truncate ${isMe ? 'text-[#00ff99]' : 'text-white'
                                            }`}>
                                            {player.name}
                                            {isMe && <span className="text-xs text-[#00ff99]/60 ml-1">(You)</span>}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-1 mt-1">
                                        <StatusIcon className={`w-3 h-3 ${statusDisplay.color} ${statusDisplay.glow}`} />
                                        <span className={`text-xs ${statusDisplay.color}`}>
                                            {statusDisplay.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Score (if any) */}
                                {player.score > 0 && (
                                    <div className="text-right">
                                        <p className="text-sm font-bold neon-text">{player.score}</p>
                                        <p className="text-xs text-white/30">pts</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {players.length === 0 && (
                    <div className="text-center py-8 text-white/30">
                        <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No players yet</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
