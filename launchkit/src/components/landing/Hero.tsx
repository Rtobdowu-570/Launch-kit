"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black">
      {/* Animated grid background */}
      <div className="absolute inset-0 h-full w-full">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:14rem_14rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Gradient orbs for depth */}
      <div className="absolute -top-40 -right-40 h-80 w-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute -bottom-8 -left-8 h-80 w-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 h-80 w-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-purple-500/50 rounded-full bg-purple-900/10 backdrop-blur-md hover:border-purple-400/80 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span className="text-sm bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              AI-Powered Brand Builder
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            From bio to brand
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              in 60 seconds
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Transform your one-sentence bio into a complete brand identity with a live website.
            <span className="block mt-2 text-gray-400">No code. No design skills. No hassle.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/launch"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-600/50 transition-all text-lg"
              >
                Start Building for Free
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#features"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:border-white/50 hover:bg-white/5 transition-all text-lg"
              >
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex items-center justify-center gap-6 text-sm text-gray-300"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "from-blue-400 to-purple-600",
                  "from-purple-400 to-pink-600",
                  "from-pink-400 to-rose-600",
                  "from-indigo-400 to-purple-600",
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-black shadow-lg`}
                  />
                ))}
              </div>
              <span className="font-semibold">500+ brands launched</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gradient-to-b from-gray-500 to-transparent" />
            <span className="hidden sm:inline font-semibold">⚡ Average setup: 47 seconds</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
