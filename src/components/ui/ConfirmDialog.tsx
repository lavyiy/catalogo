export const ConfirmDialog = ({ title, message, onConfirm, onCancel }: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return `
    <div class="fixed inset-0 bg-black opacity-50 z-20" onclick="closeConfirm()" aria-label="Confirmación">
      <div class="absolute top-1/2 left-1/2 transform translate-x-50 translate-y-50 rounded-xl bg-white shadow-2 max-w-min w-64 transform translate-x-50 translate-y-50">
        <button class="absolute top-2 right-2 rounded-xl bg-gray-200 text-gray-600 p-1" onclick="closeConfirm()" aria-label="Cancelar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="18" x2="18" y2="6"></line>
          </svg>
        </button>
        <h3 class="font-bold text-primary p-3 border-b border-primary">{title}</h3>
        <p class="p-4">{message}</p>
        <div class="p-4 border-t border-primary">
          <button class="px-4 py-2 bg-primary text-primary-text rounded-r-8" onclick="confirmAction()">Confirmar</button>
          <button class="px-4 py-2 bg-secondary text-primary-text rounded-r-8 ms-2" onclick="cancelAction()">Cancelar</button>
        </div>
      </div>
    </div>

    <script>
      function closeConfirm() {
        const confirm = document.querySelector('.fixed.inset-0.bg-black.opacity-50');
        if (confirm) {
          confirm.style.display = 'none';
        }
      }

      window.confirmAction = function() {
        closeConfirm();
        onConfirm();
      };

      window.cancelAction = function() {
        closeConfirm();
        onCancel();
      };
    </script>
  `;
};