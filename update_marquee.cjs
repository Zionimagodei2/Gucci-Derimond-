const fs = require('fs');

const marqueeImages = [
  {
    "id": 1,
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg",
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 2,
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/f/f8/TRD_logo.svg",
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 3,
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Lexus_logo.svg",
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 4,
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/4/44/Subaru_logo.svg",
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 5,
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg",
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 6,
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/13/Kia_Motors_Logo.svg",
    "created_at": "2026-03-26T00:00:00Z"
  }
];

fs.writeFileSync('marquee.json', JSON.stringify(marqueeImages, null, 2));
console.log('Marquee updated.');
