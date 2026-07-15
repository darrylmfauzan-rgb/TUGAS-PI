-- Migration: Link bookings to customers 
-- Purpose: Enable customers to view only their own bookings
-- Created: 2026-06-23
-- Note: RLS is disabled for development, so no policies are created

-- Step 1: Ensure customer_id column exists in bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE;

-- Step 2: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id_guest_email 
ON public.bookings(customer_id, guest_email);

-- Step 3: Update existing bookings to link with customers where email matches
-- This will link bookings made by customers (guest_email matches customer.email)
UPDATE public.bookings b
SET customer_id = c.id
FROM public.customers c
WHERE b.guest_email = c.email AND b.customer_id IS NULL;

-- Step 4: Create a comment to document the schema
COMMENT ON COLUMN public.bookings.customer_id IS 'References the customer who made this booking if they are registered';

-- Migration complete
-- RLS is disabled to allow development testing
-- When ready for production, enable RLS and create appropriate policies
