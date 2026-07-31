-- =======================================================
-- SQL Setup/Migration pour Supabase : Table `orders`
-- Copiez et collez tout ce bloc dans Supabase SQL Editor
-- =======================================================

-- 1. Création de la table si elle n'existe pas encore
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_email TEXT,
    couple TEXT,
    slug TEXT,
    plan TEXT DEFAULT 'Standard',
    price NUMERIC DEFAULT 49.90,
    status TEXT DEFAULT 'Live',
    paid BOOLEAN DEFAULT true,
    date TEXT,
    theme TEXT DEFAULT 'bordeaux',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Au cas où la table `orders` existait déjà auparavant avec d'autres colonnes,
-- nous ajoutons en toute sécurité toutes les colonnes manquantes :
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS couple TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Standard';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 49.90;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Live';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT true;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'bordeaux';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Indexation
CREATE INDEX IF NOT EXISTS idx_orders_slug ON public.orders(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);

-- 4. Sécurité RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Supprime les politiques existantes pour éviter tout conflit lors de la réexécution
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public update orders" ON public.orders;

CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);
