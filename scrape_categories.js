import fs from 'fs';

const generations = [
  { name: "3rd Gen 4Runner", url: "https://toyotapowered.com/pages/3rd-gen-4runner-1996-2002" },
  { name: "4th Gen 4Runner", url: "https://toyotapowered.com/pages/4th-gen-4runner-2003-2009" },
  { name: "5th Gen 4Runner", url: "https://toyotapowered.com/pages/5th-gen-4runner-2010-2023" },
  { name: "1st Gen Tacoma", url: "https://toyotapowered.com/pages/1st-gen-tacoma-1995-2004" },
  { name: "2nd Gen Tacoma", url: "https://toyotapowered.com/pages/2nd-gen-tacoma-2005-2016" },
  { name: "3rd Gen Tacoma", url: "https://toyotapowered.com/pages/2nd-gen-tacoma-2005-2015" }
];

async function scrape() {
  const allCategories = {};
  for (const gen of generations) {
    try {
      const res = await fetch(gen.url);
      const html = await res.text();
      
      const regex = /<a[^>]+href=\"([^\"]+)\"[^>]*>.*?<img[^>]+src=\"([^\"]+)\"[^>]*>.*?<\/a>/gis;
      let match;
      const categories = [];
      while ((match = regex.exec(html)) !== null) {
        const href = match[1];
        const img = match[2];
        const textRegex = new RegExp(`<a[^>]+href="${href}"[^>]*>(.*?)<\/a>`, 'is');
        const textMatch = textRegex.exec(html);
        let text = '';
        if (textMatch) {
            text = textMatch[1].replace(/<[^>]+>/g, '').trim();
        }
        
        if (href.includes('/collections/') && text && !categories.find(c => c.link === href)) {
          categories.push({ name: text, link: href, image: img });
        }
      }
      allCategories[gen.name] = categories;
    } catch (e) {
      console.error(`Error scraping ${gen.name}:`, e);
    }
  }
  fs.writeFileSync('scraped_categories.json', JSON.stringify(allCategories, null, 2));
  console.log('Done scraping categories');
}

scrape();
