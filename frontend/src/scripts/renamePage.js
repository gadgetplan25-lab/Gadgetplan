const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../app/detailProduct/[id]');
const oldPath = path.join(dir, 'page.js');
const newPath = path.join(dir, 'ProductDetailClient.js');

try {
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log("✅ Renamed page.js to ProductDetailClient.js");
    } else {
        console.log("❌ page.js not found");
    }
} catch (e) {
    console.error(e);
}
