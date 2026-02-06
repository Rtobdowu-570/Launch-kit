"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoved, setIsMouseMoved] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      setIsMouseMoved(true);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50">
      {/* Animated background elements */}
      {isMouseMoved && (
        <>
          {/* Primary gradient orb following mouse */}
          <motion.div
            className="pointer-events-none fixed w-96 h-96 rounded-full blur-3xl opacity-20 mix-blend-multiply"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.4) 40%, transparent 70%)",
              left: 0,
              top: 0,
              zIndex: 1,
            }}
            animate={{
              x: mousePosition.x - 192,
              y: mousePosition.y - 192,
            }}
            transition={{
              type: "spring",
              damping: 50,
              stiffness: 100,
              mass: 1,
            }}
          />

          {/* Secondary gradient orb with delay */}
          <motion.div
            className="pointer-events-none fixed w-80 h-80 rounded-full blur-3xl opacity-15 mix-blend-screen"
            style={{
              background: "radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(168, 85, 247, 0.3) 40%, transparent 70%)",
              left: 0,
              top: 0,
              zIndex: 1,
            }}
            animate={{
              x: mousePosition.x - 160 + 50,
              y: mousePosition.y - 160 + 50,
            }}
            transition={{
              type: "spring",
              damping: 60,
              stiffness: 60,
              mass: 1.5,
              delay: 0.05,
            }}
          />

          {/* Tertiary accent orb */}
          <motion.div
            className="pointer-events-none fixed w-72 h-72 rounded-full blur-3xl opacity-10 mix-blend-overlay"
            style={{
              background: "radial-gradient(circle, rgba(124, 58, 237, 0.5) 0%, rgba(236, 72, 153, 0.2) 40%, transparent 70%)",
              left: 0,
              top: 0,
              zIndex: 1,
            }}
            animate={{
              x: mousePosition.x - 144 - 50,
              y: mousePosition.y - 144 - 50,
            }}
            transition={{
              type: "spring",
              damping: 70,
              stiffness: 50,
              mass: 2,
              delay: 0.1,
            }}
          />
        </>
      )}

      {/* Fixed floating elements */}
      <motion.div
        className="pointer-events-none absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-5 blur-2xl"
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-20 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-pink-400 to-purple-300 opacity-5 blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="max-w-5xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge with staggered animation */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-purple-200/50 rounded-full shadow-medium mb-8 hover:bg-white/80 transition-all duration-300"
        >
          <motion.span
            className="w-2 h-2 bg-gradient-to-r from-gradient-from to-gradient-to rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text text-transparent font-semibold">
            AI-Powered Brand Builder
          </span>
        </motion.div>

        {/* Main heading with letter-by-letter animation effect */}
        <motion.h1
          variants={itemVariants}
          className="text-display-lg md:text-display-xl font-bold text-text-primary mb-6 leading-tight"
        >
          From bio to brand
          <br />
          <motion.span
            className="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent inline-block"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            in 60 seconds
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
        >
          Transform your one-sentence bio into a complete brand identity with a live website.
          <span className="block mt-2 text-text-secondary/70 font-normal">No code. No design skills. No hassle.</span>
        </motion.p>

        {/* CTA Buttons with enhanced interactions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/launch"
              className="group relative px-10 py-5 bg-gradient-to-r from-gradient-from to-gradient-to text-white text-lg font-bold rounded-xl transition-all shadow-large hover:shadow-xl overflow-hidden block text-center"
            >
              <span className="relative z-10">Start Building for Free</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gradient-via to-gradient-from opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="#features"
              className="px-10 py-5 bg-white/40 backdrop-blur-sm text-text-primary text-lg font-semibold rounded-xl border border-purple-200/50 hover:bg-white/60 transition-all block text-center"
            >
              See How It Works
            </Link>
          </motion.div>
        </motion.div>

        {/* Social proof with animated avatars */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-text-secondary font-medium"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[
                "from-blue-400 to-purple-500",
                "from-purple-400 to-pink-500",
                "from-pink-400 to-rose-500",
                "from-blue-300 to-indigo-500",
              ].map((gradient, i) => (
                <motion.div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-white shadow-medium`}
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            <span className="font-semibold text-text-primary">500+ brands launched</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gradient-to-b from-gradient-from to-transparent" />
          <motion.span
            className="hidden sm:inline font-semibold text-text-primary"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ⚡ Average setup: 47 seconds
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}
