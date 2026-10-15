import { pracownie } from './seo';

// Service landing pages per city (/[city]/uslugi/[service]). We don't know which
// tailor offers which service, so the copy describes the service and lists the
// city's tailors best-rated first — never claims a specific shop does it.
export const services = [
  {
    slug: 'przerobki-krawieckie',
    name: 'Przeróbki i poprawki krawieckie',
    short: 'Przeróbki krawieckie',
    title: (city) => `Przeróbki krawieckie ${city.name} — poprawki i naprawy odzieży`,
    description: (city, n) =>
      `Przeróbki i poprawki krawieckie w ${city.loc}: skracanie spodni, zwężanie, wymiana zamków. ${pracownie(n)} z adresami, telefonami i opiniami.`,
    h1: (city) => `Przeróbki i poprawki krawieckie w ${city.loc}`,
    intro: (city) =>
      `Spodnie za długie, marynarka za luźna, a w ulubionej kurtce zepsuł się zamek? Przeróbki krawieckie to najczęstszy powód wizyty u krawcowej — i zwykle najtańszy sposób, żeby ubranie znów dobrze leżało. Poniżej znajdziesz pracownie krawieckie w ${city.loc}, które zajmują się poprawkami i naprawami odzieży, posortowane od najlepiej ocenianych.`,
    sections: [
      {
        heading: 'Jakie przeróbki wykonuje krawcowa?',
        items: [
          'skracanie i podszywanie spodni, spódnic, sukienek i rękawów',
          'zwężanie i poszerzanie ubrań w talii, biodrach i nogawkach',
          'wymiana zamków w spodniach, kurtkach i płaszczach',
          'poprawki sukni ślubnych, wizytowych i garniturów',
          'naprawa rozdarć, cerowanie i wzmacnianie szwów',
          'przyszywanie guzików, nabijanie nap i drobne naprawy',
        ],
      },
    ],
    tips: [
      'Na skracanie spodni zabierz buty, z którymi będziesz je nosić — od tego zależy właściwa długość.',
      'Przy zwężaniu i poprawkach sukni najlepiej umówić się na przymiarkę, zanim krawcowa zacznie pruć.',
      'Zapytaj o termin i cenę przed zostawieniem ubrania — przy większych przeróbkach różnice między pracowniami bywają spore.',
    ],
  },
  {
    slug: 'pogotowie-krawieckie',
    name: 'Pogotowie krawieckie',
    short: 'Pogotowie krawieckie',
    title: (city) => `Pogotowie krawieckie ${city.name} — szybkie naprawy odzieży`,
    description: (city, n) =>
      `Pogotowie krawieckie w ${city.loc}: ekspresowe poprawki, wymiana zamka, skracanie na już. ${pracownie(n)} z telefonami — zadzwoń i zapytaj o termin.`,
    h1: (city) => `Pogotowie krawieckie w ${city.loc}`,
    intro: (city) =>
      `Potrzebujesz poprawki na dziś albo na jutro — przed weselem, rozmową o pracę czy wyjazdem? W ${city.loc} wiele pracowni krawieckich przyjmuje pilne zlecenia. Nie każda oferuje jednak ekspresowe terminy, dlatego najlepiej zadzwonić przed wizytą. Poniżej lista pracowni z numerami telefonów, od najlepiej ocenianych.`,
    sections: [
      {
        heading: 'Co zwykle da się zrobić od ręki?',
        items: [
          'wymiana zamka w spodniach lub spódnicy',
          'skrócenie spodni lub rękawów',
          'przyszycie guzika, naprawa rozprutego szwu',
          'drobne poprawki sukienki lub garnituru przed uroczystością',
        ],
      },
    ],
    tips: [
      'Zadzwoń wcześniej i zapytaj, czy pracownia przyjmie zlecenie na dziś — ekspres często wiąże się z dopłatą.',
      'Przy pilnej poprawce sukni lub garnituru zabierz ze sobą buty i dodatki, z którymi będziesz je nosić.',
      'Większe przeróbki (np. zwężanie z przymiarką) rzadko da się zrobić od ręki — warto zostawić zapas czasu.',
    ],
  },
];

export const serviceBySlug = (slug) => services.find((s) => s.slug === slug);
