/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
