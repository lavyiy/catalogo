export const Toast = ({ message, type = 'success', duration = 3000 }: {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}) => {
  const typeClasses = {
    success: 'bg-primary text-primary-text',
    error: 'bg-red-500 text-white',
    info: 'bg-primary text-primary-text',
  };

  return `
    <div class="toast-fixed fixed bottom-4 left-1/2 transform translate-x-50 z-30 rounded-xl bg-${type}-500 text-${type}-text px-4 py-3 shadow-2 max-w-64 fs-13 animate-in fade-in-slide-in-medium">
      ${message}
    </div>

    <script>
      // Auto-remover después de duration
      setTimeout(() => {
        const toast = document.querySelector('.toast-fixed');
        if (toast) {
          toast.style.display = 'none';
          toast.remove();
        }
      }, ${duration});

      // Remover manual
      const closeBtn = document.querySelector('.toast-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const toast = document.querySelector('.toast-fixed');
          if (toast) {
            toast.style.display = 'none';
            toast.remove();
          }
        });
      }
    </script>
  `;
};