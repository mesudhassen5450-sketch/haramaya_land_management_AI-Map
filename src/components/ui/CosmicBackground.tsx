import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const CosmicBackground = () => {
    const stars = useMemo(() => {
        return Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            size: Math.random() * 2 + 0.5,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 4 + 2,
            delay: Math.random() * 5,
        }));
    }, []);

    const nebulousClusters = [
        { size: 300, x: 10, y: 10, color: 'from-brand-green/20 to-transparent', duration: 40, delay: 0 },
        { size: 400, x: 70, y: 60, color: 'from-brand-gold/15 to-transparent', duration: 60, delay: -10 },
        { size: 250, x: 40, y: 30, color: 'from-blue-500/10 to-transparent', duration: 50, delay: -5 },
    ];

    // Define 11 unique planets
    const planets = useMemo(() => [
        { id: 1, size: 40, orbit: 15, speed: 20, color: 'radial-gradient(circle at 30% 30%, #facc15, #854d0e)', delay: 0 },
        { id: 2, size: 60, orbit: 25, speed: 35, color: 'radial-gradient(circle at 30% 30%, #10b981, #064e3b)', hasRing: true, delay: -5 },
        { id: 3, size: 30, orbit: 35, speed: 50, color: 'radial-gradient(circle at 30% 30%, #3b82f6, #1e3a8a)', delay: -15 },
        { id: 4, size: 80, orbit: 45, speed: 90, color: 'radial-gradient(circle at 30% 30%, #f87171, #7f1d1d)', delay: -40 },
        { id: 5, size: 55, orbit: 55, speed: 120, color: 'radial-gradient(circle at 30% 30%, #a855f7, #581c87)', delay: -20 },
        { id: 6, size: 45, orbit: 65, speed: 150, color: 'radial-gradient(circle at 30% 30%, #fb923c, #7c2d12)', delay: -60 },
        { id: 7, size: 70, orbit: 75, speed: 200, color: 'radial-gradient(circle at 30% 30%, #2dd4bf, #134e4a)', hasRing: true, delay: -80 },
        { id: 8, size: 35, orbit: 85, speed: 180, color: 'radial-gradient(circle at 30% 30%, #fb7185, #881337)', delay: -10 },
        { id: 9, size: 90, orbit: 95, speed: 250, color: 'radial-gradient(circle at 30% 30%, #94a3b8, #1e293b)', delay: -120 },
        { id: 10, size: 50, orbit: 110, speed: 300, color: 'radial-gradient(circle at 30% 30%, #4ade80, #064e3b)', delay: -50 },
        { id: 11, size: 65, orbit: 125, speed: 350, color: 'radial-gradient(circle at 30% 30%, #60a5fa, #1e3a8a)', hasRing: true, delay: -200 },
    ], []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-[#020617]">
            {/* Deep Space Base */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#051125] to-[#020617]" />

            {/* Nebula Fog */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]"
            />

            {/* Galaxy Spiral Effect */}
            <motion.div
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 300,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute w-[200%] h-[200%] left-[-50%] top-[-50%] opacity-30"
                style={{
                    background: 'radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, transparent 70%), conic-gradient(from 0deg, transparent, rgba(16,185,129,0.2), transparent 25%, rgba(212,175,55,0.15), transparent 50%, rgba(16,185,129,0.2), transparent 75%, rgba(212,175,55,0.15), transparent)',
                    filter: 'blur(100px)'
                }}
            />

            {/* Glowing Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[200px] animate-pulse" />

            {/* Stars */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    initial={{ opacity: 0.1 }}
                    animate={{
                        opacity: [0.1, 0.8, 0.1],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "linear"
                    }}
                    className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{
                        width: star.size,
                        height: star.size,
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                    }}
                />
            ))}

            {/* 11 Orbital Planets */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vmax] h-[100vmax] pointer-events-none flex items-center justify-center">
                {planets.map((planet) => (
                    <motion.div
                        key={planet.id}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: planet.speed,
                            repeat: Infinity,
                            ease: "linear",
                            delay: planet.delay
                        }}
                        className="absolute rounded-full border border-white/5"
                        style={{
                            width: `${planet.orbit * 1.5}%`,
                            height: `${planet.orbit * 1.5}%`,
                        }}
                    >
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{
                                duration: planet.speed,
                                repeat: Infinity,
                                ease: "linear",
                                delay: planet.delay
                            }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                            style={{
                                width: planet.size,
                                height: planet.size,
                                background: planet.color,
                            }}
                        >
                            {/* Inner Shadow for Depth */}
                            <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8)]" />

                            {/* Planet Ring */}
                            {planet.hasRing && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[2px] bg-white/20 blur-[1px] rotate-[25deg]" />
                            )}
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Moving Nebulous Clusters */}
            {nebulousClusters.map((cluster, i) => (
                <motion.div
                    key={i}
                    animate={{
                        rotate: 360,
                        x: [0, 50, 0, -50, 0],
                        y: [0, -50, 0, 50, 0],
                    }}
                    transition={{
                        duration: cluster.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: cluster.delay
                    }}
                    className={`absolute rounded-full bg-gradient-to-br ${cluster.color} opacity-30`}
                    style={{
                        width: cluster.size,
                        height: cluster.size,
                        left: `${cluster.x}%`,
                        top: `${cluster.y}%`,
                        filter: 'blur(120px)'
                    }}
                />
            ))}
        </div>
    );
};

export default CosmicBackground;
