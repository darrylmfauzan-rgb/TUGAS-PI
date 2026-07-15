-- Migration: Create pricing and facilities management tables
-- Purpose: Allow admins to manage villa pricing and facilities
-- Created: 2026-06-23

-- Step 1: Create pricing table for villa rates
CREATE TABLE IF NOT EXISTS public.villa_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  villa_name text NOT NULL DEFAULT 'D''VILLAMODA',
  weekend_price bigint NOT NULL DEFAULT 3500000,
  weekday_price bigint NOT NULL DEFAULT 2500000,
  description text,
  currency text DEFAULT 'IDR',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(villa_name)
);

-- Step 2: Create facilities table
CREATE TABLE IF NOT EXISTS public.villa_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon_name text,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_villa_pricing_name ON public.villa_pricing(villa_name);
CREATE INDEX IF NOT EXISTS idx_villa_facilities_category ON public.villa_facilities(category);
CREATE INDEX IF NOT EXISTS idx_villa_facilities_active ON public.villa_facilities(is_active);

-- Step 4: Insert default data
INSERT INTO public.villa_pricing (villa_name, weekend_price, weekday_price, description)
VALUES ('D''VILLAMODA', 3500000, 2500000, 'Harga default D''VILLAMODA')
ON CONFLICT (villa_name) DO NOTHING;

-- Step 5: Insert default facilities
INSERT INTO public.villa_facilities (name, description, icon_name, category, display_order)
VALUES
  ('Private Pool', 'Kolam renang pribadi yang estetik', 'Waves', 'amenity', 1),
  ('WiFi Berkecepatan Tinggi', 'Koneksi internet stabil dan cepat', 'Wifi', 'amenity', 2),
  ('Dapur Lengkap', 'Peralatan masak premium dengan semua kebutuhan', 'UtensilsCrossed', 'kitchen', 3),
  ('Smart TV dengan Netflix', 'Entertainment lengkap dengan streaming apps', 'Tv', 'entertainment', 4),
  ('Area BBQ Outdoor', 'Perlengkapan BBQ lengkap dan area makan outdoor', 'Flame', 'kitchen', 5),
  ('Parkir Mobil', 'Parkir indoor yang aman untuk kendaraan Anda', 'Car', 'facility', 6),
  ('Pemandangan Alam', 'Pemandangan taman dan alam yang memukau', 'Mountain', 'view', 7),
  ('Lokasi Strategis', 'Dekat dengan Gunung Mas, Taman Safari, dan kebun teh', 'MapPin', 'location', 8)
ON CONFLICT DO NOTHING;

-- Migration complete
-- Note: For production, implement proper RLS policies for this data

