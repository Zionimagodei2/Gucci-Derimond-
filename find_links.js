import * as cheerio from 'cheerio';

async function run() {
  const res = await fetch('https://toyotapowered.com');
  const html = await res.text();
  const $ = cheerio.load(html);
  $('h2.text-overlay__title').each((i, el) => {
    const text = $(el).text().trim();
    const href = $(el).closest('a').attr('href');
    console.log(text, href);
  });
}
run();
