import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function ProductModal({ 
  product, 
  onClose, 
  onAddToCart, 
  isWishlisted, 
  onToggleWishlist,
  deliveryLocation = 'punto acordado'
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  // Close handler that guarantees scroll is restored
  const handleClose = () => {
    document.body.style.overflow = '';
    if (onClose) onClose();
  };

  // Manage body scroll lock cleanly
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      setActiveImageIndex(0);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  // Gallery images (2, 3 or up to 4 images)
  const productImages = product
    ? ((product.images && product.images.length > 0)
        ? product.images
        : [product.image, product.hoverImage].filter(Boolean))
    : [];

  // Keyboard navigation (Escape to close, Left/Right for gallery photos)
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft' && productImages.length > 1) {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
      } else if (e.key === 'ArrowRight' && productImages.length > 1) {
        setActiveImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, productImages.length]);

  if (!product) return null;

  const singleSize = product.size || product.sizes?.[0] || 'M';
  const singleColor = product.color || product.colors?.[0]?.name || 'Tono Único';
  const colorHex = product.colorHex || product.colors?.[0]?.hex || '#111111';

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      color: singleColor,
      size: singleSize,
      image: productImages[activeImageIndex] || product.image,
      category: product.categoryLabel,
      quantity: 1
    });

    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 1500);
  };

  const categoryDisplayName = (
    product.category === 'tops' ||
    product.categoryLabel?.toLowerCase().includes('top') ||
    product.categoryLabel?.toLowerCase().includes('blusa')
  ) ? 'TOPS' : (product.categoryLabel || product.category || 'PRENDA').toUpperCase();

  const isSpecialColor = singleColor && (
    singleColor.toLowerCase().includes('único') ||
    singleColor.toLowerCase().includes('unico') ||
    singleColor.toLowerCase().includes('rayad') ||
    singleColor.toLowerCase().includes('estampad') ||
    singleColor.toLowerCase().includes('multi')
  );

  const currentImage = productImages[activeImageIndex] || product.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container: Clean, Minimalist Luxury Fashion Card */}
      <div className="relative w-full max-w-3xl bg-white shadow-2xl z-10 border border-neutral-100 m-auto flex flex-col md:flex-row overflow-y-auto md:overflow-hidden max-h-[92dvh] md:max-h-[85vh]">
        
        {/* Minimalist Close Button with frosted backdrop on mobile */}
        <button
          onClick={handleClose}
          className="absolute top-2.5 right-2.5 z-30 p-2 bg-white/90 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none text-neutral-600 hover:text-black transition-colors cursor-pointer rounded-full md:rounded-none shadow-xs md:shadow-none min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Cerrar modal"
          title="Cerrar"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Left Column: Pure, Clean Fashion Photography */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-7 flex flex-col items-center justify-center bg-white border-b md:border-b-0 md:border-r border-neutral-100 shrink-0">
          
          {/* Main Photo: Clean and unadorned, letting the garment shine */}
          <div className="relative w-full aspect-[3/4] max-h-[250px] xs:max-h-[280px] sm:max-h-[340px] md:max-h-[420px] bg-[#F7F7F7] overflow-hidden flex items-center justify-center group">
            {/* Green Box: NUEVO y un ganchito (check) */}
            <div className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs select-none">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>NUEVO</span>
            </div>

            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-opacity duration-300"
            />

            {/* Subtle Next / Prev arrows on hover if multiple images */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 text-neutral-800 hover:text-black transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 text-neutral-800 hover:text-black transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                  aria-label="Siguiente foto"
                >
                  <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                </button>
              </>
            )}
          </div>

          {/* Clean Understated Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3 w-full">
              {productImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-12 h-16 overflow-hidden transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border border-black'
                      : 'border border-transparent opacity-50 hover:opacity-100'
                  }`}
                  title={`Foto ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Vista ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Editorial Typography & Clean Details */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between md:overflow-y-auto bg-white">
          
          <div>
            {/* Category */}
            <span className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
              {categoryDisplayName}
            </span>

            {/* Product Title */}
            <h2 className="text-base sm:text-lg md:text-xl font-normal text-neutral-900 leading-snug tracking-tight uppercase mb-2 font-sans">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 mb-4 sm:mb-5">
              <span className="text-xl sm:text-2xl font-semibold text-neutral-900 font-sans tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Talla y Color en cajas de color */}
            <div className="py-3 border-t border-b border-neutral-100 mb-4 space-y-2.5 sm:space-y-3">
              {/* Talla en caja */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 font-medium w-12">Talla</span>
                <span className="inline-flex items-center justify-center min-w-[34px] px-2.5 py-1 bg-black text-white text-xs font-semibold tracking-wider">
                  {singleSize}
                </span>
              </div>

              {/* Color en caja */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 font-medium w-12">Color</span>
                {isSpecialColor ? (
                  <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800 tracking-wide">
                    {singleColor}
                  </span>
                ) : (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800">
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0" 
                      style={{ backgroundColor: colorHex }} 
                    />
                    <span>{singleColor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-600 leading-relaxed font-normal mb-3">
              {product.description}
            </p>

            {/* Details */}
            {product.details && product.details.length > 0 && (
              <ul className="list-disc list-inside text-[11px] text-neutral-500 space-y-0.5 mb-4">
                {product.details.slice(0, 3).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Action CTAs: Add to Cart + Wishlist */}
          <div className="space-y-2 pt-3 sm:pt-4 border-t border-neutral-100 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-2.5">
              {/* Primary: Add to Cart (Texto en una sola línea) */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-4 min-h-[48px] text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  isAddedAnimation
                    ? 'bg-neutral-800 text-white'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>{isAddedAnimation ? 'Añadido al carrito' : 'Añadir al carrito'}</span>
              </button>

              {/* Wishlist Button: Solo icono de corazón */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-12 h-12 min-w-[48px] min-h-[48px] shrink-0 border transition-colors cursor-pointer flex items-center justify-center ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-neutral-300 hover:border-black text-neutral-700 hover:text-black bg-white'
                }`}
                title={isWishlisted ? "Quitar de favoritos" : "Guardar en favoritos"}
                aria-label={isWishlisted ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isWishlisted ? 'fill-[#E60012] text-[#E60012]' : ''}`} />
              </button>
            </div>

            {/* Subtle Local Delivery Note */}
            <p className="text-[10px] text-neutral-400 text-center pt-1.5">
              Entrega personal {deliveryLocation && deliveryLocation.trim() ? `en ${deliveryLocation.trim().split(',')[0]}` : 'en punto céntrico acordado'} · Pago al recibir
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
