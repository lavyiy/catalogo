-- ============================================================
-- Supabase Schema para Catálogo Digital con Pedidos por WhatsApp
-- Compatible con plan gratuito de Supabase
-- ============================================================

-- Extensión UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tabla: stores
-- ============================================================
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL CHECK (slug ~*^[a-z0-9-]+$),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  whatsapp_number TEXT NOT NULL CHECK (whatsapp_number ~*'^549\d{9,15}$'),
  phone TEXT,
  address TEXT,
  maps_url TEXT,
  instagram TEXT,
  hours JSONB DEFAULT '["00:00-23:59"]'::jsonb,
  accepts_delivery BOOLEAN DEFAULT false,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  min_order NUMERIC(10,2) DEFAULT 0,
  accepts_pickup BOOLEAN DEFAULT true,
  payment_methods TEXT[] DEFAULT '{}',
  theme JSONB DEFAULT '{"primary":"#0066FF","secondary":"#FF6B6B","accent":"#FFD93D","radius":"8px"}'::jsonb,
  welcome_message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::now, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::now, now())
);

-- Índice para búsquedas por slug
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slc);

-- Índice para búsquedas activas
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active);

-- ============================================================
-- Tabla: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::now, now())
);

-- Índice para categorías por store
CREATE INDEX IF NOT EXISTS idx_categories_store_id ON categories(store_id, sort_order);

-- ============================================================
-- Tabla: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  offer_price NUMERIC(12,2) CHECK (offer_price > 0 AND offer_price < price),
  stock INTEGER CHECK (stock >= 0),
  unit TEXT DEFAULT 'unidad',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::now, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::now, now())
);

-- Índice para productos por store y active
CREATE INDEX IF NOT EXISTS idx_products_store_active ON products(store_id, is_active, sort_order);

-- Índice para productos por category
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id, is_active);

-- ============================================================
-- Trigger: updated_at automático para stores
-- ============================================================
CREATE OR REPLACE FUNCTION update_stores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::now, now());
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trg_stores_updated_at
BEFORE UPDATE ON stores
FOR EACH ROW
EXECUTE FUNCTION update_stores_updated_at();

-- ============================================================
-- Trigger: updated_at automático para products
-- ============================================================
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::now, now());
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_products_updated_at();

-- ==========================================================--
-- POLÍCIES RLS (Row Level Security) - Todas las tablas
-- ==========================================================--

-- ===== stores =====
ALTER TABLE stores SET ROW LEVEL SECURITY ON;

-- Lectura pública: solo stores activos
CREATE POLICY policies_stores_read_public ON stores
FOR SELECT USING (is_active = true);

-- Escritura: solo el owner autenticado del store
CREATE POLICY policies_stores_write_owner ON stores
FOR ALL USING (
  auth.role() = 'authenticated' AND
  owner_id = auth.uid()
);

-- ===== categories =====
ALTER TABLE categories SET ROW LEVEL SECURITY ON;

-- Lectura pública: categorías de stores activos
CREATE POLICY policies_categories_read_public ON categories
FOR SELECT USING (
  auth.role() = 'public' AND
  EXISTS (
    SELECT 1 FROM stores WHERE stores.id = categories.store_id AND stores.is_active = true
  )
);

-- Escritura: solo owner del store
CREATE POLICY policies_categories_write_owner ON categories
FOR ALL USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM stores WHERE stores.id = categories.store_id AND stores.owner_id = auth.uid()
  )
);

-- ===== products =====
ALTER TABLE products SET ROW LEVEL SECURITY ON;

-- Lectura pública: productos is_active = true de stores activos
CREATE POLICY policies_products_read_public ON products
FOR SELECT USING (
  is_active = true AND
  EXISTS (
    SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.is_active = true
  )
);

-- Escritura: solo owner del store
CREATE POLICY policies_products_write_owner ON products
FOR ALL USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid()
  )
);

-- ==========================================================--
-- Buckets de Storage: product-images
-- ==========================================================--

-- Crear bucket público product-images si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'product-images'
  ) THEN
    INSERT INTO storage.buckets (name, public) VALUES ('product-images', true);
  END IF;
END$$;

-- Política: lectura pública de images
CREATE POLICY storage_product_images_read_public ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Política: escritura solo del owner (ruta {store_id}/{file})
CREATE POLICY storage_product_images_write_owner ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated' AND
  (storage.save_path LIKE (SELECT slug || '/' FROM stores) OR auth.uid() IN (
    SELECT owner_id FROM stores WHERE stores.id = split_part(split_part(save_path, '/', 1), '/', 1)
  ))
);

-- Política: actualización solo del owner
CREATE POLICY storage_product_images_update_owner ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated' AND
  (storage.save_path LIKE (SELECT slug || '/' FROM stores) OR auth.uid() IN (
    SELECT owner_id FROM stores WHERE stores.id = split_part(split_part(save_path, '/', 1), '/', 1)
  ))
);

-- Política: eliminación solo del owner
CREATE POLICY storage_product_images_delete_owner ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated' AND
  (storage.save_path LIKE (SELECT slug || '/' FROM stores) OR auth.uid() IN (
    SELECT owner_id FROM stores WHERE stores.id = split_part(split_part(save_path, '/', 1), '/', 1)
  ))
);

-- ==========================================================--
-- Vista: tienda completa con datos básicos para el cliente
-- ============================================================
CREATE OR REPLACE VIEW store_details AS
SELECT
  s.id,
  s.slug,
  s.name,
  s.description,
  s.logo_url,
  s.whatsapp_number,
  s.phone,
  s.address,
  s.maps_url,
  s.instagram,
  s.accepts_delivery,
  s.delivery_fee,
  s.min_order,
  s.accepts_pickup,
  s.payment_methods,
  s.theme,
  s.welcome_message,
  s.is_active,
  s.created_at,
  (
    SELECT jsonb_agg(jsonb_build_object(
      'id', c.id,
      'name', c.name,
      'sort_order', c.sort_order
    )) FROM categories c WHERE c.store_id = s.id AND c.store_id = s.id
  ) AS categories,
  (
    SELECT jsonb_agg(jsonb_build_object(
      'id', p.id,
      'name', p.name,
      'description', p.description,
      'price', p.price,
      'offer_price', p.offer_price,
      'stock', p.stock,
      'unit', p.unit,
      'image_url', p.image_url,
      'is_active', p.is_active,
      'sort_order', p.sort_order
    )) FROM products p WHERE p.store_id = s.id AND p.is_active = true ORDER BY p.sort_order, p.name
  ) AS active_products
FROM stores s;

-- ==========================================================--
-- Fin del schema.sql
-- ============================================================