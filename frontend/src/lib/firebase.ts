import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123",
};

// Check if we have valid Firebase config
const isValidFirebaseConfig = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-firebase-key" &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN !== "nyaymitra-dev.firebaseapp.com";

let app: any = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let FIREBASE_ENABLED = false;

try {
  // Only initialize if config looks valid (not mock)
  if (isValidFirebaseConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    FIREBASE_ENABLED = true;

    // Set persistence to LOCAL (user stays logged in)
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.warn("Failed to set Firebase persistence:", error.message);
    });

    console.log("✓ Firebase initialized successfully");
  } else {
    console.log("⚠ Using demo mode (Firebase not configured). Use mock credentials to test.");
    // Initialize with mock config anyway
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    FIREBASE_ENABLED = false;
  }
} catch (error: any) {
  console.warn("⚠ Firebase initialization in demo mode:", error.message);
  console.log("✓ App will work with mock authentication for testing");
  
  // Initialize app with mock config for demo mode
  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
    } catch {
      console.log("Demo mode: Firebase mock initialized");
    }
  }
  FIREBASE_ENABLED = false;
}

// Export with both old and new names for backward compatibility
export { FIREBASE_ENABLED };
export { auth, db, app };
export const appInstance = app;
export const authInstance = auth;
export const dbInstance = db;

export default app;
