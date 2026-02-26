-- Run this in Supabase SQL Editor to enable Admin features

-- 1. Create an 'admin' role column in auth.users (requires superuser, which Supabase gives you via their dashboard but it's easier to just use patient_profiles table)
-- Alternative: Add 'role' to patient_profiles

ALTER TABLE public.patient_profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'patient';

-- 2. Update RLS on appointments so admins can see and update everything
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
CREATE POLICY "Users can view own appointments or admins can view all" 
ON public.appointments FOR SELECT 
USING ( 
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.patient_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
CREATE POLICY "Admins can update appointments" 
ON public.appointments FOR UPDATE 
USING ( 
  EXISTS (SELECT 1 FROM public.patient_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Note: To make someone an admin, run this in the SQL editor:
-- UPDATE public.patient_profiles SET role = 'admin' WHERE first_name = 'Your name';
