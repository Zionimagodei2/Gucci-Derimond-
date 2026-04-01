import fs from 'fs';
import * as cheerio from 'cheerio';

const baseUrl = 'https://toyotapowered.com';

async function fetchHtml(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    return await res.text();
  } catch (e) {
    console.error(`Failed to fetch ${url}:`, e);
    return '';
  }
}

async function run() {
  const visited = new Set<string>();
  const toVisit = [baseUrl];
  const allImages = new Set<string>();

  // Limit to 50 pages to avoid taking too long
  let count = 0;
  while (toVisit.length > 0 && count < 50) {
    const url = toVisit.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);
    count++;

    console.log(`Scraping ${url}...`);
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    // Extract images
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('srcset');
      if (src) {
        try {
          const firstUrl = src.split(',')[0].trim().split(' ')[0];
          const absoluteUrl = new URL(firstUrl, baseUrl).href;
          allImages.add(absoluteUrl);
        } catch (e) {}
      }
    });

    // Extract links
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, baseUrl).href;
          // Only visit pages on the same domain, and avoid obvious non-HTML files
          if (absoluteUrl.startsWith(baseUrl) && !absoluteUrl.match(/\.(jpg|png|pdf|zip)$/i)) {
            // Remove hash fragments
            const cleanUrl = absoluteUrl.split('#')[0];
            if (!visited.has(cleanUrl) && !toVisit.includes(cleanUrl)) {
              toVisit.push(cleanUrl);
            }
          }
        } catch (e) {}
      }
    });
  }

  console.log(`Found ${allImages.size} unique images across ${visited.size} pages.`);
  fs.writeFileSync('toyota_images_all.json', JSON.stringify([...allImages], null, 2));
}

run();
