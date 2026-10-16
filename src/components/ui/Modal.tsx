export const Modal = ({ isOpen, onClose, children, title }: {
  isOpen: boolean;
  onClose: () => void;
  children: string;
  title: string;
}) => {
  return `
    <div class="fixed inset-0 bg-black opacity-50 z-20" onclick="closeModal()" aria-label="Cerrar modal">
      <div class="absolute top-1/2 left-1/2 transform translate-x-50 translate-y-50 rounded-xl bg-white shadow-2 max-w-min w-80 max-h-80 overflow-auto transform translate-x-50 translate-y-50 ${isOpen ? 'visible' : 'hidden'}"
           role="dialog"
           aria-modal="true">
        <button class="absolute top-2 right-2 rounded-xl bg-gray-200 text-gray-600 p-1" onclick="closeModal()" aria-label="Cerrar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="18" x2="18" y2="6"></line>
          </svg>
        </button>
        <h3 class="font-bold text-primary p-3 border-b border-primary">{title}</h3>
        <div class="p-4">{children}</div>
      </div>
    </div>

    <script>
      function closeModal() {
        const modal = document.querySelector('.fixed.inset-0.bg-black.opacity-50');
        if (modal) {
          modal.style.display = 'none';
        }
      }

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      });
    </script>
  `;
};