import fs from 'fs';
import * as cheerio from 'cheerio';

const generations = [
  { name: "3rd Gen 4Runner", url: "https://toyotapowered.com/pages/3rd-gen-4runner-1996-2002" },
  { name: "4th Gen 4Runner", url: "https://toyotapowered.com/pages/4th-gen-4runner-2003-2009" },
  { name: "5th Gen 4Runner", url: "https://toyotapowered.com/pages/5th-gen-4runner-2010-2023" },
  { name: "1st Gen Tacoma", url: "https://toyotapowered.com/pages/1st-gen-tacoma-1995-2004" },
  { name: "2nd Gen Tacoma", url: "https://toyotapowered.com/pages/2nd-gen-tacoma-2005-2016" },
  { name: "3rd Gen Tacoma", url: "https://toyotapowered.com/pages/2nd-gen-tacoma-2005-2015" }
];

async function updateImages() {
  const data = JSON.parse(fs.readFileSync('scraped_categories.json', 'utf8'));
  
  for (const gen of generations) {
    try {
      console.log(`Fetching ${gen.url}...`);
      const res = await fetch(gen.url);
      if (!res.ok) {
        console.error(`Failed to fetch ${gen.url}: ${res.status}`);
        continue;
      }
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const fetchedCategories = [];
      
      // Find all links that go to collections
      $('a[href^="/collections/"]').each((i, el) => {
        const href = $(el).attr('href');
        const imgEl = $(el).find('img');
        
        if (imgEl.length > 0) {
          let img = imgEl.attr('src') || imgEl.attr('data-manual-src') || imgEl.attr('data-src');
          if (!img) {
            console.log(`No src for ${href}`);
          }
          if (img) {
            // Fix image URL encoding
            img = img.replace(/&amp;/g, '&');
            if (img.startsWith('//')) {
              img = 'https:' + img;
            } else if (img.startsWith('/')) {
              img = 'https://toyotapowered.com' + img;
            }
            
            // Extract the title
            let text = $(el).find('.product-block__title').text().trim();
            if (!text) {
              text = $(el).find('.h4').text().trim();
            }
            if (!text) {
              text = $(el).text().replace(/\s+/g, ' ').replace(/\d+\s*products?$/i, '').trim();
            }
            
            if (text && !fetchedCategories.find(c => c.link === href)) {
              fetchedCategories.push({ name: text, link: href, image: img });
            } else {
              console.log(`Skipped ${href} - text: "${text}", already exists: ${!!fetchedCategories.find(c => c.link === href)}`);
            }
          }
        }
      });
      
      console.log(`Fetched ${fetchedCategories.length} categories for ${gen.name}`);
      if (!data[gen.name]) {
        data[gen.name] = [];
      }
      
      let updatedCount = 0;
      let addedCount = 0;
      
      for (const fetchedCat of fetchedCategories) {
        const existingCat = data[gen.name].find(c => c.link === fetchedCat.link);
        if (existingCat) {
          if (existingCat.image !== fetchedCat.image || existingCat.name !== fetchedCat.name) {
            existingCat.image = fetchedCat.image;
            // Only update name if it's not empty and we want to correct it
            if (fetchedCat.name) {
              existingCat.name = fetchedCat.name;
            }
            updatedCount++;
          }
        } else {
          data[gen.name].push(fetchedCat);
          addedCount++;
        }
      }
      
      console.log(`Updated ${updatedCount} categories, added ${addedCount} categories for ${gen.name}`);
      
    } catch (e) {
      console.error(`Error processing ${gen.name}:`, e);
    }
  }
  
  fs.writeFileSync('scraped_categories.json', JSON.stringify(data, null, 2));
  console.log('Done updating images in scraped_categories.json');
}

updateImages();

