import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { loginAdmin, registerAdmin, loginWithGoogle } from '../../firebase/authService';

export default function AdminLogin({ onLoginSuccess, onBackToStore }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        const userCred = await registerAdmin(email, password);
        onLoginSuccess(userCred.user);
      } else {
        const userCred = await loginAdmin(email, password);
        onLoginSuccess(userCred.user);
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Habilita Correo/Contraseña en Firebase Console (Authentication > Sign-in method) o usa el botón de Acceso Directo.');
      } else {
        setError(err.message || 'Error al autenticar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const userCred = await loginWithGoogle();
      onLoginSuccess(userCred.user);
    } catch (err) {
      console.error("Google auth error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Inicio de sesión con Google cancelado.');
      } else {
        setError(err.message || 'Error al iniciar sesión con Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DFD5E8] text-neutral-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white border border-neutral-300 p-6 sm:p-8 shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <img 
            src="/usar/rayed.png" 
            alt="RAYED" 
            className="h-10 w-auto object-contain mx-auto mb-3 shadow-xs rounded-xs"
          />
          <h2 className="font-serif text-xl font-bold tracking-tight text-neutral-900 uppercase">
            Panel Administrador
          </h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Correo
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tienda.com"
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <span>{isRegistering ? 'Crear Cuenta' : 'Entrar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-[11px] text-neutral-500 hover:text-black transition-colors cursor-pointer underline"
          >
            {isRegistering
              ? '¿Ya tienes cuenta? Iniciar sesión'
              : '¿Primer inicio? Crear cuenta de administrador'}
          </button>
        </div>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <span className="relative px-2 bg-white text-[10px] uppercase tracking-wider text-neutral-400">
            o
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-3 border border-neutral-300 hover:border-black text-[11px] font-semibold uppercase tracking-wider text-neutral-800 hover:text-black transition-colors flex items-center justify-center gap-2 cursor-pointer mb-2.5 bg-white"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continuar con Google</span>
        </button>

        <div className="mt-6 text-center pt-4 border-t border-neutral-200">
          <button
            onClick={onBackToStore}
            className="text-[11px] uppercase tracking-wider text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            ← Volver a la Tienda
          </button>
        </div>

      </div>
    </div>
  );
}
