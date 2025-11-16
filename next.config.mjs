/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  i18n: {
    locales: ['en', 'kn', 'hi', 'ml'],
    defaultLocale: 'en'
  }
}
export default nextConfig
