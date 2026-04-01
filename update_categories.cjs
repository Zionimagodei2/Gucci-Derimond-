const fs = require('fs');

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

products.forEach(p => {
  const name = p.name.toLowerCase();
  if (name.includes('wheel') || name.includes('hyperdrive') || name.includes('badlander')) {
    p.category = 'wheels';
  } else if (name.includes('tent') || name.includes('awning') || name.includes('camper') || name.includes('alu-cab') || name.includes('fridge')) {
    p.category = 'camping';
  } else if (name.includes('light') || name.includes('headlight')) {
    p.category = 'lighting';
  } else if (name.includes('coil') || name.includes('shock') || name.includes('suspension')) {
    p.category = 'suspension';
  } else if (name.includes('decal') || name.includes('splash guard') || name.includes('snorkel') || name.includes('bull bar')) {
    p.category = 'exterior';
  } else if (name.includes('pouch') || name.includes('base plate') || name.includes('velcro')) {
    p.category = 'interior';
  } else if (name.includes('t-shirt')) {
    p.category = 'apparel';
  } else {
    p.category = 'accessories';
  }
});

fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
console.log('Products updated.');
