
"use client";

import { useState } from "react";
import { ContactData } from "@/types";

interface ContactFormProps {
  onSubmit: (data: ContactData) => void;
  loading: boolean;
}

export function ContactForm({ onSubmit, loading }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
            <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                <input
                type={key === 'email' ? 'email' : 'text'}
                id={key}
                name={key}
                value={formData[key as keyof ContactData] as string}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                />
            </div>
        ))}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 text-lg font-medium bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Register Domain"}
      </button>
    </form>
  );
}
