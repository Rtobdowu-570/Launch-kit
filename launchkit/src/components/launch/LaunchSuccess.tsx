"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
// import Confetti from "react-confetti"; // Would need install

interface LaunchSuccessProps {
  domain: string;
}

export default function LaunchSuccess({ domain }: LaunchSuccessProps) {
  return (
    <div className="text-center space-y-8 py-8 animate-in zoom-in-95 duration-500">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce-short">
          <CheckCircle2 className="w-10 h-10" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-bold font-display tracking-tight">You're Live! 🚀</h2>
        <p className="text-xl text-text-secondary">
          Your brand is practically famous now.
        </p>
      </div>

      <div className="p-6 bg-bg-surface rounded-xl border border-brand-neutral max-w-sm mx-auto">
        <p className="text-sm text-gray-500 uppercase font-bold mb-2">Your New Site</p>
        <a 
            href={`https://${domain}`} 
            target="_blank" 
            className="text-2xl font-bold text-brand-primary hover:underline"
        >
            {domain}
        </a>
      </div>

      <div className="pt-4">
        <Link
          href={`/dashboard/${domain}`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-black/80 transition-opacity"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
      
      <p className="text-xs text-gray-400">DNS propagation may take up to 24-48 hours usually, but Ola.CV is fast.</p>
    </div>
  );
}
