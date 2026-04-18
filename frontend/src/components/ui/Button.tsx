"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles: Record<string, string> = {
    primary:
      "bg-[#E07B39] text-white hover:bg-[#d46b2a] active:bg-[#c85b1b] shadow-sm hover:shadow-md focus:ring-[#E07B39]",
    secondary:
      "bg-[#1A2744] text-white hover:bg-[#152033] active:bg-[#0f1620] shadow-sm hover:shadow-md focus:ring-[#1A2744]",
    outline:
      "border-2 border-[#1A2744] text-[#1A2744] hover:bg-[#1A2744] hover:text-white transition-all duration-200 focus:ring-[#1A2744]",
    ghost:
      "text-[#1A2744] hover:bg-[#EEF1F8] active:bg-[#E0E5F0] focus:ring-[#E07B39]",
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </>
      ) : (
        children
      )}
    </button>
  );
}
