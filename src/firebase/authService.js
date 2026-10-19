import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

/**
 * Iniciar sesión con Google (Gmail)
 */
export async function loginWithGoogle() {
  return await signInWithPopup(auth, googleProvider);
}

/**
 * Iniciar sesión de administrador con correo y contraseña
 */
export async function loginAdmin(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Crear cuenta de administrador inicial (para primer setup)
 */
export async function registerAdmin(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Cerrar sesión
 */
export async function logoutAdmin() {
  return await signOut(auth);
}

/**
 * Suscribirse al estado de autenticación
 */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Actualizar contraseña del administrador autenticado actualmente
 */
export async function updateAdminPassword(newPassword) {
  if (!auth.currentUser) {
    throw new Error("No hay una sesión activa de administrador.");
  }
  return await updatePassword(auth.currentUser, newPassword);
}

/**
 * Enviar correo de restablecimiento de contraseña
 */
export async function sendAdminPasswordReset(email) {
  return await sendPasswordResetEmail(auth, email);
}
