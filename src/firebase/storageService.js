import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

/**
 * Sube un archivo de imagen a Firebase Storage y retorna la URL pública.
 * @param {File} file Archivo seleccionado por el usuario
 * @param {string} folder Carpeta destino en Storage (ej: "prendas")
 * @returns {Promise<string>} URL de descarga de la imagen
 */
export async function uploadProductImage(file, folder = "prendas") {
  if (!file) throw new Error("No se proporcionó ningún archivo de imagen.");
  
  // Generar nombre único
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const filePath = `${folder}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, filePath);

  // Subir imagen
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg"
  });

  // Obtener URL de acceso
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
