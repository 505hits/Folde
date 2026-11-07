# Checkout regression checks

`npm test` runs isolated payment-route tests with mocked Stripe and Supabase clients.

For browser tests, install Chromium with `npx playwright install chromium`, then build and start the site on port 3100 with these **local-only** environment values:

```
NEXT_PUBLIC_SUPABASE_URL=https://local-test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-test-anon-key
STRIPE_SECRET_KEY=sk_test_local_build_only
```

Run `npm run build`, `npm start -- --port 3100` and, in another terminal, `npm run test:e2e`. `TEST_BASE_URL` can override the local server URL.

The browser test uses a mobile viewport and intercepts preview, authentication and payment requests. It follows the real date → envelope → design → email flow, verifies that the next step asks for a password with the email already filled, tests confirmation-required signup and rejected passwords, and checks both existing-account login and new-account signup. It then follows the packages button directly to a mocked Stripe interface, without another login, including after a reload. A failed preview save cannot proceed. No emails or payments are sent.

Hosted Stripe Checkout uses dynamic payment methods. Link must be enabled in the Stripe account; Apple Pay and Google Pay appear when the customer’s device, browser, wallet setup and account settings are eligible. Rendering these real wallets and completing a Stripe test-mode transaction remain separate provider checks.

The five affected templates now use existing self-hosted media as replacements for unavailable supplier media; their original themes and signature sections are retained. Previously saved supplier URLs resolve to these replacements at rendering time.
