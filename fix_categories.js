const fs = require('fs');
const data = fs.readFileSync('scraped_categories.json', 'utf8');
const fixedData = data.replace(/&amp;/g, '&');
fs.writeFileSync('scraped_categories.json', fixedData);
console.log('Fixed scraped_categories.json');
