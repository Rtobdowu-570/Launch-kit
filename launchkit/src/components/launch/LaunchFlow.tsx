
"use client";

import { useState } from "react";
import { BioInput } from "./BioInput";
import { BrandGenerator } from "./BrandGenerator";
import { ContactForm } from "./ContactForm";
import { BrandIdentity, ContactData } from "@/types";

export function LaunchFlow() {
  const [step, setStep] = useState(1);
  const [bioData, setBioData] = useState({ name: "", email: "", bio: "" });
  const [selectedBrand, setSelectedBrand] = useState<BrandIdentity | null>(null);

  const handleBioSubmit = (data: { name: string; email: string; bio: string }) => {
    setBioData(data);
    setStep(2);
  };

  const handleBrandSelected = (brand: BrandIdentity) => {
    setSelectedBrand(brand);
    setStep(3);
  };

  const handleContactSubmit = (data: ContactData) => {
    console.log("Contact data:", data);
    // Here you would typically register the domain and launch the site.
    setStep(4);
  };

  return (
    <div className="w-full">
      {step === 1 && <BioInput onSubmit={handleBioSubmit} loading={false} />}
      {step === 2 && <BrandGenerator bio={bioData.bio} name={bioData.name} onBrandSelected={handleBrandSelected} />}
      {step === 3 && <ContactForm onSubmit={handleContactSubmit} loading={false} />}
      {step === 4 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display mb-2">Congratulations!</h1>
          <p className="text-lg text-gray-600">Your brand is ready to launch.</p>
        </div>
      )}
    </div>
  );
}
