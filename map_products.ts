import fs from 'fs';

const rawProducts = JSON.parse(fs.readFileSync('toyota_all_products.json', 'utf8'));
const fallbackImages = JSON.parse(fs.readFileSync('toyota_images_all.json', 'utf8'));

const mappedProducts = rawProducts.map((p: any) => {
  const price = p.variants && p.variants.length > 0 ? parseFloat(p.variants[0].price) : 0;
  const compareAtPrice = p.variants && p.variants.length > 0 && p.variants[0].compare_at_price ? parseFloat(p.variants[0].compare_at_price) : null;
  
  const type = (p.product_type || '').toLowerCase();
  const tags = (p.tags || []).map((t: string) => t.toLowerCase());
  const title = p.title.toLowerCase();

  let category = 'accessories';
  if (type.includes('wheel') || tags.includes('wheels') || title.includes('wheel')) category = 'wheels';
  else if (type.includes('tent') || type.includes('camping') || type.includes('camper') || tags.includes('camping') || title.includes('tent') || title.includes('awning') || title.includes('camp')) category = 'camping';
  else if (type.includes('light') || tags.includes('lighting') || title.includes('light')) category = 'lighting';
  else if (type.includes('suspension') || tags.includes('suspension') || title.includes('shock') || title.includes('spring') || title.includes('control arm') || title.includes('coilover')) category = 'suspension';
  else if (type.includes('apparel') || type.includes('shirt') || type.includes('hat') || type.includes('patch') || type.includes('decal') || tags.includes('apparel') || title.includes('shirt') || title.includes('hat') || title.includes('patch') || title.includes('decal')) category = 'apparel';
  else if (type.includes('exterior') || type.includes('bumper') || type.includes('rack') || type.includes('grille') || tags.includes('exterior') || title.includes('rack') || title.includes('bumper') || title.includes('grille')) category = 'exterior';
  else if (type.includes('interior') || type.includes('seat') || type.includes('mat') || type.includes('storage') || tags.includes('interior') || title.includes('seat') || title.includes('mat') || title.includes('storage')) category = 'interior';
  else category = 'accessories';

  // Clean up description (strip HTML tags)
  let description = p.body_html ? p.body_html.replace(/<[^>]*>?/gm, '').trim() : '';
  if (description.length > 250) {
    description = description.substring(0, 250) + '...';
  }

  // Generate a random rating between 4.0 and 5.0
  const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
  // Generate a random number of reviews between 5 and 150
  const reviews = Math.floor(Math.random() * (150 - 5 + 1)) + 5;

  // Add a random badge to some products
  let badge = null;
  const rand = Math.random();
  if (rand < 0.1) badge = 'FEATURED';
  else if (rand < 0.2) badge = 'NEW';
  else if (rand < 0.25) badge = 'SALE';

  let image = '';
  if (p.images && p.images.length > 0) {
    image = p.images[0].src;
  } else {
    // Use a random image from the fallback list
    image = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }

  return {
    id: p.id,
    name: p.title,
    brand: p.vendor,
    price: price,
    salePrice: compareAtPrice && compareAtPrice > price ? price : null, // If there's a compare_at_price, price is the sale price
    image: image,
    badge: badge,
    category: category,
    description: description,
    rating: parseFloat(rating),
    reviews: reviews,
    created_at: p.created_at
  };
});

// Sort by category first, then by name
mappedProducts.sort((a: any, b: any) => {
  if (a.category < b.category) return -1;
  if (a.category > b.category) return 1;
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
});

fs.writeFileSync('products.json', JSON.stringify(mappedProducts, null, 2));
console.log(`Successfully mapped and saved ${mappedProducts.length} products to products.json`);

const categoryCounts = mappedProducts.reduce((acc: any, p: any) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});
console.log('Category breakdown:', categoryCounts);
