import { useStoreContext } from '../../context';
import { useAuthContext } from '../../context';
import { useToastContext } from '../../context';
import { formatARS } from '../../lib/format';
import { isStoreOpen, getStoreStatusMessage } from '../../lib/hours';
import { useProductFilters } from '../../hooks/useProductFilters';

export const Header = ({ storeSlug }: { storeSlug: string }) => {
  const { store, loading } = useStoreContext();
  const { user, checkOwnership } = useAuthContext();
  const { setToast } = useToastContext();

  if (loading || !store) {
    return `<div class="h-20 flex items-center justify-center">Cargando...</div>`;
  }

  const status = getStoreStatusMessage(store.hours);
  const isOpen = status.isOpen;

  // Verificar ownership para mostrar opción de admin
  const isOwner = user ? user.userMetadata?.role === 'owner' : false;

  return `
    <header class="bg-${isOpen ? 'surface' : 'primary'} text-${isOwn ? 'primary-text' : 'secondary-text'} border-b border-gray-200">
      <div class="max-width-${formatARS(0)} mx-auto px-4 py-3 flex items-center justify-between flex-wrap">
        <!-- Logo e nombre del local -->
        <div class="flex items-center gap-3">
          <img src="${store.logo_url || '#'}" 
               alt="${store.name}" 
               class="w-24 h-24 rounded-r-8 object-contain"
               onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"64\\" height=\\"64\\" viewBox=\\"0 0 64 64\\"%3E%3Ctext x=\\"4\\" y=\\"35\\" fill=\\"#{${
                 isOpen ? '000' : 'fff'}\\" font-size \\"32\\" font-weight \\"bold\\" text-anchor \\"middle\\">${
                   store.name.substring(0, 2).toUpperCase()
               }\\"/></svg>'\"")
               loading="lazy"
               width="64"
               height="64">
          <span class="font-bold text-${isOpen ? 'primary' : 'secondary'} fs-28">
            ${store.name}
          </span>
        </div>

        <!-- Estado abierto/cerrado -->
        <div class="flex items-center gap-2 fs-13">
          <span class="badge ${isOpen ? 'bg-accent text-primary' : 'bg-secondary text-primary-text'}">
            ${isOpen ? 'Abierto' : 'Cerrado'}
          </span>
        </div>

        <!-- Menú hamburguesa (visible en móvil) -->
        <button class="mobile-menu-btn p-2 rounded-r-8 ${isOpen ? 'bg-accent' : 'bg-secondary'} text-primary-text"
                onclick="toggleMobileMenu()"
                aria-label="${isOpen ? 'Ver menú' : 'Ver menú'}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Acceso al panel admin (solo dueño) -->
        ${isOwner ? `
          <button class="admin-btn p-2 rounded-r-8 bg-accent text-primary-text fs-11" 
                  onclick="openAdminPanel()"
                aria-label="Panel de administración">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="6"></line>
            </svg>
          </button>
        ` : ''}
      </div>

      <!-- Barra de búsqueda sticky -->
      <div class="sticky-search bg-white border-b border-gray-200">
        <div class="max-width-${formatARS(0)} mx-auto px-4 py-2 flex gap-2">
          <input
            type="text"
            placeholder="Buscar productos..."
            class="flex-1 rounded-r-xl border border-gray-300 px-3 py-2 focus-visible:ring-primary focus-visible:ring-2"
            onDebounce="${150}"
            onInput="filterProducts(this.value)"
            aria-label="Buscar productos"
          />
        </div>
      </div>
    </header>

    <script>
      // Función para toggle del menú móvil
      function toggleMobileMenu() {
        const drawer = document.querySelector('.mobile-drawer');
        if (drawer) {
          drawer.classList.toggle('open');
        }
      }

      // Función para filtrar productos
      window.filterProducts = function(q) {
        const input = q || '';
        const products = document.querySelectorAll('.product-card');
        products.forEach((prod) => {
          const name = prod.dataset.productName || '';
          const lowerName = name.toLowerCase();
          const lowerSearch = input.toLowerCase();
          prod.style.display = lowerName.includes(lowerSearch) ? 'block' : 'none';
        });
      };
    </script>
  `;
};