/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: '/gallery',
        destination: '/templates',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
