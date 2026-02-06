
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
    <div className="w-full">
      {/* Generate Button Section */}
      <div className="flex justify-center mb-12">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="px-12 py-4 text-lg font-bold bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 hover:scale-105 transition-all shadow-lg shadow-brand-primary/25 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "Generating..." : "Generate Brands"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-center font-medium">{error}</p>
        </div>
      )}

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {identities.map((identity, i) => (
          <motion.button
            type="button"
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-primary shadow-sm hover:shadow-xl transition-all cursor-pointer text-left"
            onClick={() => onBrandSelected(identity)}
          >
            {/* Brand Name */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-primary transition-colors">
              {identity.brandName}
            </h3>
            
            {/* Color Palette */}
            <div className="flex gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-full shadow-md ring-2 ring-white" 
                style={{ backgroundColor: identity.colors.primary }}
              />
              <div 
                className="w-10 h-10 rounded-full shadow-md ring-2 ring-white" 
                style={{ backgroundColor: identity.colors.accent }}
              />
              <div 
                className="w-10 h-10 rounded-full shadow-md ring-2 ring-white" 
                style={{ backgroundColor: identity.colors.neutral }}
              />
            </div>
            
            {/* Tagline */}
            <p className="text-gray-600 text-base leading-relaxed">
              {identity.tagline}
            </p>

            {/* Hover Indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Empty State */}
      {!loading && identities.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">
            Click "Generate Brands" to create your unique brand identities
          </p>
        </div>
      )}
    </div>
  );
}
