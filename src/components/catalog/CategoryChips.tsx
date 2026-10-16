import { useStoreContext } from '../../context';
import { useProductFilters } from '../../hooks/useProductFilters';

export const CategoryChips = ({ categories, activeCategoryId, onCategorySelect }: {
  categories: any[];
  activeCategoryId: string | null;
  onCategorySelect: (categoryId: string) => void;
}) => {
  return `
    <div class="category-chips-container overflow-x-auto pb-2">
      <button class="category-chip px-3 py-2 rounded-full ${activeCategoryId === 'todos' ? 'bg-accent text-primary-text' : 'bg-secondary text-primary-text'} fs-12"
              onclick="selectCategory('todos')">Todos ${categories.length > 0 ? `( ${categories.length} productos)` : ''}</button>
      ${categories.map((cat) => `
        <button class="category-chip px-3 py-2 rounded-full ${activeCategoryId === cat.id ? 'bg-accent text-primary-text' : 'bg-secondary text-primary-text'} fs-12`
                onclick="selectCategory('${cat.id}')">
          ${cat.name} ${cat.productCount ? `( ${cat.productCount} )` : ''}
        }
      `).join('')}
    </div>

    <script>
      window.selectCategory = function(catId) {
        onCategorySelect(catId);
      };
    </script>
  `;
};