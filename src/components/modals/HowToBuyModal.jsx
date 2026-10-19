import React, { useState } from 'react';
import { X, ShoppingBag, ExternalLink } from 'lucide-react';

export default function HowToBuyModal({ isOpen: externalIsOpen, onClose: externalOnClose, onOpen: externalOnOpen, onExploreCatalog }) {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (externalOnOpen) externalOnOpen();
  };

  const handleClose = () => {
    setIsOpen(false);
    if (externalOnClose) externalOnClose();
  };

  const handleExplore = () => {
    handleClose();
    if (onExploreCatalog) {
      onExploreCatalog();
    } else {
      const catalogElem = document.getElementById('catalogo');
      if (catalogElem) {
        catalogElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Floating Launcher (Bottom-Left) — Text on top, Bot image below */}
      {!isOpen && (
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-40">
          <button
            onClick={handleOpen}
            className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Abrir guía: ¿Cómo comprar?"
          >
            {/* 1. "como comprar" (Texto encima en burbuja) */}
            <div className="relative mb-2 px-3.5 py-1 bg-neutral-950 text-white text-[11px] font-bold tracking-wider uppercase rounded-full shadow-2xl border border-neutral-700/80 flex items-center gap-1.5 group-hover:bg-black transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>¿Cómo comprar?</span>
              {/* Puntero hacia el bot */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-950 rotate-45 border-r border-b border-neutral-700/80 group-hover:bg-black transition-colors" />
            </div>

            {/* 2. "imagen" (Botón con la imagen bot.png) */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-neutral-950 p-1.5 shadow-2xl border-2 border-neutral-700/80 flex items-center justify-center group-hover:border-purple-400/80 transition-all">
              <img
                src="/usar/bot.png"
                alt="Bot ¿Cómo comprar?"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
              {/* Indicador verde de activo */}
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Assistant Window */}
      {isOpen && (
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] sm:right-auto z-50 w-auto sm:w-[380px] max-w-[400px] bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[82dvh] sm:max-h-[580px] animate-fadeIn">
          
          {/* Header */}
          <div className="bg-[#200E25] text-white px-4 py-3.5 flex items-center justify-between border-b border-purple-900/40 select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-neutral-900 border border-purple-500/40 p-1 flex items-center justify-center shrink-0">
                <img 
                  src="/usar/bot.png" 
                  alt="Bot RAYED" 
                  className="w-full h-full object-contain"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#200E25]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Asistente RAYED
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-purple-200/70 font-light">
                  Guía de compra oficial
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar asistente"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Area */}
          <div className="p-4 space-y-3.5 bg-[#FAF7FB] flex-1 overflow-y-auto">
            
            {/* Greeting Message Bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-300 p-0.5 shrink-0 flex items-center justify-center mt-1 shadow-xs">
                <img 
                  src="/usar/bot.png" 
                  alt="Bot" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-[10px] text-neutral-400 mb-1 ml-1 font-medium">Asistente RAYED</span>
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs border border-neutral-200/80 shadow-xs text-xs text-neutral-900 leading-relaxed font-medium">
                  Bienvenido a RAYED. Soy tu guía de compra para adquirir nuestros productos
                </div>
              </div>
            </div>

            {/* Steps Bubble (Formal and Elegant) */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-300 p-0.5 shrink-0 flex items-center justify-center mt-1 shadow-xs">
                <img 
                  src="/usar/bot.png" 
                  alt="Bot" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col items-start flex-1">
                <div className="bg-white p-4 rounded-2xl rounded-tl-xs border border-neutral-200/80 shadow-xs text-xs text-neutral-800 space-y-3 w-full">
                <p className="font-semibold text-neutral-900 border-b border-neutral-100 pb-1.5 uppercase tracking-wider text-[11px]">
                  Pasos para realizar tu compra:
                </p>

                <div className="space-y-2.5 text-[11px] leading-snug">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-neutral-900 min-w-[16px]">1.</span>
                    <div>
                      <strong className="text-neutral-900">Explora el Catálogo:</strong>
                      <p className="text-neutral-600 mt-0.5">
                        Elige tu prenda favorita. Al ser piezas únicas, cada modelo cuenta con talla y color exclusivos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold text-neutral-900 min-w-[16px]">2.</span>
                    <div>
                      <strong className="text-neutral-900">Elige tu Prenda:</strong>
                      <p className="text-neutral-600 mt-0.5">
                        Añádela a tu bolsa de compra o aparta directamente con el botón "Apartar por WhatsApp".
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold text-neutral-900 min-w-[16px]">3.</span>
                    <div>
                      <strong className="text-neutral-900">Coordinamos la Entrega:</strong>
                      <p className="text-neutral-600 mt-0.5">
                        Acordamos contigo el punto céntrico y horario de entrega personal más conveniente.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold text-neutral-900 min-w-[16px]">4.</span>
                    <div>
                      <strong className="text-neutral-900">Pago Seguro al Recibir:</strong>
                      <p className="text-neutral-600 mt-0.5">
                        Revisas tu prenda nueva con etiqueta en mano y realizas tu pago contra entrega (efectivo o transferencia).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </div>

          {/* Action Buttons Footer */}
          <div className="p-3 bg-white border-t border-neutral-200 space-y-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {/* Primary Action: Ver catálogo de prendas */}
            <button
              onClick={handleExplore}
              className="w-full py-3 px-3 min-h-[44px] bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ver catálogo de prendas</span>
            </button>

            {/* Secondary Action: Contactar a un asesor */}
            <a
              href="https://wa.me/527561319459?text=Hola,%20me%20gustaria%20recibir%20asesoria%20para%20comprar%20en%20RAYED"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 min-h-[38px] border border-neutral-300 hover:border-black text-neutral-700 hover:text-black text-[11px] font-medium uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Hablar con un asesor</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          </div>

        </div>
      )}
    </>
  );
}
