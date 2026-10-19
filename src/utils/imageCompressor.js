/**
 * Comprime y optimiza imágenes en el navegador antes de guardarlas.
 * Convierte cualquier foto (incluso fotos pesadas de 5MB-10MB tomadas con celular)
 * en una imagen JPEG liviana (~50KB - 80KB) con excelente nitidez.
 * 
 * Ventajas:
 * 1. 100% GRATIS: Se guarda directamente en Firestore sin necesidad de contratar Firebase Storage.
 * 2. Cero costos y sin pedir tarjeta de crédito.
 * 3. Carga ultra rápida en celulares y computadoras.
 */
export function compressImage(file, maxWidth = 900, maxHeight = 1200, quality = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No se proporcionó ningún archivo"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Redimensionar manteniendo proporción (aspect ratio)
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo inicializar canvas"));
          return;
        }

        // Fondo blanco limpio por si la imagen original tenía transparencias
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        // Suavizado de imagen de alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar como JPEG optimizado
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error("Error al procesar la imagen seleccionada."));
    };

    reader.onerror = () => reject(new Error("Error al leer el archivo desde el dispositivo."));
  });
}
