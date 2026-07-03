const axios = require('axios');
axios.get('https://www.pinterest.com/pin/1039064657788484920/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0'
  }
}).then(r => {
  const match = r.data.match(/"contentUrl":"([^"]+)"/);
  console.log(match ? match[1] : "not found contentUrl");
}).catch(console.error);
