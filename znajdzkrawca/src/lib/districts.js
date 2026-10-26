import { tailors } from './data';

// District pages for the cities whose scraped addresses carry a district
// ("…, 02-793 Warszawa Ursynów"). Where people search for an area that spans
// several official districts (Nowa Huta = Nowa Huta + Mistrzejowice +
// Bieńczyce + …), those are grouped into one page. `areas` are neighbourhoods
// inside the group, mentioned in the page copy so searches like
// "krawcowa ruczaj" or "krawcowa gocław" have a page to match.
const DISTRICT_GROUPS = {
  warszawa: [
    { slug: 'srodmiescie', name: 'Śródmieście', matches: ['Śródmieście'], areas: ['Muranów', 'Powiśle'] },
    { slug: 'praga-poludnie', name: 'Praga-Południe', matches: ['Praga-Południe'], areas: ['Gocław', 'Grochów', 'Saska Kępa'] },
    { slug: 'ursynow', name: 'Ursynów', matches: ['Ursynów'], areas: ['Kabaty', 'Natolin'] },
    { slug: 'wola', name: 'Wola', matches: ['Wola'], areas: [] },
    { slug: 'targowek', name: 'Targówek', matches: ['Targówek'], areas: ['Bródno'] },
    { slug: 'wlochy', name: 'Włochy', matches: ['Włochy'], areas: [] },
    { slug: 'ochota', name: 'Ochota', matches: ['Ochota'], areas: [] },
    { slug: 'mokotow', name: 'Mokotów', matches: ['Mokotów'], areas: [] },
    { slug: 'bielany', name: 'Bielany', matches: ['Bielany'], areas: [] },
    { slug: 'bemowo', name: 'Bemowo', matches: ['Bemowo'], areas: [] },
    { slug: 'bialoleka', name: 'Białołęka', matches: ['Białołęka'], areas: ['Tarchomin'] },
    { slug: 'wilanow', name: 'Wilanów', matches: ['Wilanów'], areas: [] },
    { slug: 'praga-polnoc', name: 'Praga-Północ', matches: ['Praga-Północ'], areas: [] },
  ],
  krakow: [
    { slug: 'stare-miasto', name: 'Stare Miasto', matches: ['Stare Miasto'], areas: [] },
    { slug: 'nowa-huta', name: 'Nowa Huta', titleName: 'Nowa Huta i Mistrzejowice', matches: ['Nowa Huta', 'Mistrzejowice', 'Bieńczyce', 'Wzgórza Krzesławickie', 'Czyżyny'], areas: ['Mistrzejowice', 'Bieńczyce', 'Czyżyny', 'Wzgórza Krzesławickie', 'os. Piastów'] },
    { slug: 'debniki', name: 'Dębniki', titleName: 'Dębniki i Ruczaj', matches: ['Dębniki'], areas: ['Ruczaj', 'Kobierzyn', 'ul. Kapelanka'] },
    { slug: 'pradnik-bialy', name: 'Prądnik Biały', matches: ['Prądnik Biały'], areas: ['Azory', 'Krowodrza Górka'] },
    { slug: 'podgorze', name: 'Podgórze', titleName: 'Podgórze i Prokocim', matches: ['Podgórze', 'Podgórze Duchackie', 'Bieżanów-Prokocim', 'Swoszowice'], areas: ['Podgórze Duchackie', 'Kurdwanów', 'Wola Duchacka', 'Prokocim', 'Bieżanów', 'Swoszowice'] },
    { slug: 'krowodrza', name: 'Krowodrza', titleName: 'Krowodrza i Bronowice', matches: ['Krowodrza', 'Bronowice', 'Zwierzyniec'], areas: ['Bronowice', 'Zwierzyniec', 'Salwator'] },
    { slug: 'grzegorzki', name: 'Grzegórzki', matches: ['Grzegórzki'], areas: [] },
    { slug: 'pradnik-czerwony', name: 'Prądnik Czerwony', matches: ['Prądnik Czerwony'], areas: [] },
  ],
  wroclaw: [
    { slug: 'fabryczna', name: 'Fabryczna', matches: ['Fabryczna'], areas: ['Grabiszyn', 'Muchobór', 'Nowy Dwór', 'Kozanów'] },
    { slug: 'krzyki', name: 'Krzyki', matches: ['Krzyki'], areas: ['Gaj', 'Borek', 'Klecina', 'Partynice'] },
    { slug: 'stare-miasto', name: 'Stare Miasto', matches: ['Stare Miasto'], areas: [] },
    { slug: 'srodmiescie', name: 'Śródmieście', matches: ['Śródmieście'], areas: ['Nadodrze', 'Ołbin', 'Biskupin'] },
    { slug: 'psie-pole', name: 'Psie Pole', matches: ['Psie Pole'], areas: ['Sołtysowice', 'Kowale', 'Karłowice'] },
  ],
  lodz: [
    { slug: 'baluty', name: 'Bałuty', matches: ['Bałuty'], areas: ['Teofilów', 'Radogoszcz'] },
    { slug: 'gorna', name: 'Górna', matches: ['Górna'], areas: ['Chojny'] },
    { slug: 'widzew', name: 'Widzew', matches: ['Widzew'], areas: ['Stoki', 'Olechów'] },
    { slug: 'polesie', name: 'Polesie', matches: ['Polesie'], areas: ['Retkinia', 'Koziny'] },
    { slug: 'srodmiescie', name: 'Śródmieście', matches: ['Śródmieście'], areas: [] },
  ],
  poznan: [
    { slug: 'nowe-miasto', name: 'Nowe Miasto', matches: ['Nowe Miasto'], areas: ['Rataje', 'Chartowo', 'Żegrze'] },
    { slug: 'grunwald', name: 'Grunwald', matches: ['Grunwald'], areas: ['Łazarz', 'Górczyn', 'Junikowo'] },
    { slug: 'stare-miasto', name: 'Stare Miasto', matches: ['Stare Miasto'], areas: ['Winogrady', 'Piątkowo', 'Naramowice'] },
    { slug: 'jezyce', name: 'Jeżyce', matches: ['Jeżyce'], areas: ['Ogrody', 'Strzeszyn'] },
    { slug: 'wilda', name: 'Wilda', matches: ['Wilda'], areas: ['Dębiec'] },
  ],
  // Bydgoszcz and Toruń addresses carry no district (Toruń is one postcode,
  // 87-100), so these match on street name instead. Streets were placed with
  // OpenStreetMap on 26-Oct-2026; a re-scrape keeps them valid, unlike ids.
  bydgoszcz: [
    { slug: 'fordon', name: 'Fordon', streets: ['Lawinowa', 'Tomasza Golloba', 'Pielęgniarska', 'Górskiego Ochotniczego Pogotowia Ratunkowego', 'Galla Anonima'], areas: ['Tatrzańskie', 'Bajka', 'Szybowników', 'Stary Fordon', 'Przylesie'] },
    { slug: 'srodmiescie', name: 'Śródmieście', titleName: 'Śródmieście i Stare Miasto', streets: ['Gdańska', 'Poznańska', 'Marcinkowskiego', 'Chodkiewicza 14', 'Dworcowa', 'Jagiellońska'], areas: ['Stare Miasto', 'Bocianowo', 'Sielanka'] },
    { slug: 'wyzyny', name: 'Wyżyny', titleName: 'Wyżyny i Kapuściska', streets: ['Boya-Żeleńskiego', 'Nałkowskiej', 'Przyjazna', 'Wojska Polskiego'], areas: ['Kapuściska', 'Wzgórze Wolności'] },
    { slug: 'skrzetusko', name: 'Skrzetusko', streets: ['Chodkiewicza 31', 'Powstańców Śląskich'], areas: ['Bielawy'] },
  ],
  torun: [
    { slug: 'rubinkowo', name: 'Rubinkowo', streets: ['Działowskiego', 'Dziewulskiego', 'Łyskowskiego'], areas: ['Skarpa'] },
    { slug: 'stare-miasto', name: 'Stare Miasto', streets: ['Łazienna', 'Wielkie Garbary', 'Chełmińska'], areas: ['Starówka'] },
    { slug: 'chelminskie-przedmiescie', name: 'Chełmińskie Przedmieście', streets: ['Szosa Chełmińska', 'Wybickiego', 'Podgórna'], areas: ['os. Bema', 'os. Lelewela'] },
    { slug: 'jakubskie-przedmiescie', name: 'Jakubskie Przedmieście', streets: ['Kałamarskiego', 'Żółkiewskiego', 'Szosa Lubicka'], areas: [] },
    { slug: 'koniuchy', name: 'Koniuchy', streets: ['Koniuchy', 'Mohna', 'Kozacka'], areas: ['Kozackie Góry'] },
    { slug: 'mokre', name: 'Mokre', streets: ['Świętopełka', 'Grudziądzka'], areas: [] },
    { slug: 'bielawy', name: 'Bielawy', streets: ['Suwalska', 'Nowotarska'], areas: ['Piaski'] },
  ],
};

// A district page needs at least this many tailors — anything thinner is a
// near-empty page Google tends to treat as low quality
const MIN_TAILORS = 2;

// "ul. Małej Łąki 19, 02-793 Warszawa Ursynów" → "Ursynów"
function addressDistrict(address) {
  return address.match(/\d{2}-\d{3}\s+\S+\s+(.+)$/)?.[1]?.trim() ?? null;
}

// "ul. Lawinowa 1 l. Paw.178, 85-794 Bydgoszcz" → "Lawinowa 1 l. Paw.178"
function addressStreet(address) {
  return address.split(',')[0].replace(/^(ul|al|os|pl)\.\s*/i, '').trim();
}

// A street entry matches the street name ("Gdańska") or, where one street
// crosses two districts, a street and number ("Chodkiewicza 14")
function inGroup(g, tailor) {
  if (g.matches) return g.matches.includes(addressDistrict(tailor.address));
  const street = addressStreet(tailor.address);
  return g.streets.some((s) => street === s || street.startsWith(`${s} `));
}

export function districtsFor(citySlug) {
  const groups = DISTRICT_GROUPS[citySlug] ?? [];
  const cityTailors = tailors[citySlug] ?? [];
  return groups
    .map((g) => ({ ...g, tailors: cityTailors.filter((t) => inGroup(g, t)) }))
    .filter((g) => g.tailors.length >= MIN_TAILORS);
}

export function districtForTailor(citySlug, tailor) {
  return districtsFor(citySlug).find((g) => g.tailors.some((t) => t.id === tailor.id)) ?? null;
}

export const districtTitle = (d) => d.titleName ?? d.name;
