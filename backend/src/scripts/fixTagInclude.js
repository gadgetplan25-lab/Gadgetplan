// Script to fix Tag include in getProductById
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../controllers/productController.js');
let content = fs.readFileSync(filePath, 'utf8');

// Find the Tag include without through attributes
const searchPattern = `{
          model: Tag,
          as: "tags",
          attributes: ["id", "name"],
        },`;

const replacement = `{
          model: Tag,
          as: "tags",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },`;

if (content.includes(searchPattern)) {
    content = content.replace(searchPattern, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Fixed Tag include - added through attributes');
} else {
    console.log('⚠️ Pattern not found, trying alternative...');

    // Try without exact whitespace
    const alt = content.replace(
        /model: Tag,\s+as: "tags",\s+attributes: \["id", "name"\],\s+}/,
        'model: Tag,\n          as: "tags",\n          attributes: ["id", "name"],\n          through: { attributes: [] },\n        }'
    );

    if (alt !== content) {
        fs.writeFileSync(filePath, alt, 'utf8');
        console.log('✅ Fixed Tag include with alternative pattern');
    } else {
        console.log('❌ Could not find pattern to fix');
    }
}
