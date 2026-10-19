import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Check 
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHomeView from './AdminHomeView';
import AdminProductsView from './AdminProductsView';
import AdminProductManagementView from './AdminProductManagementView';
import AdminStoreInfoView from './AdminStoreInfoView';
import AdminConfigView from './AdminConfigView';
import AdminSecurity from './AdminSecurity';

import { 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../../firebase/productsService';
import { logoutAdmin } from '../../firebase/authService';
import { 
  subscribeToStoreSettings, 
  DEFAULT_STORE_SETTINGS,
  incrementSoldCount
} from '../../firebase/storeSettingsService';

export default function AdminDashboard({
  products = [],
  isLoading = false,
  firestoreError = null,
  currentUser = null,
  onLogout,
  onNavigateToStore
}) {
  // Secciones solicitadas:
  // inicio | productos | gestion | infotienda | configuracion | admin
  const [currentSection, setCurrentSection] = useState('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const [storeSettings, setStoreSettings] = useState(DEFAULT_STORE_SETTINGS);

  // Prenda seleccionada para editar en Gestión de productos
  const [productToEdit, setProductToEdit] = useState(null);

  // Modal confirmación eliminar
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Suscribirse a configuraciones de la tienda (banner, ciudad, whatsapp)
  useEffect(() => {
    const unsubscribe = subscribeToStoreSettings((settings) => {
      if (settings) {
        setStoreSettings(settings);
      }
    });
    return () => unsubscribe();
  }, []);

  const availableCount = products.filter(p => p.status !== 'sold').length;
  // Contador histórico persistente de prendas vendidas (mantiene el conteo exacto aunque se libere espacio en Firebase)
  const soldCount = Number(storeSettings?.soldCount) || 0;
  const totalCount = availableCount;

  // Dar de alta o editar prenda desde Gestión de productos
  const handleSaveProduct = async (productData, editId) => {
    if (editId) {
      await updateProduct(editId, productData);
      showToast('Prenda actualizada correctamente.');
    } else {
      await addProduct(productData);
      showToast('Prenda dada de alta exitosamente en la tienda.');
    }
    setProductToEdit(null);
  };

  // BOTÓN VERDE "Vendido": incrementa el contador persistente de ventas y elimina el producto de Firebase para liberar espacio
  const handleMarkAsSold = async (item) => {
    try {
      await incrementSoldCount();
      await deleteProduct(item.id);
      showToast(`"${item.name}" registrada como vendida. Se liberó espacio en la base de datos.`);
    } catch (_err) {
      showToast('Error al procesar prenda vendida.');
    }
  };

  // Reactivar prenda vendida (por si se requiere)
  const handleReactivateProduct = async (item) => {
    try {
      await updateProduct(item.id, {
        ...item,
        status: 'available',
        soldAt: null
      });
      showToast(`"${item.name}" reactivada en tienda.`);
    } catch (_err) {
      showToast('Error al reactivar.');
    }
  };

  // Eliminar Prenda
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      setIsDeleting(true);
      await deleteProduct(deletingProduct.id);
      showToast('Prenda eliminada.');
      setDeletingProduct(null);
      if (productToEdit?.id === deletingProduct.id) {
        setProductToEdit(null);
      }
    } catch (_err) {
      showToast('Error al eliminar.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      if (onLogout) onLogout();
    } catch {
      if (onLogout) onLogout();
    }
  };

  // Título de la sección activa
  const getSectionTitle = () => {
    switch (currentSection) {
      case 'inicio':
        return 'Inicio';
      case 'productos':
        return 'Productos';
      case 'gestion':
        return 'Gestión de productos';
      case 'infotienda':
        return 'Info tienda';
      case 'configuracion':
        return 'Configuración';
      case 'admin':
        return 'Admin';
      default:
        return 'Panel Admin';
    }
  };

  return (
    <div className="min-h-screen bg-[#DFD5E8] text-neutral-900 font-sans flex selection:bg-black selection:text-white">
      
      {/* Toast Notification Flotante */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-black text-white px-4 py-2.5 shadow-2xl text-xs font-medium border border-neutral-700 animate-fadeIn flex items-center gap-2 rounded-xs">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. BARRA LATERAL (Sidebar con las 6 secciones exactas) */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(section) => {
          setCurrentSection(section);
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setIsSidebarOpen(false);
          }
        }}
        currentUser={currentUser}
        onNavigateToStore={onNavigateToStore}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. ÁREA DE CONTENIDO (Se expande al 100% si se oculta la barra) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${isSidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        
        {/* Cabecera Superior */}
        <header className="sticky top-0 z-30 bg-[#DFD5E8]/95 backdrop-blur-md border-b border-neutral-300/80 px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {/* Único botón Sandwich para abrir cuando la barra esté oculta (sin texto, solo 1 botón) */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-sm bg-white/80 hover:bg-white text-neutral-800 hover:text-black border border-neutral-300 flex items-center justify-center cursor-pointer transition-all shadow-2xs"
                aria-label="Abrir menú"
                title="Abrir menú"
              >
                <Menu className="w-5 h-5 shrink-0" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-1.5 py-0.5 bg-black text-white">
                ADMIN
              </span>
              <span className="text-neutral-400">/</span>
              <h2 className="text-xs sm:text-sm font-bold text-neutral-900 uppercase tracking-wider font-sans">
                {getSectionTitle()}
              </h2>
            </div>
          </div>

          {/* Contador en la barra superior */}
          <div className="text-xs text-neutral-700 font-sans tracking-wide">
            <span className="font-semibold text-neutral-900">act {availableCount}</span>
            <span className="text-neutral-400 mx-1.5">·</span>
            <span className="font-semibold text-neutral-900">ven {soldCount}</span>
          </div>

        </header>

        {/* Alerta de Firestore si hay fallo de conexión */}
        {firestoreError && (
          <div className="mx-4 sm:mx-8 mt-4 bg-amber-50 border border-amber-300 text-amber-900 px-4 py-2.5 text-xs rounded-sm">
            Verifica que las reglas de tu base de datos en Firebase permitan lectura y escritura.
          </div>
        )}

        {/* 3. VISTAS DINÁMICAS SEGÚN LA SECCIÓN ACTIVA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          
          {/* SECCIÓN 1: INICIO */}
          {currentSection === 'inicio' && (
            <AdminHomeView />
          )}

          {/* SECCIÓN 2: PRODUCTOS (Consulta completa de existencias, cantidades, filtros y estados) */}
          {currentSection === 'productos' && (
            <AdminProductsView
              products={products}
              isLoading={isLoading}
              availableCount={availableCount}
              soldCount={soldCount}
              totalCount={totalCount}
              onGoToGestion={() => {
                setProductToEdit(null);
                setCurrentSection('gestion');
              }}
              onEditProductInGestion={(item) => {
                setProductToEdit(item);
                setCurrentSection('gestion');
              }}
              onDeleteProduct={(item) => setDeletingProduct(item)}
              onMarkAsSold={handleMarkAsSold}
              onReactivateProduct={handleReactivateProduct}
            />
          )}

          {/* SECCIÓN 3: GESTIÓN DE PRODUCTOS (Estación de trabajo para dar de alta y editar) */}
          {currentSection === 'gestion' && (
            <AdminProductManagementView
              products={products}
              productToEdit={productToEdit}
              onSubmitProduct={handleSaveProduct}
              onCancelEdit={() => setProductToEdit(null)}
              onSelectProductToEdit={(item) => setProductToEdit(item)}
            />
          )}

          {/* SECCIÓN 4: INFO TIENDA (Ciudad, puntos de entrega, WhatsApp) */}
          {currentSection === 'infotienda' && (
            <AdminStoreInfoView
              currentSettings={storeSettings}
              onSaveSuccess={(msg) => showToast(msg)}
            />
          )}

          {/* SECCIÓN 5: CONFIGURACIÓN (Banners, Logo, Marca) */}
          {currentSection === 'configuracion' && (
            <AdminConfigView
              currentSettings={storeSettings}
              onSaveSuccess={(msg) => showToast(msg)}
            />
          )}

          {/* SECCIÓN 6: ADMIN (Seguridad & Contraseña) */}
          {currentSection === 'admin' && (
            <AdminSecurity
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          )}

        </main>
      </div>

      {/* Modal Confirmación de Eliminación */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-neutral-300 max-w-sm w-full p-6 shadow-2xl rounded-sm">
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-2">
              ¿Eliminar prenda?
            </h3>
            <p className="text-xs text-neutral-600 mb-6">
              Se borrará permanentemente "{deletingProduct.name}" del catálogo y la base de datos.
            </p>
            <div className="flex items-center justify-end gap-3 text-xs uppercase tracking-wider font-semibold">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
