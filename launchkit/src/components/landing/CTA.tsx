
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 h-full w-full">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:14rem_14rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/2 right-1/4 h-80 w-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15" />
      <div className="absolute top-1/3 left-1/4 h-80 w-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-20 text-center"
          whileHover={{ boxShadow: "0 40px 80px rgba(124, 58, 237, 0.3)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Animated decorative circles */}
          <motion.div
            className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Ready to build your brand?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium"
            >
              Join hundreds of creators, freelancers, and developers who have launched their presence with LaunchKit.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/launch"
                  className="px-10 py-5 bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/30 transition-all text-lg border border-white/30 hover:border-white/50 block text-center"
                >
                  Start Now, It's Free
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#features"
                  className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border-2 border-white/30 hover:border-white/50 hover:bg-white/20 transition-all text-lg block text-center"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-white/90 text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div className="flex items-center gap-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">No credit card required</span>
              </motion.div>

              <motion.div className="hidden sm:block w-px h-4 bg-white/30" />

              <motion.div className="hidden sm:flex items-center gap-2" animate={{ x: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Free forever plan</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
