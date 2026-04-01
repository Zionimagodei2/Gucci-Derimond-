import fs from 'fs';

async function scrape() {
  const res = await fetch('https://toyotapowered.com');
  const text = await res.text();
  
  // Find all links and images
  const matches = [...text.matchAll(/<a[^>]*href="([^"]+)"[^>]*>.*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/gs)];
  
  const categories = [];
  for (const match of matches) {
    if (match[1].includes('/collections/') && match[3]) {
      categories.push({
        link: match[1],
        image: match[2],
        name: match[3]
      });
    }
  }
  console.log(JSON.stringify(categories, null, 2));
}

scrape();
