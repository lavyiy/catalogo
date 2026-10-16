import { useStoreContext } from '../context';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useProductFilters } from '../hooks/useProductFilters';
import { CategoryChips } from '../components/catalog/CategoryChips';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { FloatingCartButton } from '../components/layout/FloatingCartButton';
import { formatARS, useCartTotal } from '../hooks/useCart';

export const CatalogPage = ({ storeSlug }: { storeSlug: string }) => {
  const { store, loading } = useStoreContext();
  const { products, loading: productsLoading } = useProducts(storeSlug);
  const { items: cartItems, addItem, removeItem, updateQuantity, clearCart, subtotal, total } = useCart(storeSlug);
  const { formattedSubtotal, formattedTotal } = useCartTotal(cartItems);

  useEffect(() => {
    // Revalidar carrito cuando cambian los productos
    if (store && products.length > 0) {
      // Verificar stock y precios actualizados
      cartItems.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product && product.stock !== null) {
          const currentQty = cartItems.filter((i) => i.productId === item.productId).reduce((sum, i) => sum + i.quantity, 0);
          if (currentQty > product.stock) {
            updateQuantity(item.productId, product.stock);
          }
        }
      });
    }
  }, [store, products, cartItems, updateQuantity, setToast]);

  const { data: filteredCategories, error: categoryError } = useMemo(() => {
    // Extraer categorías únicas de products
    const categories = [...new Set(products.map((p) => p.category_id))]
      .filter(Boolean)
      .map((id) => {
        const catProducts = products.filter((p) => p.category_id === id);
        return {
          id,
          name: catProducts[0]?.category?.name || 'Sin nombre',
          productCount: catProducts.length,
        };
      });
    return { categories };
  }, [products]);

  if (loading || !store) {
    return `<div class="min-h-80 flex items-center justify-center">Cargando tienda...</div>`;
  }

  const searchTerm = useMemo(() => '', []);
  const activeCategoryId = useMemo(() => 'todos', []);

  return `
    <main class="min-h-80">
      ${Header({ storeSlug })}

      <section class="py-6">
        <div class="max-width-1200px mx-auto px-4">
          ${store.categories && store.categories.length > 0 ? `
            <div class="mb-6">
              <CategoryChips
                categories={${JSON.stringify(filteredCategories.categories)}}
                activeCategoryId="${activeCategoryId}"
                onCategorySelect={(id) => console.selectCategory(id)}
              />
            }
          ` : ''}

          ${productsLoading ? `
            <ProductSkeleton count={6} />
          ` : products.length === 0 ? `
            <EmptyState message="No encontramos productos con esa búsqueda" />
          ` : `
            <ProductGrid
              products={${JSON.stringify(products)}}
              store={store}
              onProductAdd={(id) => addItem(products.find(p => p.id === id))}
            />
          `}

          <div class="mt-6">
            <FloatingCartButton
              itemCount={cartItems.length}
              total={${formattedTotal}}
            />
          </div>
        </div>
      </section>
    </main>

    <script>
      // Inicializar cart después del load
      document.addEventListener('DOMContentLoaded', () => {
        // Event listeners para botones agregar
        document.querySelectorAll('.add-to-cart').forEach((btn) => {
          btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
            const product = products.find((p) => p.id === productId);
            if (product) {
              addItem(product, 1);
            }
          });
        });
      });
    </script>
  `;
};