const nayan = require('nayan-videos-downloader');
console.log(Object.keys(nayan));
nayan.pinterestdown('https://www.pinterest.com/pin/1039064657788484920/').then(console.log).catch(console.error);
