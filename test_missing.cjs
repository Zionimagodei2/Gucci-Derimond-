const data = require('./scraped_categories.json');
const cheerio = require('cheerio');
fetch('https://toyotapowered.com/pages/4th-gen-4runner-2003-2009').then(r=>r.text()).then(html => {
  const $ = cheerio.load(html);
  const links = [];
  $('a[href^="/collections/"]').each((i, el) => {
    if ($(el).find('img').length > 0) links.push($(el).attr('href'));
  });
  console.log('Fetched links:', links.length);
  console.log('Missing:', links.filter(l => !data['4th Gen 4Runner'].find(c => c.link === l)));
});
