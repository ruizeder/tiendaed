import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../../data/products';

const BANNER_SLIDES = [
  {
    id: 1,
    tag: "CALIDAD SHEIN GARANTIZADA",
    title: "ROPA 100% NUEVA Y ETIQUETADA",
    description: "Prendas seleccionadas de moda femenina con empaque original y etiquetas intactas.",
    image: "/usar/banner/etiqueta.jpg",
    alt: "Ropa SHEIN 100% Nueva y Etiquetada"
  },
  {
    id: 2,
    title: "PUNTOS DE ENTREGA LOCALES",
    description: "Entregas personales, rápidas y coordinadas en puntos céntricos y seguros.",
    image: "/usar/banner/puntos.jpg",
    alt: "Puntos de entrega locales"
  },
  {
    id: 3,
    tag: "COMPRA CON TRANQUILIDAD",
    title: "100% SEGURO • PAGAS AL RECIBIR",
    description: "Paga en efectivo al recibir tu prenda o por transferencia bancaria y depósitos en OXXO.",
    image: "/usar/banner/paga.jpg",
    alt: "Pago 100% seguro al recibir tu prenda"
  },
  {
    id: 4,
    tag: "ATENCIÓN DIRECTA",
    title: "PIDE FÁCIL POR WHATSAPP",
    description: "Estrena nuevas prendas y tendencias cada semana. Arma tu pedido al instante.",
    image: "/usar/banner/whatsapp.jpg",
    alt: "Atención personalizada por WhatsApp RAYED"
  }
];

export default function CatalogSection({ 
  products = [],
  bannerSlides = BANNER_SLIDES,
  onQuickView, 
  onAddToCart, 
  wishlist, 
  onToggleWishlist,
  searchQuery,
  onSearchChange,
  selectedCategory = 'all',
  onSelectCategory
}) {
  const activeSlides = (bannerSlides && bannerSlides.length > 0) ? bannerSlides : BANNER_SLIDES;
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Las prendas vendidas no se muestran en la tienda
      if (product.status === 'sold') return false;

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesPrice = true;
      if (priceFilter === 'under150') matchesPrice = product.price < 150;
      if (priceFilter === 'over150') matchesPrice = product.price >= 150;

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.id - b.id;
    });
  }, [products, selectedCategory, searchQuery, priceFilter, sortBy]);

  return (
    <div id="catalogo" className="bg-[#DFD5E8] min-h-screen pb-20">
      
      {/* Top Editorial Campaign Carousel */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
        <div 
          className="relative bg-[#D6C7DE] w-full min-h-[190px] sm:min-h-[280px] md:min-h-[330px] flex items-center justify-between overflow-hidden group shadow-sm rounded-none select-none"
        >
          {/* Slides */}
          {activeSlides.map((slide, idx) => (
            <div 
              key={slide.id || idx}
              className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col md:flex-row items-center justify-between overflow-hidden ${
                idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-98 z-0 pointer-events-none'
              }`}
            >
              {/* Left Campaign Text */}
              <div className="z-10 w-full md:w-1/2 p-4 sm:p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-r from-[#D6C7DE] via-[#D6C7DE]/95 to-transparent md:bg-none">
                {slide.tag && (
                  <span className="text-[10px] sm:text-[11px] tracking-[0.3em] font-bold text-[#5B1F6E] uppercase block mb-1">
                    {slide.tag}
                  </span>
                )}
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 uppercase leading-tight font-sans">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-700 mt-1.5 sm:mt-2.5 max-w-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {slide.description}
                </p>
              </div>

              {/* Right Banner Image */}
              <div className="w-full md:w-1/2 h-full absolute md:relative right-0 top-0 bottom-0 opacity-40 md:opacity-100 flex items-center justify-end">
                <img 
                  src={slide.image} 
                  alt={slide.alt || slide.title} 
                  className="h-full w-full object-cover object-center md:object-right"
                />
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button 
            onClick={handlePrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-black p-2 shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-black p-2 shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Diapositiva siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Pagination Indicators */}
          <div className="absolute bottom-3 left-6 sm:left-10 z-20 flex items-center gap-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentSlide ? 'w-6 bg-black' : 'w-2 bg-black/30 hover:bg-black/60'
                }`}
                aria-label={`Ir a la diapositiva ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        
        {/* Minimalist Toolbar matching Screenshot with Categories */}
        <div className="border-t border-b border-neutral-200 py-2 sm:py-2.5 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 text-xs text-neutral-800">
          
          {/* Left: Category Tabs directly in the toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer min-h-[36px] flex items-center ${
                    isActive
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100 border border-transparent'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right: Items count & Sort By */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0">
            <span className="text-[11px] text-neutral-600 font-sans">
              Piezas únicas: <strong className="text-neutral-900 font-medium">{filteredProducts.length}</strong>
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-neutral-300 px-2 sm:px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-800 bg-white focus:outline-none focus:border-black cursor-pointer min-h-[36px]"
              >
                <option value="featured">ORDENAR: RELEVANCIA</option>
                <option value="price-asc">PRECIO: MENOR A MAYOR</option>
                <option value="price-desc">PRECIO: MAYOR A MENOR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Drawer / Accordion */}
        {isFilterOpen && (
          <div className="mb-8 p-5 bg-[#FAFAFA] border border-neutral-200 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              
              {/* Category Filter */}
              <div>
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-2.5 text-[11px]">
                  Categoría
                </h4>
                <div className="flex flex-col gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`text-left py-1 text-xs cursor-pointer flex items-center justify-between ${
                        selectedCategory === cat.id ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-black" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-2.5 text-[11px]">
                  Rango de Precio
                </h4>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setPriceFilter('all')}
                    className={`text-left py-1 text-xs cursor-pointer flex items-center justify-between ${
                      priceFilter === 'all' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    <span>Todos los precios</span>
                    {priceFilter === 'all' && <Check className="w-3.5 h-3.5 text-black" />}
                  </button>
                  <button
                    onClick={() => setPriceFilter('under150')}
                    className={`text-left py-1 text-xs cursor-pointer flex items-center justify-between ${
                      priceFilter === 'under150' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    <span>Hasta $150.00</span>
                    {priceFilter === 'under150' && <Check className="w-3.5 h-3.5 text-black" />}
                  </button>
                  <button
                    onClick={() => setPriceFilter('over150')}
                    className={`text-left py-1 text-xs cursor-pointer flex items-center justify-between ${
                      priceFilter === 'over150' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    <span>$150.00 o más</span>
                    {priceFilter === 'over150' && <Check className="w-3.5 h-3.5 text-black" />}
                  </button>
                </div>
              </div>

              {/* Clear filters button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    handleCategoryClick('all');
                    setPriceFilter('all');
                    onSearchChange('');
                  }}
                  className="border border-black bg-black text-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors w-full sm:w-auto"
                >
                  Limpiar Filtros
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 4-Column Product Grid (Exact Reference from Screenshot) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-6 sm:gap-y-12">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.some(item => item.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => onQuickView(p, filteredProducts)}
                  onAddToCart={onAddToCart}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={onToggleWishlist}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 px-4 border border-neutral-200 bg-white/60 my-8 max-w-xl mx-auto">
            <span className="text-[10px] tracking-[0.3em] font-bold text-[#5B1F6E] uppercase block mb-2">
              {products.length === 0 ? "Próximamente" : "Sin resultados"}
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 uppercase tracking-tight mb-2">
              {products.length === 0 ? "Nueva Colección en Preparación" : "No se encontraron prendas"}
            </h3>
            <p className="text-xs text-neutral-600 mb-6 max-w-md mx-auto leading-relaxed">
              {products.length === 0 
                ? "Estamos preparando las próximas prendas exclusivas. Muy pronto estarán disponibles aquí. Si buscas algo específico, escríbenos directamente por WhatsApp."
                : "Intenta cambiando los filtros o el término de búsqueda para ver más prendas."}
            </p>
            {products.length === 0 ? (
              <a
                href="https://wa.me/527561319459?text=Hola%20RAYED%2C%20quisiera%20consultar%20disponibilidad%20de%20prendas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors"
              >
                <span>Consultar por WhatsApp</span>
              </a>
            ) : (
              <button
                onClick={() => {
                  handleCategoryClick('all');
                  setPriceFilter('all');
                  onSearchChange('');
                }}
                className="border border-black px-4 py-2 text-xs uppercase font-medium hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                Ver Todo el Catálogo
              </button>
            )}
          </div>
        )}

        {/* Minimalist Pagination (Exact match to screenshot bottom `< 1 2 3 4 5 >`) */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-16 pb-8 text-xs font-mono text-neutral-600 select-none">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1 hover:text-black transition-colors cursor-pointer"
            >
              &lt;
            </button>
            <button 
              onClick={() => setCurrentPage(1)}
              className={`w-6 h-6 flex items-center justify-center cursor-pointer ${currentPage === 1 ? 'font-bold text-black border-b-2 border-black' : 'hover:text-black'}`}
            >
              1
            </button>
            <button 
              onClick={() => setCurrentPage(2)}
              className={`w-6 h-6 flex items-center justify-center cursor-pointer ${currentPage === 2 ? 'font-bold text-black border-b-2 border-black' : 'hover:text-black'}`}
            >
              2
            </button>
            <button 
              onClick={() => setCurrentPage(3)}
              className={`w-6 h-6 flex items-center justify-center cursor-pointer ${currentPage === 3 ? 'font-bold text-black border-b-2 border-black' : 'hover:text-black'}`}
            >
              3
            </button>
            <button 
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              className="p-1 hover:text-black transition-colors cursor-pointer"
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
