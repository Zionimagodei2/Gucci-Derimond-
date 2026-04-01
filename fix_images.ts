import fs from 'fs';

const data = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

const images: Record<string, string> = {
  'apparel': 'https://cdn.shopify.com/s/files/1/0635/8276/5242/files/57e3bfa1-7c73-4d7f-9a92-a0e225543091.webp?v=1773697888',
  'wheels': 'https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073',
  'rooftop-tent': 'https://cdn.shopify.com/s/files/1/0635/8276/5242/files/fsr-evo-v2-rooftop-tent.webp?v=1772719766',
  'decals': 'https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Rav4_PillarDecals_Mockup_AllBlack.png?v=1773156102',
  'interior': 'https://cdn.shopify.com/s/files/1/0635/8276/5242/files/modular-velcro-panel_a8ff721e-d9d3-4b59-aa16-d28b268675c1.jpg?v=1773785161',
  'suspension': 'https://toyotapowered.com/cdn/shop/products/BALLJOINTCAPSFinal_1400x_5e3cb13d-1cbb-49aa-a0ff-d6acf9aec97c.png?crop=region&crop_height=788&crop_left=143&crop_top=0&crop_width=788&v=1700367530&width=1075',
  'lighting': 'https://toyotapowered.com/cdn/shop/products/61691.16_Tacoma_Amber_XB_Headlights.100.jpg?crop=region&crop_height=740&crop_left=184&crop_top=0&crop_width=740&v=1700365920&width=1109'
};

data.forEach((p: any) => {
  if (p.category === 'apparel') {
    p.image = images['apparel'];
  } else if (p.category === 'interior') {
    p.image = images['interior'];
  } else if (p.category === 'suspension') {
    p.image = images['suspension'];
  } else if (p.category === 'lighting') {
    p.image = images['lighting'];
  } else if (p.name.includes('Tent') || p.name.includes('Evolution')) {
    p.image = images['rooftop-tent'];
  } else if (p.name.includes('Decal')) {
    p.image = images['decals'];
  } else if (p.name.includes('Velcro Panel')) {
    p.image = images['interior'];
  }
});

fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
console.log('Fixed more images');
