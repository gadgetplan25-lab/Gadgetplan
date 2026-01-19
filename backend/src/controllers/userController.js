const { User, Order, OrderItem, Product, Color, Storage, Payment, ProductImage } = require("../models");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "address"],
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    console.error("❌ Gagal mengambil profil:", error);
    res.status(500).json({ message: "Gagal mengambil data profil" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ message: "Alamat tidak boleh kosong" });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    user.address = address;
    await user.save();

    res.json({ message: "Alamat berhasil diperbarui", address: user.address });
  } catch (error) {
    console.error("❌ Gagal update alamat:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat update alamat" });
  }
};

// ✅ Ambil profil ringkas (sudah ada di route lama)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "phone", "address"],
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ user });
  } catch (err) {
    console.error("❌ Gagal ambil profil:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ✅ Ambil profil lengkap (untuk modal “Profil Saya”)
exports.getFullProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "phone", "address", "createdAt", "updatedAt"],
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Gagal fetch profil lengkap:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ✅ Ambil semua pesanan user (untuk modal “Pesanan Saya”)
// exports.getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.findAll({
//       where: { userId: req.user.id },
//       include: [
//         {
//           model: OrderItem,
//           include: [
//             { model: Product, attributes: ["id", "name", "price", "image"] },
//             { model: Color, attributes: ["id", "name"] },
//             { model: Storage, attributes: ["id", "name"] },
//           ],
//         },
//         { model: Payment, attributes: ["id", "method", "status", "amount"] },
//       ],
//       order: [["createdAt", "DESC"]],
//     });

//     res.json({ success: true, orders });
//   } catch (err) {
//     console.error("❌ Gagal fetch user orders:", err);
//     res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
//   }
// };

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    let orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price"],
              include: [{ model: ProductImage }]
            },
            { model: Color, attributes: ["id", "name"] },
            { model: Storage, attributes: ["id", "name"] },
          ],
        },
        {
          model: Payment,
          attributes: ["id", "method", "status", "transaction_id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Map images for frontend compatibility
    orders = orders.map(order => {
      const orderJSON = order.toJSON();
      orderJSON.OrderItems = orderJSON.OrderItems.map(item => {
        if (item.Product && item.Product.ProductImages) {
          item.Product.images = item.Product.ProductImages.map(img => img.image_url);
        } else if (item.Product) {
          item.Product.images = [];
        }
        return item;
      });
      return orderJSON;
    });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Gagal fetch user orders:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    let order = await Order.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price"],
              include: [{ model: ProductImage }]
            },
            { model: Color, attributes: ["id", "name"] },
            { model: Storage, attributes: ["id", "name"] },
          ],
        },
        {
          model: Payment,
          attributes: ["id", "method", "status", "transaction_id"],
        },
        { model: User, as: "User", attributes: ["id", "name", "email", "phone", "address"] }
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    // Map images for frontend compatibility
    const orderJSON = order.toJSON();
    orderJSON.OrderItems = orderJSON.OrderItems.map(item => {
      if (item.Product && item.Product.ProductImages) {
        item.Product.images = item.Product.ProductImages.map(img => img.image_url);
      } else if (item.Product) {
        item.Product.images = [];
      }
      return item;
    });

    res.json({ success: true, order: orderJSON });
  } catch (err) {
    console.error("❌ Gagal fetch order detail:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ✅ Update pengaturan user (untuk modal “Pengaturan”)
exports.updateSettings = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // Validasi sederhana
    if (email && !email.includes("@")) {
      return res.status(400).json({ message: "Format email tidak valid" });
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      address: address || user.address,
    });

    res.json({ success: true, message: "Data akun berhasil diperbarui", user });
  } catch (err) {
    console.error("❌ Gagal update user settings:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// User konfirmasi pesanan selesai
exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ where: { id, user_id: userId } });
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

    // ✅ Hanya bisa complete jika status shipped
    if (order.status !== "shipped") {
      return res.status(400).json({
        message: "Pesanan belum dikirim, tidak bisa dikonfirmasi selesai",
        currentStatus: order.status
      });
    }

    order.status = "completed";
    await order.save();

    res.json({
      success: true,
      message: "Pesanan berhasil dikonfirmasi selesai",
      order
    });
  } catch (err) {
    console.error("❌ Gagal konfirmasi selesai:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// User batalkan pesanan (hanya jika belum dikirim)
exports.cancelOrder = async (req, res) => {
  const t = await Order.sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, user_id: userId },
      include: [{ model: OrderItem }],
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    // ✅ Tidak bisa cancel jika sudah shipped, completed, atau cancelled
    if (["shipped", "completed", "cancelled"].includes(order.status)) {
      await t.rollback();
      return res.status(400).json({
        message: "Pesanan tidak bisa dibatalkan",
        currentStatus: order.status
      });
    }

    // ✅ RESTORE STOCK - Kembalikan stok produk
    for (const item of order.OrderItems) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (product) {
        // Tambahkan kembali stok yang sudah dikurangi saat checkout
        product.stock += item.quantity;
        await product.save({ transaction: t });
        console.log(`✅ Stock restored for product ${product.name}: +${item.quantity} (new stock: ${product.stock})`);
      }
    }

    // Update status order menjadi cancelled
    order.status = "cancelled";
    await order.save({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Pesanan berhasil dibatalkan dan stok dikembalikan",
      order
    });
  } catch (err) {
    if (!t.finished) {
      await t.rollback();
    }
    console.error("❌ Gagal batalkan pesanan:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
