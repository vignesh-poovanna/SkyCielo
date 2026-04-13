/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isGithubActions ? '/SkyCielo' : '',
  assetPrefix: isGithubActions ? '/SkyCielo/' : '',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? '/SkyCielo' : '',
  },
};
export default nextConfig;
