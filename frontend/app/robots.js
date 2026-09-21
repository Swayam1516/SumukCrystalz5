export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumukcrystalz.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/checkout/summary'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
