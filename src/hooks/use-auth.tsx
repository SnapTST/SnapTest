
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, onAuthStateChanged, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, type User as FirebaseAuthUser } from 'firebase/auth';
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
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const EMAIL_FOR_SIGN_IN_KEY = 'emailForSignIn';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Handle the sign-in link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY);
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the email again.
        email = window.prompt('Please provide your email for confirmation');
      }
      if(email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(async (result) => {
            window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
            const userDocRef = doc(db, "users", result.user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (!userDocSnap.exists()) {
                // This is a new user, create their document.
                await setDoc(userDocRef, {
                    email: result.user.email,
                    createdAt: serverTimestamp(),
                }, { merge: true });
            }
            toast({
              title: "Successfully Signed In",
              description: "Welcome back!",
            });
          })
          .catch((error) => {
            console.error("Error signing in with email link:", error);
            toast({
              title: "Sign In Failed",
              description: "The sign-in link is invalid or has expired.",
              variant: "destructive",
            });
          });
      }
    }


    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
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
            name: userData.name || 'User', // Fallback name
            email: userData.email,
            avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
            createdAt: createdAtDate,
          });

        } else {
          // If the user document doesn't exist, create it.
           const newUserData = {
            email: fbUser.email,
            name: fbUser.displayName || 'New User',
            createdAt: serverTimestamp()
          };
          await setDoc(userDocRef, newUserData);
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
  }, [toast]);

  const login = async (name: string, email: string) => {
    setLoading(true);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    const actionCodeSettings = {
      // URL to redirect back to. The domain (www.example.com) must be authorized
      // in the Firebase Console.
      url: window.location.href,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, email);
      
       const userDocRef = doc(db, 'users-by-email', email);
       const userDocSnap = await getDoc(userDocRef);

       if(!userDocSnap.exists() && name) {
          // This is a temporary way to associate a name before the user clicks the link
          // In a real app, you'd probably have a separate profile creation step.
           await setDoc(doc(db, 'temp-users', email), { name });
       }

      toast({
        title: "Magic Link Sent!",
        description: "Check your email for the sign-in link.",
      });

    } catch (error: any) {
      console.error("Error sending sign-in link:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
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
