"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, FIREBASE_ENABLED } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { AlertCircle, Loader, Info } from "lucide-react";

// Demo credentials for testing
const DEMO_USERS = {
  client: {
    email: "demo@client.com",
    password: "demo123",
    uid: "demo-client-001",
    displayName: "Demo Client",
    role: "CLIENT" as const,
  },
  lawyer: {
    email: "demo@lawyer.com",
    password: "demo123",
    uid: "demo-lawyer-001",
    displayName: "Demo Lawyer",
    role: "LAWYER" as const,
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleDemoLogin = async (demoUser: (typeof DEMO_USERS)[keyof typeof DEMO_USERS]) => {
    setError(null);
    setIsLoading(true);

    try {
      // Store mock user in localStorage
      const mockUser = {
        uid: demoUser.uid,
        email: demoUser.email,
        displayName: demoUser.displayName,
        photoURL: null,
      };

      localStorage.setItem("nyaymitra_mock_user", JSON.stringify(mockUser));
      localStorage.setItem("nyaymitra_demo_role", demoUser.role);

      // Wait a moment for the useAuth hook to pick up the change
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to login";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter both email and password");
        setIsLoading(false);
        return;
      }

      // Check if this is a demo user
      const demoUser = Object.values(DEMO_USERS).find(
        (u) => u.email === email && u.password === password
      );

      if (demoUser) {
        await handleDemoLogin(demoUser);
        return;
      }

      // Try real Firebase login if enabled
      if (!FIREBASE_ENABLED) {
        setError(
          `Invalid credentials. Demo accounts: ${DEMO_USERS.client.email} or ${DEMO_USERS.lawyer.email}`
        );
        setIsLoading(false);
        return;
      }

      if (!auth) {
        setError("Authentication not available");
        setIsLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      // Redirect happens via useEffect when user state updates
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!FIREBASE_ENABLED || !auth) {
      setError("Google login not available in demo mode. Use demo credentials.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      // Redirect happens via useEffect when user state updates
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in with Google";
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
          <p className="text-[#6B7A9A] mt-2">Sign in to your account</p>
        </div>

        {/* Demo Info Banner */}
        {!FIREBASE_ENABLED && (
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex gap-3">
            <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-700 text-sm font-medium">Demo Mode Active</p>
              <p className="text-blue-600 text-xs mt-1">
                Use the demo buttons below or login with demo credentials
              </p>
            </div>
          </div>
        )}

        <Card hoverable>
          <CardHeader className="bg-[#1A2744]">
            <h2 className="text-xl font-bold text-white">Login</h2>
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

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                disabled={isLoading || !email || !password}
              >
                {isLoading ? "Signing in..." : "Sign In"}
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

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isLoading || !FIREBASE_ENABLED}
              className="gap-2"
              title={!FIREBASE_ENABLED ? "Not available in demo mode" : ""}
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
              Sign in with Google
            </Button>

            {/* Demo Login Buttons */}
            {!FIREBASE_ENABLED && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#D4D8E4]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[#6B7A9A]">Demo Accounts</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    size="md"
                    onClick={() => handleDemoLogin(DEMO_USERS.client)}
                    disabled={isLoading}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-medium">Client</div>
                      <div className="text-xs opacity-75">{DEMO_USERS.client.email}</div>
                    </div>
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    size="md"
                    onClick={() => handleDemoLogin(DEMO_USERS.lawyer)}
                    disabled={isLoading}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-medium">Lawyer</div>
                      <div className="text-xs opacity-75">{DEMO_USERS.lawyer.email}</div>
                    </div>
                  </Button>
                </div>
              </>
            )}

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-[#D4D8E4]">
              <p className="text-[#6B7A9A] text-sm">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[#E07B39] font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-[#6B7A9A] mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
