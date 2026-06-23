// Firebase initialization
// Docs: https://firebase.google.com/docs/web/setup
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
 
const firebaseConfig = {
  apiKey: "AIzaSyAyhHCJ0bMDk_q18yO3xtoKfBxJaJhK4dg",
  authDomain: "discarded-264e8.firebaseapp.com",
  projectId: "discarded-264e8",
  storageBucket: "discarded-264e8.firebasestorage.app",
  messagingSenderId: "396738244370",
  appId: "1:396738244370:web:fb7718318ef8c801c00dcb",
  measurementId: "G-1MB690DSJ9",
};
 
const app = initializeApp(firebaseConfig);
 
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
 
// Keep the admin logged in across browser restarts until they explicitly log out.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Failed to set auth persistence:", err);
});
 
export default app;
 