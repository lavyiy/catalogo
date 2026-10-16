import { compressAndResizeImage, createImagePlaceholder } from '../../lib/image';

export const ImageWithFallback = ({ imageUrl, productName, productInitials, className }: {
  imageUrl: string | null;
  productName: string;
  productInitials?: string;
  className?: string;
}) => {
  const initials = productInitials || productName.split(' ').map(w => w[0]).join('') || '•';

  return `
    <div class="${className || 'relative w-full h-32 bg-gray-200 flex items-center justify-center rounded-r-8'}">
      ${imageUrl ? `
        <img src="${imageUrl}" 
             alt="${productName}"
             class="absolute inset-0 w-full h-full object-contain"
             loading="lazy"
             width="${imageUrl.length > 50 ? 400 : 200}"
             height="${imageUrl.length > 50 ? 400 : 200}"
             onerror="this.onerror=null; this.style.display='none'; showPlaceholder()"
        />
        <div class="absolute inset-0 rounded-r-8 flex items-center justify-center w-full h-full text-gray-500">${initials}</div>
      ` : `
        ${createImagePlaceholder(productName, initials)}
      `}
    </div>

    <script>
      function showPlaceholder() {
        const img = event.target;
        img.style.display = 'none';
        const placeholder = img.parentNode.querySelector('div');
        if (placeholder) {
          placeholder.style.display = 'flex';
        }
      }
    </script>
  `;
};