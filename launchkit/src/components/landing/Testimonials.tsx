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
    color: "from-indigo-400 to-purple-500",
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

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-bold text-brand-primary uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="mt-4 text-display-md md:text-display-lg font-bold text-white">
              Loved by Creators
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto font-medium">
              Join hundreds of satisfied users who launched their brands with LaunchKit
            </p>
          </motion.div>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 bg-white border border-white/10 rounded-2xl hover:border-brand-primary transition-all hover:shadow-large">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-text-primary mb-8 leading-relaxed font-medium">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-border-light">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold shadow-medium`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{testimonial.name}</p>
                    <p className="text-sm text-text-secondary font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
