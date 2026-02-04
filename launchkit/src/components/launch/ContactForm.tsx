"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createContact } from "@/app/actions";

interface ContactFormProps {
  initialData: { name: string; email: string };
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export default function ContactForm({ initialData, onSubmit, onBack }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "NG", // Default based on user feedback/probabalistic
    organization: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const res = await createContact(formData);
        if (res.success && res.data) {
             // Pass the new Contact ID to the parent flow
             onSubmit({ ...formData, contact_id: res.data.id }); 
        } else {
            const errorMessage = typeof res.error === 'string' 
                ? res.error 
                : (res.error as any)?.message || "Unknown error";
            alert("Failed to create contact: " + errorMessage);
        }
    } catch (err)  {
        console.error(err);
        alert("An error occurred");
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display">Registration Details</h2>
        <p className="text-text-secondary text-sm">Required by ICANN for domain registration.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                    required
                />
            </div>
        </div>

        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Organization (Optional)</label>
            <input
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
            />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone *</label>
                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country *</label>
                <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-primary bg-white"
                    required
                >
                    <option value="NG">Nigeria (NG)</option>
                    <option value="US">United States (US)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="CA">Canada (CA)</option>
                    {/* Add more ISO codes as needed */}
                </select>
            </div>
        </div>

        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address *</label>
            <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                required
            />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City *</label>
                <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Postcode *</label>
                <input
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                    required
                />
            </div>
        </div>

        <div className="pt-4 flex gap-4">
            <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
            >
                Back
            </button>
            <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
            </button>
        </div>
      </form>
    </div>
  );
}
