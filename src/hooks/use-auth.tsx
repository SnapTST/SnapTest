
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseAuthUser 
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useToast } from './use-toast';

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
  login: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDocRef = doc(db, "users", fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          let createdAtDate: Date;
          if (userData.createdAt instanceof Timestamp) {
            createdAtDate = userData.createdAt.toDate();
          } else {
            createdAtDate = new Date();
          }
          
          setUser({
            uid: fbUser.uid,
            name: fbUser.displayName || userData.name || 'User', // Use updated display name
            email: userData.email,
            avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
            createdAt: createdAtDate,
          });

        } else {
          // This case might happen if Firestore doc creation failed before
           const newUserData = {
            email: fbUser.email,
            name: fbUser.displayName || 'New User',
            createdAt: serverTimestamp()
          };
          await setDoc(userDocRef, newUserData, { merge: true });
          setUser({
             uid: fbUser.uid,
             name: newUserData.name,
             email: newUserData.email!,
             avatar: `https://i.pravatar.cc/150?u=${newUserData.email}`,
             createdAt: new Date(),
          });
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const login = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Signed In Successfully",
        description: "Welcome back!",
      });
      return true;

    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // If user not found, create a new account
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const fbUser = userCredential.user;

          // Update profile display name
          if (name) {
            await updateProfile(fbUser, { displayName: name });
          }

          // Create user document in Firestore
          const userDocRef = doc(db, "users", fbUser.uid);
          const newUserData = {
            email: fbUser.email,
            name: name || 'New User',
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newUserData);
          
          toast({
            title: "Account Created",
            description: "Welcome to SnapTest Enhanced!",
          });
          return true;

        } catch (createError: any) {
          console.error("Error creating user:", createError);
          toast({
            title: "Sign Up Failed",
            description: createError.message,
            variant: "destructive",
          });
          return false;
        }
      } else if (error.code === 'auth/wrong-password') {
         toast({
            title: "Login Failed",
            description: "Incorrect password. Please try again.",
            variant: "destructive",
          });
          return false;
      } else {
        console.error("Error signing in:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
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
