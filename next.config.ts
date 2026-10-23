import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.bbci.co.uk' },
      { protocol: 'https', hostname: '*.espn.com' },
      { protocol: 'https', hostname: '*.theguardian.com' },
      { protocol: 'https', hostname: '*.skysports.com' },
      { protocol: 'https', hostname: '*.football-data.org' },
      { protocol: 'https', hostname: 'media.api-sports.io' },
      { protocol: 'https', hostname: '*.transfermarkt.de' },
      { protocol: 'https', hostname: '*.whatsapp.net' },
      { protocol: 'https', hostname: '*.cdn.reddit.com' },
      { protocol: 'https', hostname: '*.reuters.com' },
      { protocol: 'https', hostname: '*.bbc.com' },
      { protocol: 'https', hostname: '*.independent.co.uk' },
      { protocol: 'https', hostname: '*.telegraph.co.uk' },
    ],
  },
}

export default nextConfig
