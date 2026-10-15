export const BASE_URL = 'https://znajdzkrawca.pl';

// Polish numeral agreement: 1 pracownia, 2–4 pracownie (but 12–14 pracowni), 5+ pracowni
export function pracownie(n) {
  const lastTwo = n % 100;
  const last = n % 10;
  if (n === 1) return '1 pracownia krawiecka';
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return `${n} pracownie krawieckie`;
  return `${n} pracowni krawieckich`;
}

// Same agreement for "opinia": 1 opinia, 2–4 opinie, 5+ opinii
export function opinie(n) {
  const lastTwo = n % 100;
  const last = n % 10;
  if (n === 1) return '1 opinia';
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return `${n} opinie`;
  return `${n} opinii`;
}

// Highest-rated first (more reviews breaks ties), unrated last in original order
export function byRating(list) {
  return [...list].sort((a, b) => {
    const ra = a.rating ?? -1, rb = b.rating ?? -1;
    if (rb !== ra) return rb - ra;
    return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
  });
}
