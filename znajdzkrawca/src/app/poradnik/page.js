import Link from 'next/link';
import { guides } from '@/lib/guides';
import { PageHero, SiteFooter } from '@/components/PageChrome';

export const metadata = {
  title: 'Poradnik krawiecki — ceny przeróbek i porady | Znajdź Krawca',
  description: 'Ile kosztują przeróbki krawieckie i jak przygotować się do wizyty u krawcowej. Ceny skracania spodni, wymiany zamków i innych usług w 16 miastach.',
  alternates: { canonical: '/poradnik' },
};

export default function GuidesIndex() {
  return (
    <>
      <PageHero
        crumbs={[{ href: '/', label: 'Strona główna' }, { href: '/poradnik', label: 'Poradnik' }]}
        title="Poradnik krawiecki"
        subtitle="Ceny przeróbek i praktyczne porady przed wizytą u krawcowej"
      />
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/poradnik/${g.slug}`}
            className="block bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
          >
            <h2 className="text-xl font-semibold text-slate-900">{g.title}</h2>
            <p className="text-slate-600 mt-1">{g.description}</p>
          </Link>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
