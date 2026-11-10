import { cities, tailors } from '@/lib/data';
import { tailorSlug } from '@/lib/slugify';
import { districtsFor } from '@/lib/districts';
import { services } from '@/lib/services';
import { BASE_URL as BASE } from '@/lib/seo';

// lastModified must be the date a page's content really changed: Google
// ignores lastmod on sites where it moves on every build. Bump these by hand
// when you change what a page shows.
//
// LISTINGS: last change to the listings (tailors.json, or the filters and
// merges in data.js). Every page that lists tailors changes with it.
const LISTINGS = '2026-11-09';
// Last change to each page template's visible content
const TEMPLATE = {
  home: '2026-10-15',
  city: '2026-10-29',
  district: '2026-10-26',
  service: '2026-10-15',
  tailor: '2026-10-26',
};

// ISO dates compare correctly as strings
const latest = (...dates) => dates.filter(Boolean).sort().at(-1);

export default function sitemap() {
  const cityPages = cities.map((city) => ({
    url: `${BASE}/${city.slug}`,
    lastModified: latest(TEMPLATE.city, LISTINGS),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const districtPages = cities.flatMap((city) =>
    districtsFor(city.slug).map((d) => ({
      url: `${BASE}/${city.slug}/dzielnica/${d.slug}`,
      lastModified: latest(TEMPLATE.district, LISTINGS),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  );

  const servicePages = cities.flatMap((city) =>
    services.map((s) => ({
      url: `${BASE}/${city.slug}/uslugi/${s.slug}`,
      lastModified: latest(TEMPLATE.service, LISTINGS),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  );

  // A tailor page changes when its own details were last scraped
  // (detailsAt, set by scripts/scrape-details.mjs)
  const tailorPages = cities.flatMap((city) =>
    (tailors[city.slug] ?? []).map((tailor) => ({
      url: `${BASE}/${city.slug}/${tailorSlug(tailor)}`,
      lastModified: latest(TEMPLATE.tailor, tailor.detailsAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  );

  return [
    { url: BASE, lastModified: latest(TEMPLATE.home, LISTINGS), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/o-nas`, lastModified: '2026-10-15', changeFrequency: 'yearly', priority: 0.3 },
    ...cityPages,
    ...districtPages,
    ...servicePages,
    ...tailorPages,
  ];
}
