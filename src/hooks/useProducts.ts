import { useState, useEffect, useCallback } from 'react';
import { formatARS, formatPrice, formatStock, formatOfferPrice } from '../lib/format';
import { isStoreOpen, getStoreStatusMessage } from '../lib/hours';
import { generateWhatsAppMessage, generateWhatsAppUrl, validateWhatsAppUrlLength } from '../lib/whatsapp';
import { normalizeSearchText, matchesSearch } from '../lib/search';
import { supabase } from '../lib/supabase';
import { useToastContext } from '../context';
import type { Store, Product, CartItem } from '../types';

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

  const formatProductPrice = (product: Product): string => {
    return formatOfferPrice(product.price, product.offer_price);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === null) return { status: 'semilla', label: 'Sin control' };
    if (product.stock === 0) return { status: 'agotado', label: 'Agotado', disabled: true };
    if (product.stock <= 3) return { status: ' pocas', label: `Últimas unidades (${product.stock})` };
    return { status: 'disponible', label: 'Disponible' };
  };

  return { products, loading, error, formatProductPrice, getStockStatus };
};