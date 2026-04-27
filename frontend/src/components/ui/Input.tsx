"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#1A2744] mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 border-2 border-[#D4D8E4] rounded-xl text-base text-[#1A2744] placeholder-[#6B7A9A] transition-colors duration-200 focus:outline-none focus:border-[#1A2744] focus:ring-2 focus:ring-[#1A2744]/10 disabled:bg-[#EEF1F8] disabled:cursor-not-allowed h-10 min-h-10 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-[#6B7A9A]">{helperText}</p>
      )}
    </div>
  );
}
