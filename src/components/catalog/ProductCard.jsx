import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onQuickView, 
  onAddToCart, 
  isWishlisted, 
  onToggleWishlist 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const singleSize = product.size || product.sizes?.[0] || 'M';
  const singleColor = product.color || product.colors?.[0]?.name || 'Tono Único';

  const handleCardClick = (e) => {
    if (!e.target.closest('button')) {
      onQuickView(product);
    }
  };

  return (
    <div 
      className="group flex flex-col cursor-pointer select-none"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#F5F5F5] overflow-hidden mb-2.5">
        {product.status === 'sold' ? (
          <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-900/90 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
            <span>AGOTADO</span>
          </div>
        ) : (
          <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>NUEVO</span>
          </div>
        )}

        {/* Main Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
            product.hoverImage && isHovered ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Hover Alternate Image if available */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} vista`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        )}

        {/* Minimalist Top-Right Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2 right-2 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-400 hover:text-black transition-colors cursor-pointer z-10"
          title={isWishlisted ? "Quitar de favoritos" : "Guardar en favoritos"}
          aria-label={isWishlisted ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <Heart 
            className={`w-4 h-4 stroke-[1.5] transition-colors ${
              isWishlisted ? 'fill-[#E60012] text-[#E60012]' : ''
            }`} 
          />
        </button>
      </div>

      {/* Product Information under image: Clean Senior Editorial */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xs font-normal text-neutral-900 line-clamp-1 leading-snug group-hover:underline">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-black text-white text-[9px] font-semibold tracking-wider">
              {singleSize}
            </span>
            <span className="text-[11px] text-neutral-500 truncate">
              {singleColor}
            </span>
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 pt-1.5">
          <span className="text-xs font-semibold text-neutral-900 font-sans tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] text-neutral-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
