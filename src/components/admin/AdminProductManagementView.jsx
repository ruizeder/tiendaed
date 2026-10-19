import React, { useState } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Check, 
  AlertCircle, 
  Loader2, 
  Plus
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

const CATEGORY_OPTIONS = [
  { id: "pantalones", label: "Pantalones" },
  { id: "tops", label: "Tops" },
  { id: "vestidos", label: "Vestidos" },
  { id: "deportivo", label: "Deportivo" }
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "Unitalla"];

const INITIAL_FORM_STATE = {
  name: '',
  category: 'pantalones',
  price: '',
  originalPrice: '',
  size: 'M',
  color: 'Color único',
  colorHex: '#1C1917',
  tag: 'Pieza Única',
  status: 'available',
  isUniquePiece: true,
  image: '',
  hoverImage: '',
  description: '',
  details: ['100% Calidad Garantizada', 'Etiqueta original']
};

export default function AdminProductManagementView({
  onSubmitProduct
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Manejar subida de foto con compresión automática
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMessage('');
      const compressedDataUrl = await compressImage(file, { maxWidth: 900, maxHeight: 1200, quality: 0.82 });
      setImagePreview(compressedDataUrl);
      setFormData(prev => ({
        ...prev,
        image: compressedDataUrl,
        hoverImage: prev.hoverImage || compressedDataUrl
      }));
    } catch (err) {
      setErrorMessage('Error al procesar la fotografía. Intenta con otra imagen.');
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setImagePreview('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Ingresa el nombre de la prenda.');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMessage('Ingresa un precio válido.');
      return;
    }

    const finalImageUrl = imagePreview || formData.image?.trim();
    if (!finalImageUrl) {
      setErrorMessage('Sube una fotografía de la prenda.');
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryObj = CATEGORY_OPTIONS.find(c => c.id === formData.category);

      const finalProduct = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        categoryLabel: categoryObj ? categoryObj.label : 'Moda',
        image: finalImageUrl,
        hoverImage: formData.hoverImage?.trim() || finalImageUrl,
        images: [finalImageUrl, ...(formData.hoverImage ? [formData.hoverImage] : [])],
        sizes: [formData.size],
        colors: [{ name: formData.color, hex: formData.colorHex }]
      };

      await onSubmitProduct(finalProduct);
      
      setSuccessMessage('¡Prenda dada de alta exitosamente en la tienda!');
      setFormData(INITIAL_FORM_STATE);
      setImagePreview('');
      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (err) {
      setErrorMessage(err.message || 'Error al guardar la prenda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 w-full">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Gestión de Productos · Alta de Prendas
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Formulario oficial para ingresar nuevas prendas al catálogo.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetForm}
          className="px-3.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer self-start sm:self-auto"
        >
          Limpiar formulario
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-sm text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-sm text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FORMULARIO DE ALTA QUE USA TODO EL ANCHO DE LA PANTALLA */}
      <form onSubmit={handleSubmit} className="w-full bg-white border border-neutral-200 p-5 sm:p-8 space-y-6 shadow-xs">
        
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Datos para dar de alta nueva prenda
          </span>
          <span className="text-[11px] text-neutral-500 font-medium">Campos requeridos *</span>
        </div>

        {/* 1. Nombre de la prenda */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Nombre de la prenda <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej. Top satinado cuello halter"
            className="w-full px-3.5 py-2.5 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs sm:text-sm text-neutral-900 focus:outline-none transition-all"
          />
        </div>

        {/* 2. Categoría & Talla & Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs text-neutral-900 focus:outline-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Talla <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs text-neutral-900 focus:outline-none cursor-pointer"
            >
              {SIZE_OPTIONS.map((sz) => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs text-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="available">Disponible en Tienda</option>
              <option value="sold">Vendido</option>
              <option value="reserved">Apartado</option>
            </select>
          </div>
        </div>

        {/* 3. Precios & Color con Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Precio ($ MXN) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="199.00"
              className="w-full px-3.5 py-2.5 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs text-neutral-900 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Precio anterior
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              placeholder="Opcional"
              className="w-full px-3.5 py-2.5 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs text-neutral-900 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                className="w-9 h-9 rounded border border-neutral-300 cursor-pointer bg-white shrink-0 p-0.5"
                title="Elegir tono"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Ej. Negro, Color único, Rayado"
                className="w-full px-3 py-2.5 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs text-neutral-900 focus:outline-none"
              />
            </div>

            {/* Botones rápidos de color */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, color: 'Color único', colorHex: '#171717' })}
                className={`px-2.5 py-1 text-[11px] rounded-xs border transition-colors cursor-pointer whitespace-nowrap ${
                  formData.color.toLowerCase().includes('único') || formData.color.toLowerCase().includes('unico')
                    ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                Color único
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, color: 'Rayado', colorHex: '#171717' })}
                className={`px-2.5 py-1 text-[11px] rounded-xs border transition-colors cursor-pointer whitespace-nowrap ${
                  formData.color.toLowerCase().includes('rayad')
                    ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                Rayado
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, color: 'Negro', colorHex: '#171717' })}
                className={`px-2.5 py-1 text-[11px] rounded-xs border transition-colors cursor-pointer whitespace-nowrap ${
                  formData.color.toLowerCase() === 'negro'
                    ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                Negro
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, color: 'Blanco', colorHex: '#FFFFFF' })}
                className={`px-2.5 py-1 text-[11px] rounded-xs border transition-colors cursor-pointer whitespace-nowrap ${
                  formData.color.toLowerCase() === 'blanco'
                    ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                Blanco
              </button>
            </div>
          </div>
        </div>

        {/* 4. Fotografía de la prenda */}
        <div className="border border-neutral-200 rounded p-4 bg-neutral-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-800">
              Fotografía de la prenda <span className="text-red-500">*</span>
            </label>
            <div className="inline-flex rounded p-0.5 bg-neutral-200 text-[11px]">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`px-2.5 py-1 rounded-xs transition-all cursor-pointer whitespace-nowrap ${
                  imageMode === 'upload' ? 'bg-white text-neutral-900 font-medium shadow-2xs' : 'text-neutral-600'
                }`}
              >
                Subir foto
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`px-2.5 py-1 rounded-xs transition-all cursor-pointer whitespace-nowrap ${
                  imageMode === 'url' ? 'bg-white text-neutral-900 font-medium shadow-2xs' : 'text-neutral-600'
                }`}
              >
                URL web
              </button>
            </div>
          </div>

          {imageMode === 'upload' ? (
            <label className="border-2 border-dashed border-neutral-300 hover:border-black rounded-sm p-6 text-center cursor-pointer block transition-colors bg-white">
              <Upload className="w-6 h-6 mx-auto text-neutral-400 mb-1.5" />
              <span className="text-xs font-semibold text-neutral-900 block">
                Seleccionar foto desde tu computadora o teléfono
              </span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">
                Se optimiza automáticamente para cargar al instante sin costo de almacenamiento
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                placeholder="https://ejemplo.com/foto.jpg"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-neutral-300 rounded-sm text-xs focus:outline-none focus:border-black"
              />
            </div>
          )}

          {/* Vista previa de la foto */}
          {imagePreview && (
            <div className="flex items-center gap-3 pt-2">
              <div className="w-20 h-24 bg-neutral-100 rounded border border-neutral-300 overflow-hidden shrink-0">
                <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs text-neutral-600">
                <span className="font-semibold text-emerald-700 block">✓ Fotografía cargada y optimizada</span>
                <span className="text-[11px] text-neutral-400">Esta imagen se mostrará en el catálogo a los clientes</span>
              </div>
            </div>
          )}
        </div>

        {/* 5. Descripción */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Descripción de la prenda
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ej. Prenda femenina de alta calidad, tela fresca y suave, ajuste cómodo ideal para toda ocasión."
            className="w-full px-3.5 py-2.5 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs text-neutral-900 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Botón de envío que NO hace doble línea */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Guardando en tienda...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 shrink-0" />
                <span>Dar de Alta Prenda en Tienda</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
