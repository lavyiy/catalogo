export const compressAndResizeImage = async (
  file: File,
  maxDimension: number = 800,
  quality: number = 0.8
): Promise<{ compressedFile: File; url: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader(file);

    reader.onload = (e) => {
      img.src = e.target!.result;

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto 2D'));
          return;
        }

        // Draw image with background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to WebP
        const compressedFile = new File(
          [canvas.toDataURL('image/webp', quality)],
          `producto-${Date.now()}.webp`,
          { type: 'image/webp' }
        );

        // Convert data URL to Blob
        const blob = new Blob([compressedFile], { type: 'image/webp' });

        // Create File object
        const finalFile = new File([blob], `producto-${Date.now()}.webp`, {
          type: 'image/webp',
        });

        const url = URL.createObjectURL(finalFile);

        resolve({ compressedFile: finalFile, url });
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen'));
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
};

export const createImagePlaceholder = (productName: string, productInitials: string): string => {
  return `
    <div class="relative w-full h-32 bg-gray-200 flex items-center justify-center rounded-r-8">
      <span class="text-gray-500 font-medium">${productInitials || '•'}</span>
    </div>
  `;
};