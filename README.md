# Catálogo Digital con Pedidos por WhatsApp

Plantilla reutilizable para pequeños comercios locales de Argentina. Permite a los clientes ver productos, armar un carrito y enviar el pedido por WhatsApp. Incluye un panel de administración para que el dueño del comercio pueda gestionar productos, stock, precios y datos del local sin tocar código.

## 📋 Requisitos

- **Node.js** LTS (v18 o superior)
- **Cuenta gratuita** de Supabase
- **Cuenta gratuita** de GitHub
- **Cuenta gratuita** de Cloudflare Pages **o** Netlify

## 🚀 Primeros pasos

### 1. Crear el proyecto de Supabase

1. Creá una cuenta en [Supabase](https://supabase.com) y un nuevo proyecto
2. Ejecutar `schema.sql` en el editor SQL de Supabase:
   ```bash
   psql -h tu-proyecto.supabase.co -U postgres -f supabase/schema.sql
   ```
3. Ejecutar `seed.sql` para cargar datos de ejemplo:
   ```bash
   psql -h tu-proyecto.supabase-co -U postgres -f supabase/seed.sql
   ```
4. Copiar la **URL** y la **anon key** pública desde Settings > API
5. Crear un usuario dueño en Auth > Users y asignarle el `owner_id` en la tabla `stores`

### 2. Clonar y configurar el frontend

```bash
git clone <tu-repositorio>
cd catálogo-whatsapp
cp .env.example .env
```

Editar `.env` con tu URL y anon key de Supabase, y el `VITE_STORE_SLUG` de tu comercio.

### 3. Correr en local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Crear un nuevo comercio en 5 minutos

**Pasos en el panel de Supabase:**

1. **Crear usuario dueño:** En Auth > Users, agregá un nuevo usuario con email y contraseña
2. **Insertar la tienda:** Ejecutar el script SQL de ejemplo:
   ```sql
   INSERT INTO stores (slug, owner_id, name, description, whatsapp_number, phone, address, hours, theme, is_active)
   VALUES (
     'mi-ferreteria',
     (SELECT id FROM auth.users WHERE email = 'dueño@ejemplo.com'),
     'Mi Ferretería',
     'Tu ferretería de confianza',
     '5493812345678',
     '+54 9 381 234 567',
     'Av. Santa Fe 1234',
     '["08:00-19:00","08:00-19:00","08:00-19:00","09:00-18:00","09:00-18:00","10:00-14:00","08:00-14:00"]'::jsonb,
     '{"primary":"#1F2937","secondary":"#355070","accent":"#E94M6D","radius":"6px"}',
     true
   );
   ```
3. **Cargar categorías:** Insertar categorías con `INSERT INTO categories (store_id, name, sort_order) VALUES (...)`
4. **Cargar productos:** Insertar productos con `INSERT INTO products (...) VALUES (...)`

### 5. Desplegar gratis

#### Cloudflare Pages (recommended)

1. Subí el código a un repositorio GitHub
2. En Cloudflare Pages, creá un nuevo site seleccionando tu repo
3. Configurá las build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: tu versión de Node
4. Agregar variable de entorno en Settings > Environment variables:
   - `VITE_STORE_SLUG`: `tu-slug-comercio`
5. Despliegue automático activo

#### Netlify

1. Subí el código a Netlify desde GitHub
2. En Site settings > Environment variables, agregá:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STORE_SLUG`
3. Despliegue automático

### 6. "Guía de personalización en 10 minutos"

**Logo y colores:**
- Modificá el objeto `theme` en la tabla `stores` de Supabase
- `primary`: color dominante (fondo)
- `secondary`: color secundario (header, chips)
- `accent`: color de acento (botones, precios en oferta)
- `radius`: borde redondo de cards y inputs

**Horarios:**
- Editá el campo `hours` en la tabla `stores` como JSONB
- Formato: `["08:00-19:00","08:00-19:00","08:00-19:00","09:00-18:00","09:00-18:00","10:00-14:00","08:00-14:00"`
- Índices: 0=Lunes, 1=Martes, ..., 6=Domingo
- `"closed"` para cerrar todo el día

**WhatsApp:**
- Modificá `whatsapp_number` en la tabla `stores` (formato: `5491123456789` sin `+`)
- El mensaje se generará automáticamente al finalizar el pedido

### 7. Configurar workflow keep-alive

El workflow `.github/workflows/keep-alive.yml` se ejecuta cada 3 días para evitar que Supabase pausé el proyecto gratuito por inactividad. Se usa el secret `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` del repositorio.

### 8. Checklist de entrega al cliente

- [ ] Probar un pedido real (agregar productos, checkout, WhatsApp)
- [ ] Capitar al dueño en el panel de administración
- [ ] Confirmar que el dueño cambió su contraseña del panel
- [ ] Verificar que `VITE_STORE_SLUG` esté configurado correctamente
- [ ] Revisar límite de almacenamiento de Supabase (bucket `product-images`)
- [ ] Recordar al cliente que las imágenes deben comprimirse antes de subir

### 9. Nota sobre límites del plan gratuito

- **Storage:** 500MB para plan gratuito
- **Bandwidth:** 1GB/día aproximado
- **Database rows:** Sin límite práctico
- **Function calls:** Generoso para tráfico moderado
- **Pause risk:** Proyecto se pausa después de ~1 semana de inactivity

**Recomendaciones:**
- Comprimir imágenes antes de subir (máximo 800px, WebP, calidad ~0.8)
- Usar `loading="lazy"` en todas las imágenes
- Monitorear el storage en el dashboard de Supabase
- Ejecutar el workflow keep-alive (ya está configurado)

## 📁 Estrructura del proyecto

```
src/
  main.tsx, App.tsx, routes.tsx
  config/        -> env.ts, constants.ts
  lib/           -> supabase.ts, format.ts, whatsapp.ts, hours.ts, theme.ts, image.ts, search.ts
  types/         -> Store, Category, Product types
  context/       -> StoreContext, CartContext, AuthContext, ToastContext
  hooks/         -> useStore, useProducts, useCart, useDebounce, useAuth
  components/
    layout/      -> Header, MobileMenu, StickySearch, Footer, FloatingCartButton
    catalog/     -> CategoryChips, ProductGrid, ProductCard, Badge, EmptyState, ProductSkeleton
    cart/        -> CartDrawer, CartItem, CheckoutForm, OrderSuccess
    admin/       -> AdminLayout, LoginForm, ProductsTab, ProductForm, QuickEditRow, BulkPriceUpdate, CategoriesTab, StoreSettingsTab, HoursEditor, ThemeEditor
    ui/          -> Button, Input, Modal, Drawer, Toast, Spinner, ImageWithFallback, ConfirmDialog
  pages/         -> CatalogPage, AdminPage, NotFoundPage
supabase/        -> schema.sql, seed.sql
.github/workflows/ -> keep-alive.yml
.env.example, README.md
```

## 🎨 Personalización

### Colores (variable `store.theme`)

Las variables CSS se generan en runtime desde el tema de la tienda:

```css
:root {
  --color-primary: #1F2937;     /* fondos */
  --color-secondary: #355070;   /* header, chips */
  --color-accent: #E94M6D;      /* botones, ofertas */
  --color-text-primary: #FFFFFF;/* texto sobre primary */
  --color-text-secondary: #E5E7E9; /* texto sobre secondary */
  --radius: 6px;               /* borde rounded */
}
```

### Horarios por día

```json
["08:00-19:00","08:00-19:00","08:00-19:00","09:00-18:00","09:00-18:00","10:00-14:00","08:00-14:00"]
```

Índices: 0=Lunes, 1=Martes, 2=Miércoles, 3=Jueves, 4=Viernes, 5=Sábado, 6=Domingo

### Formato de precios

Moneda ARS, formato es-AR: `$ 12.500,00` o `$ 12.500`

Usado via `formatPrice(valor)` desde `src/lib/format.ts`.

## 📦 Dependencias

Permitidas (bundle liviano):
- `react`, `react-dom`, `react-router-dom`
- `@supabase/supabase-js`
- `tailwindcss`
- `lucide-react`
- `zod`
- `@fontsource-variable/inter`

## 🔒 Seguridad

- **No hay secrets en el código:** Solo se usa la URL y anon key pública de Supabase via `VITE_*`
- **Seguridad real:** Las políticas RLS en la base de datos
- **Acceso de escritura:** Solo el owner autenticado del store correspondiente
- **Bucket Storage:** Leitura pública, escritura solo del owner (`{store_id}/{archivo}`)

## 📱 Soporte móvil

- Diseño mobile-first (360px width)
- Grilla: 2 cols móviles, 3 tablet, 4 desktop
- Áreas táctiles mínimo 44px
- Contraste WCAG AA
- Cierre de modals con Escape

## �-tests

Tests unitarios con Vitest para:
- Formato de moneda `formatARS`
- Cálculo de totales del carrito
- Generación del mensaje de WhatsApp
- Cálculo de abierto/cerrado (`isStoreOpen`)
- Normalización de búsqueda (`normalizeSearchText`, `matchesSearch`)

## 🚦 Lighthouse goals

- **Performance:** 90+ ( móvil)
- **Accessibility:** 90+ ( móvil)
- **Best Practices:** 90+ ( móvil)
- **SEO:** 90+ ( móvil)