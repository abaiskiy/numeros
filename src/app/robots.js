export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/compatibility'],
        disallow: ['/admin', '/admin/', '/success', '/api/'],
      },
    ],
    sitemap: 'https://numeros.kz/sitemap.xml',
  };
}
