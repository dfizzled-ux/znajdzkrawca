import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities } from '@/lib/data';
import { guides, guideBySlug } from '@/lib/guides';
import { CITY_PRICES, CITY_PRICES_DATE, cityPricesUrl, priceRange } from '@/lib/cityPrices';
import { BASE_URL } from '@/lib/seo';
import { PageHero, SiteFooter, LinkPills } from '@/components/PageChrome';

const NAMES = Object.fromEntries(cities.map((c) => [c.slug, c.name]));
// Services shown in the 'cennik' table, in reading order
const CENNIK_COLS = [
  ['hem', 'Skrócenie spodni'],
  ['taper', 'Zwężenie spodni'],
  ['skirt', 'Skrócenie spódnicy'],
  ['zip', 'Wymiana zamka (spodnie, sukienka)'],
  ['jacketZip', 'Wymiana zamka w kurtce'],
  ['linedDress', 'Skrócenie sukienki z podszewką'],
];
const zl = (n) => `${n} zł`;
const sourceDate = new Date(CITY_PRICES_DATE).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return {};
  return {
    title: `${g.title} | Znajdź Krawca`,
    description: g.description,
    alternates: { canonical: `/poradnik/${g.slug}` },
  };
}

function CityLink({ slug }) {
  return <Link href={`/${slug}`} className="text-blue-700 hover:underline">{NAMES[slug]}</Link>;
}

function HemTable() {
  const rows = Object.entries(CITY_PRICES).sort((a, b) => a[1].hem - b[1].hem || NAMES[a[0]].localeCompare(NAMES[b[0]], 'pl'));
  return (
    <table className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm text-sm overflow-hidden">
      <thead className="bg-slate-50 text-slate-500 text-left">
        <tr><th className="px-5 py-2.5 font-medium">Miasto</th><th className="px-5 py-2.5 font-medium text-right">Skrócenie spodni (średnio)</th></tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map(([slug, p]) => (
          <tr key={slug}>
            <td className="px-5 py-2.5"><CityLink slug={slug} /></td>
            <td className="px-5 py-2.5 text-right font-semibold text-slate-900">{zl(p.hem)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CennikTable() {
  const rows = Object.entries(CITY_PRICES).sort((a, b) => NAMES[a[0]].localeCompare(NAMES[b[0]], 'pl'));
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-2.5 font-medium sticky left-0 bg-slate-50">Miasto</th>
            {CENNIK_COLS.map(([k, label]) => <th key={k} className="px-4 py-2.5 font-medium text-right">{label}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(([slug, p]) => (
            <tr key={slug}>
              <td className="px-4 py-2.5 sticky left-0 bg-white"><CityLink slug={slug} /></td>
              {CENNIK_COLS.map(([k]) => <td key={k} className="px-4 py-2.5 text-right text-slate-900 whitespace-nowrap">{zl(p[k])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();

  const range = priceRange('hem', NAMES);
  const faq = g.faq(range);
  const others = guides.filter((x) => x.slug !== g.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: g.title,
        description: g.description,
        dateModified: g.updated,
        inLanguage: 'pl-PL',
        mainEntityOfPage: `${BASE_URL}/poradnik/${g.slug}`,
        publisher: { '@type': 'Organization', name: 'Znajdź Krawca', url: BASE_URL },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        crumbs={[
          { href: '/', label: 'Strona główna' },
          { href: '/poradnik', label: 'Poradnik' },
          { href: `/poradnik/${g.slug}`, label: g.short },
        ]}
        title={g.h1}
      />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-lg text-slate-700 leading-relaxed mb-8">{g.lead(range)}</p>

        {g.sections.map((s) => (
          <section key={s.heading} className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{s.heading}</h2>
            {s.paragraphs?.map((p) => <p key={p} className="text-slate-600 leading-relaxed mb-3">{p}</p>)}
            {s.items && (
              <ul className="list-disc pl-5 text-slate-600 space-y-1.5">
                {s.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            )}
            {s.table === 'hem' && <HemTable />}
            {s.table === 'cennik' && <CennikTable />}
            {s.table && (
              <p className="text-xs text-slate-400 mt-2">
                Źródło: średnie ceny z cenników miejskich <a href={cityPricesUrl('warszawa')} className="underline" rel="nofollow noopener" target="_blank">kb.pl</a> ({sourceDate}), zaokrąglone do pełnych złotych. Ceny orientacyjne — każda pracownia ustala własne.
              </p>
            )}
          </section>
        ))}

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Najczęstsze pytania</h2>
          <div className="space-y-4">
            {faq.map((f) => (
              <div key={f.q} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-1">{f.q}</h3>
                <p className="text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <LinkPills
          heading="Znajdź krawcową w swoim mieście"
          links={cities.map((c) => ({ href: `/${c.slug}`, label: `Krawcowa ${c.name}` }))}
        />
        <LinkPills
          heading="Więcej w poradniku"
          links={others.map((o) => ({ href: `/poradnik/${o.slug}`, label: o.short }))}
        />
      </main>

      <SiteFooter />
    </>
  );
}
