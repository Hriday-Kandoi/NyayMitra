"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/lib/hooks/useAuth";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

/**
 * Component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 * Optionally checks for specific user role
 */
export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF1F8] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-4" />
          <p className="text-[#6B7A9A]">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  // Check role if required
  if (requiredRole && role !== requiredRole) {
    router.push("/dashboard");
    return null;
  }

  // User is authenticated and has required role
  return <>{children}</>;
}
