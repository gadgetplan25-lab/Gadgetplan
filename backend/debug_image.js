const axios = require('axios');

async function checkImage() {
    const imageUrl = 'http://localhost:8080/public/products/1759676896785-989619247.png';
    try {
        console.log(`Checking image at: ${imageUrl}`);
        const res = await axios.get(imageUrl);
        console.log('✅ Image Status:', res.status);
        console.log('✅ Content Type:', res.headers['content-type']);
        console.log('✅ Content Length:', res.headers['content-length']);
    } catch (err) {
        console.error('❌ Error fetching image:', err.message);
        if (err.response) {
            console.error('Response Status:', err.response.status);
            console.error('Response Data:', err.response.data);
        }
    }
}

checkImage();
