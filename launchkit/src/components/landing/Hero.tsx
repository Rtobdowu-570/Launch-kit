"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-black">
      {/* Mouse-following white gradient orbs */}
      <motion.div
        className="pointer-events-none fixed w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)",
          left: 0,
          top: 0,
          zIndex: 1,
        }}
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 80,
          mass: 1.5,
        }}
      />
      
      {/* Secondary mouse-following gradient orb with delay */}
      <motion.div
        className="pointer-events-none fixed w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)",
          left: 0,
          top: 0,
          zIndex: 1,
        }}
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
        }}
        transition={{
          type: "spring",
          damping: 60,
          stiffness: 60,
          mass: 2,
        }}
      />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge with gradient border */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-brand-primary/20 rounded-full shadow-soft mb-8">
            <span className="w-2 h-2 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full animate-pulse" />
            <span className="text-sm bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent font-semibold">
              AI-Powered Brand Builder
            </span>
          </div>

          {/* Main heading with enhanced gradient */}
          <h1 className="text-display-lg md:text-display-xl font-bold text-white mb-6">
            From bio to brand
            <br />
            <span className="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
              in 60 seconds
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Transform your one-sentence bio into a complete brand identity with a live website.
            <span className="block mt-2 text-white/60 font-normal">No code. No design skills. No hassle.</span>
          </p>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/launch"
              className="group relative px-10 py-5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-lg font-bold rounded-xl transition-all shadow-large hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">Start Building for Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="#features"
              className="px-10 py-5 bg-white/20 text-text-primary text-lg font-semibold rounded-xl  hover:border-border-light transition-all hover:scale-105"
            >
              See How It Works
            </Link>
          </div>

          {/* Social proof with gradient accents */}
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-white/70 font-medium">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  'from-indigo-400 to-purple-500',
                  'from-purple-400 to-pink-500',
                  'from-pink-400 to-rose-500',
                  'from-blue-400 to-indigo-500'
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-white/20 shadow-sm`}
                  />
                ))}
              </div>
              <span className="font-semibold text-white">500+ brands launched</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="hidden sm:inline font-semibold text-white">⚡ Average setup: 47 seconds</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
