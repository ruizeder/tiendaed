import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function Footer({ onExploreCatalog, onOpenHowToBuy, onOpenFaq, onSelectCategory }) {
  const handleCategoryClick = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    if (onExploreCatalog) onExploreCatalog();
  };

  return (
    <footer id="contacto" className="bg-[#D3C4DC] text-neutral-800 pt-10 sm:pt-12 pb-8 border-t border-neutral-300 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 text-xs">
          
          {/* Col 1 */}
          <div>
            <img 
              src="/usar/rayed.png" 
              alt="RAYED" 
              className="h-9 sm:h-10 w-auto object-contain mb-3 shadow-xs rounded-xs select-none"
            />
            <p className="text-neutral-500 text-xs leading-relaxed max-w-xs">
              Tienda en línea de ropa 100% nueva marca SHEIN. Entregas personales en los puntos más céntricos{/* de la ciudad de Chilapa de Álvarez, Guerrero */}.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-3 text-[11px]">
              Categorías
            </h4>
            <ul className="space-y-2 text-neutral-600">
              <li><button onClick={() => handleCategoryClick('vestidos')} className="hover:text-black transition-colors cursor-pointer">Vestidos</button></li>
              <li><button onClick={() => handleCategoryClick('pantalones')} className="hover:text-black transition-colors cursor-pointer">Pantalones</button></li>
              <li><button onClick={() => handleCategoryClick('deportivo')} className="hover:text-black transition-colors cursor-pointer">Ropa Deportiva</button></li>
              <li><button onClick={() => handleCategoryClick('tops')} className="hover:text-black transition-colors cursor-pointer">Tops</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-3 text-[11px]">
              Ayuda & Compras
            </h4>
            <ul className="space-y-2 text-neutral-600">
              <li>
                <button onClick={onOpenHowToBuy} className="hover:text-black transition-colors cursor-pointer text-left">
                  ¿Cómo comprar?
                </button>
              </li>
              <li>
                <button onClick={onOpenFaq} className="hover:text-black transition-colors cursor-pointer text-left">
                  Dudas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: WhatsApp Contact */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-3 text-[11px]">
              Contacto Directo
            </h4>
            <a 
              href="https://wa.me/527561319459?text=Hola,%20me%20gustaria%20informes%20de%20la%20tienda%20RAYED"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 min-h-[40px] text-xs font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-200 text-center sm:text-left text-[11px] text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 RAYED Tienda en Línea{/* • Chilapa de Álvarez, Gro. */}</p>
          <div className="flex items-center gap-4">
            <span>Ropa 100% Nueva SHEIN</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
