const { v4: uuidv4 } = require("uuid");
const { Order, OrderItem, Product, Payment, User } = require("../models");

const axios = require("axios");
const { calculateShippingCost } = require("../utils/shippingUtils");

// Estimate shipping cost (untuk endpoint /shipping/estimate)
exports.estimateShipping = async (req, res) => {
  try {
    let { destination, weight = 1000 } = req.body;

    // If destination not provided, get from user
    if (!destination || isNaN(Number(destination))) {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ message: "User ID tidak ditemukan di token" });
      }

      const user = await User.findByPk(userId);
      if (!user || !user.city_id) {
        return res.status(400).json({ message: "city_id tidak ditemukan di data user" });
      }

      destination = String(user.city_id).trim();
    }

    // Calculate shipping cost using manual utility
    const result = calculateShippingCost(destination, weight);

    res.json({
      shipping_cost: result.cost,
      shipping_detail: {
        service: result.service,
        estimate: result.estimate,
        zone: result.zone,
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Gagal menghitung ongkir",
      error: err.message
    });
  }
};

// Checkout (menggunakan estimateShipping untuk ongkir)
exports.checkout = async (req, res) => {
  const t = await Order.sequelize.transaction();

  try {
    const user_id = req.user.id;
    const { items, method, shipping_cost, shipping_detail } = req.body;

    let totalPrice = 0;
    const orderItemsData = [];

    // Hitung total dan update stok
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) throw new Error(`Produk dengan id ${item.product_id} tidak ditemukan`);
      if (product.stock < item.quantity) throw new Error(`Stok produk ${product.name} tidak mencukupi`);

      const subtotal = product.price * item.quantity;
      totalPrice += subtotal;

      product.stock -= item.quantity;
      await product.save({ transaction: t });

      orderItemsData.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
        color_id: item.color_id || null,
        storage_id: item.storage_id || null,
      });
    }

    // Ambil user dan city_id
    const user = await require("../models/user").findByPk(user_id);
    if (!user || !user.city_id) throw new Error("Alamat user belum lengkap (city_id kosong)");
    const destination = user.city_id;

    // --- Manual Checkout (No Shipping Cost) ---
    // User requested to remove all shipping calculations.
    const shippingCost = 0;
    const shippingDetail = null;

    // Buat order
    const order = await Order.create(
      { user_id, total_price: totalPrice, status: "pending" }, // Removed shipping_cost and + shippingCost
      { transaction: t }
    );

    // Buat order items
    await OrderItem.bulkCreate(
      orderItemsData.map(i => ({ ...i, order_id: order.id })),
      { transaction: t }
    );

    // Buat payment record
    const payment = await Payment.create(
      {
        order_id: order.id,
        method: method,
        status: "pending",
      },
      { transaction: t }
    );

    // --- XENDIT CODE REMOVED FOR WHATSAPP MANUAL FLOW ---
    // Instead of creating an invoice, we simply commit the transaction
    // and let the frontend handle the WhatsApp redirection.

    await t.commit();

    // --- Fonnte Notification Removed ---
    // User will manually chat admin via WhatsApp link from frontend

    res.status(201).json({
      message: "Checkout berhasil",
      order,
      payment,
      shipping_cost: 0,
      shipping_detail: null,
      invoice_url: null, // No Xendit Invoice
      payment_type: "whatsapp"
    });

  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }
    if (process.env.NODE_ENV === 'development') {
      console.error("❌ Gagal checkout:", error);
      console.error("Stack trace:", error.stack);
      if (error.errors) console.error("Validation errors:", error.errors);
    }
    res.status(500).json({ message: error.message || "Terjadi kesalahan", error: error.toString() });
  }
};