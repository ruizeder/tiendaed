import React, { useState } from 'react';
import { ArrowDown, Sparkles, ShoppingBag, Eye, Star, ChevronRight, Award, ShieldCheck, Heart } from 'lucide-react';
import { HERO_HIGHLIGHTS } from '../../data/products';

export default function HeroSection({ onExploreCatalog, onQuickViewHeroItem, onAddToCart }) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const currentItem = HERO_HIGHLIGHTS.featuredItems[selectedItemIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#25122B] via-[#32173B] to-[#1E0E23] text-white pt-6 pb-20 lg:py-16 px-4 sm:px-6 lg:px-12 border-b border-purple-900/50">
      {/* Abstract Geometric Background Curves (matching Reference 1) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Upper soft violet curve */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-purple-700/20 via-fuchsia-800/15 to-transparent rounded-full blur-3xl transform -rotate-12"></div>
        
        {/* Diagonal geometric layers */}
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-purple-900/30 via-transparent to-transparent opacity-60"></div>
        
        {/* Large smooth wave background SVG */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-auto opacity-20" 
          viewBox="0 0 1440 320" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="#B388EB" 
            fillOpacity="0.15" 
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>

        {/* Floating glow orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main Hero Header & RAYED Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Main Visual: public/RAYED.jpg Image Display */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative group w-full max-w-md bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-purple-300/40 transform hover:scale-[1.01] transition-transform duration-300">
              {/* Outer Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-500 pointer-events-none"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-inner bg-stone-100">
                <img 
                  src="/rayee.jpg" 
                  alt="RAYED Tienda en Línea - Ropa 100% Nueva SHEIN" 
                  className="w-full h-auto object-cover rounded-2xl"
                  priority="true"
                />
              </div>

              {/* Floating verified badge */}
              <div className="absolute -bottom-3 -right-3 bg-[#2F1538] text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-purple-400/50 shadow-xl flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ropa 100% Nueva</span>
              </div>
            </div>
          </div>

          {/* Right Information & CTA Column */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/70 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ENTREGA LOCAL{/* CHILAPA DE ÁLVAREZ, GUERRERO */}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-light tracking-wide text-white leading-tight">
                Moda Femenina <span className="italic text-purple-300 font-normal">RAYED</span>
              </h1>

              <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed mt-3 max-w-xl">
                Catálogo exclusivo de ropa 100% nueva marca <strong>SHEIN</strong>. Entregas personales en los lugares más céntricos{/* de la ciudad de Chilapa */}.
              </p>
            </div>

            {/* Quick Info Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-purple-950/70 rounded-2xl p-3 border border-purple-800/40">
                <p className="text-[11px] text-purple-300 uppercase tracking-wider font-semibold">Garantía</p>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5">Ropa 100% Nueva</p>
              </div>
              <div className="bg-purple-950/70 rounded-2xl p-3 border border-purple-800/40">
                <p className="text-[11px] text-purple-300 uppercase tracking-wider font-semibold">Entregas</p>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5">Puntos Céntricos</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreCatalog}
                className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 hover:from-purple-500 hover:to-fuchsia-500 text-white px-7 py-4 rounded-full font-semibold text-sm tracking-wider uppercase transition-all duration-300 shadow-xl shadow-purple-950/60 hover:shadow-purple-700/80 transform hover:-translate-y-0.5 border border-purple-300/40 cursor-pointer"
              >
                <span>Explorar Catálogo</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>

              <a
                href="https://wa.me/527561319459?text=Hola,%20me%20gustaria%20informes%20sobre%20las%20prendas%20de%20RAYED%20Tienda%20en%20Línea"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-full font-semibold text-sm tracking-wider uppercase transition-all shadow-lg shadow-emerald-950 hover:shadow-emerald-600/40 border border-emerald-400/40 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Pedir por WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Interactive Rack & Featured Items Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-purple-300">
                Vitrina Interactiva
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-light text-white">
                Colección Destacada en Perchero
              </h2>
            </div>
            <button
              onClick={onExploreCatalog}
              className="text-xs text-purple-300 hover:text-white underline uppercase tracking-wider"
            >
              Ver catálogo completo →
            </button>
          </div>
        </div>


        {/* Main Hero Showcase Grid (Reference 1 Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT: The Clothing Rack / Interactive Wardrobe Showcase */}
          <div className="lg:col-span-7 bg-[#281330]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl relative flex flex-col justify-between overflow-hidden">
            {/* Metallic top rack bar */}
            <div className="relative mb-6">
              <div className="h-2 w-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 rounded-full shadow-md"></div>
              <div className="flex justify-between px-6 -mt-1 text-amber-200/50 text-[10px] tracking-widest uppercase">
                <span>• Rack Atelier</span>
                <span>Colección Exclusiva •</span>
              </div>
            </div>

            {/* Hanger items list (Clickable items on the rack) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-auto">
              {HERO_HIGHLIGHTS.featuredItems.map((item, idx) => {
                const isSelected = selectedItemIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemIndex(idx)}
                    className={`cursor-pointer group relative rounded-2xl p-2 transition-all duration-300 flex flex-col items-center text-center ${
                      isSelected
                        ? 'bg-purple-950/80 ring-2 ring-purple-400/80 shadow-xl shadow-purple-950 scale-102'
                        : 'bg-purple-900/30 hover:bg-purple-800/40 border border-purple-800/30 hover:border-purple-500/40'
                    }`}
                  >
                    {/* Hanger graphic indicator */}
                    <div className="w-8 h-4 border-t-2 border-r-2 border-amber-300/80 rounded-tr-full mb-1"></div>

                    {/* Garment Image */}
                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-purple-950 relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent flex items-end justify-center p-2">
                          <span className="text-[10px] bg-purple-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Seleccionado
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Color dot & label */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-white/40 shadow-sm" 
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-[11px] text-purple-200 font-medium truncate max-w-[80px]">
                        {item.color}
                      </span>
                    </div>

                    <h4 className="text-xs font-serif-luxury font-medium text-white truncate w-full px-1">
                      {item.name}
                    </h4>
                    <span className="text-xs font-semibold text-purple-300 mt-0.5">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom mini interactive instructions */}
            <div className="mt-6 pt-4 border-t border-purple-800/40 flex items-center justify-between text-xs text-purple-300/80">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Haz clic en una prenda para ver sus detalles
              </span>
              <span className="font-mono text-purple-400">
                0{selectedItemIndex + 1} / 0{HERO_HIGHLIGHTS.featuredItems.length}
              </span>
            </div>
          </div>

          {/* RIGHT: Selected Garment Editorial Detail & Mini Showcase (Reference 1) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Top Garment Spotlight Card */}
            <div className="bg-[#2D1637]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-purple-500/25 shadow-2xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-purple-300 font-semibold">
                    {currentItem.category} • Éder Atelier
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>5.0 Alta Costura</span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif-luxury font-light text-white mb-2 leading-snug">
                  {currentItem.name}
                </h3>

                <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed mb-5">
                  {currentItem.description} {HERO_HIGHLIGHTS.description}
                </p>

                {/* Color swatches preview */}
                <div className="mb-6">
                  <label className="text-[11px] uppercase tracking-wider text-purple-300 font-medium block mb-2">
                    Tono Seleccionado: <strong className="text-white">{currentItem.color}</strong>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {HERO_HIGHLIGHTS.featuredItems.map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItemIndex(i)}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          selectedItemIndex === i 
                            ? 'border-white scale-110 shadow-lg ring-2 ring-purple-400' 
                            : 'border-white/30 hover:border-white/70'
                        }`}
                        style={{ backgroundColor: item.colorHex }}
                        title={item.color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-4 border-t border-purple-800/40 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-purple-300/70 block">Precio Exclusivo</span>
                  <span className="text-2xl font-serif-luxury font-semibold text-white">
                    ${currentItem.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onAddToCart) {
                        onAddToCart({
                          id: currentItem.id,
                          name: currentItem.name,
                          price: currentItem.price,
                          color: currentItem.color,
                          size: 'M',
                          image: currentItem.image,
                          category: currentItem.category
                        });
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md shadow-purple-950 active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Añadir a Bolsa</span>
                  </button>

                  <a
                    href={`https://wa.me/527561319459?text=${encodeURIComponent('Hola, me interesa la prenda ' + currentItem.name + ' (' + currentItem.color + ') por $' + currentItem.price + ' de la Cápsula Imperial.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950 active:scale-95"
                    title="Pedir directo por WhatsApp"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* BOTTOM: Mini Showcase Footwear / Metric Cards (Reference 1 Bottom Area) */}
            <div className="bg-[#24112B]/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] uppercase tracking-widest text-purple-300 font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  Calzado & Complementos Cápsula
                </span>
                <button 
                  onClick={onExploreCatalog} 
                  className="text-[11px] text-purple-300 hover:text-white underline transition-colors"
                >
                  Ver todo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {HERO_HIGHLIGHTS.miniShowcase.map((mini) => (
                  <div 
                    key={mini.id} 
                    className="bg-purple-950/60 rounded-xl p-2 border border-purple-800/30 hover:border-purple-500/40 transition-all text-center group cursor-pointer"
                    onClick={onExploreCatalog}
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-purple-900/40">
                      <img 
                        src={mini.image} 
                        alt={mini.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-purple-300 font-bold block truncate">
                      {mini.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-white">
                      
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Floating Quick Trust Badges */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 pt-8 border-t border-purple-900/40">
          <div className="flex items-center gap-3 text-purple-200">
            <div className="w-9 h-9 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 border border-purple-700/40 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Materiales Nobles</p>
              <p className="text-[11px] text-purple-300/70">100% Seda & Lana Merino</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-purple-200">
            <div className="w-9 h-9 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 border border-purple-700/40 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Diseño Exclusivo</p>
              <p className="text-[11px] text-purple-300/70">Tiradas limitadas y únicas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-purple-200">
            <div className="w-9 h-9 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 border border-purple-700/40 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Confección Artesanal</p>
              <p className="text-[11px] text-purple-300/70">Patronaje de alta precisión</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-purple-200">
            <div className="w-9 h-9 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 border border-purple-700/40 shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Atención VIP WhatsApp</p>
              <p className="text-[11px] text-purple-300/70">Asesoría de tallas 24/7</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
