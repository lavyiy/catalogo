export const OrderSuccess = ({ onClearCart, onBack }: { onClearCart: () => void; onBack: () => void }) => {
  return `
    <div class="order-success max-w-full rounded-xl bg-white shadow-2 p-8 text-center">
      <svg width="64" height="64" class="mx-auto mb-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <h2 class="font-bold text-primary mb-3">Pedido enviado</h2>
      <p class="text-secondary mb-4">Tu pedido ha sido enviado por WhatsApp exitosamente.</p>
      <div class="mb-4">
        <button class="px-4 py-2 bg-primary text-primary-text rounded-r-8 mb-2"
                onclick="onClearCart()">
          Vaciar carrito
        </button>
        <button class="px-4 py-2 bg-secondary text-primary-text rounded-r-8 mb-2"
                onclick="onBack()">
          Volver al catálogo
        </button>
      </div>
    </div>
  `;
};