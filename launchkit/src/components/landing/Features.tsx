
"use client";
import { motion } from "framer-motion";
import { FiFeather, FiZap, FiSend } from "react-icons/fi";

const features = [
  {
    icon: <FiFeather className="w-6 h-6" />,
    title: "Enter Your Bio",
    description: "Start with a single sentence. Our AI understands your skills, profession, and tone to create a brand that is uniquely you.",
    step: "01",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    title: "AI-Generated Brand",
    description: "Receive three complete brand identities, including names, color palettes, and taglines, with domain availability already checked.",
    step: "02",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <FiSend className="w-6 h-6" />,
    title: "Instant Launch",
    description: "With a single click, your new brand and website are live. We handle domain registration, site generation, and deployment.",
    step: "03",
    gradient: "from-pink-500 to-red-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 h-full w-full">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:14rem_14rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_100%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-40 right-1/4 h-72 w-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15" />
      <div className="absolute -bottom-8 left-1/3 h-72 w-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text uppercase tracking-wider mb-4">
            How it works
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            The 3-Step Magic
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium">
            Experience the fastest way to build a professional online presence
          </p>
        </motion.div>

        {/* Feature cards - Bento grid style */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group h-full"
              whileHover={{ y: -8 }}
            >
              <div className="relative h-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl hover:border-white/30 transition-all hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 backdrop-blur-sm overflow-hidden">
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

                {/* Step number */}
                <motion.div
                  className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg`}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.step}
                </motion.div>

                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} bg-opacity-10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={`bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent text-lg`}>
                    {feature.icon}
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed font-medium text-base relative z-10">
                  {feature.description}
                </p>

                {/* Bottom gradient line */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl`}
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
