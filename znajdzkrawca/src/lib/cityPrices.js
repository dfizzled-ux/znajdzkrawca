// Average gross prices (zł, rounded) per city from kb.pl's tailoring price
// lists (kb.pl/cenniki/miejskie/krawcowa/<city>/), updated 2026-04-29.
// kb.pl calls them estimates from offers found online. Regenerate by
// re-downloading those pages; don't edit single numbers by hand.
export const CITY_PRICES_SOURCE = 'kb.pl';
export const CITY_PRICES_DATE = '2026-04-29';
export const cityPricesUrl = (slug) => `https://kb.pl/cenniki/miejskie/krawcowa/${slug}/`;

export const PRICE_LABELS = {
  hem: 'Skrócenie spodni',
  taper: 'Zwężanie spodni',
  sleeves: 'Skrócenie rękawów w bluzce',
  zip: 'Wymiana suwaka w spodniach lub sukienkach',
  hiddenZip: 'Wymiana suwaka krytego',
  jeansZip: 'Wszycie suwaka do spodni jeansowych',
  jacketZip: 'Wymiana zamka w kurtce',
  skirt: 'Skrócenie spódnicy bez podszewki',
  linedDress: 'Skrócenie sukienki z podszewką',
  layeredDress: 'Skrócenie sukienki wielowarstwowej',
};

export const CITY_PRICES = {
  bialystok: { hem: 31, taper: 38, sleeves: 35, zip: 34, hiddenZip: 42, jeansZip: 42, jacketZip: 77, skirt: 33, linedDress: 39, layeredDress: 76 },
  bydgoszcz: { hem: 33, taper: 40, sleeves: 33, zip: 32, hiddenZip: 38, jeansZip: 38, jacketZip: 71, skirt: 31, linedDress: 43, layeredDress: 76 },
  czestochowa: { hem: 34, taper: 42, sleeves: 34, zip: 34, hiddenZip: 41, jeansZip: 41, jacketZip: 72, skirt: 31, linedDress: 47, layeredDress: 76 },
  gdansk: { hem: 37, taper: 44, sleeves: 38, zip: 38, hiddenZip: 46, jeansZip: 45, jacketZip: 77, skirt: 33, linedDress: 48, layeredDress: 78 },
  katowice: { hem: 38, taper: 44, sleeves: 38, zip: 38, hiddenZip: 45, jeansZip: 45, jacketZip: 77, skirt: 33, linedDress: 49, layeredDress: 78 },
  kielce: { hem: 31, taper: 43, sleeves: 34, zip: 32, hiddenZip: 42, jeansZip: 41, jacketZip: 73, skirt: 33, linedDress: 43, layeredDress: 73 },
  krakow: { hem: 39, taper: 44, sleeves: 38, zip: 38, hiddenZip: 45, jeansZip: 45, jacketZip: 83, skirt: 34, linedDress: 49, layeredDress: 85 },
  lodz: { hem: 35, taper: 43, sleeves: 36, zip: 37, hiddenZip: 42, jeansZip: 45, jacketZip: 77, skirt: 33, linedDress: 48, layeredDress: 77 },
  lublin: { hem: 30, taper: 37, sleeves: 34, zip: 32, hiddenZip: 42, jeansZip: 42, jacketZip: 71, skirt: 33, linedDress: 43, layeredDress: 76 },
  poznan: { hem: 38, taper: 46, sleeves: 38, zip: 38, hiddenZip: 45, jeansZip: 45, jacketZip: 77, skirt: 34, linedDress: 49, layeredDress: 78 },
  radom: { hem: 30, taper: 42, sleeves: 33, zip: 28, hiddenZip: 40, jeansZip: 43, jacketZip: 71, skirt: 31, linedDress: 42, layeredDress: 78 },
  rzeszow: { hem: 33, taper: 43, sleeves: 36, zip: 42, hiddenZip: 45, jeansZip: 45, jacketZip: 74, skirt: 33, linedDress: 47, layeredDress: 78 },
  szczecin: { hem: 39, taper: 47, sleeves: 38, zip: 38, hiddenZip: 45, jeansZip: 45, jacketZip: 76, skirt: 33, linedDress: 49, layeredDress: 72 },
  torun: { hem: 33, taper: 38, sleeves: 31, zip: 32, hiddenZip: 36, jeansZip: 38, jacketZip: 71, skirt: 30, linedDress: 39, layeredDress: 72 },
  warszawa: { hem: 41, taper: 47, sleeves: 44, zip: 41, hiddenZip: 48, jeansZip: 48, jacketZip: 83, skirt: 39, linedDress: 52, layeredDress: 92 },
  wroclaw: { hem: 37, taper: 42, sleeves: 38, zip: 38, hiddenZip: 45, jeansZip: 45, jacketZip: 77, skirt: 33, linedDress: 49, layeredDress: 78 },
};

// Cheapest and dearest city for one service, e.g. for "30 zł (Lublin, Radom)".
// names: { slug: 'Kraków', ... }
export function priceRange(key, names) {
  const rows = Object.entries(CITY_PRICES).map(([slug, p]) => [slug, p[key]]);
  const vals = rows.map(([, v]) => v);
  const min = Math.min(...vals), max = Math.max(...vals);
  const list = (v) => rows.filter(([, x]) => x === v).map(([s]) => names[s] ?? s).join(', ');
  return { min, max, minCities: list(min), maxCities: list(max) };
}
