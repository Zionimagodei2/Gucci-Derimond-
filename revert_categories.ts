import fs from 'fs';

const data = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

data.forEach((p: any) => {
  if (p.category === 'rooftop-tent') {
    p.category = 'camping';
  } else if (p.category === 'camper-storage') {
    if (p.name.includes('Velcro Bag') || p.name.includes('Base Plate')) {
      p.category = 'interior';
    } else {
      p.category = 'camping';
    }
  } else if (p.category === 'vehicle-decals') {
    p.category = 'exterior';
  }
});

fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
console.log('Reverted categories');
