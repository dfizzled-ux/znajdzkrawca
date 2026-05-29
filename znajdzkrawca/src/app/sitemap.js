import { cities, tailors } from '@/lib/data';
import { tailorSlug } from '@/lib/slugify';

const BASE = 'https://znajdzkrawca.pl';

export default function sitemap() {
  const cityPages = cities.map((city) => ({
    url: `${BASE}/${city.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const tailorPages = cities.flatMap((city) =>
    (tailors[city.slug] ?? []).map((tailor) => ({
      url: `${BASE}/${city.slug}/${tailorSlug(tailor)}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  );

  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1.0 },
    ...cityPages,
    ...tailorPages,
  ];
}
