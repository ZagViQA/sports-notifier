-- Фаза 3: Политики безопасности (RLS) для Личного Кабинета

-- 1. Удаляем старые полностью открытые политики (если нужно)
-- DROP POLICY IF EXISTS "Allow anonymous select on subscriptions" ON public.subscriptions;

-- 2. Разрешаем авторизованным пользователям видеть свои подписки. 
-- Пользователь определяется по email (Supabase Auth Email совпадает с email в нашей таблице public.users)
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (
  user_id IN (SELECT id FROM public.users WHERE email = auth.jwt() ->> 'email')
);

-- 3. Разрешаем пользователям удалять ТОЛЬКО свои подписки
CREATE POLICY "Users can delete own subscriptions" 
ON public.subscriptions 
FOR DELETE 
USING (
  user_id IN (SELECT id FROM public.users WHERE email = auth.jwt() ->> 'email')
);

-- 4. Политика для нашей таблицы users. Разрешаем читать данные, только если email совпадает
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
USING (
  email = auth.jwt() ->> 'email'
);
