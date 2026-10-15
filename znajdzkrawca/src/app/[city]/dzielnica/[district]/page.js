import { notFound } from 'next/navigation';
import { cities } from '@/lib/data';
import { districtsFor, districtTitle } from '@/lib/districts';
import { services } from '@/lib/services';
import { pracownie, byRating } from '@/lib/seo';
import TailorList from '@/components/TailorList';
import { PageHero, SiteFooter, LinkPills } from '@/components/PageChrome';

export function generateStaticParams() {
  return cities.flatMap((c) => districtsFor(c.slug).map((d) => ({ city: c.slug, district: d.slug })));
}

function lookup(city, district) {
  const cityData = cities.find((c) => c.slug === city);
  const d = cityData && districtsFor(city).find((x) => x.slug === district);
  return cityData && d ? { cityData, d } : null;
}

export async function generateMetadata({ params }) {
  const { city, district } = await params;
  const found = lookup(city, district);
  if (!found) return {};
  const { cityData, d } = found;
  const base = `Krawcowa i krawiec — ${districtTitle(d)}, ${cityData.name}: ${pracownie(d.tailors.length)} z adresami, telefonami i opiniami.`;
  const withAreas = d.areas.length ? `${base} Także ${d.areas.join(', ')}.` : base;
  return {
    title: `Krawcowa ${districtTitle(d)} (${cityData.name}) — ${pracownie(d.tailors.length)} | Znajdź Krawca`,
    // Keep the neighbourhood list only if it fits — Google cuts descriptions off around 160 chars
    description: withAreas.length <= 160 ? withAreas : base,
    alternates: { canonical: `/${city}/dzielnica/${district}` },
  };
}

export default async function DistrictPage({ params }) {
  const { city, district } = await params;
  const found = lookup(city, district);
  if (!found) notFound();
  const { cityData, d } = found;
  const others = districtsFor(city).filter((x) => x.slug !== d.slug);

  return (
    <>
      <PageHero
        crumbs={[
          { href: '/', label: 'Strona główna' },
          { href: `/${city}`, label: cityData.name },
          { href: `/${city}/dzielnica/${d.slug}`, label: districtTitle(d) },
        ]}
        title={`Krawcowa i krawiec — ${districtTitle(d)}, ${cityData.name}`}
        subtitle={`${pracownie(d.tailors.length)} w okolicy`}
      />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8 space-y-3">
          <p className="text-slate-600 leading-relaxed">
            Szukasz krawcowej w okolicy — {districtTitle(d)}, {cityData.name}? Poniżej znajdziesz pracownie krawieckie
            z tej części miasta, od najlepiej ocenianych. Przeróbki, poprawki, skracanie spodni, wymiana zamków
            i szycie na miarę — blisko domu, bez jeżdżenia przez całe miasto.
          </p>
          {d.areas.length > 0 && (
            <p className="text-slate-600 leading-relaxed">
              Lista obejmuje m.in. okolice: {d.areas.join(', ')}.
            </p>
          )}
        </div>

        <TailorList citySlug={city} tailors={byRating(d.tailors)} />

        <div className="mt-10">
          <LinkPills
            heading={`Inne dzielnice — ${cityData.name}`}
            links={[
              ...others.map((o) => ({ href: `/${city}/dzielnica/${o.slug}`, label: districtTitle(o) })),
              { href: `/${city}`, label: `Wszyscy krawcy w ${cityData.loc}` },
            ]}
          />
          <LinkPills
            heading="Usługi krawieckie"
            links={services.map((s) => ({ href: `/${city}/uslugi/${s.slug}`, label: `${s.short} ${cityData.name}` }))}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
