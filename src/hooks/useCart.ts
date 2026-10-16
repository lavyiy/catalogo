import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
}

export const useCart = (slug: string): CartState => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(`cart-${slug}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(`cart-${slug}`, JSON.stringify(items));
  }, [items, slug]);

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const addItem = (product: any, quantity: number = 1) => {
    const existingIndex = items.findIndex((item) => item.productId === product.id);
    if (existingIndex >= 0) {
      const newQuantity = items[existingIndex].quantity + quantity;
      const newSubtotal = newQuantity * product.price;
      setItems([
        ...items.slice(0, existingIndex),
        { ...items[existingIndex], quantity: newQuantity, subtotal: newSubtotal },
        ...items.slice(existingIndex + 1),
      ]);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        unit: product.unit || 'unidad',
        price: product.price,
        quantity,
        subtotal: quantity * product.price,
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(
      items.map((item) =>
        item.productId === productId
          ? { ...item, quantity, subtotal: quantity * item.price }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return { items, addItem, removeItem, updateQuantity, clearCart, subtotal, total };
};

export const useCartTotal = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { formattedSubtotal: '$ ' + subtotal, formattedTotal: '$ ' + total };
};

export const useProductFilters = (products: any[], searchTerm: string, categoryFilter: string | null) => {
  return products.filter((product) => {
    const matchesSearchTerm = searchTerm ? matchesSearch(product.name || '', searchTerm) : true;
    const matchesCategory = !categoryFilter || product.category_id === categoryFilter || categoryFilter === 'todos';
    return matchesSearchTerm && matchesCategory;
  });
};

export const useStockStatus = (stock: number | null) => {
  if (stock === null) return { status: 'sin control', label: 'Sin control' };
  if (stock === 0) return { status: 'agotado', label: 'Agotado', disabled: true };
  if (stock <= 3) return { status: ' pocas', label: `Últimas unidades (${stock})` };
  return { status: 'disponible', label: 'Disponible' };
};