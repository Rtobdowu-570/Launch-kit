"use client";

import { useState } from "react";
import { Check, Search, AlertCircle, Loader2 } from "lucide-react";
import { checkDomain } from "@/app/actions";

interface DomainSelectorProps {
  initialDomain?: string;
  onSelect: (domainData: any) => void;
  onBack: () => void;
}

export default function DomainSelector({ initialDomain, onSelect, onBack }: DomainSelectorProps) {
  const [query, setQuery] = useState(initialDomain || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // { available, price, ... }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResult(null);

    const domainToCheck = query.endsWith(".cv") ? query : `${query}.cv`;

    try {
        const res = await checkDomain(domainToCheck);
        
        if (res && res.success && res.data) {
             const domainData = res.data;
             setResult({
                 domain: domainToCheck,
                 available: domainData.available,
                 price: domainData.registrationFee || domainData.renewalFee || "N/A",
                 currency: domainData.currency || "USD"
             });
        } else {
             console.error('error' in res ? res.error : 'Unknown error');
             setResult({ available: false, domain: domainToCheck, error: "Check failed" });
        }
    } catch (err) {
        console.error(err);
        setResult({ available: false, domain: domainToCheck, error: "Network error" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display">Secure your .cv domain</h2>
        <p className="text-text-secondary text-sm">Every brand needs a home. Check availability instantly.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ""))}
          className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-mono"
          placeholder="yourbrand"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-mono pointer-events-none pr-10">
            {!query.endsWith(".cv") && ".cv"}
        </div>
        <button 
            type="submit"
            disabled={loading || !query}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 disabled:opacity-50 transition-colors"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </form>

      {result && (
        <div className={`p-4 rounded-lg border-2 flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${
            result.available 
                ? "border-green-100 bg-green-50/50" 
                : "border-red-100 bg-red-50/50"
        }`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${result.available ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                    {result.available ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                    <h3 className="font-bold font-mono text-lg">{result.domain}</h3>
                    <p className={`text-xs ${result.available ? "text-green-700" : "text-red-700"}`}>
                        {result.available ? "Available for registration" : "Already registered"}
                    </p>
                </div>
            </div>
            
            {result.available && (
                <div className="text-right">
                    <div className="font-bold text-lg">${result.price}</div>
                    <div className="text-xs text-gray-500">per year</div>
                </div>
            )}
        </div>
      )}

      {result?.available && (
          <button
            type="button"
            onClick={() => onSelect(result)}
            className="w-full py-4 bg-brand-primary text-white rounded-full font-medium text-lg hover:bg-brand-primary/90 transition-transform active:scale-[0.98] shadow-lg shadow-brand-primary/25"
          >
            Claim Domain & Continue
          </button>
      )}

      <button onClick={onBack} type="button" className="text-sm text-gray-500 hover:text-black">
        &larr; Back to Branding
      </button>
    </div>
  );
}
