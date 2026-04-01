import fs from 'fs';

const images = JSON.parse(fs.readFileSync('toyota_images_all.json', 'utf8'));
const marquee = JSON.parse(fs.readFileSync('marquee.json', 'utf8'));

let id = marquee.length > 0 ? Math.max(...marquee.map((m: any) => m.id)) + 1 : 1;

// Filter out tiny images and duplicates
const uniqueImages = [...new Set(images)].filter((url: any) => {
  return url.startsWith('http');
});

for (const url of uniqueImages) {
  // Check if it's already in marquee
  if (!marquee.find((m: any) => m.image_url === url)) {
    marquee.push({
      id: id++,
      image_url: url,
      created_at: new Date().toISOString()
    });
  }
}

fs.writeFileSync('marquee.json', JSON.stringify(marquee, null, 2));
console.log(`Added ${uniqueImages.length} images to marquee.json. Total is now ${marquee.length}.`);
