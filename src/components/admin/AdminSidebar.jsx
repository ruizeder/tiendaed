import React from 'react';
import { 
  Home, 
  Package, 
  ClipboardList, 
  MapPin, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  X,
  Menu 
} from 'lucide-react';

export default function AdminSidebar({
  currentSection,
  onSelectSection,
  currentUser,
  onNavigateToStore,
  onLogout,
  isOpen = false,
  onClose,
  isOpenMobile,
  onCloseMobile
}) {
  const isCurrentlyOpen = isOpen ?? isOpenMobile;
  const handleClose = onClose || onCloseMobile;

  const mainNav = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'gestion', label: 'Gestión de productos', icon: ClipboardList }
  ];

  const configNav = [
    { id: 'infotienda', label: 'Info tienda', icon: MapPin },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
    { id: 'admin', label: 'Admin', icon: ShieldCheck }
  ];

  const handleNavClick = (id) => {
    onSelectSection(id);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (handleClose) handleClose();
    }
  };

  return (
    <>
      {/* Backdrop móvil / overlay al estar abierta */}
      {isCurrentlyOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
          onClick={handleClose}
        />
      )}

      {/* Barra Lateral Limpia y Editorial */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-neutral-900 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-neutral-200 shadow-2xl lg:shadow-xs ${
          isCurrentlyOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header con Logo Original RAYED y Botón Sandwich para Cerrar y Ocultar */}
          <div className="p-3.5 sm:p-4 border-b border-neutral-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img 
                src="/usar/rayed.png" 
                alt="RAYED" 
                className="h-7 w-auto object-contain select-none"
              />
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase px-1.5 py-0.5 bg-black text-white">
                ADMIN
              </span>
            </div>

            {/* Botón Sandwich único para cerrar/ocultar la barra (solo icono, sin texto) */}
            <button 
              onClick={handleClose}
              className="p-1.5 rounded-sm text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Cerrar menú lateral"
              title="Cerrar menú"
            >
              <Menu className="w-5 h-5 shrink-0" />
            </button>
          </div>

          {/* Menú de Navegación */}
          <div className="p-3 space-y-6">
            
            {/* Grupo 1: Catálogo e Inventario */}
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1.5">
                Inventario
              </span>
              <nav className="space-y-1">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs tracking-wider uppercase transition-colors cursor-pointer text-left rounded-sm ${
                        isActive
                          ? 'bg-black text-white font-semibold'
                          : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Grupo 2: Tienda y Ajustes */}
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1.5">
                Tienda & Cuenta
              </span>
              <nav className="space-y-1">
                {configNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs tracking-wider uppercase transition-colors cursor-pointer text-left rounded-sm ${
                        isActive
                          ? 'bg-black text-white font-semibold'
                          : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

          </div>
        </div>

        {/* Parte Inferior: Ver Tienda, Usuario & Cerrar Sesión */}
        <div className="p-4 border-t border-neutral-200 space-y-2.5 bg-neutral-50/60">
          {currentUser?.email && (
            <div className="text-[11px] text-neutral-500 font-mono truncate px-1">
              {currentUser.email}
            </div>
          )}

          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              onNavigateToStore();
            }}
            className="w-full flex items-center justify-between text-xs font-medium text-neutral-700 hover:text-black transition-colors cursor-pointer uppercase tracking-wider py-1 px-1"
          >
            <span>Ver Tienda</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-red-700 transition-colors cursor-pointer uppercase tracking-wider py-1.5 px-1 border-t border-neutral-200 pt-2.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>

      </aside>
    </>
  );
}
