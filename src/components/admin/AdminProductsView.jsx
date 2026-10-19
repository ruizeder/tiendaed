import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  Check, 
  RotateCcw, 
  Loader2,
  Plus
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'TODOS' },
  { id: 'pantalones', label: 'PANTALONES' },
  { id: 'tops', label: 'TOPS' },
  { id: 'vestidos', label: 'VESTIDOS' },
  { id: 'deportivo', label: 'DEPORTIVO' }
];

export default function AdminProductsView({
  products = [],
  isLoading = false,
  availableCount = 0,
  soldCount = 0,
  totalCount = 0,
  onGoToGestion,
  onEditProductInGestion,
  onDeleteProduct,
  onMarkAsSold,
  onReactivateProduct
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (item.status === 'sold') return false;

      const matchesSearch = 
        !searchTerm || 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoryLabel?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'all') {
        return true;
      }

      return item.category === activeTab;
    });
  }, [products, searchTerm, activeTab]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Productos · Catálogo & Existencias
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Consulta general de prendas dadas de alta, tallas, colores y estados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Contador en el encabezado */}
          <div className="px-3 py-1.5 bg-white border border-neutral-300 text-xs font-mono">
            <span>act <strong className="text-emerald-700">{availableCount}</strong></span>
            <span className="text-neutral-300 mx-2">·</span>
            <span>ven <strong className="text-amber-700">{soldCount}</strong></span>
          </div>

          <button
            onClick={onGoToGestion}
            className="px-3.5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Gestionar / Nueva</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros & Buscador */}
      <div className="bg-[#D3C4DC]/60 border border-neutral-300 p-2 sm:p-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Pestañas de categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer min-h-[34px] flex items-center ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-700 hover:text-black hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Buscador */}
        <div className="relative md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por prenda, color..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-black rounded-none"
          />
        </div>

      </div>

      {/* Tabla & Lista de Prendas */}
      <div className="bg-white border border-neutral-300 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 text-center text-neutral-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
            <span className="text-xs uppercase tracking-wider">Cargando existencias...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
              {activeTab === 'sold_history' ? 'No hay prendas vendidas' : 'No hay prendas en esta categoría'}
            </p>
          </div>
        ) : (
          <>
            {/* VISTA MÓVIL (< 768px) */}
            <div className="block md:hidden divide-y divide-neutral-200">
              {filteredProducts.map((item) => {
                const isSold = item.status === 'sold';
                return (
                  <div key={item.id} className="p-3.5 flex flex-col gap-3 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="relative w-16 h-20 bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                        <img
                          src={item.image || "https://placehold.co/100x120?text=Prenda"}
                          alt={item.name}
                          className={`w-full h-full object-cover object-top ${isSold ? 'opacity-60 grayscale' : ''}`}
                        />
                        {isSold && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white bg-black/80 px-1 py-0.5 uppercase tracking-wider">
                              Vendido
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">
                          {item.categoryLabel || item.category}
                        </span>
                        <h3 className="text-xs font-bold text-neutral-900 truncate uppercase mt-0.5">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 bg-black text-white text-[10px] font-semibold">
                            {item.size || item.sizes?.[0] || 'M'}
                          </span>
                          <span className="text-neutral-300">·</span>
                          <span className="text-[11px] text-neutral-700 font-medium">
                            {item.color || item.colors?.[0]?.name || 'Único'}
                          </span>
                        </div>

                        <div className="mt-2 text-sm font-bold text-neutral-900 font-mono">
                          ${Number(item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 gap-2">
                      <div className="flex-1">
                        {isSold ? (
                          <button
                            onClick={() => onReactivateProduct(item)}
                            className="w-full py-2 px-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
                            <span>Reactivar Prenda</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onMarkAsSold(item)}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[38px]"
                            title="Marcar como vendido y liberar espacio en Firebase"
                          >
                            <Check className="w-4 h-4 shrink-0" />
                            <span>Marcar Vendido</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditProductInGestion(item)}
                          className="p-2 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          title="Editar en Gestión"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(item)}
                          className="p-2 border border-neutral-300 hover:border-red-600 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* VISTA ESCRITORIO (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[10px] uppercase tracking-wider text-neutral-600 font-semibold select-none">
                    <th className="py-3 px-4">Prenda</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Talla / Color</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredProducts.map((item) => {
                    const isSold = item.status === 'sold';
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-neutral-50/50 transition-colors ${isSold ? 'bg-neutral-50/40 text-neutral-400' : 'text-neutral-800'}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-12 bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                              <img
                                src={item.image || "https://placehold.co/80x100?text=Prenda"}
                                alt={item.name}
                                className={`w-full h-full object-cover object-top ${isSold ? 'opacity-50 grayscale' : ''}`}
                              />
                            </div>
                            <span className={`font-semibold uppercase tracking-tight truncate max-w-xs ${isSold ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
                              {item.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 uppercase text-[11px] font-medium text-neutral-600">
                          {item.categoryLabel || item.category}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 bg-black text-white text-[10px] font-semibold">
                              {item.size || item.sizes?.[0] || 'M'}
                            </span>
                            <span className="text-neutral-600 text-[11px]">
                              {item.color || item.colors?.[0]?.name || 'Único'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-neutral-900 font-mono">
                          ${Number(item.price).toFixed(2)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {isSold ? (
                            <button
                              onClick={() => onReactivateProduct(item)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
                              title="Reactivar prenda en la tienda"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reactivar</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onMarkAsSold(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-xs rounded-xs"
                              title="Marcar como vendido y liberar espacio en Firebase"
                            >
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>Vendido</span>
                            </button>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onEditProductInGestion(item)}
                              className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer rounded-xs"
                              title="Editar en Gestión"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(item)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 transition-colors cursor-pointer rounded-xs"
                              title="Eliminar prenda"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
