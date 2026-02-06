"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  // Show session expiration message if present
  useEffect(() => {
    const expired = searchParams.get('expired');
    if (expired === 'true') {
      setError('Your session has expired. Please sign in again.');
    }
  }, [searchParams]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Handle specific error cases with user-friendly messages
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email or password is incorrect");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Please verify your email before logging in");
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.session) {
        // Successful login - redirect to return URL or dashboard
        console.log('Login successful, redirecting to:', returnUrl)
        window.location.href = returnUrl // Use window.location for immediate redirect
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero image/gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/geometric-pattern.svg')] bg-repeat opacity-20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <p className="text-xl font-medium leading-relaxed">
              &ldquo;The workflow has never been smoother.&rdquo;
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Sign up link */}
          <div className="text-right mb-8">
            <span className="text-gray-600 text-sm">Don&apos;t have an account? </span>
            <Link 
              href="/signup" 
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Please enter your details to sign in.</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login form */}
          <LoginForm onSubmit={handleLogin} loading={loading} />

          {/* Footer links */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-gray-700 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
