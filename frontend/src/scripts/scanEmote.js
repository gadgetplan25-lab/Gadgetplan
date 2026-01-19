const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../app/dashboard');

function scanDir(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Regex for common emojis
            const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]/u;

            if (emojiRegex.test(content)) {
                console.log(`\n📄 File: ${fullPath.replace(__dirname, '')}`);

                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (emojiRegex.test(line)) {
                        console.log(`   Line ${index + 1}: ${line.trim()}`);
                    }
                });
            }
        }
    });
}

console.log("Mencari Emoji di folder dashboard...");
scanDir(dir);
