"use client";

import { useState } from "react";
import Link from "next/link";

interface PasswordResetFormProps {
  onSubmit: (email: string) => void;
  loading: boolean;
}

export function PasswordResetForm({ onSubmit, loading }: PasswordResetFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter your email"
          required
          disabled={loading}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 text-base font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? "Sending reset link..." : "Send reset link"}
      </button>

      {/* Sign in link */}
      <p className="text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
