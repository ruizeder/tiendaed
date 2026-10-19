import React from 'react';
import { Sparkles, ArrowRight, Quote } from 'lucide-react';

export default function LookbookSection({ onExploreCatalog }) {
  return (
    <section id="lookbook" className="py-20 px-4 sm:px-6 lg:px-12 bg-[#200E25] text-white relative overflow-hidden border-t border-purple-900/40">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-purple-300 bg-purple-900/60 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-purple-400/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              Lookbook & Manifiesto
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-light text-white leading-tight">
              Diseño que trasciende la temporada con <span className="italic text-purple-300">personalidad & sobriedad</span>
            </h2>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <button
              onClick={onExploreCatalog}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-300 hover:text-white transition-colors group"
            >
              <span>Ver todas las prendas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Editorial Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-purple-950 border border-purple-800/40 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" 
              alt="Editorial 1" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A21] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold block mb-1">Corte Arquitectónico</span>
              <h3 className="font-serif-luxury text-xl font-medium text-white mb-2">Siluetas Fluidas & Sastrería</h3>
              <p className="text-xs text-purple-200/80 line-clamp-2">Líneas limpias que estilizan el cuerpo sin sacrificar comodidad ni movimiento.</p>
            </div>
          </div>

          {/* Card 2 - Center Quote */}
          <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-gradient-to-b from-[#34163E] to-[#250F2D] p-8 flex flex-col justify-between border border-purple-500/30 shadow-xl">
            <Quote className="w-10 h-10 text-purple-400/40" />
            
            <blockquote className="font-serif-luxury text-xl sm:text-2xl text-purple-100 font-light italic leading-relaxed">
              "La verdadera sofisticación reside en la armonía de los tonos profundos y la pureza de cada costura."
            </blockquote>

            <div className="pt-4 border-t border-purple-800/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block uppercase tracking-wider">Éder Atelier</span>
                <span className="text-[10px] text-purple-300">Dirección Creativa</span>
              </div>
              <button 
                onClick={onExploreCatalog}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 rounded-full font-semibold transition-colors"
              >
                Catálogo
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-purple-950 border border-purple-800/40 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" 
              alt="Editorial 3" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A21] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold block mb-1">Paleta Imperial</span>
              <h3 className="font-serif-luxury text-xl font-medium text-white mb-2">Violetas, Ciruelas & Camel</h3>
              <p className="text-xs text-purple-200/80 line-clamp-2">Una gama cromática diseñada para destacar con distinción en cualquier ocasión.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
