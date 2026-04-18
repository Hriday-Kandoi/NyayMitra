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
        <label className="block text-sm font-medium text-[#1A2744] mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:border-[#1A2744] focus:ring-1 focus:ring-[#1A2744] disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
