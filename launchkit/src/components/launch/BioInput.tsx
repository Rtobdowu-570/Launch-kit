"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { BioData } from "@/types";

interface BioInputProps {
  onSubmit: (data: BioData) => void;
  initialData?: BioData;
}

// Input sanitization function to prevent XSS attacks
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Auto-save to localStorage
const STORAGE_KEY = 'launchkit-bio-data';

// Function to load initial data from localStorage
const getInitialData = (initialData?: BioData): BioData => {
  if (initialData) {
    return initialData;
  }
  
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.warn('Failed to load saved bio data:', error);
  }
  
  return {
    fullName: "",
    bio: "",
    email: "",
  };
};

export default function BioInput({ onSubmit, initialData }: BioInputProps) {
  const [formData, setFormData] = useState<BioData>(() => getInitialData(initialData));

  const [errors, setErrors] = useState<{
    fullName?: string;
    bio?: string;
    email?: string;
  }>({});

  // Auto-save to localStorage when form data changes
  const saveToLocalStorage = useCallback((data: BioData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save bio data:', error);
    }
  }, []);

  // Debounced auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.fullName || formData.bio || formData.email) {
        saveToLocalStorage(formData);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData, saveToLocalStorage]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Bio validation
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length > 120) {
      newErrors.bio = "Bio must be 120 characters or less";
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = "Bio must be at least 10 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BioData, value: string) => {
    // Sanitize input
    const sanitizedValue = sanitizeInput(value);
    
    // Enforce character limits
    let finalValue = sanitizedValue;
    if (field === 'bio' && sanitizedValue.length > 120) {
      finalValue = sanitizedValue.substring(0, 120);
    } else if (field === 'fullName' && sanitizedValue.length > 100) {
      finalValue = sanitizedValue.substring(0, 100);
    } else if (field === 'email' && sanitizedValue.length > 254) {
      finalValue = sanitizedValue.substring(0, 254);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: finalValue
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clear localStorage on successful submission
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to clear saved bio data:', error);
      }
      
      onSubmit(formData);
    }
  };

  const isFormValid = formData.fullName.trim() && 
                     formData.bio.trim() && 
                     formData.email.trim() && 
                     isValidEmail(formData.email) &&
                     formData.bio.length <= 120;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.fullName 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'
          } focus:ring-2 outline-none transition-all dark:bg-zinc-800 dark:border-zinc-700`}
          placeholder="e.g. Chidi Okonkwo"
          autoComplete="name"
          maxLength={100}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.fullName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-text-secondary mb-2">
          One-Sentence Bio
        </label>
        <div className="relative">
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.bio 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'
            } focus:ring-2 outline-none transition-all resize-none h-24 dark:bg-zinc-800 dark:border-zinc-700`}
            placeholder="I design fintech apps that make finance fun..."
            maxLength={120}
          />
          <div className={`absolute bottom-3 right-3 text-xs ${
            formData.bio.length > 100 ? 'text-orange-500' : 'text-gray-400'
          }`}>
            {formData.bio.length}/120
          </div>
        </div>
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.bio}
          </p>
        )}
        <p className="mt-2 text-xs text-brand-primary flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI will use this to build your brand
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'
          } focus:ring-2 outline-none transition-all dark:bg-zinc-800 dark:border-zinc-700`}
          placeholder="you@example.com"
          autoComplete="email"
          maxLength={254}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full flex items-center justify-center gap-2 py-4 bg-brand-primary text-white rounded-full font-medium text-lg hover:bg-brand-primary/90 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-brand-primary/25"
      >
        Generate My Brand Identity
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
}
