import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBEjBIPE0uqcoWmiE6wpaEFkIrbmtH-3N8",
  authDomain: "architect-studio.firebaseapp.com",
  projectId: "architect-studio",
  storageBucket: "architect-studio.firebasestorage.app",
  messagingSenderId: "857658874128",
  appId: "1:857658874128:web:0a3971647cf6da9c34ad95",
  measurementId: "G-D8686Z01T3"
};


const app = initializeApp(firebaseConfig);


export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;