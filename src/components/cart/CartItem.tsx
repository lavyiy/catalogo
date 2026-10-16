export const CartItem = ({ item, removeItem }: { item: CartItem; removeItem: (productId: string) => void }) => {
  return `
    <div class="cart-item rounded-r-8 bg-white shadow-sm border-b border-gray-200 p-3 mb-2">
      <div class="flex items-center gap-3">
        <span class="font-semibold">${item.name}</span>
        <span class="fs-11 text-secondary">${item.quantity} x ${item.unit}</span>
      </div>
      <div class="flex gap-2 mt-1">
        <button class="fs-11 decrease-quantity" onclick="decreaseCartQuantity('${item.productId}')">-</button>
        <span class="fs-11">${item.quantity}</span>
        <button class="fs-11 increase-quantity" onclick="increaseCartQuantity('${item.productId}')">+</button>
      </div>
      <span class="fs-13 text-secondary">$ ${item.subtotal}</span>
      <button class="remove-item mt-2 text-red-500 fs-11" onclick="removeItem('${item.productId}')">Remover</button>
    </div>

    <script>
      window.decreaseCartQuantity = function(productId) {
        removeItem(productId);
      };

      window.increaseCartQuantity = function(productId) {
        const item = items.find((i) => i.productId === productId);
        if (item) {
          const product = products.find((p) => p.id === productId);
          const max = product ? (product.stock || 999) : 999;
          const newQty = item.quantity + 1;
          if (newQty <= max) {
            updateQuantity(productId, newQty);
          }
        }
      };
    </script>
  `;
};