const User = require("../models/user");
const Technician = require("../models/technician");
const Booking = require("../models/booking");
const BookingPayment = require("../models/bookingPayment");
const ServiceType = require("../models/serviceType");
const Color = require("../models/color");
const Storage = require("../models/storage");
const { Order, OrderItem, Product, Payment } = require("../models");
const sequelize = require("../config/db");


exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "customer"].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Role user berhasil diubah", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.addTechnician = async (req, res) => {
  try {
    const { name, specialty, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name dan phone wajib diisi" });
    }

    const technician = await Technician.create({ name, specialty, phone });

    res.status(201).json({
      message: "Teknisi berhasil ditambahkan",
      technician
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
// controllers/adminController.js
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await user.destroy();
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus user" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email", "phone"] },
        { model: Technician, attributes: ["id", "name"] }, // hanya ambil nama teknisi
        { model: ServiceType },
        { model: BookingPayment }
      ],
      order: [
        ["service_date", "DESC"],
        ["service_time", "ASC"]
      ]
    });

    res.json({ bookings });
  } catch (err) {
    console.error("❌ Gagal fetch bookings:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: "User", attributes: ["id", "name", "email", "phone", "address"] },
        {
          model: OrderItem,
          include: [
            { model: Product, attributes: ["id", "name", "price"] },
            { model: Color, attributes: ["id", "name"] },
            { model: Storage, attributes: ["id", "name"] },
          ]
        },
        { model: Payment },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Gagal fetch orders:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// GET /api/admin/dashboard/orders?year=2025&month=10
// exports.getDashboardOrders = async (req, res) => {
//   const { year, month } = req.query;
//   try {
//     const orders = await Order.findAll({
//       where: sequelize.where(
//         sequelize.fn('MONTH', sequelize.col('createdAt')),
//         month
//       ),
//       include: [User],
//     });

//     // hitung per minggu
//     const weeksData = [1,2,3,4].map(week => ({
//       week,
//       count: orders.filter(o => {
//         const day = new Date(o.createdAt).getDate();
//         const weekStart = (week-1)*7+1;
//         const weekEnd = week*7;
//         return day >= weekStart && day <= weekEnd;
//       }).length
//     }));

//     res.json({ data: weeksData });
//   } catch(err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getDashboardOrders = async (req, res) => {
  const { year, month } = req.query;

  try {
    const orders = await Order.findAll({
      where: sequelize.and(
        sequelize.where(sequelize.fn('YEAR', sequelize.col('Order.createdAt')), year),
        sequelize.where(sequelize.fn('MONTH', sequelize.col('Order.createdAt')), month)
      ),
      include: [{ model: User, as: "User" }],
    });

    // hitung per minggu
    const weeksData = [1, 2, 3, 4].map(week => ({
      week,
      count: orders.filter(o => {
        const day = new Date(o.createdAt).getDate();
        const weekStart = (week - 1) * 7 + 1;
        const weekEnd = week * 7;
        return day >= weekStart && day <= weekEnd;
      }).length
    }));

    res.json({ data: weeksData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/admin/dashboard/bookings?year=2025&month=10
// GET /api/admin/dashboard/bookings?year=2025&month=10
exports.getDashboardBookings = async (req, res) => {
  const { year, month } = req.query;
  try {
    const bookings = await Booking.findAll({
      where: sequelize.and(
        sequelize.where(sequelize.fn('YEAR', sequelize.col('service_date')), year),
        sequelize.where(sequelize.fn('MONTH', sequelize.col('service_date')), month)
      ),
      include: [User],
    });

    const weeksData = [1, 2, 3, 4].map(week => ({
      week,
      count: bookings.filter(b => {
        const day = new Date(b.service_date).getDate();
        const weekStart = (week - 1) * 7 + 1;
        const weekEnd = week * 7;
        return day >= weekStart && day <= weekEnd;
      }).length
    }));

    res.json({ data: weeksData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const users = await User.count();
    const products = await Product.count();
    const orders = await Order.count();
    const bookings = await Booking.count();

    res.json({ data: { users, products, orders, bookings } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update status order oleh admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // order id
    const { status, tracking_number } = req.body; // status baru

    // Validasi status
    const allowedStatuses = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const order = await Order.findByPk(id, {
      include: [{ model: User, as: "User", attributes: ["id", "name", "email", "phone"] }]
    });
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

    // ✅ Validasi status transition DIHAPUS untuk ADMIN
    // Admin harus punya full control (Misal salah klik "Cancelled", harus bisa dikembalikan ke "Processing")
    const currentStatus = order.status;
    console.log(`ℹ️ Admin changing Order #${id} status from ${currentStatus} to ${status}`);


    // ✅ Validasi tracking number wajib untuk status shipped
    if (status === "shipped" && !tracking_number) {
      return res.status(400).json({
        message: "Tracking number wajib diisi saat mengubah status ke 'shipped'"
      });
    }

    // Update status dan tracking number
    order.status = status;
    if (tracking_number) {
      order.tracking_number = tracking_number;
    }
    await order.save();

    // ✅ WhatsApp notification removed (Manual System)
    // Admin can manually chat customer if needed

    res.json({
      success: true,
      message: "Status order berhasil diperbarui",
      order
    });
  } catch (error) {
    console.error("❌ Gagal update status order:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// TEMPORARY: Reset Data
exports.resetData = async (req, res) => {
  try {
    console.log("⚠️ RESETTING DATA REQUESTED");
    await OrderItem.destroy({ truncate: true, cascade: true });
    await Payment.destroy({ truncate: true, cascade: true });
    await Order.destroy({ truncate: true, cascade: true });
    await BookingPayment.destroy({ truncate: true, cascade: true });
    await Booking.destroy({ truncate: true, cascade: true });

    console.log("✅ Data reset successful");
    res.json({ message: "All orders and bookings have been reset." });
  } catch (error) {
    console.error("❌ Reset failed:", error);
    res.status(500).json({ message: "Reset failed", error: error.message });
  }
};