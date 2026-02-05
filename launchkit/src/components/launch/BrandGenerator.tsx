
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrandIdentity } from "@/types";
import { generateBrandIdentities } from "@/app/actions";

interface BrandGeneratorProps {
  bio: string;
  name: string;
  onBrandSelected: (brand: BrandIdentity) => void;
}

export function BrandGenerator({ bio, name, onBrandSelected }: BrandGeneratorProps) {
  const [identities, setIdentities] = useState<BrandIdentity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    // TODO: Replace with a real call to the Gemini API
    const result = await generateBrandIdentities(bio, name);
    if (result.success && result.data) {
      setIdentities(result.data);
    } else {
      setError(result.error as string);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-8 py-4 text-lg font-medium bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 hover:scale-105 transition-all shadow-lg shadow-brand-primary/25 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Brands"}
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid md:grid-cols-3 gap-8">
        {identities.map((identity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onBrandSelected(identity)}
          >
            <h3 className="text-xl font-bold font-display mb-2">{identity.brandName}</h3>
            <div className="flex gap-2 my-4">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: identity.colors.primary }}></div>
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: identity.colors.accent }}></div>
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: identity.colors.neutral }}></div>
            </div>
            <p className="text-gray-500">{identity.tagline}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
