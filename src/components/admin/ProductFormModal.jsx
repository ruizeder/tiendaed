import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, Plus, CheckCircle2, AlertCircle, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

const CATEGORY_OPTIONS = [
  { id: "pantalones", label: "Pantalones" },
  { id: "tops", label: "Tops" },
  { id: "vestidos", label: "Vestidos" },
  { id: "deportivo", label: "Deportivo" }
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "Unitalla"];

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  productToEdit = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'pantalones',
    price: '',
    originalPrice: '',
    size: 'M',
    color: 'Negro',
    colorHex: '#1C1917',
    tag: 'Pieza Única',
    status: 'available',
    isUniquePiece: true,
    image: '',
    hoverImage: '',
    description: '',
    details: ['100% Calidad Garantizada', 'Etiqueta original']
  });

  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newDetailText, setNewDetailText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset or fill form when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage('');
    setSelectedFile(null);

    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || 'vestidos',
        price: productToEdit.price || '',
        originalPrice: productToEdit.originalPrice || '',
        size: productToEdit.size || 'M',
        color: productToEdit.color || 'Negro',
        colorHex: productToEdit.colorHex || '#1C1917',
        tag: productToEdit.tag || 'Pieza Única',
        status: productToEdit.status || 'available',
        isUniquePiece: productToEdit.isUniquePiece !== false,
        image: productToEdit.image || '',
        hoverImage: productToEdit.hoverImage || '',
        description: productToEdit.description || '',
        details: Array.isArray(productToEdit.details) && productToEdit.details.length > 0
          ? [...productToEdit.details]
          : ['100% Calidad Garantizada']
      });
      setImagePreview(productToEdit.image || '');
      setImageMode(productToEdit.image ? 'url' : 'upload');
    } else {
      setFormData({
        name: '',
        category: 'pantalones',
        price: '',
        originalPrice: '',
        size: 'M',
        color: 'Negro',
        colorHex: '#1C1917',
        tag: 'Pieza Única',
        status: 'available',
        isUniquePiece: true,
        image: '',
        hoverImage: '',
        description: '',
        details: ['100% Calidad Garantizada', 'Etiqueta original']
      });
      setImagePreview('');
      setImageMode('upload');
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleAddDetail = () => {
    if (newDetailText.trim()) {
      setFormData(prev => ({
        ...prev,
        details: [...prev.details, newDetailText.trim()]
      }));
      setNewDetailText('');
    }
  };

  const handleRemoveDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Ingresa el nombre de la prenda.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMessage('Ingresa un precio válido mayor a 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      let finalImageUrl = formData.image;

      // Optimización automática de imagen (sin costo)
      if (selectedFile) {
        try {
          finalImageUrl = await compressImage(selectedFile, 900, 1200, 0.78);
        } catch (imgErr) {
          console.error('Error al optimizar imagen:', imgErr);
          throw new Error('No se pudo procesar la foto seleccionada. Intenta con otra imagen.');
        }
      }

      if (!finalImageUrl.trim()) {
        setErrorMessage('Por favor proporciona una foto o enlace para la prenda.');
        setIsSubmitting(false);
        return;
      }

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

      // Guardar con timeout de seguridad
      const submitPromise = onSubmit(finalProduct);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Tiempo de espera agotado al guardar. Revisa tu conexión e intenta de nuevo.')), 15000)
      );

      await Promise.race([submitPromise, timeoutPromise]);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Error al guardar la prenda. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white text-neutral-900 w-full max-w-xl rounded-xl border border-neutral-200 shadow-2xl my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#EDE6F2] border-b border-neutral-200/80 px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-neutral-900 tracking-tight">
              {productToEdit ? 'Editar prenda' : 'Nueva prenda'}
            </h3>
            <p className="text-[11px] text-neutral-600 mt-0.5">
              {productToEdit ? 'Modifica la información de la prenda' : 'Ingresa la información para agregarla al catálogo'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

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
              placeholder="Ej. Vestido largo satén"
              className="w-full px-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 rounded-md text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden transition-all"
            />
          </div>

          {/* 2. Categoría & Talla & Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 rounded-md text-xs sm:text-sm text-neutral-900 focus:outline-hidden transition-all cursor-pointer"
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
                className="w-full px-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 rounded-md text-xs sm:text-sm text-neutral-900 focus:outline-hidden transition-all cursor-pointer"
              >
                {SIZE_OPTIONS.map((sz) => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Disponibilidad <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 rounded-md text-xs sm:text-sm text-neutral-900 focus:outline-hidden transition-all cursor-pointer"
              >
                <option value="available">Disponible</option>
                <option value="sold">Vendido</option>
                <option value="reserved">Apartado</option>
              </select>
            </div>
          </div>

          {/* 3. Precios & Color (con etiquetas cortas que no se desbordan) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                placeholder="189.00"
                className="w-full px-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 rounded-md text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden transition-all"
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
                className="w-full px-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 rounded-md text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden transition-all"
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
                  className="w-8 h-8 rounded border border-neutral-300 cursor-pointer bg-white shrink-0 p-0.5"
                  title="Elegir tono"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Ej. Negro, Color único, Rayado"
                  className="w-full px-2.5 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 rounded-md text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden transition-all"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, color: 'Color único', colorHex: '#171717' })}
                  className={`px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer ${
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
                  className={`px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer ${
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
                  className={`px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer ${
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
                  className={`px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer ${
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
          <div className="border border-neutral-200/90 rounded-lg p-3 bg-neutral-50/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-700">
                Foto de la prenda <span className="text-red-500">*</span>
              </label>
              <div className="inline-flex rounded-md p-0.5 bg-neutral-200/70 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                    imageMode === 'upload' ? 'bg-white text-neutral-900 font-medium shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Subir foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                    imageMode === 'url' ? 'bg-white text-neutral-900 font-medium shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Enlace web</span>
                </button>
              </div>
            </div>

            {imageMode === 'upload' ? (
              <div className="flex items-center gap-3">
                <label className="flex-1 border border-dashed border-neutral-300 hover:border-neutral-900 rounded-lg p-3 cursor-pointer transition-colors bg-white hover:bg-neutral-50/80 text-center flex items-center justify-center gap-2.5">
                  <Upload className="w-4 h-4 text-neutral-500 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-neutral-800">
                      {selectedFile ? selectedFile.name : 'Seleccionar fotografía de la prenda'}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Formatos recomendados: JPG o PNG
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <div className="w-14 h-16 rounded-md border border-neutral-300 overflow-hidden shrink-0 bg-neutral-100 shadow-2xs">
                    <img src={imagePreview} alt="Previsualización" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://... enlace de la imagen"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 rounded-md text-xs text-neutral-900 focus:outline-hidden transition-all"
                />
                {imagePreview && (
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-14 rounded border border-neutral-300 overflow-hidden shrink-0 bg-neutral-100">
                      <img src={imagePreview} alt="Previsualización" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enlace detectado
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. Descripción */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Descripción corta <span className="text-[11px] text-neutral-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalla corte, tela o características..."
              className="w-full px-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 rounded-md text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden transition-all"
            />
          </div>

          {/* 6. Detalles / Viñetas */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Detalles y cuidados <span className="text-[11px] text-neutral-400 font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newDetailText}
                onChange={(e) => setNewDetailText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDetail();
                  }
                }}
                placeholder="Ej. 100% Satén, Cierre invisible..."
                className="flex-1 px-3 py-1.5 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-neutral-900 rounded-md text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={handleAddDetail}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-black text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
            {formData.details.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {formData.details.map((detail, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px] flex items-center gap-1.5 border border-neutral-200"
                  >
                    <span>{detail}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(idx)}
                      className="text-neutral-400 hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-md bg-neutral-900 hover:bg-black text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{productToEdit ? 'Guardar cambios' : 'Publicar prenda'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
