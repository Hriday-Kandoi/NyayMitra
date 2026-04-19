"use client";

import { useEffect, useState, useCallback } from "react";
import { User, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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

/**
 * Hook to manage Firebase authentication state
 * Subscribes to auth state changes and fetches user role from Firestore
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from Firestore
  const fetchUserRole = useCallback(async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setRole((userData.role as UserRole) || null);
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setRole(null);
    }
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
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
  }, [fetchUserRole]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }, []);

  // Get ID token for backend requests
  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;
      return await firebaseUser.getIdToken();
    } catch (error) {
      console.error("Error getting ID token:", error);
      return null;
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
