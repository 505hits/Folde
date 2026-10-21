import { legacyRedirects } from "./src/lib/routes.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
