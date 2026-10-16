import { useCartContext } from '../../context';
import { formatARS, useCartTotal } from '../../hooks/useCart';

export const CartDrawer = ({ show }: { show: boolean }) => {
  const { items, addItem, removeItem, updateQuantity, clearCart, subtotal, total } = useCartContext();
  const { formattedSubtotal, formattedTotal } = useCartTotal(items);

  return `
    <div class="cart-drawer fixed inset-0 bg-white bottom-0 right-0 w-64 max-h-80 transform translate-x-full transition-transform shadow-2 z-20 overflow-y-auto" aria-label="Carrito de compras">
      <button class="absolute top-4 right-4 rounded-xl bg-gray-200 text-gray-600 p-2" onclick="closeCartDrawer()" aria-label="Cerrar carrito">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="18" x2="18" y2="6"></line>
        </svg>
      </button>

      <h2 class="font-bold text-primary pb-3 mb-2">Carrito</h2>

      ${items.length === 0 ? `
        <div class="p-4 text-center">
          <EmptyState message="Tu carrito está vacío" illustration="🛒">
            <a href="/" class="btn-primary mt-2">Continuar comprando</a>
          </EmptyState>
        </div>
      ` : `
        <div class="cart-items p-4">
          ${items.map((item, i) => `
            <div class="cart-item border-b border-gray-200 pb-3 mb-2">
              <div class="flex items-center gap-3">
                <span class="font-semibold">${item.name}</span>
                <span class="fs-11 text-secondary">${item.quantity} x ${item.unit}</span>
              </div>
              <div class="flex gap-2 mt-1">
                <button class="fs-11 decrease-quantity" data-product-id="${item.productId}" onclick="decreaseQuantity(this)">-</button>
                <span class="fs-11">${item.quantity}</span>
                <button class="fs-11 increase-quantity" data-product-id="${item.productId}" onclick="increaseQuantity(this)">+</button>
              </div>
              <span class="fs-13 text-secondary">$ ${item.subtotal}</span>
            </div>
          `).join('')}
        </div>

        <div class="cart-summary p-4 border-t border-primary">
          <div class="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${formattedSubtotal}</span>
          </div>
          ${items.some((item) => item.stock !== null) ? `
            <div class="flex justify-between mb-2">
              <span>Stock verificado</span>
              <span class="text-secondary">Según disponibilidad</span>
            </div>
          ` : ''}
          <div class="flex justify-between mb-3">
            <span>Total</span>
            <span>${formattedTotal}</span>
          </div>
        </div>

        <div class="cart-actions p-4 border-t border-gray-200">
          <button class="w-full px-4 py-2 bg-primary text-primary-text fs-13 rounded-r-8 mb-2"
                  onclick="proceedToCheckout()">
            Finalizar pedido
          </button>
          <button class="w-full px-4 py-2 bg-secondary text-primary-text fs-13 rounded-r-8 mb-2"
                  onclick="clearCartConfirmation()">
            Vaciar carrito
          </button>
        </div>
      `}

      <script>
        function closeCartDrawer() {
          const drawer = document.querySelector('.cart-drawer');
          if (drawer) {
            drawer.classList.toggle('open', false);
            document.body.style.overflow = 'auto';
          }
        }

        window.openCartDrawer = function() {
          const drawer = document.querySelector('.cart-drawer');
          if (drawer) {
            drawer.classList.toggle('open');
            if (drawer.classList.contains('open')) {
              document.body.style.overflow = 'hidden';
            } else {
              document.body.style.overflow = 'auto';
            }
          }
        };

        window.decreaseQuantity = function(btn) {
          const productId = btn.dataset.productId;
          const newQty = parseInt(btn.previousSibling.textContent) - 1;
          updateQuantity(productId, Math.max(0, newQty));
          btn.textContent = Math.max(0, newQty);
          btn.nextSibling.textContent = Math.max(0, newQty);
        };

        window.increaseQuantity = function(btn) {
          const productId = btn.dataset.productId;
          const product = items.find((i) => i.productId === productId);
          const max = product ? (product.stock || 999) : 999;
          const newQty = parseInt(btn.textContent) + 1;
          if (newQty <= max) {
            updateQuantity(productId, newQty);
            btn.textContent = newQty;
          }
        };

        window.proceedToCheckout = function() {
          // Abrir modal de checkout
          openCheckoutModal();
        };

        window.clearCartConfirmation = function() {
          if (confirm('¿Seguro querés vaciar el carrito?')) {
            clearCart();
            closeCartDrawer();
          }
        };
      </script>
  `;
};