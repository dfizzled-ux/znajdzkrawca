// Guides at /poradnik/[slug]. They target price and how-to searches
// ("ile kosztuje skrócenie spodni", "cennik usług krawieckich") and link every
// city page, so city pages get links from pages that rank for other queries.
//
// Prices come from CITY_PRICES (kb.pl, see cityPrices.js); the copy only makes
// general claims ("zwykle drożej") where we have no number to back it.
//
// A section is { heading, paragraphs?, items?, table? } where table is
// 'hem' (one service, every city) or 'cennik' (main services, every city).
// `updated` is the date the guide's text last changed: it feeds the sitemap.

export const guides = [
  {
    slug: 'ile-kosztuje-skrocenie-spodni',
    updated: '2026-11-16',
    title: 'Ile kosztuje skrócenie spodni u krawcowej? Ceny w 16 miastach',
    short: 'Ile kosztuje skrócenie spodni',
    description:
      'Skrócenie spodni u krawcowej kosztuje średnio 30–41 zł. Sprawdź ceny w 16 miastach, od czego zależy cena skracania jeansów i spodni garniturowych i jak przygotować się do wizyty.',
    h1: 'Ile kosztuje skrócenie spodni?',
    lead: (r) =>
      `Skrócenie zwykłych spodni u krawcowej kosztuje średnio od ${r.min} zł (${r.minCities}) do ${r.max} zł (${r.maxCities}), więc różnica między miastami to ok. ${r.max - r.min} zł. Jeansy z zachowaniem fabrycznego szwu, spodnie z podszewką albo z mankietem kosztują zwykle więcej.`,
    sections: [
      {
        heading: 'Cena skrócenia spodni w Twoim mieście',
        paragraphs: [
          'Średnie ceny skrócenia spodni o normalnym stopniu skomplikowania. Kliknij miasto, żeby zobaczyć tamtejsze pracownie krawieckie z telefonami i opiniami.',
        ],
        table: 'hem',
      },
      {
        heading: 'Od czego zależy cena?',
        items: [
          'Rodzaj spodni: proste spodnie materiałowe są najtańsze, spodnie garniturowe z podszewką i spodnie z mankietem wymagają więcej pracy.',
          'Jeansy: zwykłe podwinięcie kosztuje tyle co przy innych spodniach, ale skrócenie z zachowaniem oryginalnego, przetartego szwu jest droższe.',
          'Materiał: grube tkaniny, skóra i materiały elastyczne trudniej się szyje.',
          'Termin: wiele pracowni bierze dopłatę za wykonanie od ręki lub na następny dzień.',
          'Miasto i dzielnica: pracownie w centrum dużego miasta są zwykle droższe niż na osiedlach i w mniejszych miejscowościach.',
        ],
      },
      {
        heading: 'Jak przygotować się do wizyty u krawcowej?',
        items: [
          'Zabierz buty, z którymi będziesz nosić spodnie — od wysokości obcasa zależy właściwa długość.',
          'Przymierz spodnie na miejscu: krawcowa zaznaczy długość szpilkami lub kredą.',
          'Nowe spodnie z bawełny lub jeansu najpierw wypierz — po praniu mogą się skurczyć.',
          'Zapytaj o cenę i termin przed zostawieniem ubrania.',
        ],
      },
      {
        heading: 'Ile trwa skrócenie spodni?',
        paragraphs: [
          'Samo skrócenie to krótka praca, ale pracownie realizują zlecenia w kolejności. Zwykle odbierzesz spodnie po kilku dniach; w trybie ekspresowym często tego samego lub następnego dnia. Jeśli potrzebujesz spodni na konkretny termin, powiedz o tym przy oddawaniu.',
        ],
      },
    ],
    faq: (r) => [
      {
        q: 'Ile kosztuje skrócenie spodni u krawcowej?',
        a: `Średnio od ${r.min} do ${r.max} zł, zależnie od miasta. Ceny w Twoim mieście znajdziesz w tabeli powyżej.`,
      },
      {
        q: 'Czy skrócenie jeansów jest droższe?',
        a: 'Zwykłe podwinięcie jeansów kosztuje podobnie jak przy innych spodniach. Za skrócenie z zachowaniem oryginalnego szwu pracownie zwykle liczą więcej, bo wymaga ono odcięcia i ponownego doszycia fabrycznego obszycia.',
      },
      {
        q: 'Czy spodnie skraca się w butach?',
        a: 'Tak — przy przymiarce załóż buty, z którymi będziesz nosić spodnie. Ta sama nogawka inaczej układa się na płaskim bucie, a inaczej na obcasie.',
      },
    ],
  },
  {
    slug: 'cennik-uslug-krawieckich',
    updated: '2026-11-16',
    title: 'Cennik usług krawieckich 2026 — ceny przeróbek w 16 miastach',
    short: 'Cennik usług krawieckich',
    description:
      'Ile kosztują przeróbki krawieckie w 2026 roku? Średnie ceny skracania spodni, zwężania, wymiany zamka i skracania sukienek w 16 miastach Polski.',
    h1: 'Cennik usług krawieckich 2026',
    lead: (r) =>
      `Najtańszą usługą krawiecką jest zwykle skrócenie spodni lub spódnicy (ok. ${r.min}–${r.max} zł), najdroższe są wymiana zamka w kurtce i skrócenie sukienki wielowarstwowej. Poniżej średnie ceny najczęstszych przeróbek w 16 miastach. Każda pracownia ustala własny cennik, więc traktuj je jako orientacyjne.`,
    sections: [
      {
        heading: 'Ceny przeróbek krawieckich w miastach',
        paragraphs: [
          'Średnie ceny brutto za sztukę, przy normalnym stopniu skomplikowania. Ceny wymiany zamków nie obejmują samego zamka. Kliknij miasto, żeby zobaczyć tamtejsze pracownie.',
        ],
        table: 'cennik',
      },
      {
        heading: 'Co podnosi cenę przeróbki?',
        items: [
          'Podszewka: skrócenie sukienki lub zwężenie spódnicy z podszewką to praca na dwóch warstwach materiału.',
          'Wiele warstw lub delikatny materiał: sukienki wieczorowe, tiul, szyfon i jedwab wymagają więcej czasu i doświadczenia.',
          'Zamek: przy wymianie płacisz osobno za nowy zamek; zamki kryte i w kurtkach są droższe od zwykłych.',
          'Ekspres: wykonanie od ręki lub na następny dzień zwykle kosztuje dodatkowo.',
        ],
      },
      {
        heading: 'Jak nie przepłacić?',
        items: [
          'Zadzwoń do dwóch, trzech pracowni i zapytaj o cenę konkretnej usługi — numery telefonów znajdziesz w katalogu.',
          'Przy większej przeróbce (suknia, garnitur, płaszcz) poproś o wycenę po przymiarce, zanim krawcowa zacznie pracę.',
          'Kilka rzeczy naraz? Zapytaj o cenę za całość.',
        ],
      },
    ],
    faq: (r) => [
      {
        q: 'Ile kosztują przeróbki krawieckie w 2026 roku?',
        a: `Proste przeróbki, jak skrócenie spodni, kosztują średnio ${r.min}–${r.max} zł. Wymiana zamka w kurtce to zwykle 70–85 zł plus koszt zamka. Szczegóły dla 16 miast są w tabeli powyżej.`,
      },
      {
        q: 'Gdzie krawcowa jest najtańsza?',
        a: `Z porównywanych miast najniższe średnie ceny skrócenia spodni są w: ${r.minCities}, najwyższe w: ${r.maxCities}. Różnice między pracowniami w jednym mieście bywają jednak większe niż między miastami.`,
      },
      {
        q: 'Czy cena wymiany zamka obejmuje zamek?',
        a: 'Zwykle nie — cennik podaje cenę samej usługi, a zamek doliczany jest osobno. Możesz też przynieść własny zamek; zapytaj wcześniej, czy pracownia to akceptuje.',
      },
    ],
  },
];

export const guideBySlug = (slug) => guides.find((g) => g.slug === slug);
