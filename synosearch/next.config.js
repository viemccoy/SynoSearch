/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "replicate.com",
        },
        {
          protocol: "https",
          hostname: "replicate.delivery",
        },
      ],
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/app/page',
          permanent: true,
        },
      ]
    },
  };
  
  module.exports = nextConfig;