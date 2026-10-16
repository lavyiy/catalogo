import { createRoot } from 'react-dom/client';
import App from './App';
import { StoreProvider } from './context';
import { CartProvider } from './context';
import { AuthProvider } from './context';
import { ToastProvider } from './context';
import { supabase } from './lib/supabase';
import { env } from './config/env';

try {
  const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_STORE_SLUG } = env();

  // Inicializar Supabase
  supabase.auth.signInAnonymously().catch(() => {
    // Ignore auth errors on public page
  });

  const storeSlug = VITE_STORE_SLUG || 'ferreteria-del-sur';

  // Crear root y providers
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <StoreProvider store={storeSlug}>
      <CartProvider>
        <AuthProvider>
          <ToastProvider>
            <App storeSlug={storeSlug} />
          </ToastProvider>
        </AuthProvider>
      </CartProvider>
    </StoreProvider>
  );
} catch (err: any) {
  console.error('Error initializing app:', err);
  document.getElementById('root')!.innerHTML = `
    <div class="min-h-80 flex items-center justify-center border-2 border-red-500 rounded-xl bg-red-100 text-red-700 p-8">
      <h2>Error de inicialización</h2>
      <p>Verificá tu configuración de entorno.</p>
    </div>
  `;
}