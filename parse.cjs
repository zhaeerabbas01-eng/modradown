const https = require('https');
https.get('https://in.pinterest.com/pin/1039064657788484920/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const fs = require('fs');
    fs.writeFileSync('pin.html', data);
    const match = data.match(/<script id="__PWS_DATA__" type="application\/json">(.+?)<\/script>/s);
    if(match) {
        const json = JSON.parse(match[1]);
        const str = JSON.stringify(json);
        const matches = str.match(/https:\/\/[^"]+\.mp4/g);
        console.log("MP4s:", [...new Set(matches)]);
        const imgs = str.match(/https:\/\/[^"]+\.jpg/g);
        console.log("JPGs count:", imgs ? imgs.length : 0);
        if (imgs) console.log("JPGs:", [...new Set(imgs)].slice(0, 5));
    }
  });
});
