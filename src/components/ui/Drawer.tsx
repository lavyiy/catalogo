export const Drawer = ({ isOpen, onClose, children, title }: {
  isOpen: boolean;
  onClose: () => void;
  children: string;
  title: string;
}) => {
  return `
    <div class="fixed inset-0 bg-white z-10" onclick="closeDrawer()" aria-label="Drawer principal">
      <div class="rounded-xl bg-white shadow-2 max-h-100 transform translate-x-64 transition-transform ${isOpen ? 'open' : ''} ${!isOpen ? 'transform translate-x-64' : ''}"
           role="navigation"
           aria-label="Drawer lateral">
        <button class="absolute top-4 right-4 rounded-xl bg-primary text-primary-text p-2" onclick="closeDrawer()" aria-label="Cerrar menú">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="18" x2="18" y2="6"></line>
          </svg>
        </button>
        <div class="p-4 border-b border-gray-200">
          <h2 class="font-bold text-primary mb-3">{title}</h2>
          {children}
        </div>
      </div>
    </div>

    <script>
      function closeDrawer() {
        const drawer = document.querySelector('.fixed.inset-0.bg-white.z-10');
        if (drawer) {
          drawer.classList.toggle('open', false);
          drawer.style.transform = 'translate-x-64';
          document.body.style.overflow = 'auto';
        }
      }

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeDrawer();
        }
      });
    </script>
  `;
};