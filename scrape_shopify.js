import fs from 'fs';

async function scrapeAllProducts() {
  let allProducts = [];
  let page = 1;
  while (true) {
    console.log(`Fetching page ${page}...`);
    try {
      const res = await fetch(`https://toyotapowered.com/products.json?limit=250&page=${page}`);
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
  
  console.log(`Total products fetched: ${allProducts.length}`);
  
  // Transform to our format
  const formattedProducts = allProducts.map(p => {
    return {
      id: p.id.toString(),
      name: p.title,
      brand: p.vendor,
      price: parseFloat(p.variants[0]?.price || 0),
      salePrice: p.variants[0]?.compare_at_price ? parseFloat(p.variants[0].compare_at_price) : null,
      image: p.images[0]?.src || '',
      badge: p.tags.includes('New') ? 'New' : (p.tags.includes('Sale') ? 'Sale' : null),
      category: p.product_type || 'Accessories',
      description: p.body_html.replace(/<[^>]+>/g, '').trim(),
      rating: 5,
      reviews: Math.floor(Math.random() * 50) + 1,
      created_at: p.created_at,
      tags: p.tags
    };
  });
  
  fs.writeFileSync('new_products.json', JSON.stringify(formattedProducts, null, 2));
  console.log('Saved to new_products.json');
}

scrapeAllProducts();
