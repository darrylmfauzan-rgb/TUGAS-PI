-- Rename primary key columns to table-specific names
-- This keeps the column naming consistent with the table name.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bookings'
      AND column_name = 'id'
  ) THEN
    ALTER TABLE public.bookings RENAME COLUMN id TO id_bookings;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'customers'
      AND column_name = 'id'
  ) THEN
    ALTER TABLE public.customers RENAME COLUMN id TO id_customers;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'villa_pricing'
      AND column_name = 'id'
  ) THEN
    ALTER TABLE public.villa_pricing RENAME COLUMN id TO id_villa_pricing;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'villa_facilities'
      AND column_name = 'id'
  ) THEN
    ALTER TABLE public.villa_facilities RENAME COLUMN id TO id_villa_facilities;
  END IF;
END $$;
