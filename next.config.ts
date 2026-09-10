import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Hide the on-screen dev indicator (bottom-left route badge) shown during
  // development. Compile/runtime errors still surface normally.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.bbci.co.uk',
      },
      {
        protocol: 'https',
        hostname: '*.espn.com',
      },
      {
        protocol: 'https',
        hostname: '*.theguardian.com',
      },
      {
        protocol: 'https',
        hostname: '*.skysports.com',
      },
      {
        protocol: 'https',
        hostname: '*.football-data.org',
      },
      {
        protocol: 'https',
        hostname: '*.transfermarkt.de',
      },
      {
        protocol: 'https',
        hostname: '*.whatsapp.net',
      },
      {
        protocol: 'https',
        hostname: '*.cdn.reddit.com',
      },
      {
        protocol: 'https',
        hostname: '*.reuters.com',
      },
      {
        protocol: 'https',
        hostname: '*.bbc.com',
      },
      {
        protocol: 'https',
        hostname: '*.independent.co.uk',
      },
      {
        protocol: 'https',
        hostname: '*.telegraph.co.uk',
      },
    ],
  },
}

export default nextConfig