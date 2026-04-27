"use client";

import { useEffect, useState, useCallback } from "react";
import { signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, FIREBASE_ENABLED } from "@/lib/firebase";

export type UserRole = "CLIENT" | "LAWYER";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

// Mock user storage for demo mode
const MOCK_USER_KEY = "nyaymitra_mock_user";

function getMockUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(MOCK_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setMockUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(MOCK_USER_KEY);
    }
  } catch {
    console.warn("Failed to store mock user");
  }
}

/**
 * Hook to manage authentication state
 * Uses real Firebase when configured, falls back to mock auth for demo mode
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from Firestore or mock storage
  const fetchUserRole = useCallback(async (uid: string) => {
    try {
      if (FIREBASE_ENABLED && db) {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setRole((userData.role as UserRole) || "CLIENT");
        } else {
          setRole("CLIENT");
        }
      } else {
        // Demo mode: use default role
        setRole("CLIENT");
      }
    } catch (error) {
      console.warn("Using demo role (CLIENT):", error);
      setRole("CLIENT");
    }
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    if (!FIREBASE_ENABLED) {
      // Demo mode: check localStorage for mock user
      const mockUser = getMockUser();
      if (mockUser) {
        setUser(mockUser);
        fetchUserRole(mockUser.uid);
      }
      setLoading(false);
      return undefined;
    }

    // Real Firebase mode
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // User is logged in
          const userData: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          setUser(userData);
          // Fetch user role from Firestore
          await fetchUserRole(firebaseUser.uid);
        } else {
          // User is logged out
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (error) {
      console.warn("Auth state listener error, using demo mode:", error);
      const mockUser = getMockUser();
      if (mockUser) {
        setUser(mockUser);
        fetchUserRole(mockUser.uid);
      }
      setLoading(false);
      return undefined;
    }
  }, [fetchUserRole]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      if (FIREBASE_ENABLED && auth) {
        await firebaseSignOut(auth);
      } else {
        // Demo mode: clear mock user
        setMockUser(null);
      }
      setUser(null);
      setRole(null);
    } catch (error) {
      console.warn("Sign out error:", error);
      // Still clear local state even if Firebase fails
      setUser(null);
      setRole(null);
      setMockUser(null);
    }
  }, []);

  // Get ID token for backend requests
  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      if (FIREBASE_ENABLED && auth && auth.currentUser) {
        return await auth.currentUser.getIdToken();
      } else {
        // Demo mode: return mock token
        return `mock-token-${user.uid}-${Date.now()}`;
      }
    } catch (error) {
      console.warn("Error getting token, using mock:", error);
      return `mock-token-${user.uid}-${Date.now()}`;
    }
  }, [user]);

  return {
    user,
    role,
    loading,
    signOut,
    getIdToken,
  };
}
