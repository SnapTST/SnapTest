"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInAnonymously, type User as FirebaseAuthUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';

interface User {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseAuthUser | null;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDocRef = doc(db, "users", fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
            uid: fbUser.uid,
            name: userData.name,
            email: userData.email,
            avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
            createdAt: userData.createdAt.toDate(),
          });
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (name: string, email: string) => {
    setLoading(true);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    try {
      const cred = await signInAnonymously(auth);
      const fbUser = cred.user;

      const userDocRef = doc(db, "users", fbUser.uid);
      
      await setDoc(userDocRef, {
        name,
        email,
        createdAt: serverTimestamp(),
      }, { merge: true });

      setUser({
        uid: fbUser.uid,
        name,
        email,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        createdAt: new Date(),
      });
      setFirebaseUser(fbUser);

    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const auth = getAuth(app);
    await auth.signOut();
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};