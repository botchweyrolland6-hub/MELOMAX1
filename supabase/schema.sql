-- MeloMax Ventures Tyre Management System
-- Database Schema for Supabase PostgreSQL

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  status TEXT NOT NULL CHECK (status IN ('active', 'disabled')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TYRES TABLE
CREATE TABLE IF NOT EXISTS public.tyres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  size TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')) DEFAULT 'in_stock',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  item TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id INT PRIMARY KEY DEFAULT 1,
  company_name TEXT NOT NULL DEFAULT 'MeloMax Ventures',
  company_logo TEXT DEFAULT '/logo.png',
  contact_email TEXT DEFAULT 'info@melomaxventures.com',
  contact_phone TEXT DEFAULT '0249389181',
  currency TEXT NOT NULL DEFAULT 'GHS',
  low_stock_threshold INT NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_categories_timestamp BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_tyres_timestamp BEFORE UPDATE ON public.tyres FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- RLS POLICIES (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tyres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read access for tyres, categories, settings
CREATE POLICY "Public Tyres View" ON public.tyres FOR SELECT USING (true);
CREATE POLICY "Public Categories View" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Settings View" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public Users View" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Audit Logs View" ON public.audit_logs FOR SELECT USING (true);

-- Allow All Operations for App Functionality
CREATE POLICY "Public Tyres Manage" ON public.tyres FOR ALL USING (true);
CREATE POLICY "Public Categories Manage" ON public.categories FOR ALL USING (true);
CREATE POLICY "Public Settings Manage" ON public.settings FOR ALL USING (true);
CREATE POLICY "Public Users Manage" ON public.users FOR ALL USING (true);
CREATE POLICY "Public Audit Logs Manage" ON public.audit_logs FOR ALL USING (true);

-- INITIAL SEED SETTINGS
INSERT INTO public.settings (id, company_name, company_logo, contact_phone, currency, low_stock_threshold)
VALUES (1, 'MeloMax Ventures', '/logo.png', '0249389181', 'GHS', 5)
ON CONFLICT (id) DO UPDATE SET
  company_logo = '/logo.png',
  contact_phone = '0249389181';

-- INITIAL SEED ADMINISTRATOR USER
INSERT INTO public.users (full_name, email, phone, password_hash, role, status)
VALUES ('MeloMax Administrator', 'melomax@gmail.com', '0249389181', 'maxwell123', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- DEFAULT SEED CATEGORIES
INSERT INTO public.categories (name, description) VALUES
('RIM 22.5', 'Heavy Duty Commercial Truck & Bus Tyres'),
('RIM 19.5', 'Medium Truck & Regional Haul Tyres'),
('RIM 17.5', 'Light Commercial & Delivery Vehicle Tyres'),
('RIM 19', 'Luxury SUV & Performance Crossover Tyres'),
('RIM 18 (4X4)', 'All-Terrain 4x4 Off-Road Tyres'),
('RIM 18 (PRIVATE)', 'Private Passenger & Executive Sedan Tyres'),
('RIM 17 (4X4)', 'Rugged 4x4 SUV & Pickup Tyres'),
('RIM 17 (SALON)', 'Salon & Sedan Passenger Car Tyres'),
('RIM 16 (COMMERCIAL)', 'Commercial Cargo & Van Heavy Tyres'),
('RIM 16 (PRIVATE)', 'Private Compact & Sedan Passenger Tyres'),
('RIM 15 (COMMERCIAL)', 'Commercial Light Truck & Pickup Tyres'),
('RIM 15 (PRIVATE)', 'Private Passenger Car Tyres'),
('RIM 14', 'Standard Passenger & City Car Tyres'),
('RANDOM', 'General Purpose & Miscellaneous Sizes')
ON CONFLICT (name) DO NOTHING;
