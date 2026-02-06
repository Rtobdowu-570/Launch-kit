
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export function Header() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
              whileHover={{ scale: 1.15, rotate: 10 }}
              transition={{ duration: 0.3 }}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              LaunchKit
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                onHoverStart={() => setIsHovered(item.href)}
                onHoverEnd={() => setIsHovered(null)}
                className="relative"
              >
                <Link 
                  href={item.href} 
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {item.label}
                </Link>
                {isHovered === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ opacity: 0, width: "0%" }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/launch"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-600/50 transition-all"
            >
              Start Free
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
