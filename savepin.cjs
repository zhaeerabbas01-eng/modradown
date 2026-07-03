const axios = require('axios');
axios.post('https://www.savepin.app/download.php', 'url=https://www.pinterest.com/pin/1039064657788484920/', {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
    }
}).then(r => console.log(r.data.substring(0, 500))).catch(console.error);
