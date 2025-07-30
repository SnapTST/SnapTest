
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This function ensures that Firebase is initialized only once.
function initializeFirebase() {
  if (!getApps().length) {
    if (firebaseConfig.apiKey) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
    } else {
        // This is a dummy app for server-side rendering or build environments
        // where the env vars might not be available.
        app = initializeApp({});
        auth = getAuth(app);
        db = getFirestore(app);
    }
  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

// Call the function to initialize Firebase
initializeFirebase();

export { app, auth, db };
