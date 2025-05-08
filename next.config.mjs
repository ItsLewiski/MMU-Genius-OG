/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    unoptimized: true,
  },
  // Add package resolution for @radix-ui/react-focus-guards
  webpack: (config, { isServer }) => {
    // Fix for @radix-ui/react-focus-guards
    config.resolve.alias = {
      ...config.resolve.alias,
      '@radix-ui/react-focus-guards': '@radix-ui/react-focus-guards',
    };
    return config;
  },
}

export default nextConfig
