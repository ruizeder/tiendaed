import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Loader2, 
  Mail, 
  LogOut,
  UserCheck
} from 'lucide-react';
import { updateAdminPassword, sendAdminPasswordReset } from '../../firebase/authService';

export default function AdminSecurity({
  currentUser,
  onLogout
}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifica.');
      return;
    }

    setIsLoading(true);

    try {
      await updateAdminPassword(newPassword);
      setSuccessMessage('¡Contraseña actualizada con éxito! Tu acceso ahora está protegido con tu nueva clave.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setErrorMessage('Por seguridad de Firebase, es necesario que cierres sesión y vuelvas a entrar antes de cambiar tu contraseña.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('La contraseña es demasiado débil. Usa una combinación más segura.');
      } else {
        setErrorMessage(err.message || 'Error al actualizar la contraseña.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!currentUser?.email) return;
    setIsSendingReset(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await sendAdminPasswordReset(currentUser.email);
      setResetEmailSent(true);
      setSuccessMessage(`Se ha enviado un enlace de restablecimiento al correo ${currentUser.email}.`);
    } catch (err) {
      setErrorMessage(err.message || 'Error al enviar el correo de recuperación.');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-2xl pb-12">
      
      {/* Encabezado */}
      <div className="pb-3 border-b border-neutral-300">
        <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Seguridad & Cuenta Administrador
        </h1>
        <p className="text-xs text-neutral-600 mt-0.5">
          Administra la contraseña de acceso al panel y las credenciales de seguridad.
        </p>
      </div>

      {/* Información del Administrador Actual */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-[#DFD5E8] text-[#25122B] flex items-center justify-center font-bold text-sm">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">
              Cuenta de Administrador
            </span>
            <span className="text-sm font-semibold text-neutral-900 font-mono">
              {currentUser?.email || 'Administrador de RAYED'}
            </span>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Sesión activa verificada</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="text-xs font-semibold uppercase tracking-wider text-red-600 hover:text-red-800 transition-colors cursor-pointer flex items-center gap-1.5 p-2 rounded hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </div>

      {/* Mensajes de Estado */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulario de Cambio de Contraseña */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-3">
          <KeyRound className="w-4 h-4 text-neutral-700" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Cambiar Contraseña
          </h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-md text-xs sm:text-sm text-neutral-900 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                className="w-full pl-9 pr-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-md text-xs sm:text-sm text-neutral-900 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !newPassword}
              className="w-full sm:w-auto px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[42px] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Actualizar Contraseña</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Opción alterna por correo */}
        {currentUser?.email && (
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-neutral-500">
              ¿Prefieres recibir un enlace seguro en tu correo?
            </div>
            <button
              type="button"
              disabled={isSendingReset || resetEmailSent}
              onClick={handleSendResetEmail}
              className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{resetEmailSent ? 'Enlace enviado al correo' : 'Enviar enlace a mi correo'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
