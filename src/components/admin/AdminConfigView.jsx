import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Save, 
  RefreshCw, 
  Loader2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { DEFAULT_STORE_SETTINGS, updateStoreSettings } from '../../firebase/storeSettingsService';

export default function AdminConfigView({
  currentSettings = DEFAULT_STORE_SETTINGS,
  onSaveSuccess
}) {
  const [formData, setFormData] = useState(currentSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState(null);

  useEffect(() => {
    if (currentSettings) {
      setFormData({
        ...DEFAULT_STORE_SETTINGS,
        ...currentSettings
      });
    }
  }, [currentSettings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSlideChange = (index, field, value) => {
    const updatedSlides = [...(formData.bannerSlides || DEFAULT_STORE_SETTINGS.bannerSlides)];
    updatedSlides[index] = {
      ...updatedSlides[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      bannerSlides: updatedSlides
    }));
  };

  // Subir imagen para un slide del banner con compresión automática
  const handleSlideImageUpload = async (index, file) => {
    if (!file) return;
    try {
      setUploadingSlideIdx(index);
      setErrorMessage('');
      const compressedDataUrl = await compressImage(file, { maxWidth: 1280, maxHeight: 900, quality: 0.82 });
      handleSlideChange(index, 'image', compressedDataUrl);
    } catch (err) {
      setErrorMessage('Error al procesar la imagen del banner.');
    } finally {
      setUploadingSlideIdx(null);
    }
  };

  // Subir nuevo logo
  const handleLogoUpload = async (file) => {
    if (!file) return;
    try {
      setErrorMessage('');
      const compressedLogo = await compressImage(file, { maxWidth: 500, maxHeight: 200, quality: 0.9 });
      handleChange('logoUrl', compressedLogo);
    } catch (err) {
      setErrorMessage('Error al procesar la imagen del logo.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      await updateStoreSettings(formData);
      setSaveSuccess(true);
      if (onSaveSuccess) onSaveSuccess('Configuración de banners y logo guardada.');
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setErrorMessage(err.message || 'Error al guardar la configuración.');
    } finally {
      setIsSaving(false);
    }
  };

  const slides = formData.bannerSlides || DEFAULT_STORE_SETTINGS.bannerSlides;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn w-full pb-12">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Configuración · Banners & Logotipo
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Personaliza las fotografías del carrusel de la portada y el logo oficial de RAYED.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[42px] disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 shrink-0" />
              <span>Guardar Configuración</span>
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-sm text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Banners y logo guardados exitosamente en la tienda!</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-sm text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECCIÓN 1: IMÁGENES DEL BANNER CARRUSEL */}
      <div className="bg-white border border-neutral-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900">
            <ImageIcon className="w-4 h-4 text-neutral-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Imágenes del Banner (Carrusel de la Portada)
            </h2>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            {slides.length} diapositivas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id || idx} 
              className="border border-neutral-200 p-3.5 bg-neutral-50/50 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                    Diapositiva #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const defaults = DEFAULT_STORE_SETTINGS.bannerSlides[idx];
                      if (defaults) {
                        handleSlideChange(idx, 'image', defaults.image);
                        handleSlideChange(idx, 'title', defaults.title);
                        handleSlideChange(idx, 'description', defaults.description);
                      }
                    }}
                    className="text-[10px] text-neutral-400 hover:text-black transition-colors cursor-pointer flex items-center gap-1"
                    title="Restaurar valores de fábrica"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Restaurar</span>
                  </button>
                </div>

                {/* Vista previa de la foto actual */}
                <div className="relative w-full h-32 bg-neutral-200 overflow-hidden border border-neutral-300 mb-3 group">
                  <img
                    src={slide.image || '/usar/banner/etiqueta.jpg'}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-[11px] font-medium">
                    {uploadingSlideIdx === idx ? 'Optimizando foto...' : 'Vista previa'}
                  </div>
                </div>

                {/* Subir nueva foto */}
                <div className="mb-3">
                  <label className="flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-white hover:bg-neutral-100 border border-neutral-300 hover:border-black rounded text-xs font-semibold text-neutral-800 transition-colors cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingSlideIdx === idx ? 'Procesando...' : 'Cambiar foto de este banner'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleSlideImageUpload(idx, e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Textos del Slide */}
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-0.5">Título</label>
                    <input
                      type="text"
                      value={slide.title || ''}
                      onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-0.5">Descripción</label>
                    <textarea
                      rows={2}
                      value={slide.description || ''}
                      onChange={(e) => handleSlideChange(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded text-xs text-neutral-900 focus:outline-none focus:border-black resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: LOGOTIPO & MARCA */}
      <div className="bg-white border border-neutral-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-3">
          <Sparkles className="w-4 h-4 text-neutral-700" />
          <h2 className="text-xs font-bold uppercase tracking-wider">
            Logotipo & Nombre Comercial
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Nombre de la tienda
            </label>
            <input
              type="text"
              value={formData.storeName || ''}
              onChange={(e) => handleChange('storeName', e.target.value)}
              placeholder="RAYED"
              className="w-full px-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs sm:text-sm text-neutral-900 focus:outline-none transition-all uppercase tracking-wider font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Logotipo oficial
            </label>
            <div className="flex items-center gap-3">
              <div className="h-10 px-3 bg-neutral-100 border border-neutral-200 rounded flex items-center justify-center shrink-0">
                <img
                  src={formData.logoUrl || '/usar/rayed.png'}
                  alt="Logo"
                  className="h-7 w-auto object-contain"
                />
              </div>

              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-neutral-100 border border-neutral-300 hover:border-black rounded text-xs font-semibold text-neutral-800 transition-colors cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Subir nuevo logo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleLogoUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[42px] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Configuración</span>
        </button>
      </div>

    </form>
  );
}
