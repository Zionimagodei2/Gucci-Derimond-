import fs from 'fs';

const categoriesData = JSON.parse(fs.readFileSync('scraped_categories.json', 'utf8'));

async function scrapeCollection(link) {
  let allProducts = [];
  let page = 1;
  while (true) {
    try {
      const res = await fetch(`https://toyotapowered.com${link}/products.json?limit=250&page=${page}`);
      if (!res.ok) break;
      const data = await res.json();
      if (!data.products || data.products.length === 0) {
        break;
      }
      allProducts = allProducts.concat(data.products);
      page++;
    } catch (e) {
      console.error(e);
      break;
    }
  }
  return allProducts.map(p => p.id.toString());
}

async function scrapeAll() {
  const collectionProducts = {};
  for (const gen in categoriesData) {
    for (const cat of categoriesData[gen]) {
      if (!collectionProducts[cat.link]) {
        console.log(`Scraping ${cat.link}...`);
        const productIds = await scrapeCollection(cat.link);
        collectionProducts[cat.link] = productIds;
      }
    }
  }
  fs.writeFileSync('collection_products.json', JSON.stringify(collectionProducts, null, 2));
  console.log('Done scraping collection products');
}

scrapeAll();
