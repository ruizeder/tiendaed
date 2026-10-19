import React from 'react';
import { X, Heart, ShoppingBag, Eye, Trash2 } from 'lucide-react';

export default function WishlistModal({ 
  isOpen, 
  onClose, 
  wishlist, 
  onRemoveWishlist, 
  onQuickView, 
  onAddToCart 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white shadow-2xl p-4 sm:p-6 z-10 max-h-[88dvh] flex flex-col border border-neutral-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#E60012] fill-[#E60012]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Prendas Favoritas</h3>
            <span className="text-xs text-neutral-500 font-mono">
              ({wishlist.length})
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
            aria-label="Cerrar favoritos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-2.5 bg-white border border-neutral-200"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-14 h-16 object-cover bg-neutral-100 shrink-0" 
                />
                
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    MUJER • {item.categoryLabel}
                  </span>
                  <h4 className="text-xs font-medium text-neutral-900 line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold bg-neutral-100 text-neutral-800 px-1.5 py-0.5">
                      Talla {item.size || item.sizes?.[0] || 'M'}
                    </span>
                    <span className="text-xs font-bold text-neutral-900 font-sans">
                      $ {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onClose();
                      onQuickView(item);
                    }}
                    className="p-1.5 text-neutral-600 hover:text-black border border-neutral-300 cursor-pointer"
                    title="Ver detalles"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onAddToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        color: item.color || item.colors?.[0]?.name || 'Tono Único',
                        size: item.size || item.sizes?.[0] || 'M',
                        image: item.image,
                        category: item.categoryLabel,
                        quantity: 1
                      });
                    }}
                    className="p-1.5 bg-black text-white hover:bg-neutral-800 cursor-pointer"
                    title="Añadir a la bolsa"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveWishlist(item)}
                    className="p-1.5 text-neutral-400 hover:text-[#E60012]"
                    title="Quitar de favoritos"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-neutral-400">
              <Heart className="w-8 h-8 mx-auto text-neutral-300 mb-2 stroke-1" />
              <p className="text-sm font-semibold text-neutral-800">No tienes favoritos aún</p>
              <p className="text-xs text-neutral-500 mt-1">
                Haz clic en el corazón de cualquier prenda para guardarla aquí.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
