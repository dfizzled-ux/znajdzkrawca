import { notFound } from 'next/navigation';
import { cities, tailors } from '@/lib/data';
import { districtsFor, districtTitle } from '@/lib/districts';
import { services } from '@/lib/services';
import { pracownie, opinie, byRating } from '@/lib/seo';
import { tailorSlug } from '@/lib/slugify';
import { PRICES_YEAR } from '@/lib/prices';
import { CITY_PRICES, PRICE_LABELS } from '@/lib/cityPrices';
import Link from 'next/link';
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
  // "krawiec <miasto>", so lead with it and keep both. City pages rank ~11
  // with ~1% CTR, so the title promises what the page now has: ratings and prices
  return {
    title: `Krawcowa i krawiec ${cityData.name} — ${pracownie(n)}, opinie i ceny`,
    description: `Krawcowa ${cityData.name}: ${pracownie(n)} w ${cityData.loc} z adresami, telefonami i opiniami. Najlepiej oceniane pracownie, ceny przeróbek ${PRICES_YEAR} i pogotowie krawieckie.`,
    alternates: { canonical: `/${city}` },
  };
}

export default async function CityPage({ params }) {
  const { city } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) notFound();

  const cityTailors = tailors[city] ?? [];
  const districts = districtsFor(city);
  // Only ratings that mean something: backed by reviews and actually good
  const topRated = byRating(cityTailors).filter((t) => t.rating >= 4 && t.reviewCount > 0).slice(0, 5);
  const withPhone = cityTailors.filter((t) => t.phone).length;
  const biggestDistricts = [...districts].sort((a, b) => b.tailors.length - a.tailors.length).slice(0, 3);
  const best = topRated[0];
  // This city's average prices (kb.pl); a city missing from that list
  // simply shows no price table
  const prices = CITY_PRICES[city];
  const priceRows = prices
    ? [
        ['hem'], ['taper'], ['skirt'], ['sleeves'],
        ['zip', 'plus koszt zamka'], ['jacketZip', 'plus koszt zamka'], ['linedDress'],
      ].map(([k, note]) => ({ service: PRICE_LABELS[k], price: prices[k], note }))
    : [];

  // Answers are built from this city's own listings, so each city page says
  // something different instead of repeating one template
  const faq = [
    {
      q: `Ile jest pracowni krawieckich w ${cityData.loc}?`,
      a: `W katalogu ${pracownie(cityTailors.length).endsWith('pracownie krawieckie') ? 'są' : 'jest'} ${pracownie(cityTailors.length)} w ${cityData.loc}${withPhone ? ` (${withPhone} z numerem telefonu)` : ''}.${biggestDistricts.length ? ` Najwięcej jest w dzielnicach: ${biggestDistricts.map((d) => `${districtTitle(d)} (${d.tailors.length})`).join(', ')}.` : ''}`,
    },
    best && {
      q: `Jaka krawcowa w ${cityData.loc} ma najlepsze opinie?`,
      a: `Najwyżej oceniana w katalogu jest ${best.name} — ${best.rating.toFixed(1).replace('.', ',')}/5 (${opinie(best.reviewCount)}). Opinie pochodzą z Panoramy Firm; przy niewielu opiniach warto przeczytać je przed wizytą.`,
    },
    prices && {
      q: `Ile kosztuje skrócenie spodni w ${cityData.loc}?`,
      a: `Średnio ok. ${prices.hem} zł w ${PRICES_YEAR} r., a zwężenie spodni ok. ${prices.taper} zł. Jeansy z zachowaniem oryginalnego szwu i spodnie z podszewką kosztują więcej. Zapytaj o cenę przed zostawieniem ubrania.`,
    },
    {
      q: `Czy krawcowa w ${cityData.loc} zrobi poprawkę od ręki?`,
      a: `Proste rzeczy, jak wymiana zamka czy skrócenie spodni, wiele pracowni zrobi tego samego lub następnego dnia, często z dopłatą za ekspres. Zadzwoń wcześniej i zapytaj o termin.`,
    },
  ].filter(Boolean);

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

        {topRated.length >= 2 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Najlepiej oceniane pracownie krawieckie — {cityData.name}</h2>
            <ol className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
              {topRated.map((t, i) => (
                <li key={t.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-slate-400 font-semibold w-5">{i + 1}.</span>
                  <Link href={`/${city}/${tailorSlug(t)}`} className="flex-1 min-w-0 truncate text-slate-800 hover:text-blue-700">{t.name}</Link>
                  <span className="text-sm text-slate-600 whitespace-nowrap">★ {t.rating.toFixed(1).replace('.', ',')} · {opinie(t.reviewCount)}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {priceRows.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Ile kosztują przeróbki krawieckie w {cityData.loc}?</h2>
            <p className="text-slate-500 text-sm mb-3">Średnie ceny w {PRICES_YEAR} r. (cennik miejski kb.pl). Każda pracownia ustala własne — zapytaj przed zleceniem.</p>
            <table className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm text-sm overflow-hidden">
              <tbody className="divide-y divide-slate-100">
                {priceRows.map((p) => (
                  <tr key={p.service}>
                    <td className="px-5 py-2.5 text-slate-700">{p.service}{p.note && <span className="text-slate-400"> ({p.note})</span>}</td>
                    <td className="px-5 py-2.5 text-right font-semibold text-slate-900 whitespace-nowrap">ok. {p.price} zł</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm mt-3">
              <Link href="/poradnik/cennik-uslug-krawieckich" className="text-blue-700 hover:underline">Porównaj ceny w 16 miastach</Link>
              <span className="text-slate-300 mx-2">·</span>
              <Link href="/poradnik/ile-kosztuje-skrocenie-spodni" className="text-blue-700 hover:underline">Ile kosztuje skrócenie spodni?</Link>
            </p>
          </section>
        )}

        <h2 className="text-xl font-bold text-slate-900 mb-3">Wszystkie pracownie krawieckie — {cityData.name}</h2>
        <TailorList citySlug={city} tailors={cityTailors} />

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Najczęstsze pytania — krawcowa {cityData.name}</h2>
          <div className="space-y-4">
            {faq.map((f) => (
              <div key={f.q} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-1">{f.q}</h3>
                <p className="text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
