import { notFound } from 'next/navigation';
import { cities, tailors } from '@/lib/data';
import { districtsFor, districtTitle } from '@/lib/districts';
import { services, serviceBySlug } from '@/lib/services';
import { pracownie, byRating } from '@/lib/seo';
import TailorList from '@/components/TailorList';
import { PageHero, SiteFooter, LinkPills } from '@/components/PageChrome';

export function generateStaticParams() {
  return cities.flatMap((c) => services.map((s) => ({ city: c.slug, service: s.slug })));
}

export async function generateMetadata({ params }) {
  const { city, service } = await params;
  const cityData = cities.find((c) => c.slug === city);
  const s = serviceBySlug(service);
  if (!cityData || !s) return {};
  const n = (tailors[city] ?? []).length;
  return {
    title: `${s.title(cityData)} | Znajdź Krawca`,
    description: s.description(cityData, n),
    alternates: { canonical: `/${city}/uslugi/${service}` },
  };
}

export default async function ServicePage({ params }) {
  const { city, service } = await params;
  const cityData = cities.find((c) => c.slug === city);
  const s = serviceBySlug(service);
  if (!cityData || !s) notFound();

  const cityTailors = byRating(tailors[city] ?? []);
  const otherServices = services.filter((x) => x.slug !== s.slug);

  return (
    <>
      <PageHero
        crumbs={[
          { href: '/', label: 'Strona główna' },
          { href: `/${city}`, label: cityData.name },
          { href: `/${city}/uslugi/${s.slug}`, label: s.short },
        ]}
        title={s.h1(cityData)}
        subtitle={`${pracownie(cityTailors.length)} — od najlepiej ocenianych`}
      />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8 space-y-4">
          <p className="text-slate-600 leading-relaxed">{s.intro(cityData)}</p>
          {s.sections.map((sec) => (
            <div key={sec.heading}>
              <h2 className="font-semibold text-slate-800 mb-2">{sec.heading}</h2>
              <ul className="list-disc pl-5 text-slate-600 space-y-1">
                {sec.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="font-semibold text-slate-800 mb-2">Praktyczne wskazówki</h2>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              {s.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>

        <LinkPills
          heading={`${s.short} w dzielnicach — ${cityData.name}`}
          links={districtsFor(city).map((d) => ({ href: `/${city}/dzielnica/${d.slug}`, label: districtTitle(d) }))}
        />

        <TailorList citySlug={city} tailors={cityTailors} />

        <div className="mt-10">
          <LinkPills
            heading="Inne usługi"
            links={[
              ...otherServices.map((o) => ({ href: `/${city}/uslugi/${o.slug}`, label: `${o.short} ${cityData.name}` })),
              { href: `/${city}`, label: `Wszyscy krawcy w ${cityData.loc}` },
            ]}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
