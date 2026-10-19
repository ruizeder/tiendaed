import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

const LETTERS = ['R', 'A', 'Y', 'E', 'D'];

export default function LandingCover({ onExploreCatalog, city }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Loading animation cycle
  const runSequence = () => {
    setLoading(true);
    setProgress(0);
    setRevealedCount(0);
    setShowImage(false);
    setShowDetails(false);

    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += Math.floor(Math.random() * 8) + 6;
      if (currentProg >= 100) {
        currentProg = 100;
        clearInterval(interval);
        setProgress(100);

        setTimeout(() => {
          setLoading(false);
        }, 200);
      } else {
        setProgress(currentProg);
      }
    }, 40);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const cleanup = runSequence();
    const preloadImg = new Image();
    preloadImg.src = '/usar/iconoo.png';
    return cleanup;
  }, []);

  // Strict sequence after loading finishes:
  // 1. Letters reveal one by one (R -> A -> Y -> E -> D)
  // 2. Only AFTER letters finish, the image appears
  // 3. Subtitle & Button appear right after
  useEffect(() => {
    if (!loading) {
      const letterCadence = 280; // Clear, visible letter-by-letter pace

      LETTERS.forEach((_, idx) => {
        setTimeout(() => {
          setRevealedCount(idx + 1);
        }, (idx + 1) * letterCadence);
      });

      const totalLettersTime = (LETTERS.length + 1) * letterCadence;

      // Image appears strictly AFTER all letters are revealed
      const imageTimer = setTimeout(() => {
        setShowImage(true);
      }, totalLettersTime + 200);

      // Subtitle & Button appear after image
      const detailsTimer = setTimeout(() => {
        setShowDetails(true);
      }, totalLettersTime + 650);

      return () => {
        clearTimeout(imageTimer);
        clearTimeout(detailsTimer);
      };
    }
  }, [loading]);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#DFD5E8] flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 select-none">
      
      {/* Ambient subtle glow preserving the #DFD5E8 tone */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-300/35 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-fuchsia-300/25 rounded-full blur-3xl animate-pulse-subtle" />
      </div>

      {/* ========================================================= */}
      {/* PHASE 1: LOADING SCREEN (Clean minimal line, NO static text) */}
      {/* ========================================================= */}
      {loading ? (
        <div className="relative z-10 flex flex-col items-center justify-center space-y-3 animate-fadeIn my-auto">
          <div className="w-32 sm:w-44 h-[2px] bg-[#25122B]/15 overflow-hidden rounded-full">
            <div
              className="h-full bg-[#25122B] transition-all duration-100 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#25122B]/60 font-sans font-light">
            Cargando
          </span>
        </div>
      ) : (
        /* ========================================================= */
        /* PHASE 2: ANIMATED PRESENTATION                            */
        /* ORDER: RAYED -> IMAGEN -> TIENDA EN LINEA                 */
        /* ========================================================= */
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto py-2 sm:py-4 my-auto w-full">
          
          {/* 1. TOP: Letter-by-letter animation: R - A - Y - E - D */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-7 my-1 sm:my-2 flex-nowrap">
            {LETTERS.map((letter, index) => {
              const isVisible = index < revealedCount;
              return (
                <span
                  key={index}
                  className={`inline-block font-serif-luxury font-light text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-[#25122B] transition-all duration-500 transform leading-none ${
                    isVisible
                      ? 'opacity-100 translate-y-0 scale-100 filter-none'
                      : 'opacity-0 -translate-y-8 scale-90 blur-sm pointer-events-none'
                  }`}
                  style={{
                    letterSpacing: '0.08em',
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>

          {/* 2. MIDDLE: Image from /public/usar/iconoo.png (Appears ONLY after letters are revealed) */}
          <div 
            className={`transition-all duration-700 transform my-2 sm:my-4 ${
              showImage 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <img
                src="/usar/iconoo.png"
                onError={(e) => {
                  // Fallback if ever missing
                  if (!e.currentTarget.dataset.retried) {
                    e.currentTarget.dataset.retried = 'true';
                    e.currentTarget.src = '/usar/iconoo.jpg';
                  }
                }}
                alt="RAYED Icono - Tienda en Línea"
                className="h-[200px] sm:h-[270px] md:h-[330px] lg:h-[370px] max-h-[38vh] w-auto object-contain drop-shadow-2xl select-none transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* 3. BOTTOM OF IMAGE: Subtitle "TIENDA EN LÍNEA" */}
          <div
            className={`transition-all duration-700 delay-150 flex items-center justify-center gap-2.5 sm:gap-5 mt-1 sm:mt-2 w-full max-w-xs sm:max-w-md ${
              showDetails 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-3'
            }`}
          >
            <div className="h-[1px] flex-1 bg-[#25122B]/35" />
            <p className="text-[11px] sm:text-sm md:text-base tracking-[0.3em] sm:tracking-[0.45em] uppercase font-light text-[#25122B]/85 font-sans whitespace-nowrap">
              Tienda en línea
            </p>
            <div className="h-[1px] flex-1 bg-[#25122B]/35" />
          </div>

          {/* Ubicación activa */}
          {city && city.trim() && (
            <div
              className={`transition-all duration-700 delay-200 mt-1 flex items-center justify-center gap-1.5 ${
                showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="text-[10px] sm:text-xs tracking-widest uppercase font-medium text-[#25122B]/75 bg-white/40 px-3 py-1 rounded-full border border-[#25122B]/10 backdrop-blur-xs">
                📍 {city.trim()}
              </span>
            </div>
          )}

          {/* 4. Action Button: VER CATÁLOGO */}
          <div
            className={`transition-all duration-700 delay-300 mt-4 sm:mt-6 ${
              showDetails 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <button
              onClick={onExploreCatalog}
              className="group relative inline-flex items-center gap-2.5 bg-[#25122B] hover:bg-[#381B41] text-white px-7 sm:px-9 py-2.5 sm:py-3 rounded-full font-serif-luxury text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase shadow-2xl shadow-purple-950/30 hover:shadow-purple-900/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-purple-400/30 cursor-pointer min-h-[44px] touch-manipulation"
            >
              <span>Ver Catálogo</span>
              <ArrowDown className="w-3.5 h-3.5 text-purple-300 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
