/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: true, // 🔍 para ver errores en producción
  reactStrictMode: true, // ✅ buena práctica en desarrollo
}

export default nextConfig
