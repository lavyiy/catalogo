import { createContext, ReactContext, ReactNode, useContext } from 'react';

// ============================================================
// StoreContext
// ============================================================
type StoreContextValue = {
  store: Store | null;
  loading: boolean;
  error: string | null;
  fetchStore: (slug: string) => Promise<void>;
};

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider = ({ storeSlug }: { storeSlug: string }) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Se cargará desde el parent App.tsx

  return (
    <StoreContext.Provider value={ { store, loading, error, fetchStore: () => {} } }>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = (): StoreContextValue => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};

// ============================================================
// CartContext
// ============================================================
type CartItem = {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  subtotal: number;
};

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  useEffect(() => {
    localStorage.setItem(`cart-${import.meta.env.VITE_STORE_SLUG}`, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number = 1) => {
    // Logic here
    setItems(prev => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id);
      if (existingIndex >= 0) {
        const newQuantity = prev[existingIndex].quantity + quantity;
        const newSubtotal = newQuantity * product.price;
        return [
          ...prev.slice(0, existingIndex),
          { ...prev[existingIndex], quantity: newQuantity, subtotal: newSubtotal },
          ...prev.slice(existingIndex + 1),
        ];
      } else {
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          unit: product.unit || 'unidad',
          price: product.price,
          quantity,
          subtotal: quantity * product.price,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity, subtotal: quantity * item.price }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={ {
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      subtotal,
    } }>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

// ============================================================
// AuthContext
// ============================================================
type AuthContextValue = {
  user: {
    id: string;
    email: string;
    userMetadata?: {
      role?: 'owner' | 'admin';
    };
  } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkOwnership: (storeSlug: string) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({
    id: '',
    email: '',
    userMetadata: {},
  } | null);
  const [loading, setLoading] = useState(true);

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
  }, []);

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

      const isOwner = await checkOwnership(import.meta.env.VITE_STORE_SLUG || 'ferreteria-del-sur');

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

  return (
    <AuthContext.Provider value={ { user, loading, login, logout, checkOwnership } }>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// ============================================================
// ToastContext
// ============================================================
type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
};

type ToastContextValue = {
  toasts: Toast[];
  addToast: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
  removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter((t) => t.id !== id)), duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={ { toasts, addToast, removeToast } }>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export default {
  StoreProvider,
  CartProvider,
  AuthProvider,
  ToastProvider,
};