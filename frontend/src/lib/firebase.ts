import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required environment variables are present
const requiredKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

const missingKeys = requiredKeys.filter(
  (key) => !firebaseConfig[key]
);

if (missingKeys.length > 0) {
  console.error(
    `Firebase configuration is incomplete. Missing keys: ${missingKeys.join(", ")}`
  );
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Set persistence to LOCAL (user stays logged in)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set Firebase persistence:", error);
});

// Initialize Firestore
export const db = getFirestore(app);

export default app;
