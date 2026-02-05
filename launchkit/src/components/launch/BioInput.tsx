
"use client";

import { useState } from "react";

interface BioInputProps {
  onSubmit: (data: { name: string; email: string; bio: string }) => void;
  loading: boolean;
}

export function BioInput({ onSubmit, loading }: BioInputProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, bio });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Chidi Okonkwo"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">One-sentence bio</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="I design fintech apps that don't suck"
          maxLength={120}
          required
        />
         <p className="text-xs text-gray-500 mt-1">{bio.length}/120 characters</p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 text-lg font-medium bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Create My Brand"}
      </button>
    </form>
  );
}
