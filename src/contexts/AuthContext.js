import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
 
const AuthContext = createContext(null);
 
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // True until Firebase has told us whether someone is logged in.
  // Prevents a flash of the login form (or dashboard) before we know.
  const [authLoading, setAuthLoading] = useState(true);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);
 
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
 
  const logout = () => {
    return firebaseSignOut(auth);
  };
 
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    authLoading,
    login,
    logout,
  };
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};