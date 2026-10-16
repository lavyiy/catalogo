import { formatPrice, formatOfferPrice, formatStock, useStockStatus } from '../../lib/format';
import { useStoreContext } from '../../context';

export const ProductCard = ({ product, store, isCompact }: { product: any; store: any; isCompact?: boolean }) => {
  const stockStatus = useStockStatus(product.stock);
  const priceDisplay = formatOfferPrice(product.price, product.offer_price);
  const initials = product.name.split(' ').map(w => w[0]).join('') || '•';

  return `
    <article class="product-card rounded-r-8 overflow-hidden bg-white shadow-sm transition-setup"
             data-product-name="${product.name}"
             style="border-color: ${store.theme.primary}">
      ${product.image_url ? `
        <img src="${product.image_url}" 
             alt="${product.name}" 
             class="w-full h-40 object-contain"
             loading="lazy"
             width="${product.image_url.length > 100 ? 200 : 100}"
             height="${product.image_url.length > 100 ? 200 : 100}"
             onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"40\\" height=\\"40\\" viewBox=\\"0 0 40 40\\"%3E%3Ctext x=\\"2\\" y=\\"27\\" fill=\\"#{${
               store.theme.primary === '#1F2937' ? 'fff' : '000'}\\" font-size \\"16\\" font-weight \\"bold\\" text-anchor \\"middle\\">${
               initials
           }\\"/></svg>'\"")` : `
        <div class="relative w-full h-40 bg-${store.theme.primary === '#1F2937' ? '#2C3E50' : '#E5E7E9'} flex items-center justify-center rounded-r-8">
          <span class="text-${store.theme.primary === '#1F2937' ? '#fff' : '#000'} font-medium">${initials}</span>
        </div>
      `}
      <div class="p-3">
        <h3 class="font-semibold text-${store.theme.primary} fs-16 mb-1 line-height--short">${product.name}</h3>
        <p class="text-${store.theme.secondary} fs-12 mb-1 line-height--short">${product.description || ''}</p>
        <div class="flex flex-col-reverse flex-sm-row gap-2 mb-2">
          <span class="text-${store.theme.accent} fs-13">${priceDisplay}</span>
          ${product.offer_price !== null ? `
            <span class="text-${store.theme.secondary} fs-11 line-through">$ ${product.price}</span>
          ` : ''}
        </div>
        <div class="flex gap-1">
          <span class="text-${store.theme.secondary} fs-11">${stockStatus.label}</span>
        </div>
      </div>
      ${!isCompact ? `
        <button class="w-full px-3 py-2 bg-${store.theme.primary} text-${store.theme.primary-text} fs-12 rounded-r-8 mt-2"
                onclick="addToCart('${product.id}')">
          Agregar
        }
      ` : ''}
    </article>

    <script>
      window.addToCart = function(productId) {
        // Dispatch event to cart context
        addToCartEvent = productId;
      };
    </script>
  `;
};