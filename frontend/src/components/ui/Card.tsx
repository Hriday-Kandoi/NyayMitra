"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export function Card({
  children,
  hoverable = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#D4D8E4] shadow-sm ${
        hoverable ? "transition-all duration-200 hover:shadow-lg hover:border-[#E07B39]/30" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ children, className = "", ...props }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-[#D4D8E4] ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({
  children,
  className = "",
  ...props
}: CardContentProps) {
  return (
    <div className={`px-6 py-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({
  children,
  className = "",
  ...props
}: CardFooterProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-[#D4D8E4] flex gap-3 justify-end ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
