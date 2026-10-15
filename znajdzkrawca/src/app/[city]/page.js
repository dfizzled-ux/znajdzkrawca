import { notFound } from 'next/navigation';
import { cities, tailors } from '@/lib/data';
import { districtsFor, districtTitle } from '@/lib/districts';
import { services } from '@/lib/services';
import { pracownie } from '@/lib/seo';
import TailorList from '@/components/TailorList';
import { PageHero, SiteFooter, LinkPills } from '@/components/PageChrome';

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) return {};
  const n = (tailors[city] ?? []).length;
  // Search Console: "krawcowa <miasto>" gets far more impressions than
  // "krawiec <miasto>", so lead with it and keep both
  return {
    title: `Krawcowa i krawiec ${cityData.name} — ${pracownie(n)} | Znajdź Krawca`,
    description: `Krawcowa ${cityData.name}: ${pracownie(n)} w ${cityData.loc} z adresami, telefonami i opiniami. Przeróbki krawieckie, poprawki i szycie na miarę.`,
    alternates: { canonical: `/${city}` },
  };
}

export default async function CityPage({ params }) {
  const { city } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) notFound();

  const cityTailors = tailors[city] ?? [];
  const districts = districtsFor(city);

  return (
    <>
      <PageHero
        crumbs={[{ href: '/', label: 'Strona główna' }, { href: `/${city}`, label: cityData.name }]}
        title={`Krawcowa i krawiec w ${cityData.loc}`}
        subtitle={`${pracownie(cityTailors.length)} — przeróbki, poprawki i szycie na miarę`}
      />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8 space-y-3">
          <p className="text-slate-600 leading-relaxed">{cityData.intro}</p>
          <p className="text-slate-600 leading-relaxed">
            Każda pracownia krawiecka na liście ma adres, telefon i — jeśli są dostępne — opinie klientów.
            Szukasz krawcowej blisko domu? Wybierz dzielnicę poniżej albo przejrzyj pełną listę.
          </p>
        </div>

        <LinkPills
          heading={`Krawcowa w dzielnicach — ${cityData.name}`}
          links={districts.map((d) => ({ href: `/${city}/dzielnica/${d.slug}`, label: `${districtTitle(d)} (${d.tailors.length})` }))}
        />
        <LinkPills
          heading="Usługi krawieckie"
          links={services.map((s) => ({ href: `/${city}/uslugi/${s.slug}`, label: `${s.short} ${cityData.name}` }))}
        />

        <TailorList citySlug={city} tailors={cityTailors} />
      </main>

      <SiteFooter />
    </>
  );
}
