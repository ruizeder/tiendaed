import React, { useState, useEffect, useMemo } from 'react';
import { Check } from 'lucide-react';

// 1. Layout (Header & Footer)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// 2. Portada / Landing
import LandingCover from './components/landing/LandingCover';

// 3. Catálogo & Productos
import CatalogSection from './components/catalog/CatalogSection';
import ProductModal from './components/catalog/ProductModal';

// 4. Carrito & Bolsa de Compras
import CartDrawer from './components/cart/CartDrawer';

// 5. Modales Informativos & Favoritos
import WishlistModal from './components/modals/WishlistModal';
import HowToBuyModal from './components/modals/HowToBuyModal';
import FaqModal from './components/modals/FaqModal';

// 6. Admin Panel & Firebase
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import { subscribeToProducts } from './firebase/productsService';
import { subscribeToAuth } from './firebase/authService';
import { subscribeToStoreSettings, getCachedStoreSettings } from './firebase/storeSettingsService';

export default function App() {
  // Función para determinar la vista inicial basada en la URL (/admin, #catalogo, etc.)
  const getInitialView = () => {
    if (typeof window === 'undefined') return 'landing';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    
    if (path === '/admin' || path.endsWith('/admin') || hash === '#admin' || hash === '#/admin') {
      return 'admin';
    }
    if (hash === '#catalogo') {
      return 'catalog';
    }
    return 'landing';
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  // Estado de usuario administrador
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('rayed_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Estado de productos en Firebase Firestore
  const [firestoreProducts, setFirestoreProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState(null);

  // Escuchar cambios de URL (popstate del historial y hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path === '/admin' || path.endsWith('/admin') || hash === '#admin' || hash === '#/admin') {
        setCurrentView('admin');
        window.scrollTo(0, 0);
      } else if (hash === '#catalogo') {
        setCurrentView('catalog');
        window.scrollTo(0, 0);
      } else if (hash === '#portada' || (path === '/' && hash === '')) {
        setCurrentView('landing');
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Suscripción en tiempo real a Firebase Firestore para sincronizar catálogo
  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (loadedProducts) => {
        setFirestoreProducts(loadedProducts);
        setIsProductsLoading(false);
        setFirestoreError(null);
      },
      (error) => {
        console.warn("Firestore info:", error.message);
        setFirestoreError(error);
        setIsProductsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Suscripción al estado de Auth de Firebase
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      if (user) {
        setAdminUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email
        });
        try {
          sessionStorage.setItem('rayed_admin_user', JSON.stringify({
            uid: user.uid,
            email: user.email
          }));
        } catch {}
      }
    });

    return () => unsubscribe();
  }, []);

  // Suscripción en tiempo real a la configuración de la tienda (banner, ciudad, whatsapp)
  const [storeSettings, setStoreSettings] = useState(getCachedStoreSettings);
  useEffect(() => {
    const unsubscribe = subscribeToStoreSettings((settings) => {
      if (settings) {
        setStoreSettings(settings);
      }
    });
    return () => unsubscribe();
  }, []);

  // Lista de productos activa para clientes:
  // Solo se muestran las prendas disponibles (las vendidas NO aparecen en la tienda)
  const activeProducts = useMemo(() => {
    const list = firestoreProducts || [];
    return list.filter(item => item.status !== 'sold');
  }, [firestoreProducts]);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('eder_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('eder_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isHowToBuyOpen, setIsHowToBuyOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  const handleQuickView = (product) => {
    setSelectedProductModal(product);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eder_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('eder_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Trigger brief floating toast notification
  const showToast = (message, icon = 'check') => {
    setToastMessage({ message, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Monitoreo en tiempo real: Si el administrador marca una prenda como "Vendido",
  // y algún cliente la tenía en su carrito/bolsa sin comprar aún, la retiramos
  // automáticamente y le avisamos para evitar vender la misma prenda dos veces.
  useEffect(() => {
    if (!firestoreProducts || firestoreProducts.length === 0) return;

    setCartItems(prevCart => {
      if (!prevCart || prevCart.length === 0) return prevCart;
      
      const soldItemsInCart = [];
      const updatedCart = prevCart.filter(item => {
        const matching = firestoreProducts.find(p => String(p.id) === String(item.id));
        if (matching && matching.status === 'sold') {
          soldItemsInCart.push(item.name || 'Una prenda');
          return false;
        }
        return true;
      });

      if (soldItemsInCart.length > 0) {
        showToast(`⚠️ ${soldItemsInCart.join(', ')} ya fue vendida por WhatsApp y se retiró de tu bolsa.`);
      }

      return updatedCart;
    });
  }, [firestoreProducts]);

  // Cart Handlers (Enforces unique piece: max 1 per item)
  const handleAddToCart = (itemToAdd) => {
    let alreadyInCart = false;

    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.id === itemToAdd.id
      );

      if (existingIndex > -1) {
        alreadyInCart = true;
        return prevItems;
      } else {
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });

    if (alreadyInCart) {
      showToast('Esta prenda es pieza única y ya la tienes en tu bolsa.');
    } else {
      showToast('"' + itemToAdd.name + '" añadida a tu bolsa.');
    }
  };

  const handleUpdateQuantity = (id, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id, size, color);
      return;
    }
    if (newQuantity > 1) {
      showToast('Esta prenda es pieza única (solo 1 en existencia).');
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id, size, color) => {
    setCartItems(prev => prev.filter(
      item => !(item.id === id && item.size === size && item.color === color)
    ));
    showToast("Prenda eliminada de la bolsa.");
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast("Bolsa vaciada.");
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      showToast('"' + product.name + '" eliminado de tus favoritos.');
    } else {
      setWishlist(prev => [...prev, product]);
      showToast('"' + product.name + '" guardado en tus favoritos ❤️');
    }
  };

  // View Navigation
  const handleGoToCatalog = () => {
    try {
      window.history.pushState(null, '', '/#catalogo');
    } catch {}
    window.location.hash = 'catalogo';
    setCurrentView('catalog');
    window.scrollTo(0, 0);
  };

  const handleGoToLanding = () => {
    try {
      window.history.pushState(null, '', '/#portada');
    } catch {}
    window.location.hash = 'portada';
    setCurrentView('landing');
    window.scrollTo(0, 0);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // VISTA 1: PANEL ADMINISTRADOR (/admin o #admin)
  if (currentView === 'admin') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => setAdminUser(user)}
          onBackToStore={handleGoToCatalog}
        />
      );
    }

    return (
      <AdminDashboard
        products={firestoreProducts}
        isLoading={isProductsLoading}
        firestoreError={firestoreError}
        currentUser={adminUser}
        storeSettings={storeSettings}
        onLogout={() => {
          setAdminUser(null);
          try {
            sessionStorage.removeItem('rayed_admin_user');
          } catch {}
          handleGoToCatalog();
        }}
        onNavigateToStore={handleGoToCatalog}
      />
    );
  }

  // VISTA 2: PORTADA / LANDING (Página 1 para clientes)
  if (currentView === 'landing') {
    return <LandingCover onExploreCatalog={handleGoToCatalog} city={storeSettings?.city} />;
  }

  // VISTA 3: CATÁLOGO DE CLIENTES (Página 2 para clientes)
  return (
    <div className="min-h-screen bg-[#DFD5E8] text-neutral-900 flex flex-col font-sans selection:bg-black selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 left-4 sm:left-auto max-w-sm z-50 bg-black text-white px-4 py-2.5 shadow-xl flex items-center gap-2.5 text-xs font-medium border border-neutral-700 animate-fadeIn">
          <Check className="w-4 h-4 text-white shrink-0" />
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Sticky Navigation Bar */}
      <Navbar
        onGoToLanding={handleGoToLanding}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenHowToBuy={() => setIsHowToBuyOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onNavigateToCatalog={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        city={storeSettings?.city}
        deliveryPoints={storeSettings?.deliveryPoints}
      />

      {/* Main Store Catalog Section with Firebase real-time products & dynamic banners */}
      <main className="flex-1">
        <CatalogSection
          products={activeProducts}
          bannerSlides={storeSettings?.bannerSlides}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </main>

      {/* Footer */}
      <Footer 
        onExploreCatalog={() => {
          const catalogElem = document.getElementById('catalogo');
          if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenHowToBuy={() => setIsHowToBuyOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onSelectCategory={setSelectedCategory}
      />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProductModal}
        deliveryLocation={storeSettings?.city}
        onClose={() => {
          document.body.style.overflow = '';
          setSelectedProductModal(null);
        }}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProductModal ? wishlist.some(i => i.id === selectedProductModal.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        whatsappNumber={storeSettings?.whatsappNumber}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveWishlist={handleToggleWishlist}
        onQuickView={(product) => setSelectedProductModal(product)}
        onAddToCart={handleAddToCart}
      />

      <HowToBuyModal
        isOpen={isHowToBuyOpen}
        onOpen={() => setIsHowToBuyOpen(true)}
        onClose={() => setIsHowToBuyOpen(false)}
        onExploreCatalog={() => {
          const catalogElem = document.getElementById('catalogo');
          if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />

    </div>
  );
}
