const cron = require("node-cron");
const { Op } = require("sequelize");
const User = require("../models/user");


cron.schedule("0 * * * *", async () => {
  try {
    const batas = new Date(Date.now() - 15 * 60 * 1000); // 5 menit lalu

    const deleted = await User.destroy({
      where: {
        isVerified: false,
        createdAt: { [Op.lt]: batas }
      }
    });

    if (deleted > 0) {
      console.log(`Auto delete ${deleted} akun belum verifikasi (lebih dari 5 menit)`);
    } else {
      console.log("Tidak ada akun unverified untuk dihapus");
    }
  } catch (err) {
    console.error("Cron cleanup error:", err);
  }
});



