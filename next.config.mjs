/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: [
    '@react-pdf/renderer',
    '@react-pdf/layout',
    '@react-pdf/svg',
    '@react-pdf/font',
    'pdf-parse',
    'openai',
  ],
};

export default nextConfig;
