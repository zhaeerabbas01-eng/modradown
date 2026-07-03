try {
  const nd = require('nayan-media-downloader');
  nd.nayan('https://www.pinterest.com/pin/1039064657788484920/').then(console.log).catch(console.error);
} catch (e) { console.error(e.message); }
