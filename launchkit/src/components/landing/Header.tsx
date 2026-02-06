
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
          {/* Logo with hover animation */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-gradient-from to-gradient-to rounded-lg shadow-medium"
              whileHover={{ scale: 1.15, rotate: 10 }}
              transition={{ duration: 0.3 }}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text text-transparent group-hover:drop-shadow-lg transition-all">
              LaunchKit
            </span>
          </Link>

          {/* Navigation with animated underline */}
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
                  className="text-sm font-medium text-text-secondary hover:text-gradient-to transition-colors duration-300"
                >
                  {item.label}
                </Link>
                {isHovered === item.href && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gradient-from to-gradient-to"
                    initial={{ opacity: 0, width: "0%" }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </nav>

          {/* CTA with enhanced hover effect */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/launch"
                className="px-6 py-2 bg-gradient-to-r from-gradient-from to-gradient-to text-white text-sm font-semibold rounded-lg hover:shadow-large transition-all shadow-medium relative overflow-hidden group"
              >
                <span className="relative z-10">Start Free</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gradient-via to-gradient-from opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
