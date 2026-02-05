
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-bold font-display text-text-primary">
            LaunchKit
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-text-secondary hover:text-text-primary transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-text-secondary hover:text-text-primary transition-colors">
              Blog
            </Link>
          </nav>
          <div>
            <Link
              href="/launch"
              className="px-5 py-2 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-primary/90 transition-all transform hover:scale-105 shadow-md"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
