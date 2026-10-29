// Typical prices for common alterations, rounded into ranges from 2026 price
// lists for Polish towns (kb.pl city price lists: small towns sit at the low
// end, Warszawa at the top — e.g. skrócenie spodni ~27 zł vs ~41 zł).
// Shown as a guide only; every page says to ask the tailor first.
export const PRICES = [
  { service: 'Skrócenie spodni', range: '25–45 zł' },
  { service: 'Zwężenie spodni', range: '40–55 zł' },
  { service: 'Skrócenie spódnicy lub sukienki', range: '35–60 zł', note: 'sukienka wielowarstwowa nawet ok. 90 zł' },
  { service: 'Skrócenie rękawów', range: '35–50 zł' },
  { service: 'Wymiana zamka w spodniach lub sukience', range: '35–50 zł', note: 'plus koszt zamka' },
  { service: 'Wymiana zamka w kurtce', range: '60–90 zł', note: 'plus koszt zamka' },
];

export const PRICES_YEAR = 2026;
