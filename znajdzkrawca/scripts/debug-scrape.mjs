// Debug script — dumps first card's inner HTML to see address/phone structure
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  locale: 'pl-PL',
});
const page = await context.newPage();

await page.goto('https://panoramafirm.pl/krawcy/mazowieckie,,warszawa/firmy,1.html', {
  waitUntil: 'networkidle',
  timeout: 30000,
});

const info = await page.evaluate(() => {
  // From debug-1 we know card containers have class "target:border-r-blue"
  const cards = Array.from(document.querySelectorAll('div[class*="target:border-r-blue"]'));
  console.log('Cards found:', cards.length);

  return {
    cardCount: cards.length,
    cards: cards.slice(0, 3).map(card => {
      const nameEl = card.querySelector('h2 a[href*="hth"], h3 a[href*="hth"]');
      const name = nameEl?.textContent.trim();
      const href = nameEl?.getAttribute('href');

      // Get all elements with their text and data attributes
      const elements = Array.from(card.querySelectorAll('*'))
        .map(el => ({
          tag: el.tagName,
          class: (typeof el.className === 'string' ? el.className : '').substring(0, 100),
          text: el.textContent.trim().substring(0, 100),
          attrs: Array.from(el.attributes)
            .filter(a => a.name !== 'class')
            .map(a => `${a.name}="${a.value.substring(0, 60)}"`)
            .join(' '),
        }))
        .filter(el => el.text && el.text.length > 0 && el.text.length < 100);

      return { name, href, elements: elements.slice(0, 40) };
    }),
  };
});

console.log('Total cards:', info.cardCount);
for (const card of info.cards) {
  console.log('\n=== CARD:', card.name, '===');
  console.log('href:', card.href);
  card.elements.forEach(el =>
    console.log(`  <${el.tag} class="${el.class}" ${el.attrs}> "${el.text}"`)
  );
}

await browser.close();
