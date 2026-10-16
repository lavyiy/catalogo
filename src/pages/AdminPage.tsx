import { useAuthContext } from '../context';
import { useStoreContext } from '../context';
import { useToastContext } from '../context';
import { useNavigate } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useState, useEffect } from 'react';

export const AdminPage = ({ storeSlug }: { storeSlug: string }) => {
  const { user, loading, login, logout, checkOwnership } = useAuthContext();
  const { store, loading: storeLoading } = useStoreContext();
  const { setToast } = useToastContext();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (store && user) {
      checkOwnership(store.slug).then((owner) => {
        setIsOwner(owner);
      });
    }
  }, [store?.slug, user?.id]);

  if (loading || !user || !store) {
    return `
      <div class="min-h-80 flex items-center justify-center">
        ${storeLoading ? 'Cargando tienda...' : 'Cargando panel de administración...'}
      </div>
    `;
  }

  if (!isOwner) {
    return `
      <div class="min-h-80 flex items-center justify-center border-2 border-red-500 rounded-xl bg-red-100 text-red-700 p-8">
        <h2 class="font-bold mb-4">Acceso Denegado</h2>
        <p class="mb-2">No tenés permisos para acceder al panel de este comercio.</p>
        <p class="text-secondary mb-4">Séééte el usuario dueño o iniciá sesión con las credenciales correctas.</p>
        <button class="px-4 py-2 bg-primary text-primary-text rounded-r-8" onclick="login()">Iniciar sesión</button>
      </div>
    `;
  }

  const { products, loading: productsLoading } = useProducts(store.slug);
  const { items: cartItems, subtotal, total } = useCart(store.slug);
  const { formattedTotal } = useCartTotal(cartItems);

  return `
    <main class="min-h-80">
      ${Header({ storeSlug })}

      <section class="py-6">
        <div class="max-width-1200px mx-auto px-4">
          <!-- Pestaña: Productos -->
          <div class="tab active" onclick="showTab('productos')">
            <h3 class="font-bold text-primary mb-3">Productos</h3>
            <p class="text-secondary fs-11">Gestioná el catálogo de tu comercio.</p>

            ${productsLoading ? `
              <ProductSkeleton count={6} />
            ` : products.length === 0 ? `
              <EmptyState message="No hay productos aún" />
            ` : `
              <ProductGrid
                products=${JSON.stringify(products)}
                store=${JSON.stringify(store)}
                onProductAdd={(id) => addItem(products.find(p => p.id === id))}
              />
            `}

            {/* Formulario rápido de producto */}
            <div class="mt-4">
              <ProductForm {{
                onSubmit: (form) => {
                  // Lógica de crear/editar producto
                  setToast('Producto guardado', 'success');
                },
                onDelete: (id) => {
                  // Lógica de eliminar producto
                  setProductoEliminado(id);
                },
              }} />
            </div>
          </div>

          <!-- Pestaña: Categorías -->
          <div class="tab" onclick="showTab('categorias')">
            <h3 class="font-bold text-primary mb-3">Categorías</h3>
            <p class="text-secondary fs-11">Organizá tus productos en categorías.</p>
            <CategoriesTab {{
              onCreate: (name) => {
                setToast('Categoría creada', 'success');
              },
              onDelete: (id) => {
                setToast('Categoría eliminada', 'error');
              },
            }} />
          </div>

          <!-- Pestaña: Mi local -->
          <div class="tab" onclick="showTab('local')">
            <h3 class="font-bold text-primary mb-3">Mi local</h3>
            <p class="text-secondary fs-11">Editá los datos de tu comercio.</p>
            <StoreSettingsTab {{
              store,
              onUpdate: (data) => {
                setToast('Datos actualizados', 'success');
              },
            }} />
          </div>

          <!-- Pestaña: Bulk Price Update -->
          <div class="tab">
            <h3 class="font-bold text-primary mb-3">Actualización masiva de precios</h3>
            <p class="text-secondary fs-11">Aumentá o disminuí precios por porcentaje.</p>
            <BulkPriceUpdate {{
              store,
              onUpdate: (data) => {
                setToast('Precios actualizados', 'success');
              },
            }} />
          </div>
        </div>
      </section>
    </main>

    <script>
      function showTab(tabName) {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach((tab) => {
          tab.classList = tab.dataset.tab === tabName ? 'active' : '';
        }
        );
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach((content) => {
          content.style.display = tabName === content.dataset.tab ? 'block' : 'none';
        });
      }

      // Inicializar tabs
      document.addEventListener('DOMContentLoaded', () => {
        const firstTab = document.querySelector('.tab');
        if (firstTab) firstTab.dataset.tab = 'productos';
        if (firstTab) firstTab.classList = 'active';
      });
    </script>
  `;
};