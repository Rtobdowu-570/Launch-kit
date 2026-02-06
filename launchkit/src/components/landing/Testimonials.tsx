"use client";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    content: "LaunchKit saved me weeks of work. I went from idea to live website in literally 60 seconds. The AI-generated brand was spot-on!",
    rating: 5,
    avatar: "SC",
    color: "from-blue-400 to-purple-500",
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Developer",
    content: "As a developer, I appreciate how LaunchKit handles all the tedious setup. Domain registration, DNS, deployment - all automated. Brilliant!",
    rating: 5,
    avatar: "MR",
    color: "from-purple-400 to-pink-500",
  },
  {
    name: "Emily Watson",
    role: "Content Creator",
    content: "I'm not technical at all, but LaunchKit made it so easy. The templates are beautiful and my site looks professional. Highly recommend!",
    rating: 5,
    avatar: "EW",
    color: "from-pink-400 to-rose-500",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 h-full w-full">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:14rem_14rem] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-1/3 h-72 w-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15" />
      <div className="absolute -bottom-8 left-1/4 h-72 w-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Loved by Creators
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium">
            Join hundreds of satisfied users who launched their brands with LaunchKit
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group h-full"
              whileHover={{ y: -8 }}
            >
              <motion.div
                className="h-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl hover:border-white/30 transition-all hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 backdrop-blur-sm relative overflow-hidden"
                whileHover={{ boxShadow: "0 20px 50px rgba(124, 58, 237, 0.15)" }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

                <div className="relative z-10">
                  {/* Rating */}
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
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
                      >
                        <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Content */}
                  <motion.p
                    className="text-white mb-8 leading-relaxed font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 + 0.1 }}
                  >
                    "{testimonial.content}"
                  </motion.p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <motion.div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold flex-shrink-0`}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      {testimonial.avatar}
                    </motion.div>
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
