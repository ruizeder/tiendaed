import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA54KDN8Ph8_TwOhK24gt96mjXHvcrEwkc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tiendaeder-6df33.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tiendaeder-6df33",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tiendaeder-6df33.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "171321150578",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:171321150578:web:ccf88ae7b860ce1c74c6eb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Q7P31BJSLQ"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Inicializar Firestore (Base de datos 'default')
export const db = getFirestore(app, "default");

// Inicializar Auth (Autenticación)
export const auth = getAuth(app);

// Inicializar Storage (Archivos e imágenes)
export const storage = getStorage(app);

// Inicializar Analytics condicionalmente (solo en navegadores compatibles)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
