CREATE POLICY "Users can insert own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (
  auth.uid() = id
);
