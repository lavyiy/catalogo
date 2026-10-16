export const ProductSkeleton = ({ count }: { count?: number }) => {
  const count = count || 6;
  return `
    <div class="product-grid grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-3 gap-4">
      ${Array(count).fill(1).map((_, i) => `
        <article class="product-card skeleton rounded-r-8 overflow-hidden bg-gray-100 shadow-sm" style="
          transition-delay: ${i * 0.1}s;
        ">
          <div class="relative w-full h-40 bg-gray-200 flex items-center justify-center rounded-r-8 skeleton-border"></div>
          <div class="p-3">
            <h3 class="skeleton-text fs-16 mb-1" style="height: 1.2em;"></h3>
            <p class="skeleton-text fs-12 mb-1" style="height: 1.2em;"></p>
            <div class="flex gap-1 mt-2">
              <span class="skeleton-circle w-8 h-8"></span>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
};