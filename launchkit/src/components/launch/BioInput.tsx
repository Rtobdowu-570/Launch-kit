
"use client";

import { useState, useEffect } from "react";
import { sanitizeInput, sanitizeEmail } from "@/lib/security";

interface BioInputProps {
  onSubmit: (data: { name: string; email: string; bio: string }) => void;
  loading: boolean;
}

export function BioInput({ onSubmit, loading }: BioInputProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  // Auto-save to localStorage - load initial data
  useEffect(() => {
    const saved = localStorage.getItem('launchkit-bio-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        // Use a callback to avoid cascading renders
        if (data.name || data.email || data.bio) {
          // Batch state updates to avoid cascading renders
          Promise.resolve().then(() => {
            setName(data.name || '')
            setEmail(data.email || '')
            setBio(data.bio || '')
          })
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  useEffect(() => {
    if (name || email || bio) {
      localStorage.setItem('launchkit-bio-data', JSON.stringify({ name, email, bio }))
    }
  }, [name, email, bio])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize inputs before submission
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeEmail(email),
      bio: sanitizeInput(bio)
    };
    
    onSubmit(sanitizedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-4 py-3 bg-white text-black border-2 border-transparent rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          placeholder="Chidi Okonkwo"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-4 py-3 bg-white text-black border-2 border-transparent rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-semibold text-white mb-2">
          One-sentence bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => {
            const value = e.target.value;
            // Enforce 120 character limit
            if (value.length <= 120) {
              setBio(value);
            }
          }}
          rows={3}
          className="block w-full px-4 py-3 bg-white text-black border-2 border-transparent rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
          placeholder="I design fintech apps that don't suck"
          maxLength={120}
          required
        />
         <p className="text-xs text-white/50 mt-2 font-medium">{bio.length}/120 characters</p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-4 text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-large"
      >
        {loading ? "Submitting..." : "Create My Brand"}
      </button>
    </form>
  );
}
