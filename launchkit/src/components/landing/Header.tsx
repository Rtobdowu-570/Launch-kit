
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-border-light"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-gradient-from to-gradient-via rounded-lg group-hover:scale-110 transition-transform shadow-sm" />
            <span className="text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">LaunchKit</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="#features" 
              className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/blog" 
              className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/launch"
              className="px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-semibold rounded-lg hover:shadow-medium transition-all hover:scale-105 shadow-soft"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
