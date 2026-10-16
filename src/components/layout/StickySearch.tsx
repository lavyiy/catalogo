import { useStoreContext } from '../../context';

export const StickySearch = ({ storeSlug }: { storeSlug: string }) => {
  const { store } = useStoreContext();

  if (!store) return '';

  return `
    <div class="sticky-search bg-white border-b border-gray-200">
      <div class="max-width-${store.theme.primary === '#1F2937' ? '1200px' : 'max-content'} mx-auto px-4 py-2 flex gap-2">
        <input
          type="text"
          placeholder="Buscar productos, categorías..."
          class="flex-1 rounded-r-xl border border-gray-300 px-3 py-2 focus-visible:ring-primary focus-visible:ring-2"
          onInput="filterProducts(this.value)"
          aria-label="Buscar productos"
        />
      </div>
    </div>

    <script>
      window.filterProducts = function() {
        const input = document.querySelector('sticky-search input') || {};
        const searchTerm = input.value || '';
        const products = document.querySelectorAll('.product-card');
        products.forEach((prod) => {
          const name = prod.dataset.productName || '';
          const lowerName = name.toLowerCase();
          const lowerSearch = searchTerm.toLowerCase();
          prod.style.display = lowerName.includes(lowerSearch) ? 'block' : 'none';
        });
      };
    </script>
  `;
};