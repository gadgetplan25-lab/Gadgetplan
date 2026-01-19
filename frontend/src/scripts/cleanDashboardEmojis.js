const fs = require('fs');
const path = require('path');

// Target directory
const TARGET_DIR = path.join(__dirname, '../app/dashboard');

// Regex Matcher untuk Emoji & Simbol Informal
// Mencakup: Emoji standar, Dingbats (✅❌), Transport/Map (🚀), Misc Symbols (⚠️), Geometric Shapes (▸)
const EMOJI_REGEX = /([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2934}\u{2935}\u{25B6}\u{25B8}])/gu;

// List file yang dikecualikan (jika ada)
const EXCLUDE_FILES = [];

let totalFilesScanned = 0;
let totalFilesCleaned = 0;
let totalEmojisRemoved = 0;

function cleanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Cek apakah ada emoji
    if (!EMOJI_REGEX.test(content)) {
        return;
    }

    // Lakukan pembersihan
    // 1. Ganti emoji dengan string kosong
    // 2. Bersihkan spasi ganda yang mungkin tertinggal (opsional, hati-hati dengan string)
    const cleanedContent = content.replace(EMOJI_REGEX, '');

    // Cek jika ada perubahan
    if (content !== cleanedContent) {
        fs.writeFileSync(filePath, cleanedContent, 'utf8');
        console.log(`✨ Cleaned: ${path.relative(TARGET_DIR, filePath)}`);
        totalFilesCleaned++;

        // Hitung jumlah emoji yang dihapus (estimasi kasar)
        const match = content.match(EMOJI_REGEX);
        if (match) totalEmojisRemoved += match.length;
    }
}

function scanAndClean(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanAndClean(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
            if (!EXCLUDE_FILES.includes(file)) {
                totalFilesScanned++;
                cleanFile(fullPath);
            }
        }
    });
}

console.log("🚀 Starting Emoji Cleanup Operation...");
console.log(`📂 Target: ${TARGET_DIR}`);
console.log("----------------------------------------");

scanAndClean(TARGET_DIR);

console.log("----------------------------------------");
console.log(`✅ Operation Complete!`);
console.log(`📊 Scanned: ${totalFilesScanned} files`);
console.log(`🧹 Cleaned: ${totalFilesCleaned} files`);
console.log(`🗑️  Emojis Removed: ${totalEmojisRemoved}`);
