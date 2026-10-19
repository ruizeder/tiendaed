import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  getDocs, 
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "products";

/**
 * Escucha en tiempo real la lista de prendas desde Firestore.
 * @param {Function} onUpdate Callback con array de productos
 * @param {Function} onError Callback si ocurre un error (ej. permisos de Firestore)
 * @returns {Function} Función para cancelar la suscripción (unsubscribe)
 */
export function subscribeToProducts(onUpdate, onError) {
  try {
    const productsRef = collection(db, COLLECTION_NAME);

    return onSnapshot(
      productsRef,
      (snapshot) => {
        const products = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })).sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          if (timeB !== timeA) return timeB - timeA;
          return String(b.id).localeCompare(String(a.id));
        });
        onUpdate(products);
      },
      (error) => {
        console.warn("Aviso Firestore (onSnapshot):", error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error("Error al suscribirse a productos:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Obtiene los productos una sola vez.
 */
export async function getProductsOnce() {
  const productsRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * Agrega una nueva prenda a Firestore.
 */
export async function addProduct(productData) {
  const productsRef = collection(db, COLLECTION_NAME);
  
  const cleanData = {
    name: productData.name?.trim() || "Prenda sin nombre",
    category: productData.category || "vestidos",
    categoryLabel: productData.categoryLabel || "Vestidos",
    price: Number(productData.price) || 0,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
    tag: productData.tag || "Pieza Única",
    tagColor: productData.tagColor || "bg-purple-600",
    rating: Number(productData.rating) || 5.0,
    reviewsCount: Number(productData.reviewsCount) || 1,
    size: productData.size || "M",
    sizes: Array.isArray(productData.sizes) && productData.sizes.length > 0 
      ? productData.sizes 
      : [productData.size || "M"],
    color: productData.color || "Único",
    colorHex: productData.colorHex || "#622A70",
    colors: [{ name: productData.color || "Único", hex: productData.colorHex || "#622A70" }],
    isUniquePiece: productData.isUniquePiece !== false,
    status: productData.status || "available", // "available" | "sold" | "reserved"
    image: productData.image?.trim() || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    hoverImage: productData.hoverImage?.trim() || productData.image?.trim() || "",
    images: Array.isArray(productData.images) && productData.images.length > 0 
      ? productData.images 
      : [productData.image?.trim()].filter(Boolean),
    description: productData.description?.trim() || "",
    details: Array.isArray(productData.details) 
      ? productData.details 
      : (productData.details || "").split("\n").map(d => d.trim()).filter(Boolean),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(productsRef, cleanData);
  return { id: docRef.id, ...cleanData };
}

/**
 * Actualiza una prenda existente en Firestore.
 */
export async function updateProduct(id, productData) {
  const productDocRef = doc(db, COLLECTION_NAME, String(id));
  
  const updateData = {
    ...productData,
    price: Number(productData.price),
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
    updatedAt: serverTimestamp()
  };

  delete updateData.id; // No guardar el id dentro del documento
  await updateDoc(productDocRef, updateData);
  return { id, ...updateData };
}

/**
 * Elimina una prenda de Firestore.
 */
export async function deleteProduct(id) {
  const productDocRef = doc(db, COLLECTION_NAME, String(id));
  await deleteDoc(productDocRef);
  return id;
}
