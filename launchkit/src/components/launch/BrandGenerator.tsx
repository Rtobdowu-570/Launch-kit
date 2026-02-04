"use client";

import { useState, useEffect } from "react";
import { Check, RefreshCw } from "lucide-react";

import { BioData } from '@/types';

interface BrandGeneratorProps {
  userData: BioData;
  onSelect: (brand: any) => void;
  onBack: () => void;
}

// Mock AI generated brands
const MOCK_BRANDS = [
  {
    name: "PulseWorks",
    tagline: "Financial interfaces that feel alive",
    colors: { primary: "#00D9A3", accent: "#FF6B35", neutral: "#1A1A2E" },
    domain: "pulseworks.cv",
    available: true,
  },
  {
    name: "NeoFlow",
    tagline: "Building the future of finance",
    colors: { primary: "#3B82F6", accent: "#8B5CF6", neutral: "#F3F4F6" },
    domain: "neoflow.cv",
    available: true,
  },
  {
    name: "FinCraft",
    tagline: "Crafting digital financial experiences",
    colors: { primary: "#10B981", accent: "#F59E0B", neutral: "#111827" },
    domain: "fincraft.cv",
    available: false,
  },
];

export default function BrandGenerator({ userData, onSelect, onBack }: BrandGeneratorProps) {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<typeof MOCK_BRANDS>([]);

  useEffect(() => {
    // Simulate AI generation delay
    const timer = setTimeout(() => {
      setBrands(MOCK_BRANDS);
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold font-display animate-pulse">
            Constructing your brand identity...
          </h3>
          <p className="text-text-secondary">Analyzing bio: "{userData.bio.substring(0, 30)}..."</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display">Choose your identity</h2>
        <button 
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}
            className="p-2 hover:bg-gray-100 rounded-full text-text-secondary"
        >
            <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid gap-4">
        {brands.map((brand, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:scale-[1.01] ${
              brand.available 
                ? "border-gray-200 hover:border-brand-primary bg-white" 
                : "border-gray-100 bg-gray-50 opacity-70"
            }`}
            onClick={() => brand.available && onSelect(brand)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold font-display">{brand.name}</h3>
                <p className="text-sm text-text-secondary">{brand.tagline}</p>
              </div>
              {brand.available ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                  Available
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                  Taken
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="text-xs font-medium text-gray-500">Palette:</div>
              <div className="flex gap-1">
                <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: brand.colors.primary }} />
                <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: brand.colors.accent }} />
                <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: brand.colors.neutral }} />
              </div>
            </div>
            
            <div className="text-xs text-gray-400 font-mono">
                {brand.domain}
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-black">
        &larr; Back to Bio
      </button>
    </div>
  );
}
