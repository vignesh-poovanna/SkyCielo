/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/SkyCielo',
  assetPrefix: '/SkyCielo/',
  images: { unoptimized: true },
};
export default nextConfig;
