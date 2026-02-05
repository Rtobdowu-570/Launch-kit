
"use client";
import { motion } from "framer-motion";
import { FiFeather, FiPalette, FiRocket } from "react-icons/fi";

const features = [
  {
    icon: <FiFeather className="w-10 h-10 text-brand-primary" />,
    title: "1. Enter Your Bio",
    description:
      "Start with a single sentence. Our AI understands your skills, profession, and tone to create a brand that is uniquely you.",
  },
  {
    icon: <FiPalette className="w-10 h-10 text-brand-primary" />,
    title: "2. AI-Generated Brand",
    description:
      "Receive three complete brand identities, including names, color palettes, and taglines, with domain availability already checked.",
  },
  {
    icon: <FiRocket className="w-10 h-10 text-brand-primary" />,
    title: "3. Instant Launch",
    description:
      "With a single click, your new brand and website are live. We handle domain registration, site generation, and deployment.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary">
            The 3-Step Magic
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Experience the fastest way to build a professional online presence.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 bg-background rounded-2xl shadow-sm"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold font-display mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
