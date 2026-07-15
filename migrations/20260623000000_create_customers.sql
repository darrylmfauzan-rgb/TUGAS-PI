-- Ensure pgcrypto is available for gen_random_uuid (Supabase typically has this extension)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create customers table to store registered customers
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
