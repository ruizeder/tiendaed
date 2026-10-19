import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./config";

export const DEFAULT_STORE_SETTINGS = {
  storeName: 'RAYED',
  city: 'Chilapa de Álvarez, Gro.',
  deliveryPoints: 'Puntos céntricos y seguros (Centro, Zócalo o punto acordado)',
  whatsappNumber: '527561319459',
  logoUrl: '/usar/rayed.png',
  soldCount: 1, // Contador acumulado histórico de prendas vendidas
  bannerSlides: [
    {
      id: 1,
      tag: "CALIDAD GARANTIZADA",
      title: "ROPA 100% NUEVA Y ETIQUETADA",
      description: "Prendas seleccionadas de moda femenina con empaque original y etiquetas intactas.",
      image: "/usar/banner/etiqueta.jpg",
      alt: "Ropa 100% Nueva y Etiquetada"
    },
    {
      id: 2,
      tag: "ENTREGA LOCAL",
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
      alt: "Pago seguro al recibir tu prenda"
    },
    {
      id: 4,
      tag: "ATENCIÓN DIRECTA",
      title: "PIDE FÁCIL POR WHATSAPP",
      description: "Estrena nuevas prendas y tendencias cada semana. Arma tu pedido al instante.",
      image: "/usar/banner/whatsapp.jpg",
      alt: "Atención personalizada por WhatsApp"
    }
  ]
};

const SETTINGS_DOC_ID = "store_config";
const SETTINGS_COLLECTION = "settings";
const LOCAL_STORAGE_KEY = "rayed_store_settings_cache";

/**
 * Obtener configuración guardada localmente como fallback inmediato
 */
export function getCachedStoreSettings() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_STORE_SETTINGS;
}

/**
 * Escuchar cambios en la configuración de la tienda en tiempo real
 */
export function subscribeToStoreSettings(onUpdate, onError) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = { ...DEFAULT_STORE_SETTINGS, ...docSnap.data() };
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          } catch {}
          onUpdate(data);
        } else {
          onUpdate(getCachedStoreSettings());
        }
      },
      (error) => {
        console.warn("Aviso Firestore (settings snapshot):", error.message);
        onUpdate(getCachedStoreSettings());
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn("Error subscribing to store settings:", err);
    onUpdate(getCachedStoreSettings());
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Actualizar configuración de la tienda en Firestore
 */
export async function updateStoreSettings(newSettings) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const merged = {
      ...DEFAULT_STORE_SETTINGS,
      ...getCachedStoreSettings(),
      ...newSettings,
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(docRef, merged, { merge: true });
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    } catch {}
    
    return merged;
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings));
    } catch {}
    throw error;
  }
}

/**
 * Incrementar contador histórico de vendidas y sincronizar con Firestore
 */
export async function incrementSoldCount() {
  try {
    const current = getCachedStoreSettings();
    const newCount = (Number(current.soldCount) || 0) + 1;
    await updateStoreSettings({ soldCount: newCount });
    return newCount;
  } catch (err) {
    console.error("Error al incrementar contador de ventas:", err);
    return 1;
  }
}
