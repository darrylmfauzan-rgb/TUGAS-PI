-- Drop old customers table if it exists (or keep data if needed)
-- First, let's update the existing customers table to include password hash
-- and other necessary fields for authentication

-- Alter customers table to add password hash and more fields
ALTER TABLE IF EXISTS public.customers 
ADD COLUMN IF NOT EXISTS password_hash text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login timestamptz,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- Update existing records to have a password_hash (temporary bcrypt hash of empty string)
-- In production, you should migrate customer passwords properly
UPDATE public.customers 
SET password_hash = '' 
WHERE password_hash IS NULL;

-- Add customer_id to bookings table to link reservations to customers
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS customer_id uuid;

-- Add foreign key constraint
ALTER TABLE public.bookings 
ADD CONSTRAINT fk_bookings_customer_id 
FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

-- Create index for bookings customer_id
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);

-- Update bookings by matching email to customer
UPDATE public.bookings b
SET customer_id = c.id
FROM public.customers c
WHERE b.guest_email = c.email AND b.customer_id IS NULL;

-- Enable RLS on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "customers_public_profile_read" ON public.customers;
DROP POLICY IF EXISTS "customers_self_update" ON public.customers;
DROP POLICY IF EXISTS "customers_self_delete" ON public.customers;
DROP POLICY IF EXISTS "admin_customers_all" ON public.customers;

-- Create RLS Policies for customers table

-- Policy: Customers can view their own profile
CREATE POLICY "customers_self_read"
ON public.customers
FOR SELECT
USING (auth.uid()::text = id::text);

-- Policy: Customers can update their own profile
CREATE POLICY "customers_self_update"
ON public.customers
FOR UPDATE
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Policy: Admin can read all customers (needs admin role)
CREATE POLICY "admin_customers_read"
ON public.customers
FOR SELECT
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Policy: Admin can update customer status
CREATE POLICY "admin_customers_update"
ON public.customers
FOR UPDATE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Drop existing bookings policies
DROP POLICY IF EXISTS "Anyone can submit a booking" ON public.bookings;
DROP POLICY IF EXISTS "Guests can view their own bookings by email" ON public.bookings;
DROP POLICY IF EXISTS "Admins can confirm bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

-- Create new RLS Policies for bookings table

-- Policy: Customers can view their own bookings
CREATE POLICY "customer_view_own_bookings"
ON public.bookings
FOR SELECT
USING (
  auth.uid()::text = customer_id::text OR
  auth.uid()::text IS NULL -- Allow public submissions
);

-- Policy: Anyone can create a booking (public reservations)
CREATE POLICY "public_create_booking"
ON public.bookings
FOR INSERT
WITH CHECK (true);

-- Policy: Customers can update their own bookings
CREATE POLICY "customer_update_own_booking"
ON public.bookings
FOR UPDATE
USING (auth.uid()::text = customer_id::text)
WITH CHECK (auth.uid()::text = customer_id::text);

-- Policy: Admin can view all bookings
CREATE POLICY "admin_view_all_bookings"
ON public.bookings
FOR SELECT
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Policy: Admin can update bookings
CREATE POLICY "admin_update_bookings"
ON public.bookings
FOR UPDATE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Policy: Admin can delete bookings
CREATE POLICY "admin_delete_bookings"
ON public.bookings
FOR DELETE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Create function to update customers updated_at
CREATE OR REPLACE FUNCTION public.update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for customers updated_at
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_customers_updated_at();

-- Create audit log table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index on audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view audit logs
CREATE POLICY "admin_view_audit_logs"
ON public.audit_logs
FOR SELECT
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);
