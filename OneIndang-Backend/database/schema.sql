
-- =====================================================
-- 1. BUSINESSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sub VARCHAR(255),
  rating DECIMAL(2,1) DEFAULT 0,
  distance VARCHAR(50),
  image TEXT,
  location VARCHAR(255),
  tag VARCHAR(100),
  price VARCHAR(50),
  verified BOOLEAN DEFAULT false,
  is_open BOOLEAN DEFAULT true,
  phone VARCHAR(20),
  agent VARCHAR(100),
  sqft VARCHAR(50),
  beds VARCHAR(20),
  baths VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to businesses
CREATE POLICY "Anyone can view businesses" ON businesses
  FOR SELECT USING (true);

-- Only authenticated users can create businesses 
CREATE POLICY "Authenticated users can create businesses" ON businesses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update businesses
CREATE POLICY "Authenticated users can update businesses" ON businesses
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete businesses
CREATE POLICY "Authenticated users can delete businesses" ON businesses
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for faster category searches
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses(name);

-- =====================================================
-- 2. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  restaurant_name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  delivery_note TEXT,
  status VARCHAR(50) DEFAULT 'Preparing',
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Anyone can create orders (for guest checkout)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Users can update their own orders
CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create index for user order lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- =====================================================
-- 3. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  item_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view order items (tied to order access)
CREATE POLICY "Anyone can view order items" ON order_items
  FOR SELECT USING (true);

-- Anyone can create order items
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Create index for order lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =====================================================
-- 4. SEED DATA - Sample Businesses
-- =====================================================
-- Insert sample businesses matching your existing businessData.js

INSERT INTO businesses (name, category, sub, rating, distance, image, location, tag, price, verified, is_open, phone, agent)
VALUES
  -- Food businesses
  ('Jollibee Indang', 'Food', 'Fast Food • Town Plaza', 4.8, '0.2 km', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500', 'Indang Town Plaza', 'Popular', '250', true, true, '09123456789', 'Manager On Duty'),
  ('Siglo Farm Café', 'Food', 'Native Coffee • Filipino Fusion', 4.9, '1.5 km', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500', 'Brgy. Kaytapos', 'Must Try', '450', true, true, '09987654321', 'Chef Aris'),
  ('Celyns Inasal', 'Food', 'Grilled Chicken • Local Favorites', 4.6, '0.5 km', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500', 'San Gregorio St.', 'Trending', '180', false, true, '09112223333', 'Celyn S.'),
  ('Indang Town Milk Tea', 'Food', 'Refreshments • Snacks', 4.5, '0.3 km', 'https://images.unsplash.com/photo-1572715376701-98568319fd0b?w=500', 'Poblacion 1', 'Best Seller', '95', false, true, '09223334444', 'Store Lead'),
  ('Kusina ni Lolo', 'Food', 'Authentic Bulalo & Sinigang', 4.7, '2.1 km', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500', 'Brgy. Alulod', 'Top Rated', '600', true, true, '09334445555', 'Lolo Bert'),
  
  -- Agriculture businesses
  ('Indang Farm Heritage', 'Agriculture', 'Organic Vegetables & Tours', 4.9, '0.8 km', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400', 'Brgy. Mataas na Lupa', 'Popular', '500', true, true, '09123456789', 'Farmer Jun'),
  ('Silan Dragon Fruit Farm', 'Agriculture', 'Pick-and-Pay Fruit Orchard', 4.8, '3.1 km', 'https://images.unsplash.com/photo-1527333323140-79886a8969bb?w=400', 'Brgy. Tambo Munti', 'Must Try', '300', true, true, '09987654321', 'Ms. Silan'),
  ('EMV Flower Farm', 'Agriculture', 'Ornamental Flowers & Events', 4.7, '2.4 km', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400', 'Sitio Colong', 'Trending', '450', true, true, '09112223333', 'Admin Rose'),
  
  -- Education institutions
  ('Cavite State University', 'Education', 'Main Campus • Public University', 4.9, '0.5 km', 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=400', 'Indang-Mendez Rd', 'Govt Accredited', '0', true, true, '0461234567', 'Registrar Office'),
  ('Indang Central School', 'Education', 'Elementary • Public Education', 4.6, '0.3 km', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400', 'Poblacion', 'Historical', '0', false, true, '0467654321', 'Principal Office'),
  ('St. Gregory Academy', 'Education', 'Private • K-12 School', 4.7, '0.4 km', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400', 'Poblacion 2', 'Top Rated', '15000', true, true, '09112223333', 'Admissions'),
  
  -- Construction businesses
  ('Indang Mega Hardware', 'Construction', 'Steel, Cement & Power Tools', 4.8, '0.5 km', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400', 'Poblacion 4', 'Complete Stocks', '2500', true, true, '09123456789', 'Engr. Santos'),
  ('Cavite Concrete Master', 'Construction', 'Ready-mix & Aggregates', 4.7, '2.1 km', 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400', 'Brgy. Alulod', 'Contractor', '15000', true, true, '09987654321', 'Lando Cal'),
  
  -- Retail businesses
  ('Indang Town Center', 'Retail', 'Department Store & Groceries', 4.7, '0.2 km', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', 'Poblacion 1', 'One Stop Shop', '1200', true, true, '09123456789', 'Store Manager'),
  ('Fresh Market Indang', 'Retail', 'Local Produce & Meat Market', 4.6, '0.4 km', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'Poblacion 3', 'Fresh Daily', '800', true, true, '09987654321', 'Market Admin'),
  
  -- Tourism spots
  ('Indang Heritage Museum', 'Tourism', 'Historical Artifacts & Culture', 4.8, '0.3 km', 'https://images.unsplash.com/photo-1566127992631-137a41c5b5da?w=400', 'Poblacion 1', 'Cultural Hub', '50', true, true, '09123456789', 'Curator Maria'),
  ('Mt. Pico de Loro Viewpoint', 'Tourism', 'Scenic Mountain Views', 4.9, '8.5 km', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'Maragondon', 'Breathtaking', '100', true, true, '09987654321', 'Tour Guide')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. FUNCTION TO UPDATE TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONE! Your database is ready for the Express backend
-- =====================================================
