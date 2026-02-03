import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Brain, Timer, Zap, Target, ArrowRight, Shield, Cpu } from 'lucide-react';

export default function About() {
    const features = [
        {
            icon: Users,
            title: 'Real-time Multiplayer',
            description: 'Compete with 2-4 players in live coding battles. Experience the thrill of coding under pressure.'
        },
        {
            icon: Trophy,
            title: 'Live Leaderboards',
            description: 'Track your progress and climb the ranks. See how you stack up against other coders.'
        },
        {
            icon: Brain,
            title: 'Smart Code Evaluation',
            description: 'Our AI-powered judge evaluates your code instantly with comprehensive test cases.'
        },
        {
            icon: Timer,
            title: 'Fair Timed Battles',
            description: 'Every player gets the same time limit. Speed and accuracy determine the winner.'
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-grid-animated opacity-30" />

            {/* Gradient orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#00ff99]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-3xl" />

            {/* Hero Section */}
            <section className="relative py-20 md:py-32">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6">
                        <Cpu className="w-4 h-4 text-[#00ff99]" />
                        <span className="text-sm font-medium text-white/80">About Our Platform</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        About <span className="neon-text">Code Clash</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        A real-time multiplayer coding battle platform designed to sharpen your programming skills
                        while competing with developers from around the world.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Why Choose <span className="neon-text">Code Clash</span>?
                        </h2>
                        <p className="text-white/50 max-w-2xl mx-auto">
                            We've built the ultimate platform for competitive coding enthusiasts.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group glass-card p-6 lg:p-8 hover:border-[#00ff99]/40 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#00ff99]/10 border border-[#00ff99]/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#00ff99]/20 group-hover:shadow-[0_0_20px_rgba(0,255,153,0.3)] transition-all">
                                    <feature.icon className="w-7 h-7 text-[#00ff99]" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-white/50 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="glass-card neon-border p-8 md:p-12 text-center relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 bg-grid-animated opacity-20" />

                        <div className="relative z-10">
                            <Target className="w-12 h-12 mx-auto mb-6 text-[#00ff99]" />
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Our <span className="neon-text">Mission</span>
                            </h2>
                            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                                To make learning to code competitive, fun, and interactive. We believe that the best way
                                to improve your coding skills is through practice and friendly competition.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-16 md:py-24 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Start <span className="neon-text">Battling</span>?
                    </h2>
                    <p className="text-white/50 mb-8 max-w-xl mx-auto">
                        Join thousands of developers who are already improving their skills through competitive coding.
                    </p>
                    <Link
                        to="/"
                        className="glow-btn inline-flex items-center gap-2 text-base animate-pulse-glow"
                    >
                        Start Playing
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-8 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Zap className="w-6 h-6 text-[#00ff99]" />
                            <span className="font-bold text-white">Code<span className="text-[#00ff99]">Clash</span></span>
                        </div>
                        <p className="text-sm text-white/30">
                            © 2026 Code Clash. Built for developers, by developers.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
