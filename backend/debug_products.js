const axios = require('axios');

async function checkProducts() {
    try {
        console.log('Fetching products from http://localhost:8080/api/user/products ...');
        const res = await axios.get('http://localhost:8080/api/user/products');
        console.log('Status:', res.status);
        console.log('Data Type:', typeof res.data);

        if (res.data.products && Array.isArray(res.data.products)) {
            console.log('Products Count:', res.data.products.length);
            if (res.data.products.length > 0) {
                console.log('First Product:', JSON.stringify(res.data.products[0], null, 2));
            } else {
                console.warn('⚠️ RESPONSE OK BUT PRODUCTS EMPTY []');
            }
        } else {
            console.log('Raw Data:', JSON.stringify(res.data, null, 2));
        }

    } catch (err) {
        console.error('❌ Error fetching products:', err.message);
        if (err.response) {
            console.error('Response Status:', err.response.status);
            console.error('Response Data:', err.response.data);
        }
    }
}

checkProducts();
