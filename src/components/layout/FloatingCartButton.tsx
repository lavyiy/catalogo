export const FloatingCartButton = ({ itemCount, total }: { itemCount: number; total: number }) => {
  return `
    <button class="fixed bottom-4 right-4 rounded-full bg-accent shadow-2 z-20 transform translateY(0) transition-transform"
            onclick="openCartDrawer()"
            aria-label="Ver carrito (${itemCount} items, $${total})">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 2L13.73 14.17l-5.23 5.23a1.99 1.99 0 0 1-2.83 0l-1.25-1.25a1.99 1.99 0 0 1 0-2.83l5.16-5.16a1.99 1.99 0 0 1 2.83 0l1.25 1.25ZM line"></path>
        <circle cx="8" cy="8" r="2" fill="white"></circle>
        <path d="M22 2L13.73 14.17l-5.23 5.23a1.99 1.99 0 0 1-2.83 0l-1.25-1.25a1.99 1.99 0 0 1 0-2.83l5.16-5.16a1.99 1.99 0 0 1 2.83 0l1.25 1.25Z"></path>
      </svg>
      <span class="absolute top-2 right-2 rounded-99 bg-primary text-white fs-11">${itemCount}</span>
    </button>

    <script>
      function openCartDrawer() {
        const drawer = document.querySelector('.cart-drawer');
        if (drawer) {
          drawer.classList.toggle('open');
        }
      }
    </script>
  `;
};