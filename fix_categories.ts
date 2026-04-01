import fs from 'fs';

const data = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

data.forEach((p: any) => {
  if (p.name.includes('Tent') || p.name.includes('Evolution')) {
    p.category = 'rooftop-tent';
  } else if (p.name.includes('Velcro Panel') || p.name.includes('Velcro Bag') || p.name.includes('Base Plate')) {
    p.category = 'camper-storage';
  } else if (p.name.includes('Decal')) {
    p.category = 'vehicle-decals';
  }
});

fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
console.log('Fixed categories');
