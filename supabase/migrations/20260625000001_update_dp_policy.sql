-- Update booking policy after adding DP enum value
DROP POLICY IF EXISTS "Admins can confirm bookings" ON public.bookings;
CREATE POLICY "Admins can confirm bookings" ON public.bookings
FOR UPDATE
USING (true)
WITH CHECK (status IN ('confirmed', 'dp'));
