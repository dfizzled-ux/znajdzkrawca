import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities, tailors } from '@/lib/data';
import { tailorSlug } from '@/lib/slugify';

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
    title: `${tailor.name} — Krawiec w ${cityData.name} | Znajdź Krawca`,
    description: `${tailor.name} — pracownia krawiecka w ${cityData.name}. Adres: ${tailor.address}. Telefon: ${tailor.phone}.`,
  };
}

export default async function TailorPage({ params }) {
  const { city, slug } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) notFound();

  const tailor = (tailors[city] ?? []).find((t) => tailorSlug(t) === slug);
  if (!tailor) notFound();

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(tailor.name + ' ' + tailor.address)}`;

  const streetAddress = tailor.address.split(',')[0]?.trim();
  const postalCode = tailor.address.match(/\d{2}-\d{3}/)?.[0];

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
  };

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
            <span className="text-white truncate">{tailor.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white font-bold text-xl flex items-center justify-center uppercase shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold leading-snug">{tailor.name}</h1>
              <p className="text-blue-200 mt-1 text-sm">Pracownia krawiecka · {cityData.name}</p>
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

        <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          Jesteś właścicielem tej firmy?{' '}
          <span className="font-medium">Skontaktuj się z nami, aby zaktualizować dane lub dodać zdjęcia.</span>
        </div>

        <div className="mt-8">
          <Link
            href={`/${city}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Wróć do krawców w {cityData.name}
          </Link>
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
