import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, MapPin } from 'lucide-react';

import { CATEGORIES } from '../../data/products';

export default function Navbar({ 
  onGoToLanding,
  cartCount, 
  onOpenCart, 
  wishlistCount, 
  onOpenWishlist, 
  onSearchChange, 
  searchQuery, 
  selectedCategory = 'all', 
  onSelectCategory, 
  onNavigateToCatalog, 
  onOpenHowToBuy, 
  onOpenFaq,
  city,
  deliveryPoints
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isAnnouncementClosed, setIsAnnouncementClosed] = useState(false);

  const handleCategorySelect = (categoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    setMobileMenuOpen(false);
    if (onNavigateToCatalog) {
      onNavigateToCatalog();
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory('all');
    }
    if (onNavigateToCatalog) {
      onNavigateToCatalog();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#DFD5E8]/95 backdrop-blur-md border-b border-neutral-300/80 pt-[env(safe-area-inset-top)]">
      
      {/* Barra Blanca de Ubicación en Movimiento Continuo (Tipo Carrusel) */}
      {city && city.trim() && !isAnnouncementClosed && (
        <div className="relative bg-white text-neutral-900 border-b border-neutral-200/90 overflow-hidden py-1.5 shadow-2xs select-none pr-8">
          <div className="animate-marquee-infinite flex items-center">
            
            {/* Set 1 */}
            <div className="flex items-center gap-6 sm:gap-8 px-4 shrink-0 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
              <span className="flex items-center gap-1.5 text-neutral-900">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Entregas activas en <strong className="underline decoration-red-600 underline-offset-2 tracking-normal">{city.trim()}</strong></span>
              </span>

              <span className="text-neutral-300 font-light text-xs">✦</span>

              {deliveryPoints && deliveryPoints.trim() && (
                <>
                  <span className="text-neutral-700 normal-case first-letter:uppercase font-medium">
                    {deliveryPoints.trim()}
                  </span>
                  <span className="text-neutral-300 font-light text-xs">✦</span>
                </>
              )}

              <span className="flex items-center gap-1.5 text-neutral-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Pagas al recibir tu prenda</span>
              </span>

              <span className="text-neutral-300 font-light text-xs">✦</span>

              <span className="text-neutral-800">
                Ropa 100% nueva y etiquetada
              </span>

              <span className="text-neutral-300 font-light text-xs">✦</span>

              <span className="text-neutral-800">
                Piezas únicas · Estrena cada semana
              </span>

              <span className="text-neutral-300 font-light text-xs">✦</span>
            </div>

            {/* Set 2 (Clon idéntico para loop infinito sin saltos) */}
            <div className="flex items-center gap-6 sm:gap-8 px-4 shrink-0 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase" aria-hidden="true">
              <span className="flex items-center gap-1.5 text-neutral-900">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Entregas activas en <strong className="underline decoration-red-600 underline-offset-2 tracking-normal">{city.trim()}</strong></span>
              </span>

              <span className="text-neutral-300 font-light text-xs">✦</span>

              {deliveryPoints && deliveryPoints.trim() && (
                <>
                  <span className="text-neutral-700 normal-case first-letter:uppercase font-medium">
                    {deliveryPoints.trim()}
                  </span>
                  <span className="text-neutral-300 font-light text-xs">✦</span>
                </>
              )}

              <span className="flex items-center gap-1.5 text-neutral-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Pagas al recibir tu prenda</span>
              </span>

              <span className="text-neutral-300 font-light text-xs">✦</span>

              <span className="text-neutral-800">
                Ropa 100% nueva y etiquetada
              </span>

              <span className="text-neutral-300 font-light text-xs">✦</span>

              <span className="text-neutral-800">
                Piezas únicas · Estrena cada semana
              </span>

              <span className="text-neutral-300 font-light text-xs">✦</span>
            </div>

          </div>

          {/* Botón para cerrar y ocultar la barra */}
          <button
            onClick={() => setIsAnnouncementClosed(true)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-black bg-white/95 rounded-full cursor-pointer z-10 hover:bg-neutral-100 transition-colors"
            title="Cerrar y ocultar barra"
            aria-label="Cerrar barra"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Red Square Logo & Hamburger Menu */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-black hover:opacity-70 transition-opacity cursor-pointer md:hidden"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Red Official Logo (RAYED) */}
          <div 
            onClick={handleLogoClick}
            className="cursor-pointer select-none flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <img 
              src="/usar/rayed.png" 
              alt="RAYED" 
              className="h-7 sm:h-9 w-auto object-contain shadow-xs rounded-xs"
            />
          </div>
        </div>

        {/* Center: Main Navigation (Dudas) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-xs font-semibold tracking-wider text-neutral-700 uppercase">
          <button 
            onClick={onOpenFaq} 
            className="py-1 text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            DUDAS
          </button>
        </nav>

        {/* Right: Minimalist Outline Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Search Bar / Icon */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center border border-neutral-300 rounded-sm px-2 py-1 bg-neutral-50 animate-fadeIn">
                <Search className="w-4 h-4 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent border-none text-[13px] sm:text-xs text-neutral-900 placeholder-neutral-400 px-1.5 py-0.5 focus:outline-none w-24 xs:w-32 sm:w-44"
                />
                <button 
                  onClick={() => { setShowSearchInput(false); onSearchChange(''); }}
                  className="text-neutral-400 hover:text-neutral-800 text-xs p-1 min-w-[24px] min-h-[24px] flex items-center justify-center cursor-pointer"
                  aria-label="Cerrar búsqueda"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowSearchInput(true)}
                className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-neutral-800 hover:text-black transition-colors cursor-pointer"
                title="Buscar"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
            )}
          </div>

          {/* Wishlist Heart Icon */}
          <button 
            onClick={onOpenWishlist}
            className="relative p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-neutral-800 hover:text-black transition-colors cursor-pointer"
            title="Favoritos"
            aria-label="Favoritos"
          >
            <Heart className="w-5 h-5 stroke-[1.5]" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#E60012] text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag / Cart Icon */}
          <button 
            onClick={onOpenCart}
            className="relative p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-neutral-800 hover:text-black transition-colors cursor-pointer"
            title="Bolsa de compras"
            aria-label="Bolsa de compras"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#E60012] text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-300 bg-[#DFD5E8] px-6 py-4 flex flex-col gap-1 text-xs uppercase tracking-wider text-neutral-800 animate-fadeIn">
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenFaq) onOpenFaq();
            }}
            className="text-left py-2.5 border-b border-neutral-100 text-neutral-700 hover:text-black flex items-center justify-between cursor-pointer"
          >
            <span>Dudas</span>
            <span>❓</span>
          </button>

          <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-widest mt-3 mb-1">
            Categorías de Ropa
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`text-left py-2 border-b border-neutral-100 flex items-center justify-between cursor-pointer ${
                selectedCategory === cat.id ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <span>{cat.label}</span>
              {selectedCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-[#E60012]"></span>}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
