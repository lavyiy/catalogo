import { useStoreContext } from '../../context';
import { useAuthContext } from '../../context';
import { useToastContext } from '../../context';
import { Link } from 'react-router-dom';

export const MobileMenu = ({ storeSlug }: { storeSlug: string }) => {
  const { store, loading } = useStoreContext();
  const { user } = useAuthContext();
  const { setToast } = useToastContext();

  if (loading || !store) {
    return `<div class="h-64 bg-primary text-center py-8">Cargando...</div>`;
  }

  const isOwner = user?.userMetadata?.role === 'owner';

  return `
    <div class="mobile-drawer fixed inset-0 bg-${store.theme.primary} top-0 w-64 max-h-100 transform translate-x-64 transition-transform shadow-2 z-10"
         aria-label="Menú lateral">
      <button class="absolute top-4 right-4 rounded-xl bg-primary text-primary-text p-2" 
              onclick="toggleMobileMenu()"
              aria-label="Cerrar menú">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="18" x2="18" y2="6"></line>
        </svg>
      </button>

      <!-- Datos del local -->
      <div class="p-4 border-b border-gray-200">
        <h3 class="font-bold text-${store.theme.secondary} mb-2">${store.name}</h3>
        <p class="text-${store.theme.secondary} fs-13 mb-1">${store.address || 'Dirección no disponible'}</p>
        <p class="text-${store.theme.secondary} fs-11 mb-1">${store.phone || 'Teléfono no disponible'}</p>
        <a href="mailto:${store.instagram ? '' : ''}" class="text-${store.theme.secondary} fs-11 underline mb-1"
           ${store.instagram ? `href="https://${store.instagram}"` : ''} aria-label="Instagram">
          ${store.instagram || 'Sin Instagram'}
        </a>
      </div>

      <!-- Horarios -->
      <div class="p-4 mb-4">
        <h4 class="font-semibold text-${store.theme.secondary} mb-2">Horarios</h4>
        <ul class="space-y-2 text-${store.theme.secondary} fs-11">
          <li>Lun-Vie: ${store.hours['08:00-19:00'] || '08:00-19:00'}</li>
          <li>Mar-Vie: ${store.hours['08:00-19:00'] || '08:00-19:00'}</li>
          <li>Mi-Jue: ${store.hours['08:00-19:00'] || '08:00-19:00'}</li>
          <li>Jue-Vie: ${store.hours['09:00-18:00'] || '09:00-18:00'}</li>
          <li>Vi-Sab: ${store.hours['10:00-14:00'] || '10:00-14:00'}</li>
          <li>Dom: Cerrado</li>
        </ul>
      </div>

      <!-- Categorías (chips con scroll horizontal) -->
      <div class="p-4 overflow-x-auto">
        <h4 class="font-semibold text-${store.theme.secondary} mb-2">Categorías</h4>
        <div class="flex gap-2 overflow-scroll py-2" style="scroll-behavior: smooth;">
          <button class="category-chip px-3 py-2 rounded-full bg-secondary text-primary-text fs-12"
                  onclick="filterByCategory('todos')">Todos</button>
          ${store.categories?.map((cat: any) => `
            <button class="category-chip px-3 py-2 rounded-full ${cat.name === 'Herramientas manuales' ? 'bg-accent' : 'bg-secondary'} text-primary-text fs-12"
                    onclick="filterByCategory('${cat.id}')">
              ${cat.name}
            }
          `).join('')}
        </div>
      </div>

      <!-- Acceso al panel admin (solo dueño) -->
      ${isOwner ? `
        <div class="p-4 mt-4 border-t border-accent">
          <h4 class="font-semibold text-accent mb-2">Panel Admin</h4>
          <button class="w-full px-4 py-2 rounded-xl bg-accent text-primary-text"
                  onclick="openAdminPanel()">
            Ir al panel de administración
          </button>
        }
      ` : ''}
    </div>

    <script>
      // Función para toggle
      function toggleMobileMenu() {
        const drawer = document.querySelector('.mobile-drawer');
        const body = document.body;
        if (drawer) {
          drawer.classList.toggle('open');
          if (drawer.classList.contains('open')) {
            body.style.overflow = 'hidden';
          } else {
            body.style.overflow = 'auto';
          }
        }
      }

      // Filtrar por categoría
      window.filterByCategory = function(catId) {
        // Navegación a la página de productos con filtro
        // Esto sería manejado por React Router
        console.filterByCategory = catId;
      };
    </script>
  `;
};