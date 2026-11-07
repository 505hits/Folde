# Checkout regression checks

`npm test` runs isolated payment-route tests with mocked Stripe and Supabase clients.

For browser tests, install Chromium with `npx playwright install chromium`, then build and start the site on port 3100 with these **local-only** environment values:

```
NEXT_PUBLIC_SUPABASE_URL=https://local-test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-test-anon-key
STRIPE_SECRET_KEY=sk_test_local_build_only
```

Run `npm run build`, `npm start -- --port 3100` and, in another terminal, `npm run test:e2e`. `TEST_BASE_URL` can override the local server URL.

The browser test intercepts authentication, database and payment requests. It checks stale local profiles, rejected passwords, confirmation-required signup, successful login, session restoration, checkout token forwarding, paid return/dashboard access, five template previews, direct visits to `/success` and unauthenticated checkout rejection. It sends no emails and charges no payments. Live provider configuration and a real Stripe test-mode transaction remain separate deployment checks.

The five affected templates now use existing self-hosted media as replacements for unavailable supplier media; their original themes and signature sections are retained. Previously saved supplier URLs resolve to these replacements at rendering time.
