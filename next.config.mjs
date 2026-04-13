/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['@react-pdf/renderer'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  // Браузеры по умолчанию бьют в /favicon.ico; iOS — в /apple-touch-icon.png.
  // Next генерирует /icon.png и /apple-icon.png из app/icon.svg.
  async redirects() {
    return [
      { source: '/favicon.ico', destination: '/icon.png', permanent: false },
      { source: '/apple-touch-icon.png', destination: '/apple-icon.png', permanent: false },
    ];
  },
};

export default nextConfig;
