import { legacyRedirects } from "./src/lib/routes.mjs";

// BotID authenticates its server checks with Vercel OIDC. Refuse to deploy a
// configuration that would make protected customer submissions unavailable.
if (process.env.VERCEL === '1' && !process.env.VERCEL_OIDC_TOKEN) {
  throw new Error('Enable OIDC tokens for this Vercel project before deploying BotID protection.');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'" },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      // Canonical host is the apex domain. This only applies if www reaches the
      // app; the Vercel domain-level redirect should also be set to 308/301.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.folde-wedding.com" }],
        destination: "https://folde-wedding.com/:path*",
        permanent: true,
      },
      // /templates never existed; send old links to the collections page.
      { source: "/gallery", destination: "/collections", permanent: true },
      { source: "/templates", destination: "/collections", permanent: true },
      // Old English slugs under /fr and /es -> localized slugs (301).
      ...legacyRedirects(),
    ];
  },
};

export default nextConfig;
