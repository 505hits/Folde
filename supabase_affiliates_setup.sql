-- =======================================================
-- FOLDÈ affiliate program: affiliates, referrals and payouts
-- Paste this whole block into the Supabase SQL Editor and run it once.
-- It is safe to run again.
--
-- All writes go through the server (service role). Signed-in affiliates may
-- only read their own rows. Referrals hold no buyer personal data.
-- =======================================================

CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
    code TEXT NOT NULL UNIQUE CHECK (code ~ '^[a-z0-9][a-z0-9-]{1,22}[a-z0-9]$'),
    channel TEXT CHECK (channel IS NULL OR char_length(channel) <= 200),
    locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'fr', 'es')),
    payout_method TEXT NOT NULL DEFAULT 'paypal' CHECK (payout_method IN ('paypal', 'wise')),
    payout_email TEXT NOT NULL CHECK (char_length(payout_email) <= 200),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
    clicks INTEGER NOT NULL DEFAULT 0,
    sales_count INTEGER NOT NULL DEFAULT 0,
    total_commission_cents INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    currency TEXT NOT NULL DEFAULT 'usd',
    method TEXT NOT NULL,
    payout_email TEXT NOT NULL,
    referral_count INTEGER NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    stripe_session_id TEXT NOT NULL UNIQUE,
    payment_intent TEXT,
    amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
    commission_cents INTEGER NOT NULL CHECK (commission_cents >= 0),
    currency TEXT NOT NULL DEFAULT 'usd',
    plan TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
    payout_id UUID REFERENCES public.affiliate_payouts(id) ON DELETE SET NULL,
    paid_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate ON public.affiliate_referrals(affiliate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_payment_intent ON public.affiliate_referrals(payment_intent);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_pending ON public.affiliate_referrals(status, created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate ON public.affiliate_payouts(affiliate_id, created_at DESC);

-- Row Level Security: no public access; affiliates read only their own rows.
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Affiliates read own profile" ON public.affiliates;
DROP POLICY IF EXISTS "Affiliates read own referrals" ON public.affiliate_referrals;
DROP POLICY IF EXISTS "Affiliates read own payouts" ON public.affiliate_payouts;

CREATE POLICY "Affiliates read own profile" ON public.affiliates
    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Affiliates read own referrals" ON public.affiliate_referrals
    FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.affiliates a WHERE a.id = affiliate_id AND a.user_id = auth.uid()));
CREATE POLICY "Affiliates read own payouts" ON public.affiliate_payouts
    FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.affiliates a WHERE a.id = affiliate_id AND a.user_id = auth.uid()));

-- Counts one visit from an affiliate link.
CREATE OR REPLACE FUNCTION public.increment_affiliate_click(p_code TEXT)
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
    UPDATE public.affiliates SET clicks = clicks + 1 WHERE code = p_code AND status = 'active';
$$;

-- Records one paid Checkout session for an affiliate, once. Returns
-- {"inserted": true, ...totals} the first time, {"inserted": false} after.
CREATE OR REPLACE FUNCTION public.record_affiliate_sale(
    p_code TEXT, p_session_id TEXT, p_payment_intent TEXT, p_buyer_user_id UUID,
    p_amount_cents INTEGER, p_commission_cents INTEGER, p_currency TEXT, p_plan TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    a public.affiliates%ROWTYPE;
    new_id UUID;
BEGIN
    SELECT * INTO a FROM public.affiliates WHERE affiliates.code = p_code AND affiliates.status = 'active';
    IF NOT FOUND THEN RETURN jsonb_build_object('inserted', false, 'reason', 'unknown_code'); END IF;
    IF p_buyer_user_id IS NOT NULL AND a.user_id = p_buyer_user_id THEN
        RETURN jsonb_build_object('inserted', false, 'reason', 'self_referral');
    END IF;
    INSERT INTO public.affiliate_referrals (affiliate_id, stripe_session_id, payment_intent, amount_cents, commission_cents, currency, plan)
    VALUES (a.id, p_session_id, p_payment_intent, p_amount_cents, p_commission_cents, COALESCE(p_currency, 'usd'), p_plan)
    ON CONFLICT (stripe_session_id) DO NOTHING
    RETURNING id INTO new_id;
    IF new_id IS NULL THEN RETURN jsonb_build_object('inserted', false, 'reason', 'duplicate'); END IF;
    UPDATE public.affiliates
       SET sales_count = sales_count + 1,
           total_commission_cents = total_commission_cents + p_commission_cents,
           updated_at = NOW()
     WHERE id = a.id
    RETURNING * INTO a;
    RETURN jsonb_build_object(
        'inserted', true, 'email', a.email, 'name', a.name, 'locale', a.locale, 'code', a.code,
        'sales_count', a.sales_count, 'total_commission_cents', a.total_commission_cents
    );
END;
$$;

-- Cancels the commission of a refunded payment that has not been paid out yet.
CREATE OR REPLACE FUNCTION public.refund_affiliate_sale(p_payment_intent TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    r public.affiliate_referrals%ROWTYPE;
BEGIN
    UPDATE public.affiliate_referrals SET status = 'refunded', refunded_at = NOW()
     WHERE payment_intent = p_payment_intent AND status = 'pending'
    RETURNING * INTO r;
    IF NOT FOUND THEN RETURN jsonb_build_object('refunded', false); END IF;
    UPDATE public.affiliates
       SET sales_count = GREATEST(sales_count - 1, 0),
           total_commission_cents = GREATEST(total_commission_cents - r.commission_cents, 0),
           updated_at = NOW()
     WHERE id = r.affiliate_id;
    RETURN jsonb_build_object('refunded', true, 'affiliate_id', r.affiliate_id, 'commission_cents', r.commission_cents);
END;
$$;

-- Marks every pending commission created before p_cutoff as paid, after the
-- administrator has sent the money by PayPal or Wise. Never moves money itself.
CREATE OR REPLACE FUNCTION public.mark_affiliate_paid(p_affiliate_id UUID, p_cutoff TIMESTAMPTZ, p_note TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    a public.affiliates%ROWTYPE;
    total INTEGER;
    n INTEGER;
    payout UUID;
BEGIN
    SELECT * INTO a FROM public.affiliates WHERE id = p_affiliate_id FOR UPDATE;
    IF NOT FOUND THEN RETURN jsonb_build_object('amount_cents', 0, 'count', 0); END IF;
    SELECT COALESCE(SUM(commission_cents), 0), COUNT(*) INTO total, n
      FROM public.affiliate_referrals
     WHERE affiliate_id = a.id AND status = 'pending' AND created_at <= p_cutoff;
    IF total <= 0 THEN RETURN jsonb_build_object('amount_cents', 0, 'count', 0); END IF;
    INSERT INTO public.affiliate_payouts (affiliate_id, amount_cents, method, payout_email, referral_count, note)
    VALUES (a.id, total, a.payout_method, a.payout_email, n, p_note)
    RETURNING id INTO payout;
    UPDATE public.affiliate_referrals SET status = 'paid', paid_at = NOW(), payout_id = payout
     WHERE affiliate_id = a.id AND status = 'pending' AND created_at <= p_cutoff;
    RETURN jsonb_build_object('amount_cents', total, 'count', n, 'payout_id', payout);
END;
$$;

REVOKE ALL ON FUNCTION public.increment_affiliate_click(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_affiliate_sale(TEXT, TEXT, TEXT, UUID, INTEGER, INTEGER, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refund_affiliate_sale(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.mark_affiliate_paid(UUID, TIMESTAMPTZ, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_affiliate_click(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_affiliate_sale(TEXT, TEXT, TEXT, UUID, INTEGER, INTEGER, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_affiliate_sale(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_affiliate_paid(UUID, TIMESTAMPTZ, TEXT) TO service_role;
