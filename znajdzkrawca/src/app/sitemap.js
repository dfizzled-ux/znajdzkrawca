import { cities, tailors } from '@/lib/data';
import { tailorSlug } from '@/lib/slugify';
import { districtsFor } from '@/lib/districts';
import { services } from '@/lib/services';
import { BASE_URL as BASE } from '@/lib/seo';

export default function sitemap() {
  const cityPages = cities.map((city) => ({
    url: `${BASE}/${city.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const districtPages = cities.flatMap((city) =>
    districtsFor(city.slug).map((d) => ({
      url: `${BASE}/${city.slug}/dzielnica/${d.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  );

  const servicePages = cities.flatMap((city) =>
    services.map((s) => ({
      url: `${BASE}/${city.slug}/uslugi/${s.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  );

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
    ...districtPages,
    ...servicePages,
    ...tailorPages,
  ];
}
