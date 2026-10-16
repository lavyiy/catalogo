-- ============================================================
-- Seed data: Ferretería "Ferretería del Sur" - 3 categorias, 12 productos
-- ============================================================

-- Insertar tienda (owner_id será el usuario que se cree en Supabase Auth)
INSERT INTO stores (slug, owner_id, name, description, logo_url, whatsapp_number, phone, address, maps_url, instagram, hours, accepts_delivery, delivery_fee, min_order, accepts_pickup, payment_methods, theme, welcome_message, is_active)
VALUES (
  'ferreteria-del-sur',
  NULL, -- Se asignará después al dueño creado
  'Ferretería del Sur',
  'Tu ferretería de confianza en el barrio',
  'https://example.com/logo-ferreteria-del-sur.png',
  '5491112345678',
  '+54 9 111 234 567',
  'Av. Corrientes 1235, C101',
  'https://maps.google.com/ferreteria-del-sur',
  '@ferreteriasursur',
  '["08:00-19:00","08:00-19:00","08:00-19:00","09:00-18:00","09:00-18:00","10:00-14:00","08:00-14:00"]'::jsonb,
  true,
  150,
  500,
  true,
  '["Efectivo","Mercado Pago","Transferencia"]',
  '{"primary":"#1F2937","secondary":"#355070","accent":"#E94M6D","radius":"6px"}',
  '¡Gracias por visitarnos! Agregá lo que necesitás y retirá en el local.',
  true
);

-- Categorías
INSERT INTO categories (store_id, name, sort_order)
SELECT id, 'Herramientas manuales', 0 FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO categories (store_id, name, sort_order)
SELECT id, 'Herramientas eléctricas', 1 FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO categories (store_id, name, sort_order)
SELECT id, 'Materiales de construcción', 2 FROM stores WHERE slug = 'ferreteria-del-sur';

-- Productos: 12 productos realistas con ofertas y stock variado
-- Categoría 1: Herramientas manuales (sort_order 0)
INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Herramientas manuales' LIMIT 1),
  'Martillo carpintero',
  'Martillo de 40cm para trabajos de carpintería',
  5000,
  4500,
  15,
  'unidad',
  NULL,
  true,
  1
FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Herramientas manuales' LIMIT 1),
  'Destruidor de clavos',
  'Destruidor de clavos profesional de acero',
  8500,
  NULL,
  8,
  'unidad',
  NULL,
  true,
  2
FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Herramientas manuales' LIMIT 1),
  'Destornillador Phillips #2',
  'Set de 3 destornilladores Phillips',
  3200,
  NULL,
  25,
  'unidad',
  NULL,
  true,
  3
FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Herramientas manuales' LIMIT 1),
  'Cinta métrica 5m',
  'Cinta métrica flexible 5 metros',
  2800,
  2500,
  3,
  'unidad',
  NULL,
  true,
  4
FROM stores WHERE slug = 'ferreteria-del-sur';

-- Categoría 2: Herramientas eléctricas (sort_order 1)
INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Herramientas eléctricas' LIMIT 1),
  'Taladro inalámbrico 12V',
  'Taladro sans cable 12V con batería incluida',
  25000,
  23000,
  2,
  'unidad',
  NULL,
  true,
  1
FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Herramientas eléctricas' LIMIT 1),
  'Lijadora orbital',
  'Lijadora orbital para superficies de madera',
  18000,
  NULL,
  1,
  'unidad',
  NULL,
  true,
  2
FROM stores WHERE slug = 'ferreteria-del-sur';

-- Categoría 3: Materiales de construcción (sort_order 2)
INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Materiales de construcción' LIMIT 1),
  'Cemento Portland 25kg',
  'Cemento Portland saco de 25 kg',
  12000,
  NULL,
  50,
  'kg',
  NULL,
  true,
  1
FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Materiales de construcción' LIMIT 1),
  'Arena lavada 25kg',
  'Arena lavada para mezclas de concreto',
  9500,
  8500,
  12,
  'kg',
  NULL,
  true,
  2
FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Materiales de construcción' LIMIT 1),
  'Tubo PVC 1/2" x 3m',
  'Tubo de PVC para instalaciones eléctricas',
  1500,
  NULL,
  20,
  'unidad',
  NULL,
  true,
  3
FROM stores WHERE slug = 'ferreteria-del-sur';

-- Productos sin stock o con stock baixo
INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Materiales de construcción' LIMIT 1),
  'Pintura esmalte blanco',
  'Litro de pintura esmalte blanco',
  4500,
  4000,
  0,
  'litro',
  NULL,
  true,
  4
FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Herramientas manuales' LIMIT 1),
  'Llave ajustable 10"',
  'Llave ajustable cromo-vanadium 10 pulgadas',
  7200,
  NULL,
  1,
  'unidad',
  NULL,
  true,
  5
FROM stores WHERE slug = 'ferreteria-del-sur';

INSERT INTO products (store_id, category_id, name, description, price, offer_price, stock, unit, image_url, is_active, sort_order)
SELECT
  id,
  (SELECT id FROM categories WHERE store_id = stores.id AND name = 'Herramientas eléctricas' LIMIT 1),
  'Motoboquita soldadora',
  'Maquina soldadora inverter 200A',
  35000,
  33000,
  0,
  'unidad',
  NULL,
  true,
  3
FROM stores WHERE slug = 'ferreteria-del-sur';

-- ==========================================================--
-- Fin del seed.sql
-- ============================================================