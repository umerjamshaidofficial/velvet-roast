// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:  "AIzaSyBpArOHKxSw-wZSuVvP_JRbWvOAgx_cJrw",
  authDomain: "velvet-roast-43d3b.firebaseapp.com",
  projectId: "velvet-roast-43d3b",
  storageBucket: "velvet-roast-43d3b.firebasestorage.app",
  messagingSenderId: "363632899512",
  appId: "1:363632899512:web:838ebab3571e95fdc5ef4d",
  measurementId: "G-JDHEJHGERK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();