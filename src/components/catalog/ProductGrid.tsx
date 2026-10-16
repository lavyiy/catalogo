export const ProductGrid = ({ products, store, onProductAdd }: { products: any[]; store: any; onProductAdd: (productId: string) => void }) => {
  const gridCols = window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4;

  return `
    <div class="product-grid grid grid-cols-${gridCols} gap-4">
      ${products.map((product) => ProductCard({ product, store }).join(''))}
    </div>

    <script>
      // Inicializar cards after load
      document.querySelectorAll('.product-card').forEach((card, i) => {
        card.style.transitionDelay = '${i * 0.1}s';
      });
    </script>
  `;
};