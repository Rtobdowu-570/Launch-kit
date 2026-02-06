
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
    gradient: "from-indigo-500 to-purple-600",
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

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-bold text-brand-primary uppercase tracking-wider">
              How it works
            </span>
            <h2 className="mt-4 text-display-md md:text-display-lg font-bold text-text-primary">
              The 3-Step Magic
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto font-medium">
              Experience the fastest way to build a professional online presence
            </p>
          </motion.div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 bg-white border border-border-light rounded-2xl hover:border-brand-primary/50 transition-all hover:shadow-large">
                {/* Step number with unique gradient */}
                <div className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white font-bold shadow-medium`}>
                  {feature.step}
                </div>

                {/* Icon with gradient background */}
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} bg-opacity-10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className={`bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed font-medium text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
