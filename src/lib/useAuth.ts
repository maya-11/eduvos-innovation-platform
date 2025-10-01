"use client";

import { useState, useEffect } from "react";
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Simple role system - in production, use Firebase Claims
const getRoleFromEmail = (email: string | null): 'student' | 'manager' | 'admin' => {
  if (!email) return 'student';
  if (email.includes('admin')) return 'admin';
  if (email.includes('manager')) return 'manager';
  return 'student';
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'student' | 'manager' | 'admin'>('student');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setRole(getRoleFromEmail(user?.email || null));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  return { user, role, loading, signIn, signUp, logout };
}
