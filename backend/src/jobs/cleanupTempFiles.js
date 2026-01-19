const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Cleanup temporary files older than 1 hour
const cleanupTempFiles = () => {
    const tempDir = path.join(__dirname, '..', 'public', 'temp');

    try {
        if (!fs.existsSync(tempDir)) {
            return;
        }

        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        let deletedCount = 0;

        files.forEach(file => {
            const filePath = path.join(tempDir, file);
            const stats = fs.statSync(filePath);

            // Delete files older than 1 hour
            if (now - stats.mtimeMs > oneHour) {
                try {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                } catch (err) {
                    console.warn(`Could not delete temp file: ${file}`);
                }
            }
        });

        if (deletedCount > 0) {
            console.log(`🧹 Cleaned up ${deletedCount} temporary files`);
        }
    } catch (error) {
        console.error('Error cleaning temp files:', error.message);
    }
};

// Run cleanup every hour
cron.schedule('0 * * * *', () => {
    console.log('🧹 Running temp files cleanup...');
    cleanupTempFiles();
});

// Run cleanup on startup (after 1 minute)
setTimeout(() => {
    console.log('🧹 Running initial temp files cleanup...');
    cleanupTempFiles();
}, 60000);

module.exports = { cleanupTempFiles };
