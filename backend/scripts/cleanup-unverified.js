require("dotenv").config();
const { User } = require("./src/models");
const sequelize = require("./src/config/db");

async function cleanupUnverified() {
    try {
        console.log("🧹 Membersihkan user yang belum terverifikasi...");

        const unverifiedUsers = await User.findAll({
            where: { isVerified: false }
        });

        console.log(`📊 Ditemukan ${unverifiedUsers.length} user belum terverifikasi:`);
        unverifiedUsers.forEach(user => {
            console.log(`   - ${user.email} (ID: ${user.id})`);
        });

        if (unverifiedUsers.length === 0) {
            console.log("✅ Database sudah bersih!");
            process.exit();
            return;
        }

        // Hapus OTP terkait menggunakan raw query
        const userIds = unverifiedUsers.map(u => u.id);
        await sequelize.query(
            `DELETE FROM OTPs WHERE userId IN (${userIds.join(',')})`,
            { type: sequelize.QueryTypes.DELETE }
        );
        console.log("✅ OTP terkait berhasil dihapus");

        // Hapus user
        const deleted = await User.destroy({
            where: { isVerified: false }
        });

        console.log(`✅ Berhasil menghapus ${deleted} user yang belum terverifikasi`);
        console.log("💡 Sekarang Anda bisa registrasi ulang dengan email yang sama");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        process.exit();
    }
}

cleanupUnverified();
