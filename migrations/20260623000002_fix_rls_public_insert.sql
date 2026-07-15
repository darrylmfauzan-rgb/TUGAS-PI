-- Quick fix: Disable RLS on customers table for public registration to work during development
-- In production, implement proper RLS policies with auth tokens

-- Disable RLS on customers table
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;

-- Disable RLS on bookings table for now
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

