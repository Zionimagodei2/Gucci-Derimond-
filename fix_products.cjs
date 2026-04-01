const fs = require('fs');
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
let changed = 0;
for (const p of products) {
  if (p.brand === 'AJT DESIGN' && p.category === 'wheels') {
    p.category = 'interior';
    changed++;
  }
}
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
console.log(`Changed ${changed} products.`);
