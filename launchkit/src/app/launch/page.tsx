import Link from "next/link";

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-bg-surface flex flex-col items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold font-display">Launch Your Brand</h1>
        <p className="text-text-secondary">Enter your details below to get started.</p>
        {/* Placeholder for Wizard Component */}
        <div className="p-8 bg-background rounded-xl border border-brand-neutral shadow-sm h-64 flex items-center justify-center">
             <p className="text-sm text-gray-400">Wizard Step 1 Loading...</p>
        </div>
        
        <Link href="/" className="text-sm text-brand-primary hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
