
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold font-display text-text-primary">
          Ready to build your brand?
        </h2>
        <p className="mt-4 text-lg text-text-secondary">
          Join hundreds of creators, freelancers, and developers who have launched
          their presence with LaunchKit.
        </p>
        <div className="mt-8">
          <Link
            href="/launch"
            className="px-10 py-5 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-primary/90 transition-all transform hover:scale-105 shadow-xl shadow-brand-primary/25 text-lg"
          >
            Start Now, It's Free
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
