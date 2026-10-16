import { useState, useEffect, useCallback } from 'react';
import { env } from '../config/env';
import { supabase } from '../lib/supabase';
import { useStoreContext } from '../context';
import { useToastContext } from '../context';
import { formatARS, formatPrice, formatStock, formatOfferPrice } from '../lib/format';
import { isStoreOpen, getStoreStatusMessage } from '../lib/hours';
import { generateWhatsAppMessage, generateWhatsAppUrl, validateWhatsAppUrlLength } from '../lib/whatsapp';
import { normalizeSearchText, matchesSearch } from '../lib/search';
import type { Store, Product, CartItem } from '../types';

export const useStore = (slug?: string) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setToast } = useToastContext();

  useEffect(() => {
    const loadStore = async () => {
      if (!slug) {
        setError('Slug de tienda requerido');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('store_details')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          setError(error.message || 'Error al cargar la tienda');
          setLoading(false);
          return;
        }

        setStore(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Error inesperado');
        setLoading(false);
      }
    };

    loadStore();
  }, [slug, setToast]);

  const fetchStore = useCallback(async (s: string) => {
    setLoading(true);
    setError(null);
    setStore(null);
    // Re-render with new slug
    // This will be handled by the parent component re-providing the context
  }, []);

  return { store, loading, error, fetchStore };
};

export const useProducts = (storeSlug?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setToast } = useToastContext();

  useEffect(() => {
    const loadProducts = async () => {
      if (!storeSlug) {
        setError('Slug de tienda requerido');
        setLoading(false);
        return;
      }

      try {
        const { data, error: supaError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeSlug)
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('name', { ascending: true });

        if (supaError) {
          setError(supaError.message || 'Error al cargar productos');
          setLoading(false);
          return;
        }

        setProducts(data || []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Error inesperado');
        setLoading(false);
      }
    };

    loadProducts();
  }, [storeSlug, setToast]);

  return { products, loading, error };
};

export const useCart = (slug: string) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(`cart-${slug}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToast } = useToastContext();

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0); // delivery fee added at checkout

  useEffect(() => {
    localStorage.setItem(`cart-${slug}`, JSON.stringify(items));
  }, [items, slug]);

  const addItem = (product: Product, quantity: number = 1) => {
    try {
      // Verificar stock
      if (product.stock !== null) {
        const currentQuantity = items.find((item) => item.productId === product.id).quantity;
        const availableStock = product.stock - (items.filter((i) => i.productId === product.id).reduce((sum, i) => sum + i.quantity, 0));
        if (availableStock <= 0) {
          setToast('Producto aggotado', 'error');
          return;
        }
        if (currentQuantity + quantity > product.stock) {
          setToast(`Máximo ${product.stock} unidades disponibles`, 'error');
          return;
        }
      }

      const existingIndex = items.findIndex((item) => item.productId === product.id);
      const productPrice = product.offer_price !== null ? product.offer_price : product.price;

      if (existingIndex >= 0) {
        const newQuantity = items[existingIndex].quantity + quantity;
        const newSubtotal = newQuantity * productPrice;
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
          price: productPrice,
          quantity,
          subtotal: quantity * productPrice,
        };
        setItems([...items, newItem]);
      }

      setToast(`Added ${product.name} to cart`, 'success');
    } catch (err: any) {
      setToast(err.message || 'Error al agregar al carrito', 'error');
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item.productId !== productId));
    setToast('Producto removido del carrito', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Verificar stock
    if (product.stock !== null) {
      const currentItem = items.find((i) => i.productId === productId);
      if (currentItem && currentItem.quantity > quantity) {
        // Reducir stock usado
        const newSubtotal = quantity * product.offer_price !== null ? product.offer_price : product.price;
        setItems(
          items.map((item) =>
            item.productId === productId
              ? { ...item, quantity, subtotal: newSubtotal }
              : item
          )
        );
      }
    } else {
      setItems(
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity, subtotal: quantity * (product.offer_price !== null ? product.offer_price : product.price) }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
    setToast('Carrito vaciado', 'info');
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    loading,
    error,
  };
};

export const useDebounce = (value: string, delay: number = 150) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export const useAuth = () => {
  const [user, setUser] = useState({
    id: '',
    email: '',
    userMetadata: {},
  } | null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setToast } = useToastContext();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message || 'Error de sesión');
          setLoading(false);
          return;
        }

        const { session } = data;

        if (session?.user?.app_meta?.role === 'owner') {
          setUser({
            id: session.user.id,
            email: session.user.email,
            userMetadata: { role: 'owner' },
          });
        } else if (session?.user?.app_meta?.role === 'authenticated') {
          setUser({
            id: session.user.id,
            email: session.user.email,
            userMetadata: { role: 'admin' },
          });
        } else {
          setUser(null);
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Error al verificar sesión');
        setLoading(false);
      }
    };

    checkSession();

    // Escucha cambios de auth
    const { onAuthStateChange } = supabase.auth;
    const unsubscribe = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      if (session?.user?.app_meta?.role) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          userMetadata: { role: session.user.app_meta.role },
        });
      }
    });

    return () => unsubscribe();
  }, [setToast]);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message || 'Email o contraseña incorrectos');
        setLoading(false);
        return false;
      }

      // Verificar que sea dueño del comercio
      const storeSlug = import.meta.env.VITE_STORE_SLUG || 'ferreteria-del-sur';
      const isOwner = await checkOwnership(storeSlug);

      if (!isOwner) {
        setError('No tenés acceso a este comercio');
        setLoading(false);
        return false;
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error de login');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
      setLoading(false);
    }
  };

  const checkOwnership = async (storeSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('owner_id')
        .eq('slug', storeSlug)
        .single();

      if (error || !data?.owner_id) return false;

      const { data: userData } = await supabase.auth.getUser();
      return userData?.user?.id === data.owner_id;
    } catch {
      return false;
    }
  };

  return { user, loading, error, login, logout, checkOwnership };
};