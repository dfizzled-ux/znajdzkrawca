// Adds opening hours, services and website to each listing in tailors.json,
// read from its Panorama Firm page (sourceUrl).
// Usage: npm run scrape:details            — listings not yet visited
//        npm run scrape:details -- --all   — every listing again
//        npm run scrape:details -- --limit 3
//        npm run scrape:details -- --reviews  — only rated listings with no review count
// Descriptions and reviews are left out on purpose: copied word for word they
// would duplicate Panorama Firm's pages, and the reviews are customers' text.

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'src', 'lib', 'tailors.json');
const DELAY_MS = 1800;
const SAVE_EVERY = 20;
const MAX_SERVICES = 15;

const args = process.argv.slice(2);
const all = args.includes('--all');
const reviewsOnly = args.includes('--reviews');
const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : Infinity;

const DAYS = { Monday: 'pon', Tuesday: 'wt', Wednesday: 'śr', Thursday: 'czw', Friday: 'pt', Saturday: 'sob', Sunday: 'niedz' };

// Keywords that say nothing about what the shop does
const GENERIC = new Set(['krawiec', 'krawcowa', 'krawiectwo', 'zakład krawiecki', 'pracownia krawiecka', 'usługi krawieckie', 'krawiectwo usługi', 'krawcowa usługi', 'krawieckie usługi']);
const NAME_WORDS_KEPT = new Set(['krawiec', 'krawiecki', 'krawiecka', 'krawieckie', 'krawcowa', 'zakład', 'pracownia', 'usługi', 'szycie', 'krawiectwo', 'atelier', 'moda']);

// Drop generic keywords and ones built from the business's own name
// ("diandra", "zakład krawiecki diandra")
function usefulServices(keywords, name) {
  const nameWords = name.toLowerCase().split(/[^\p{L}]+/u).filter((w) => w.length >= 4 && !NAME_WORDS_KEPT.has(w));
  return [...new Set(keywords)]
    .filter((k) => !GENERIC.has(k) && !nameWords.some((w) => k.includes(w)))
    .slice(0, MAX_SERVICES);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function extractDetails(page) {
  return page.evaluate(() => {
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
      try { const j = JSON.parse(s.textContent); return Array.isArray(j) ? j : [j]; } catch { return []; }
    });
    const biz = ld.find((x) => x['@type'] === 'LocalBusiness') ?? {};
    const hours = (biz.openingHoursSpecification ?? []).map((h) => ({ day: h.dayOfWeek, opens: h.opens, closes: h.closes }));

    const keywords = document.querySelector('#keywords-list')?.textContent ?? '';
    const services = keywords.split(',').map((k) => k.replace(/\s+/g, ' ').trim().toLowerCase()).filter((k) => k.length > 2);

    // "Strona www" label in the Kontakt section, followed by the link
    const label = [...document.querySelectorAll('*')].find((e) => e.childElementCount === 0 && e.textContent.trim() === 'Strona www');
    const website = label?.parentElement?.querySelector('a[href^="http"]')?.getAttribute('href') ?? null;

    const rating = parseFloat(biz.aggregateRating?.ratingValue) || null;
    const reviewCount = parseInt(biz.aggregateRating?.reviewCount) || 0;

    return { hours, services, website, rating, reviewCount };
  });
}

async function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  const todo = Object.values(data).flat().filter((t) => t.sourceUrl && (reviewsOnly ? t.rating && !t.reviewCount : all || !t.detailsAt)).slice(0, limit);
  console.log(`${todo.length} listings to visit`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pl-PL',
  });
  const page = await context.newPage();
  const save = () => writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');

  let done = 0, failed = 0;
  for (const t of todo) {
    try {
      const res = await page.goto(t.sourceUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!res || res.status() >= 400) throw new Error(`HTTP ${res?.status()}`);
      await page.waitForSelector('script[type="application/ld+json"]', { state: 'attached', timeout: 10000 }).catch(() => {});
      const d = await extractDetails(page);
      t.hours = d.hours.filter((h) => DAYS[h.day]).map((h) => ({ day: DAYS[h.day], opens: h.opens, closes: h.closes }));
      t.services = usefulServices(d.services, t.name);
      t.website = d.website;
      if (d.rating) { t.rating = d.rating; t.reviewCount = d.reviewCount; }
      t.detailsAt = new Date().toISOString().slice(0, 10);
      done++;
      console.log(`  ${done}/${todo.length} ${t.name.slice(0, 40)} — ${t.hours.length} days, ${t.services.length} services${t.website ? ', www' : ''}${t.rating ? `, ${t.rating}★ (${t.reviewCount})` : ''}`);
    } catch (err) {
      failed++;
      console.error(`  FAILED ${t.name.slice(0, 40)}: ${err.message}`);
    }
    if (done % SAVE_EVERY === 0) save();
    await sleep(DELAY_MS);
  }

  await browser.close();
  save();
  console.log(`\nDone: ${done} updated, ${failed} failed.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
