"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { AlertCircle, Loader, Mail, Lock, User } from "lucide-react";

type UserRole = "CLIENT" | "LAWYER";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState<UserRole>("CLIENT");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const createUserInFirestore = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, {
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error creating user document in Firestore:", err);
      throw new Error("Failed to save user profile");
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      // Create user document in Firestore with role
      await createUserInFirestore(userCredential.user.uid);

      // Redirect happens via useEffect when user state updates
    } catch (err: unknown) {
      let errorMessage = "Failed to sign up";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const userCredential = await signInWithPopup(auth, provider);

      // Create user document in Firestore with role
      await createUserInFirestore(userCredential.user.uid);

      // Redirect happens via useEffect when user state updates
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign up with Google";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#EEF1F8] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-4" />
          <p className="text-[#6B7A9A]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF1F8] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-[#1A2744]">
              Nyay<span className="text-[#E07B39]">Mitra</span>
            </h1>
          </Link>
          <p className="text-[#6B7A9A] mt-2">Create your account</p>
        </div>

        <Card hoverable>
          <CardHeader className="bg-[#1A2744]">
            <h2 className="text-xl font-bold text-white">Sign Up</h2>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex gap-3">
                <AlertCircle
                  size={20}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#1A2744]">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("CLIENT")}
                  className={`p-4 rounded-xl border-2 transition-all text-center font-medium ${
                    role === "CLIENT"
                      ? "border-[#E07B39] bg-[#FFF0E8] text-[#E07B39]"
                      : "border-[#D4D8E4] bg-white text-[#6B7A9A] hover:border-[#E07B39]"
                  }`}
                >
                  <User size={20} className="mx-auto mb-2" />
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setRole("LAWYER")}
                  className={`p-4 rounded-xl border-2 transition-all text-center font-medium ${
                    role === "LAWYER"
                      ? "border-[#E07B39] bg-[#FFF0E8] text-[#E07B39]"
                      : "border-[#D4D8E4] bg-white text-[#6B7A9A] hover:border-[#E07B39]"
                  }`}
                >
                  <User size={20} className="mx-auto mb-2" />
                  Lawyer
                </button>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                disabled={
                  isLoading ||
                  !formData.name ||
                  !formData.email ||
                  !formData.password
                }
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D4D8E4]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#6B7A9A]">Or</span>
              </div>
            </div>

            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.461,2.268,15.365,1.25,12.545,1.25 c-6.343,0-11.5,5.157-11.5,11.5c0,6.343,5.157,11.5,11.5,11.5c11.5,0,11.5-8.618,11.5-11.5H12.545z" />
                </svg>
              )}
              Sign up with Google
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-[#D4D8E4]">
              <p className="text-[#6B7A9A] text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#E07B39] font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-[#6B7A9A] mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
