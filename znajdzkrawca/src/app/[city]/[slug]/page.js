import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities, tailors } from '@/lib/data';
import { tailorSlug } from '@/lib/slugify';
import { districtForTailor, districtTitle } from '@/lib/districts';
import { opinie, byRating } from '@/lib/seo';
import TailorList from '@/components/TailorList';

const NEARBY_COUNT = 5;

// Opening hours are stored with Polish day keys by scripts/scrape-details.mjs
const WEEK = [
  { key: 'pon', label: 'Poniedziałek', schema: 'Monday' },
  { key: 'wt', label: 'Wtorek', schema: 'Tuesday' },
  { key: 'śr', label: 'Środa', schema: 'Wednesday' },
  { key: 'czw', label: 'Czwartek', schema: 'Thursday' },
  { key: 'pt', label: 'Piątek', schema: 'Friday' },
  { key: 'sob', label: 'Sobota', schema: 'Saturday' },
  { key: 'niedz', label: 'Niedziela', schema: 'Sunday' },
];

// Same district first (best-rated), then topped up from the rest of the city.
// Gives thin listing pages useful content and links every tailor page to
// several others, so Google finds and re-crawls them.
function nearbyTailors(citySlug, tailor, district) {
  const others = (tailors[citySlug] ?? []).filter((t) => t.id !== tailor.id);
  const inDistrict = district ? byRating(others.filter((t) => district.tailors.some((d) => d.id === t.id))) : [];
  const rest = byRating(others.filter((t) => !inDistrict.includes(t)));
  return [...inDistrict, ...rest].slice(0, NEARBY_COUNT);
}

export function generateStaticParams() {
  const params = [];
  for (const city of cities) {
    const cityTailors = tailors[city.slug] ?? [];
    for (const tailor of cityTailors) {
      params.push({ city: city.slug, slug: tailorSlug(tailor) });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { city, slug } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) return {};

  const tailor = (tailors[city] ?? []).find((t) => tailorSlug(t) === slug);
  if (!tailor) return {};

  return {
    title: `${tailor.name} — krawiec, ${cityData.name} | Znajdź Krawca`,
    // Phone and rating only when present — 262 listings have no phone and used
    // to show "Telefon: undefined" in search results
    description: [
      `${tailor.name} — pracownia krawiecka w ${cityData.loc}.`,
      `Adres: ${tailor.address}.`,
      tailor.phone && `Telefon: ${tailor.phone}.`,
      tailor.rating && tailor.reviewCount > 0 && `Ocena ${tailor.rating.toFixed(1)}/5 (${opinie(tailor.reviewCount)}).`,
    ].filter(Boolean).join(' '),
    alternates: { canonical: `/${city}/${slug}` },
  };
}

export default async function TailorPage({ params }) {
  const { city, slug } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) notFound();

  const tailor = (tailors[city] ?? []).find((t) => tailorSlug(t) === slug);
  if (!tailor) notFound();

  const district = districtForTailor(city, tailor);
  const nearby = nearbyTailors(city, tailor, district);
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(tailor.name + ' ' + tailor.address)}`;

  const streetAddress = tailor.address.split(',')[0]?.trim();
  const postalCode = tailor.address.match(/\d{2}-\d{3}/)?.[0];
  const hours = tailor.hours ?? [];
  const services = tailor.services ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: tailor.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      postalCode,
      addressLocality: cityData.name,
      addressCountry: 'PL',
    },
    ...(tailor.phone && { telephone: tailor.phone }),
    url: `https://znajdzkrawca.pl/${city}/${slug}`,
    ...(tailor.website && { sameAs: [tailor.website] }),
    ...(hours.length > 0 && {
      openingHoursSpecification: hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: WEEK.find((d) => d.key === h.day).schema,
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    ...(tailor.rating && tailor.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tailor.rating,
        reviewCount: tailor.reviewCount,
      },
    }),
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(tailor.address)}&output=embed`;

  const initials = (() => {
    const words = tailor.name.trim().split(/\s+/);
    return words.length >= 2 ? words[0][0] + words[1][0] : tailor.name.slice(0, 2);
  })();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="relative text-white py-12 px-4 overflow-hidden">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/85 to-indigo-950/90" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <nav className="text-blue-200 text-sm mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Strona główna</Link>
            <span>/</span>
            <Link href={`/${city}`} className="hover:text-white transition-colors">{cityData.name}</Link>
            <span>/</span>
            {district && (
              <>
                <Link href={`/${city}/dzielnica/${district.slug}`} className="hover:text-white transition-colors">{districtTitle(district)}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-white truncate">{tailor.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white font-bold text-xl flex items-center justify-center uppercase shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold leading-snug">{tailor.name}</h1>
              <p className="text-blue-200 mt-1 text-sm">Pracownia krawiecka · {cityData.name}{district ? ` · ${districtTitle(district)}` : ''}</p>
              {tailor.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-amber-400 text-sm">{'★'.repeat(Math.round(tailor.rating))}{'☆'.repeat(5 - Math.round(tailor.rating))}</span>
                  <span className="text-white font-semibold text-sm">{tailor.rating.toFixed(1)}</span>
                  {tailor.reviewCount > 0 && (
                    <span className="text-blue-200 text-sm">({opinie(tailor.reviewCount)})</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          <div className="divide-y divide-slate-100">
            <div className="p-6 flex items-start gap-4">
              <span className="text-2xl mt-0.5">📍</span>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Adres</p>
                <p className="text-slate-800 font-medium">{tailor.address}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-sm text-blue-600 hover:underline"
                >
                  Pokaż na mapie →
                </a>
              </div>
            </div>

            {tailor.phone && (
              <div className="p-6 flex items-start gap-4">
                <span className="text-2xl mt-0.5">📞</span>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Telefon</p>
                  <a
                    href={`tel:${tailor.phone.replace(/\s/g, '')}`}
                    className="text-xl font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {tailor.phone}
                  </a>
                </div>
              </div>
            )}

            {hours.length > 0 && (
              <div className="p-6 flex items-start gap-4">
                <span className="text-2xl mt-0.5">🕐</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Godziny otwarcia</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                    {WEEK.map((d) => {
                      const h = hours.find((x) => x.day === d.key);
                      return (
                        <div key={d.key} className="contents">
                          <dt className="text-slate-500">{d.label}</dt>
                          <dd className={h ? 'text-slate-800 font-medium' : 'text-slate-400'}>{h ? `${h.opens}–${h.closes}` : 'nieczynne'}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </div>
            )}

            {tailor.website && (
              <div className="p-6 flex items-start gap-4">
                <span className="text-2xl mt-0.5">🌐</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Strona www</p>
                  <a
                    href={tailor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {tailor.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex flex-wrap gap-3">
            {tailor.phone && (
              <a
                href={`tel:${tailor.phone.replace(/\s/g, '')}`}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
              >
                📞 Zadzwoń
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-medium text-sm transition-colors"
            >
              🗺️ Mapa
            </a>
            {tailor.sourceUrl && (
              <a
                href={tailor.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-medium text-sm transition-colors"
              >
                Panorama Firm ↗
              </a>
            )}
          </div>
        </div>

        {services.length > 0 && (
          <section className="mt-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Usługi — {tailor.name}</h2>
            <ul className="flex flex-wrap gap-2">
              {services.map((s) => (
                <li key={s} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{s}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-400">Według wpisu firmy w Panorama Firm. Zakres usług warto potwierdzić telefonicznie.</p>
          </section>
        )}

        <div className="mt-6 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa: ${tailor.name}`}
          />
        </div>

        {nearby.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {district ? `Inne pracownie krawieckie w okolicy — ${districtTitle(district)}` : `Inne pracownie krawieckie w ${cityData.loc}`}
            </h2>
            <TailorList citySlug={city} tailors={nearby} />
          </section>
        )}

        <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          Jesteś właścicielem tej firmy?{' '}
          <span className="font-medium">Skontaktuj się z nami, aby zaktualizować dane lub dodać zdjęcia.</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href={`/${city}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Wszyscy krawcy w {cityData.loc}
          </Link>
          {district && (
            <Link
              href={`/${city}/dzielnica/${district.slug}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Inne pracownie — {districtTitle(district)} →
            </Link>
          )}
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 py-6 text-center text-sm text-slate-400">
        <div className="mb-2">
          <Link href="/o-nas" className="hover:text-slate-600 transition-colors">O nas</Link>
          <span className="mx-2">·</span>
          <a href="mailto:kontakt@znajdzkrawca.pl" className="hover:text-slate-600 transition-colors">Kontakt</a>
        </div>
        © 2026 Znajdź Krawca — Katalog krawców w Polsce
      </footer>
    </>
  );
}
