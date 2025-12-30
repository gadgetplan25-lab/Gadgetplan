const { Order } = require("../models");
const { Op } = require("sequelize");
const cron = require("node-cron");

// Jalankan setiap hari jam 01:00
cron.schedule("0 1 * * *", async () => {
  try {
    // 3 hari setelah dikirim, otomatis selesai
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const orders = await Order.findAll({
      where: {
        status: "shipped",
        updatedAt: { [Op.lt]: threeDaysAgo }
      }
    });

    for (const order of orders) {
      order.status = "completed";
      await order.save();
    }

    console.log(`✅ Auto-complete ${orders.length} pesanan shipped > 3 hari`);
  } catch (err) {
    console.error("❌ Gagal auto-complete pesanan:", err);
  }
});
