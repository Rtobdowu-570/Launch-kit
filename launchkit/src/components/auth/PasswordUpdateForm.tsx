"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface PasswordUpdateFormProps {
  onSubmit: (password: string) => void;
  loading: boolean;
}

interface PasswordStrength {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  isValid: boolean;
}

export function PasswordUpdateForm({ onSubmit, loading }: PasswordUpdateFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    isValid: false,
  });

  const validatePasswordStrength = (pwd: string): PasswordStrength => {
    const hasMinLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      isValid,
    };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(validatePasswordStrength(newPassword));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate password strength
    if (!passwordStrength.isValid) {
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      return;
    }

    onSubmit(password);
  };

  const passwordsMatch = confirmPassword === "" || password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Password field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="block w-full px-4 py-3 pr-12 bg-white text-gray-900 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Password strength indicator */}
        {password && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-gray-600">Password must contain:</p>
            <div className="space-y-1">
              <PasswordRequirement
                met={passwordStrength.hasMinLength}
                text="At least 8 characters"
              />
              <PasswordRequirement
                met={passwordStrength.hasUppercase}
                text="One uppercase letter"
              />
              <PasswordRequirement
                met={passwordStrength.hasLowercase}
                text="One lowercase letter"
              />
              <PasswordRequirement
                met={passwordStrength.hasNumber}
                text="One number"
              />
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`block w-full px-4 py-3 pr-12 bg-white text-gray-900 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
              !passwordsMatch
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="••••••••"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {!passwordsMatch && confirmPassword && (
          <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
        )}
      </div>

      {/* Update password button */}
      <button
        type="submit"
        disabled={loading || !passwordStrength.isValid || !passwordsMatch}
        className="w-full px-6 py-3 text-base font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? "Updating password..." : "Update password"}
      </button>
    </form>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <X className="w-4 h-4 text-gray-400" />
      )}
      <span className={`text-xs ${met ? "text-green-600" : "text-gray-500"}`}>
        {text}
      </span>
    </div>
  );
}
