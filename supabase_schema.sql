-- 1. Create a table for Users
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_chat_id BIGINT UNIQUE,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a table for Subscriptions
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  sports JSONB NOT NULL DEFAULT '[]'::jsonb,
  tournaments JSONB NOT NULL DEFAULT '[]'::jsonb,
  preferences JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS) policies
-- Allow insert from anonymous users (our React App)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert to users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow anonymous update on users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous insert to subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on subscriptions" ON public.subscriptions FOR SELECT USING (true);
