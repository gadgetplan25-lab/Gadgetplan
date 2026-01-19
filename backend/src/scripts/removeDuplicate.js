// Script to remove duplicate getProductById function
// This will be used to clean up the productController.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../controllers/productController.js');
let content = fs.readFileSync(filePath, 'utf8');

// Find and remove the first getProductById (line 294-325)
const duplicateStart = content.indexOf('exports.getProductById = async (req, res) => {');
if (duplicateStart !== -1) {
    // Find the end of this function
    let braceCount = 0;
    let inFunction = false;
    let endIndex = duplicateStart;

    for (let i = duplicateStart; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
            inFunction = true;
        }
        if (content[i] === '}') {
            braceCount--;
            if (inFunction && braceCount === 0) {
                endIndex = i + 2; // Include }; and newline
                break;
            }
        }
    }

    // Check if there's another getProductById after this
    const remaining = content.substring(endIndex);
    const hasSecond = remaining.indexOf('exports.getProductById') !== -1;

    if (hasSecond) {
        // Remove the first one
        content = content.substring(0, duplicateStart) +
            '// Removed duplicate getProductById - using newer version below\n\n' +
            content.substring(endIndex);

        fs.writeFileSync(filePath, content, 'utf8');
        console.log('✅ Removed duplicate getProductById function');
    } else {
        console.log('⚠️ Only one getProductById found, skipping removal');
    }
} else {
    console.log('❌ getProductById not found');
}
