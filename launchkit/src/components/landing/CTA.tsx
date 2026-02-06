
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-24 md:py-32 bg-text-primary">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to rounded-3xl p-12 md:p-16 text-center shadow-large">
          {/* Decorative elements with enhanced glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          
          <div className="relative z-10">
            <h2 className="text-display-md md:text-display-lg font-bold text-white mb-6 drop-shadow-lg">
              Ready to build your brand?
            </h2>
            <p className="text-xl text-white mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
              Join hundreds of creators, freelancers, and developers who have launched
              their presence with LaunchKit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/launch"
                className="px-10 py-5 bg-white/20 text-text-primary font-semibold rounded-xl hover:bg-white/5 transition-all hover:scale-105 shadow-large text-lg"
              >
                Start Now, It's Free
              </Link>
              <Link
                href="#features"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all hover:scale-105 text-lg"
              >
                Learn More
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-white text-sm font-medium drop-shadow-md">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">No credit card required</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              <div className="hidden sm:flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Free forever plan</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
