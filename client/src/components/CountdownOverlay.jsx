import React from 'react';
import { Zap } from 'lucide-react';

export default function CountdownOverlay({ countdown, visible }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1612]/95 backdrop-blur-lg">
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-grid-animated opacity-30" />

            <div className="text-center relative z-10">
                {/* Animated rings */}
                <div className="relative w-48 h-48 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-2 border-[#00ff99]/20 animate-ping" />
                    <div className="absolute inset-4 rounded-full border-2 border-[#00ff99]/30 animate-ping" style={{ animationDelay: '0.2s' }} />
                    <div className="absolute inset-8 rounded-full border-2 border-[#00ff99]/40 animate-ping" style={{ animationDelay: '0.4s' }} />

                    {/* Glowing circle */}
                    <div className="absolute inset-12 rounded-full bg-[#00ff99]/10 border border-[#00ff99]/50 shadow-[0_0_60px_rgba(0,255,153,0.4)]" />

                    {/* Countdown number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl font-bold neon-text animate-pulse">
                            {countdown}
                        </span>
                    </div>
                </div>

                {/* Text */}
                <div className="flex items-center justify-center gap-2 text-xl text-white mb-2">
                    <Zap className="w-6 h-6 text-[#00ff99]" />
                    <span className="font-medium">Game starting in...</span>
                </div>

                <p className="text-white/40 text-sm">
                    Get ready to code!
                </p>
            </div>
        </div>
    );
}
