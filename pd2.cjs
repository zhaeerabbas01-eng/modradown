const axios = require('axios');
axios.post('https://pinterestvideodownloader.com/download.php', 'url=https://in.pinterest.com/pin/1039064657788484920/', {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
    }
}).then(r => console.log(r.data)).catch(console.error);
