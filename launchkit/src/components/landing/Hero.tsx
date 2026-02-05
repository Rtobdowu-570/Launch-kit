
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="text-center py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-text-primary">
          From bio to brand in 60 seconds.
        </h1>
        <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-text-secondary">
          LaunchKit transforms your one-sentence bio into a complete brand
          identity with a live website. No code, no design skills, no hassle.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 md:mt-10 flex justify-center gap-4"
      >
        <Link
          href="/launch"
          className="px-8 py-4 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-brand-primary/25"
        >
          Start Building for Free
        </Link>
        <Link
          href="#features"
          className="px-8 py-4 bg-background text-text-primary font-medium rounded-full hover:bg-gray-100 transition-colors transform hover:scale-105"
        >
          See How It Works
        </Link>
      </motion.div>
    </div>
  );
}
