import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { cities, tailors } from '@/lib/data';

const CITY_ICONS = {
  warszawa:  '🏛️',
  krakow:    '👑',
  wroclaw:   '🌉',
  gdansk:    '⚓',
  lodz:      '🧵',
  poznan:    '🐐',
  katowice:    '⛏️',
  lublin:      '🌿',
  szczecin:    '🚢',
  bydgoszcz:   '🌊',
  bialystok:   '🦬',
  rzeszow:     '🏔️',
  torun:       '🔭',
  kielce:      '⛰️',
  czestochowa: '⛪',
};

export default function HomePage() {
  return (
    <>
      <header className="relative text-white py-20 px-4 overflow-hidden">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/85 to-indigo-950/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">✂️</div>
          <h1 className="text-5xl font-bold tracking-tight mb-3">Znajdź Krawca</h1>
          <p className="text-blue-200 text-lg mb-10">
            Katalog krawców i pracowni krawieckich w Polsce
          </p>
          <SearchBar />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Przeglądaj miasta</h2>
          <p className="text-slate-500 mt-1">Wybierz miasto, aby zobaczyć krawców w okolicy</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cities.map((city) => {
            const count = (tailors[city.slug] ?? []).length;
            return (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="group block p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-100"
              >
                <div className="text-3xl mb-3">{CITY_ICONS[city.slug] ?? '📍'}</div>
                <h3 className="text-xl font-semibold text-slate-900">{city.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{city.description}</p>
                <p className="text-xs font-semibold text-blue-600 mt-3 uppercase tracking-wide">
                  {count} krawców →
                </p>
              </Link>
            );
          })}
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
