"use client";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    content:
      "LaunchKit saved me weeks of work. I went from idea to live website in literally 60 seconds. The AI-generated brand was spot-on!",
    rating: 5,
    avatar: "SC",
    color: "from-blue-400 to-purple-500",
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Developer",
    content:
      "As a developer, I appreciate how LaunchKit handles all the tedious setup. Domain registration, DNS, deployment - all automated. Brilliant!",
    rating: 5,
    avatar: "MR",
    color: "from-purple-400 to-pink-500",
  },
  {
    name: "Emily Watson",
    role: "Content Creator",
    content:
      "I'm not technical at all, but LaunchKit made it so easy. The templates are beautiful and my site looks professional. Highly recommend!",
    rating: 5,
    avatar: "EW",
    color: "from-pink-400 to-rose-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-blue-50/50 to-purple-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-5"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-5"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-bold text-transparent bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text uppercase tracking-wider"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-display-md md:text-display-lg font-bold text-text-primary"
          >
            Loved by Creators
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto font-medium"
          >
            Join hundreds of satisfied users who launched their brands with LaunchKit
          </motion.p>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              className="group h-full"
              whileHover={{ y: -8 }}
            >
              <motion.div
                className="h-full p-8 bg-white/60 backdrop-blur-sm border border-purple-200/50 rounded-2xl hover:border-gradient-to/50 transition-all hover:shadow-large hover:bg-white/80 relative overflow-hidden"
                whileHover={{ boxShadow: "0 20px 50px rgba(124, 58, 237, 0.15)" }}
              >
                {/* Animated gradient background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gradient-from/5 to-gradient-to/5 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative z-10">
                  {/* Rating with animated stars */}
                  <motion.div
                    className="flex items-center gap-1 mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                  >
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <motion.div
                        key={idx}
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: idx * 0.1,
                        }}
                      >
                        <FiStar className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Content */}
                  <motion.p
                    className="text-text-primary mb-8 leading-relaxed font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 + 0.1 }}
                  >
                    "{testimonial.content}"
                  </motion.p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-purple-200/50">
                    <motion.div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold shadow-medium flex-shrink-0`}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      {testimonial.avatar}
                    </motion.div>
                    <div>
                      <p className="font-bold text-text-primary">{testimonial.name}</p>
                      <p className="text-sm text-text-secondary font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
