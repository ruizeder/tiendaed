import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, Tag } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  whatsappNumber = '527561319459'
}) {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 150;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'RAYED10' || couponCode.trim().toUpperCase() === 'EDER10') {
      setDiscountPercent(10);
      setCouponMessage('¡Cupón del 10% aplicado con éxito!');
    } else {
      setCouponMessage('Cupón no válido. Prueba con "RAYED10"');
    }
  };

  // Generate formatted WhatsApp message
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let itemsText = cartItems.map((item, idx) => 
      `${idx + 1}. ${item.name}\n   Talla: ${item.size} | Color: ${item.color} | $${item.price.toFixed(2)}`
    ).join('\n\n');

    let text = `Hola, me gustaría encargar las siguientes prendas de RAYED:\n\n` +
      `${itemsText}\n\n`;

    if (discountPercent > 0) {
      text += `Subtotal: $${subtotal.toFixed(2)}\n` +
        `Descuento (${discountPercent}%): -$${discountAmount.toFixed(2)}\n`;
    }

    text += `Total a pagar: $${finalTotal.toFixed(2)}\n\n` +
      `¿Podemos coordinar el punto de entrega? Muchas gracias.`;

    const phone = whatsappNumber || '527561319459';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
        
        {/* Header */}
        <div className="p-4 bg-white text-neutral-900 flex items-center justify-between border-b border-neutral-200 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2.5">
            <img 
              src="/usar/rayed.png" 
              alt="RAYED" 
              className="h-5.5 w-auto object-contain shadow-xs rounded-xs"
            />
            <h3 className="text-sm font-bold uppercase tracking-wider">Bolsa de Compras</h3>
            <span className="text-xs text-neutral-500 font-mono">
              ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="bg-neutral-50 p-3 border-b border-neutral-200 text-xs">
          <div className="flex items-center justify-between mb-1 text-[11px] text-neutral-700">
            <span>
              {isFreeShipping 
                ? '¡Entrega gratis en puntos céntricos!' 
                : `Te faltan $${remainingForFreeShipping.toFixed(2)} para entrega gratis`}
            </span>
            <span className="font-bold text-black">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1 bg-neutral-200 overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length > 0 ? (
            cartItems.map((item, idx) => (
              <div 
                key={`${item.id}-${item.size}-${item.color}-${idx}`}
                className="flex gap-3 p-3 bg-white border border-neutral-200 relative"
              >
                {/* Product Image */}
                <div className="w-16 h-20 bg-neutral-100 overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      <span>Talla: <strong>{item.size}</strong></span> | <span>Color: <strong>{item.color}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5">
                      Pieza única (1 pza)
                    </span>

                    <span className="text-xs font-bold text-neutral-900 font-sans">
                      $ {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.id, item.size, item.color)}
                  className="absolute top-2 right-2 text-neutral-400 hover:text-black p-1 transition-colors cursor-pointer"
                  title="Eliminar prenda"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <ShoppingBag className="w-10 h-10 mb-2 stroke-1 text-neutral-300" />
              <h4 className="text-sm font-semibold text-neutral-800 mb-1">Tu bolsa está vacía</h4>
              <p className="text-xs text-neutral-500 max-w-xs mb-4">
                Añade tus prendas favoritas para solicitar tu pedido{/* en Chilapa */}.
              </p>
              <button
                onClick={onClose}
                className="border border-black text-black text-xs uppercase font-semibold px-4 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                Ver Catálogo
              </button>
            </div>
          )}
        </div>

        {/* Footer with totals & WhatsApp checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            
            {/* Promo Code input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="CUPÓN (EJ. RAYED10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-white border border-neutral-300 px-3 py-2 text-[13px] sm:text-xs uppercase text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white text-xs px-3.5 py-2 font-semibold uppercase hover:bg-neutral-800 transition-colors cursor-pointer min-h-[38px]"
              >
                Aplicar
              </button>
            </form>
            {couponMessage && (
              <p className={`text-[11px] ${discountPercent > 0 ? 'text-emerald-700 font-medium' : 'text-[#E60012]'}`}>
                {couponMessage}
              </p>
            )}

            {/* Calculations breakdown */}
            <div className="space-y-1 text-xs text-neutral-600 pt-1 border-t border-neutral-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$ {subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Descuento ({discountPercent}%)</span>
                  <span>-$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span>$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* WhatsApp Direct Order Button (Verde WhatsApp) */}
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full py-3.5 px-4 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pedir por WhatsApp</span>
            </button>

            <button
              onClick={onClearCart}
              className="w-full text-center text-[11px] text-neutral-400 hover:text-black transition-colors cursor-pointer min-h-[36px] flex items-center justify-center"
            >
              Vaciar bolsa
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
