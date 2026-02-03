import React from 'react';
import { User, Trophy, Target, Clock, Gamepad2, TrendingUp, Award, Zap, Swords } from 'lucide-react';

export default function Profile() {
    // Static user data (will be replaced with real data later)
    const user = {
        username: localStorage.getItem('username') || 'Player One',
        title: 'Competitive Coder',
        badge: '⚡ Elite Coder',
        avatar: null
    };

    const stats = [
        { icon: Gamepad2, label: 'Games Played', value: '24', color: 'from-blue-400 to-blue-600' },
        { icon: Trophy, label: 'Wins', value: '15', color: 'from-[#00ff99] to-[#00cc7a]' },
        { icon: Target, label: 'Accuracy', value: '78%', color: 'from-[#00d4ff] to-[#0099cc]' },
        { icon: Clock, label: 'Avg Time', value: '12 min', color: 'from-purple-400 to-purple-600' }
    ];

    const recentMatches = [
        { result: 'won', opponent: 'Room #234', score: 150, time: '2 hours ago' },
        { result: 'lost', opponent: 'Room #198', score: 85, time: '5 hours ago' },
        { result: 'won', opponent: 'Room #301', score: 175, time: 'Yesterday' },
        { result: 'won', opponent: 'Room #156', score: 120, time: 'Yesterday' },
        { result: 'lost', opponent: 'Room #289', score: 65, time: '2 days ago' }
    ];

    return (
        <div className="min-h-screen py-8 md:py-12 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-grid-animated opacity-30" />

            {/* Gradient orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#00ff99]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#00d4ff]/10 rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">

                {/* Profile Header */}
                <div className="glass-card neon-border p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar with glow ring */}
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#00ff99] to-[#00cc7a] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,153,0.4)]">
                                <User className="w-12 h-12 md:w-16 md:h-16 text-[#0a1612]" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-[#0a1612] rounded-full flex items-center justify-center border-2 border-[#00ff99]">
                                <Award className="w-5 h-5 text-[#00ff99]" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                {user.username}
                            </h1>
                            <p className="text-white/50 mb-3">{user.title}</p>
                            <div className="neon-badge inline-flex items-center gap-2">
                                <Zap className="w-3 h-3" />
                                {user.badge}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-6 md:gap-8">
                            <div className="text-center">
                                <p className="text-2xl font-bold neon-text">15</p>
                                <p className="text-xs text-white/40">Wins</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white/40">9</p>
                                <p className="text-xs text-white/40">Losses</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold neon-text">62%</p>
                                <p className="text-xs text-white/40">Win Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="glass-card p-5 hover:border-[#00ff99]/40 transition-all"
                        >
                            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-white/40">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Matches */}
                <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#00ff99]/10 border border-[#00ff99]/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-[#00ff99]" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Recent Matches</h2>
                    </div>

                    <div className="space-y-3">
                        {recentMatches.map((match, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${match.result === 'won'
                                        ? 'bg-[#00ff99]/5 border-[#00ff99]/20 hover:border-[#00ff99]/40'
                                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${match.result === 'won'
                                            ? 'bg-[#00ff99]/20 text-[#00ff99]'
                                            : 'bg-white/5 text-white/40'
                                        }`}>
                                        {match.result === 'won' ? (
                                            <Trophy className="w-5 h-5" />
                                        ) : (
                                            <Swords className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">
                                            <span className={match.result === 'won' ? 'text-[#00ff99]' : 'text-red-400'}>
                                                {match.result === 'won' ? 'Won' : 'Lost'}
                                            </span>
                                            {' '}vs {match.opponent}
                                        </p>
                                        <p className="text-sm text-white/40">{match.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${match.result === 'won' ? 'neon-text' : 'text-white/40'
                                        }`}>
                                        {match.score} pts
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
