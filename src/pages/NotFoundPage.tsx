export const NotFoundPage = () => {
  return `
    <div class="not-found max-w-full rounded-xl bg-white shadow-2 p-8 text-center">
      <svg width="80" height="80" class="mx-auto mb-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
        <line x1="12" y1="8" x2="12" y2="16"></line>
      </svg>
      <h2 class="font-bold text-primary fs-32 mb-4">Local no encontrado</h2>
      <p class="text-secondary mb-4">El comercio con ese slug no existe o está inactivo.</p>
      <div>
        <button class="px-4 py-2 bg-primary text-primary-text rounded-r-8 mb-2"
                onclick="goBack()">
          Volver al inicio
        </button>
      </div>
    </div>

    <script>
      function goBack() {
        history.back();
      }
    </script>
  `;
};