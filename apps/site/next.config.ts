import type { NextConfig } from 'next'

// Static export: the build is plain HTML/CSS/JS that nginx serves as files.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  transpilePackages: ['@gthanasis/ui'],
  trailingSlash: false,
}

export default nextConfig
