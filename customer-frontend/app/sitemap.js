export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumukcrystalz.com';

  const staticRoutes = [
    '',
    '/shop',
    '/about',
    '/services',
    '/collections',
    '/encyclopedia',
    '/account',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/shop' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/shop' ? 0.9 : 0.8,
  }));

  // Dynamic product slugs from default catalog
  const productSlugs = [
    'pyrite-wealth-bracelet',
    'amethyst-cathedral-geode',
    'golden-tiger-eye-band',
    'rose-quartz-masterwork',
    'black-tourmaline-shield',
    'clear-quartz-generator',
    'citrine-abundance-cluster',
    'lapis-lazuli-sacred-stone',
    'green-jade-harmony-bracelet',
    'selenite-tower-amplifier',
  ];

  const productRoutes = productSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes];
}
