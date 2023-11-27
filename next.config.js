/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // add config for images
  images: {
    domains: ['github.githubassets.com'],
  },
};

module.exports = nextConfig;
