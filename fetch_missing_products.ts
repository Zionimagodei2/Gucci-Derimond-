import fs from 'fs';

const categoriesData = JSON.parse(fs.readFileSync('scraped_categories.json', 'utf8'));
const existingProducts = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const existingIds = new Set(existingProducts.map((p: any) => p.id.toString()));

async function scrapeCollection(link: string) {
  let allProducts: any[] = [];
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
  return allProducts;
}

async function scrapeAll() {
  const collectionProducts: Record<string, string[]> = {};
  let newProductsCount = 0;
  
  for (const gen in categoriesData) {
    for (const cat of categoriesData[gen]) {
      if (!collectionProducts[cat.link]) {
        console.log(`Scraping ${cat.link}...`);
        const products = await scrapeCollection(cat.link);
        
        const productIds = products.map(p => p.id.toString());
        collectionProducts[cat.link] = productIds;
        
        for (const p of products) {
          const idStr = p.id.toString();
          if (!existingIds.has(idStr)) {
            existingIds.add(idStr);
            existingProducts.push({
              id: idStr,
              name: p.title,
              brand: p.vendor,
              price: parseFloat(p.variants[0]?.price || 0),
              salePrice: p.variants[0]?.compare_at_price ? parseFloat(p.variants[0].compare_at_price) : null,
              image: p.images[0]?.src || '',
              badge: p.tags.includes('New') ? 'New' : (p.tags.includes('Sale') ? 'Sale' : null),
              category: p.product_type || 'Accessories',
              description: p.body_html ? p.body_html.replace(/<[^>]+>/g, '').trim() : '',
              rating: 5,
              reviews: Math.floor(Math.random() * 50) + 1,
              created_at: p.created_at,
              tags: p.tags
            });
            newProductsCount++;
          }
        }
      }
    }
  }
  
  fs.writeFileSync('collection_products.json', JSON.stringify(collectionProducts, null, 2));
  fs.writeFileSync('products.json', JSON.stringify(existingProducts, null, 2));
  console.log(`Done scraping collection products. Added ${newProductsCount} new products.`);
}

scrapeAll();
