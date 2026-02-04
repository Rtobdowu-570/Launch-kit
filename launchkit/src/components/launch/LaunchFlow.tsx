"use client";

import { useState, useEffect } from "react";
import BioInput from "./BioInput";
import BrandGenerator from "./BrandGenerator";
import DomainSelector from "./DomainSelector";
import ContactForm from "./ContactForm";
import LaunchSuccess from "./LaunchSuccess";
import { registerDomain } from "@/app/actions";
import { Loader2, AlertTriangle } from "lucide-react";

export default function LaunchFlow() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    fullName: "",
    bio: "",
    email: "",
  });
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'registering' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleBioSubmit = (data: any) => {
    setUserData({ ...userData, ...data });
    setStep(2);
  };

  const handleBrandSelect = (brand: any) => {
    setSelectedBrand(brand);
    // Pre-fill domain search with brand name
    setStep(3);
  };

  const handleDomainSelect = (domain: any) => {
    setSelectedDomain(domain);
    setStep(4);
  };

  const handleContactSubmit = (contactData: any) => {
    // Contact is already created in the form, we just get ID back
    console.log("Contact submitted:", contactData);
    setContactId(contactData.contact_id);
    setStep(5);
  };
  
  // Auto-trigger registration when entering step 5
  useEffect(() => {
      if (step === 5 && contactId && selectedDomain && launchStatus === 'idle') {
          handleLaunch();
      }
  }, [step, contactId, selectedDomain]);

  const handleLaunch = async () => {
      setLaunchStatus('registering');
      setErrorMessage("");
      
      try {
          // 1. Register Domain
          const res = await registerDomain(selectedDomain.domain, contactId!);
          
          if (res.success) {
              setLaunchStatus('success');
          } else {
              setLaunchStatus('error');
              const errorMessage = typeof res.error === 'string' 
                  ? res.error 
                  : (res.error as any)?.message || "Registration failed";
              setErrorMessage(errorMessage);
          }
      } catch (err) {
          console.error(err);
          setLaunchStatus('error');
          setErrorMessage("An unexpected error occurred during launch.");
      }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
       {/* Progress Bar (simplified) */}
       <div className="mb-8 flex justify-between text-xs font-medium text-gray-400 uppercase tracking-widest">
         <span className={step >= 1 ? "text-brand-primary" : ""}>1. Bio</span>
         <span className={step >= 2 ? "text-brand-primary" : ""}>2. Brand</span>
         <span className={step >= 3 ? "text-brand-primary" : ""}>3. Domain</span>
         <span className={step >= 4 ? "text-brand-primary" : ""}>4. Contact</span>
         <span className={step >= 5 ? "text-brand-primary" : ""}>5. Launch</span>
       </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-gray-200 dark:border-zinc-800 shadow-xl min-h-[400px]">
        {step === 1 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-display">Tell us about you</h2>
                <BioInput onSubmit={handleBioSubmit} initialData={userData} />
            </div>
        )}
        {step === 2 && (
            <BrandGenerator 
                userData={userData} 
                onSelect={handleBrandSelect} 
                onBack={() => setStep(1)} 
            />
        )}
        {step === 3 && (
            <DomainSelector
                initialDomain={selectedBrand?.name}
                onSelect={handleDomainSelect}
                onBack={() => setStep(2)}
            />
        )}
        {step === 4 && (
            <ContactForm
                initialData={{ name: userData.fullName, email: userData.email }}
                onSubmit={handleContactSubmit}
                onBack={() => setStep(3)}
            />
        )}
        {step === 5 && (
            <div className="flex flex-col items-center justify-center py-10 h-full">
                {launchStatus === 'registering' && (
                    <div className="text-center space-y-4">
                        <Loader2 className="w-16 h-16 text-brand-primary animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold font-display animate-pulse">Launching your brand...</h2>
                        <div className="text-text-secondary">
                            <p>✓ Secured contact details</p>
                            <p className="font-bold text-black">➜ Registering {selectedDomain?.domain}...</p>
                            <p className="opacity-50">○ Configuring DNS</p>
                        </div>
                    </div>
                )}
                
                {launchStatus === 'success' && (
                    <LaunchSuccess domain={selectedDomain?.domain} />
                )}
                
                {launchStatus === 'error' && (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-red-600">Launch Failed</h2>
                        <p className="text-text-secondary max-w-xs mx-auto">{errorMessage}</p>
                        <button 
                            onClick={handleLaunch}
                            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
