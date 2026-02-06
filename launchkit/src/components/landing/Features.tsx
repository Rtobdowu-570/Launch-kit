
"use client";
import { motion } from "framer-motion";
import { FiFeather, FiZap, FiSend } from "react-icons/fi";

const features = [
  {
    icon: <FiFeather className="w-6 h-6" />,
    title: "Enter Your Bio",
    description:
      "Start with a single sentence. Our AI understands your skills, profession, and tone to create a brand that is uniquely you.",
    step: "01",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    title: "AI-Generated Brand",
    description:
      "Receive three complete brand identities, including names, color palettes, and taglines, with domain availability already checked.",
    step: "02",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: <FiSend className="w-6 h-6" />,
    title: "Instant Launch",
    description:
      "With a single click, your new brand and website are live. We handle domain registration, site generation, and deployment.",
    step: "03",
    gradient: "from-pink-500 to-rose-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10"
          animate={{
            y: [0, 30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10"
          animate={{
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
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
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-sm font-bold text-transparent bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text uppercase tracking-wider">
              How it works
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-display-md md:text-display-lg font-bold text-text-primary"
          >
            The 3-Step Magic
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto font-medium"
          >
            Experience the fastest way to build a professional online presence
          </motion.p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group h-full"
              whileHover={{ y: -8 }}
            >
              <div className="relative h-full p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/30 transition-all hover:shadow-large hover:bg-white/10">
                {/* Step number with enhanced styling */}
                <motion.div
                  className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white font-bold shadow-medium`}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.step}
                </motion.div>

                {/* Icon with enhanced animation */}
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} bg-opacity-10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={`bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed font-medium text-base">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
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
        </motion.div>
      </div>
    </section>
  );
}
