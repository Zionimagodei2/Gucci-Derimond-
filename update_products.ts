import fs from 'fs';

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const images = JSON.parse(fs.readFileSync('toyota_images_all.json', 'utf8'));

// Filter out tiny images and logos, prefer product-looking images
const validImages = images.filter((img: string) => {
  return img.includes('products/') || img.includes('cdn.shopify.com/s/files/');
});

// Shuffle the images array
for (let i = validImages.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [validImages[i], validImages[j]] = [validImages[j], validImages[i]];
}

let imageIndex = 0;

for (const product of products) {
  if (imageIndex < validImages.length) {
    product.image = validImages[imageIndex++];
  }
}

fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
console.log(`Updated ${products.length} products with new images.`);
