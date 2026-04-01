const cheerio = require('cheerio');
fetch('https://toyotapowered.com/pages/4th-gen-4runner-2003-2009').then(r=>r.text()).then(html => {
  const $ = cheerio.load(html);
  ['/collections/arb', '/collections/dirt-king-fabrication', '/collections/teq-offroad', '/collections/merch'].forEach(l => {
    const el = $('a[href="' + l + '"]');
    console.log(l, 'Text:', el.text().trim(), 'Title:', el.find('.product-block__title').text().trim(), 'H4:', el.find('.h4').text().trim());
  });
});
