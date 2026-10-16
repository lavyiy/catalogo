export const EmptyState = ({ message, illustration }: { message: string; illustration?: string }) => {
  return `
    <div class="empty-state text-center py-12">
      ${illustration ? `<div class="illustration">${illustration}</div>` : ''}
      <h3 class="font-semibold text-${'primary' === '#1F2937' ? '#1F2937' : '#333'} fs-24 mb-4">${message}</h3>
      <p class="text-secondary fs-14 mb-2">Inténtá buscando por otro producto o categoría.</p>
    </div>
  `;
};