export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/cdn-cgi/',
    },
    sitemap: 'https://znajdzkrawca.pl/sitemap.xml',
  };
}
