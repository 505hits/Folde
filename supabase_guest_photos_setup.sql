-- Private guest photo galleries for FOLDÈ Wedding.
-- Run this file once in Supabase > SQL Editor.

CREATE TABLE IF NOT EXISTS public.guest_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL UNIQUE,
  original_name TEXT,
  content_type TEXT NOT NULL,
  file_size BIGINT NOT NULL CHECK (file_size > 0 AND file_size <= 8388608),
  guest_name TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_photos_order_created
  ON public.guest_photos(order_id, created_at DESC);

ALTER TABLE public.guest_photos ENABLE ROW LEVEL SECURITY;

-- No browser-facing policy is created. The server route uses the service role.
DROP POLICY IF EXISTS "Public read guest photos" ON public.guest_photos;
DROP POLICY IF EXISTS "Public insert guest photos" ON public.guest_photos;
DROP POLICY IF EXISTS "Public update guest photos" ON public.guest_photos;
DROP POLICY IF EXISTS "Public delete guest photos" ON public.guest_photos;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'guest-photos',
  'guest-photos',
  false,
  8388608,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Keep the bucket private: the service-role API issues short-lived signed URLs.
DROP POLICY IF EXISTS "Public read guest photos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public upload guest photos bucket" ON storage.objects;
