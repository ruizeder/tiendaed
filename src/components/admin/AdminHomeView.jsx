import React from 'react';

export default function AdminHomeView() {
  return (
    <div className="animate-fadeIn max-w-2xl mx-auto py-8 sm:py-16 px-4 sm:px-6">
      
      {/* Tarjeta Editorial de Bienvenida */}
      <div className="bg-white border border-neutral-200/90 shadow-sm p-8 sm:p-14 text-center flex flex-col items-center">
        
        {/* Logotipo Oficial RAYED */}
        <div className="mb-6">
          <img 
            src="/usar/rayed.png" 
            alt="RAYED" 
            className="h-12 sm:h-16 w-auto object-contain mx-auto select-none"
          />
        </div>

        {/* Bienvenida */}
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-400 mb-1.5 block">
          PANEL DE ADMINISTRACIÓN
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-6">
          Bienvenido, Administrador RAYED
        </h1>

        {/* Separador fino */}
        <div className="w-12 h-[1px] bg-neutral-300 mb-6" />

        {/* Salmos de Dios para la prosperidad y crecimiento del negocio */}
        <div className="space-y-5 max-w-lg mx-auto">
          <div>
            <blockquote className="font-serif italic text-base sm:text-lg md:text-xl text-neutral-800 leading-relaxed">
              «Y sea la luz del Señor nuestro Dios sobre nosotros, y la obra de nuestras manos confirma sobre nosotros; sí, la obra de nuestras manos confirma.»
            </blockquote>
            <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500 block mt-2">
              — Salmos 90:17
            </span>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <blockquote className="font-serif italic text-sm sm:text-base text-neutral-700 leading-relaxed pt-2">
              «Será como árbol plantado junto a corrientes de aguas, que da su fruto en su tiempo, y su hoja no se marchita; y todo lo que hace, prosperará.»
            </blockquote>
            <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500 block mt-1.5">
              — Salmos 1:3
            </span>
          </div>

          <p className="text-xs text-neutral-500 pt-3">
            Que la bendición de Dios acompañe cada prenda, cada venta y guíe el crecimiento de tu tienda.
          </p>
        </div>

      </div>

    </div>
  );
}
