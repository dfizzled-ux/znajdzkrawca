// Scraper for panoramafirm.pl — extracts krawiec listings for Polish cities
// Usage: npm run scrape
// Output: src/lib/tailors.json

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CITIES = [
  { slug: 'warszawa', region: 'mazowieckie,,warszawa' },
  { slug: 'krakow',   region: 'małopolskie,,kraków' },
  { slug: 'wroclaw',  region: 'dolnośląskie,,wrocław' },
  { slug: 'gdansk',   region: 'pomorskie,,gdańsk' },
  { slug: 'lodz',     region: 'łódzkie,,łódź' },
  { slug: 'poznan',   region: 'wielkopolskie,,poznań' },
];

const BASE = 'https://panoramafirm.pl';
const PAGES_PER_CITY = 3; // ~60 listings per city (20–25 per page)
const DELAY_MS = 1800;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function extractListings(page) {
  return page.evaluate(() => {
    const cards = Array.from(
      document.querySelectorAll('div[class*="target:border-r-blue"]')
    );

    return cards.flatMap((card) => {
      // Name — the main title link
      const nameEl = card.querySelector('a[data-ga="l-title"]');
      const name = nameEl?.textContent.trim();
      if (!name || name.length < 3) return [];

      const href = nameEl?.getAttribute('href') || '';
      const sourceUrl = href ? `https://panoramafirm.pl${href}` : '';

      // Address — the line-clamp-1 paragraph holds the one-line address
      const addrEl = card.querySelector('p[class*="line-clamp-1"]');
      const address = addrEl?.textContent.trim() || '';

      // Phone — stored in a tooltip div that's invisible via CSS but present in DOM
      let phone = '';
      const phoneLink = card.querySelector('a[data-ga="l-phone"]');
      if (phoneLink) {
        // The tooltip is a sibling div with class "invisible absolute..."
        let sibling = phoneLink.nextElementSibling;
        while (sibling) {
          if (sibling.className && sibling.className.includes('invisible')) {
            // The number is in the first span inside the inner div
            const span = sibling.querySelector('span');
            if (span) phone = span.textContent.trim();
            break;
          }
          sibling = sibling.nextElementSibling;
        }
      }

      return [{ name, address, phone, sourceUrl }];
    });
  });
}

async function scrapeCity(page, city) {
  const listings = [];
  const seen = new Set();

  for (let p = 1; p <= PAGES_PER_CITY; p++) {
    const url = `${BASE}/krawcy/${city.region}/firmy,${p}.html`;
    console.log(`  Page ${p}: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await sleep(DELAY_MS);

      const pageListings = await extractListings(page);
      console.log(`    → ${pageListings.length} listings found`);

      if (pageListings.length === 0) {
        console.log(`    → No listings, stopping.`);
        break;
      }

      for (const item of pageListings) {
        const key = item.name.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          listings.push(item);
        }
      }
    } catch (err) {
      console.error(`    Error on page ${p}:`, err.message);
      break;
    }
  }

  return listings;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pl-PL',
  });
  const page = await context.newPage();

  const allData = {};
  let totalFound = 0;

  for (const city of CITIES) {
    console.log(`\nScraping ${city.slug}...`);
    const listings = await scrapeCity(page, city);
    allData[city.slug] = listings.map((item, i) => ({ id: i + 1, ...item }));
    totalFound += listings.length;
    console.log(`  Total: ${listings.length} unique listings`);
  }

  await browser.close();

  const outPath = join(__dirname, '..', 'src', 'lib', 'tailors.json');
  writeFileSync(outPath, JSON.stringify(allData, null, 2), 'utf8');

  console.log(`\nDone. ${totalFound} total listings → src/lib/tailors.json`);
  for (const [city, items] of Object.entries(allData)) {
    console.log(`  ${city}: ${items.length}`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
