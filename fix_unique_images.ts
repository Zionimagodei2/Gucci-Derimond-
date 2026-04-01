import fs from 'fs';

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const allImages = JSON.parse(fs.readFileSync('toyota_images_all.json', 'utf8'));

// Filter out tiny images and logos, prefer product-looking images
const validImages = allImages.filter((img: string) => {
  return img.includes('products/') || img.includes('cdn.shopify.com/s/files/');
});

// Shuffle the images array to get random unique images
for (let i = validImages.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [validImages[i], validImages[j]] = [validImages[j], validImages[i]];
}

// Keep track of used images to ensure uniqueness
const usedImages = new Set<string>();

// Keep the first 11 products intact (ARB products)
// For the rest, assign unique images
let imageIndex = 0;

for (let i = 0; i < products.length; i++) {
  const p = products[i];
  
  // Skip the first 11 ARB products which have correct images
  if (i < 11) {
    usedImages.add(p.image);
    continue;
  }

  // Find the next unique image
  while (imageIndex < validImages.length && usedImages.has(validImages[imageIndex])) {
    imageIndex++;
  }

  if (imageIndex < validImages.length) {
    p.image = validImages[imageIndex];
    usedImages.add(validImages[imageIndex]);
    imageIndex++;
  }
}

fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
console.log(`Assigned unique images to ${products.length - 11} products.`);
