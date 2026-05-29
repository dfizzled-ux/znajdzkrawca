import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities, tailors } from '@/lib/data';
import { tailorSlug } from '@/lib/slugify';

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) return {};
  return {
    title: `Krawcy w ${cityData.name} — Znajdź Krawca`,
    description: `Pracownie krawieckie i krawcy w ${cityData.name}. Znajdź krawca blisko siebie.`,
  };
}

function Initials({ name }) {
  const words = name.trim().split(/\s+/);
  const letters = words.length >= 2
    ? words[0][0] + words[1][0]
    : name.slice(0, 2);
  return (
    <div className="shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center uppercase">
      {letters}
    </div>
  );
}

export default async function CityPage({ params }) {
  const { city } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) notFound();

  const cityTailors = tailors[city] ?? [];

  return (
    <>
      <header className="relative text-white py-12 px-4 overflow-hidden">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/85 to-indigo-950/90" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-5 transition-colors"
          >
            ← Powrót do strony głównej
          </Link>
          <h1 className="text-4xl font-bold">Krawcy w {cityData.name}</h1>
          <p className="text-blue-200 mt-2">
            {cityTailors.length} pracowni w katalogu
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {cityTailors.length === 0 ? (
          <p className="text-slate-500 text-center py-16">
            Brak krawców w tym mieście. Wróć wkrótce!
          </p>
        ) : (
          <div className="space-y-3">
            {cityTailors.map((tailor) => (
              <Link
                key={tailor.id}
                href={`/${city}/${tailorSlug(tailor)}`}
                className="group flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <Initials name={tailor.name} />
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                    {tailor.name}
                  </h2>
                  <p className="text-slate-500 text-sm mt-0.5 truncate">{tailor.address}</p>
                  {tailor.phone && (
                    <p className="text-slate-400 text-xs mt-0.5">{tailor.phone}</p>
                  )}
                </div>
                <span className="shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors text-lg">→</span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200 py-6 text-center text-sm text-slate-400">
        © 2026 Znajdź Krawca — Katalog krawców w Polsce
      </footer>
    </>
  );
}
