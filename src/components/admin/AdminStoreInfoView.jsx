import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Check, 
  Save, 
  AlertCircle, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';
import { DEFAULT_STORE_SETTINGS, updateStoreSettings } from '../../firebase/storeSettingsService';

const CITY_PRESETS = [
  'Chilapa de Álvarez, Gro.',
  'Cd. Altamirano, Gro.',
  'Chilpancingo, Gro.',
  'Tixtla, Gro.',
  'Iguala, Gro.'
];

export default function AdminStoreInfoView({
  currentSettings = DEFAULT_STORE_SETTINGS,
  onSaveSuccess
}) {
  const [formData, setFormData] = useState(currentSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      await updateStoreSettings(formData);
      setSaveSuccess(true);
      if (onSaveSuccess) onSaveSuccess('Información de tienda guardada.');
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setErrorMessage(err.message || 'Error al guardar la información.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn w-full pb-12">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-300">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Info Tienda · Zona de Venta & Contacto
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Configura en qué ciudad estás vendiendo, puntos acordados de entrega y el teléfono de WhatsApp.
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
              <span>Guardar Info Tienda</span>
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-sm text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Datos de la tienda guardados con éxito! Se reflejan de inmediato en la tienda de los clientes.</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-sm text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white border border-neutral-200 p-5 sm:p-6 shadow-xs space-y-5">
        
        {/* Ciudad / Ubicación */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-800">
              Ciudad o Población donde estás vendiendo <span className="text-neutral-400 font-normal">(Opcional)</span>
            </label>
            {formData.city && formData.city.trim() && (
              <button
                type="button"
                onClick={() => handleChange('city', '')}
                className="text-[11px] text-red-600 hover:underline cursor-pointer"
              >
                Quitar ubicación (Ocultar barra)
              </button>
            )}
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ej. Chilapa de Álvarez, Gro. (Deja vacío si no deseas mostrar la barra)"
              className="w-full pl-9 pr-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs sm:text-sm text-neutral-900 focus:outline-none transition-all"
            />
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            💡 No es obligatorio: si dejas este campo vacío, la barra de ubicación en la tienda no se mostrará. Si colocas una ciudad, se activará la barra blanca animada.
          </p>

          {/* Accesos rápidos de 1-clic */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            <span className="text-[10px] text-neutral-400 font-medium">Accesos rápidos:</span>
            
            <button
              type="button"
              onClick={() => handleChange('city', '')}
              className={`px-2.5 py-1 text-[11px] rounded-xs border transition-colors cursor-pointer ${
                !formData.city || !formData.city.trim()
                  ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                  : 'bg-white text-neutral-600 border-neutral-300 hover:border-black'
              }`}
            >
              ✕ Sin barra
            </button>

            {CITY_PRESETS.map((cityPreset) => (
              <button
                key={cityPreset}
                type="button"
                onClick={() => handleChange('city', cityPreset)}
                className={`px-2.5 py-1 text-[11px] rounded-xs border transition-colors cursor-pointer ${
                  formData.city === cityPreset
                    ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                }`}
              >
                {cityPreset.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Puntos de entrega */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">
            Puntos de entrega acordados
          </label>
          <input
            type="text"
            value={formData.deliveryPoints || ''}
            onChange={(e) => handleChange('deliveryPoints', e.target.value)}
            placeholder="Ej. Puntos céntricos y seguros (Centro, Zócalo o punto acordado)"
            className="w-full px-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs sm:text-sm text-neutral-900 focus:outline-none transition-all"
          />
          <span className="text-[10px] text-neutral-400 mt-1 block">
            Este texto se muestra a los compradores en el modal de cada prenda y en la información de compras.
          </span>
        </div>

        {/* Teléfono WhatsApp */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">
            Teléfono de WhatsApp para pedidos
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                required
                value={formData.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="527561319459"
                className="w-full pl-9 pr-3 py-2 bg-neutral-50/50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-sm text-xs sm:text-sm text-neutral-900 focus:outline-none font-mono"
              />
            </div>

            {formData.whatsappNumber && (
              <a
                href={`https://wa.me/${formData.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 border border-neutral-300 hover:border-black rounded-sm text-xs text-neutral-700 hover:text-black flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>Probar WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">
            Incluye el código de país (52 para México). Al hacer clic en "Pedir por WhatsApp" en el carrito, se abrirá un chat directo a este número con la lista de prendas pedidas.
          </span>
        </div>

      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[42px] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Información de Tienda</span>
        </button>
      </div>

    </form>
  );
}
