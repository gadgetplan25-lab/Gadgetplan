const { Op } = require("sequelize");
const Booking = require("../models/booking");
const BookingPayment = require("../models/bookingPayment");
const Technician = require("../models/technician");
const ServiceType = require("../models/serviceType");
const { v4: uuidv4 } = require("uuid");




exports.createBooking = async (req, res) => {
  try {
    const { service_date, service_time, technician_id, serviceType_id, jenis_perangkat, model_perangkat } = req.body;
    const user_id = req.user.id;
    const user_email = req.user.email;

    // Validasi input baru
    if (!jenis_perangkat || !model_perangkat) {
      return res.status(400).json({ message: "Jenis perangkat dan model perangkat wajib diisi" });
    }

    // cek service type
    const serviceType = await ServiceType.findByPk(serviceType_id);
    if (!serviceType) {
      return res.status(404).json({ message: "Service type tidak ditemukan" });
    }

    // cek teknisi
    const technician = await Technician.findByPk(technician_id);
    if (!technician) {
      return res.status(404).json({ message: "Teknisi tidak ditemukan" });
    }

    // Validasi jam buka toko (09:00 - 20:00)
    const bookingStart = new Date(`${service_date}T${service_time}`);
    const bookingEnd = new Date(bookingStart.getTime() + serviceType.waktu_proses * 60000);

    const openHour = new Date(`${service_date}T09:00:00`);
    const closeHour = new Date(`${service_date}T20:00:00`);

    if (bookingStart < openHour || bookingEnd > closeHour) {
      return res.status(400).json({ message: "Booking di luar jam operasional toko" });
    }

    // Cek jadwal teknisi apakah bentrok
    const existingBookings = await Booking.findAll({
      where: {
        technician_id,
        service_date,
        status: { [Op.in]: ["pending", "confirmed", "proses"] },
      },
    });

    // Loop semua booking teknisi pada hari yang sama
    for (let b of existingBookings) {
      const bStart = new Date(`${b.service_date}T${b.service_time}`);
      // ambil durasi service dari booking yang ada
      const bServiceType = await ServiceType.findByPk(b.serviceType_id);

      // Safety check if serviceType is missing
      if (!bServiceType) continue;

      const bEnd = new Date(bStart.getTime() + bServiceType.waktu_proses * 60000);
      const bEndWithBuffer = new Date(bEnd.getTime() + 15 * 60000);
      // cek overlap: booking baru mulai < booking lama selesai DAN booking baru selesai > booking lama mulai
      if (bookingStart < bEndWithBuffer && bookingEnd > bStart) {
        return res.status(400).json({
          message: "Teknisi sudah ada booking pada rentang waktu tersebut",
        });
      }
    }

    // buat booking
    const booking = await Booking.create({
      service_date,
      service_time,
      jenis_perangkat,
      model_perangkat,
      status: "pending",
      user_id: req.user.id, // Explicitly use req.user.id
      technician_id,
      serviceType_id,
    });

    // Hitung DP otomatis (50% dari harga service)
    const dpAmount = Math.round(Number(serviceType.harga) / 2);

    // buat payment record (Tanpa Xendit Link)
    const payment = await BookingPayment.create({
      booking_id: booking.id,
      amount: dpAmount,
      payment_method: "whatsapp",
      payment_status: "pending",
      transaction_id: `MANUAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Safer ID gen
    });

    res.status(201).json({
      message: "Booking berhasil dibuat",
      booking,
      payment,
      invoice_url: null, // No Xendit Invoice
      payment_type: "whatsapp"
    });
  } catch (error) {
    console.error("❌ Gagal membuat booking:", error);
    res.status(500).json({ message: error.message || "Terjadi kesalahan server", stack: error.stack });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const bookings = await Booking.findAll({
      where: { user_id },
      include: [Technician, ServiceType, BookingPayment],
    });

    res.json({ bookings });
  } catch (error) {
    console.error("❌ Gagal mengambil booking:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.getUserBookingDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const booking = await Booking.findOne({
      where: { id, user_id },
      include: [Technician, ServiceType, BookingPayment],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    res.json({ booking });
  } catch (error) {
    console.error("❌ Gagal mengambil detail booking:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // cari booking milik user
    const booking = await Booking.findOne({
      where: { id, user_id },
      include: [BookingPayment],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan atau bukan milik Anda" });
    }

    // hapus pembayaran dulu
    await BookingPayment.destroy({ where: { booking_id: booking.id } });

    // hapus booking
    await booking.destroy();

    res.json({ message: "Booking berhasil dihapus" });
  } catch (error) {
    console.error("❌ Gagal menghapus booking:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params; // booking id
    const { status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    booking.status = status;
    await booking.save();

    // Otomatis update status pembayaran jadi 'paid' jika status booking Confirmed/Proses/Selesai
    if (["confirmed", "proses", "selesai"].includes(status)) {
      await BookingPayment.update(
        { payment_status: "paid" },
        { where: { booking_id: id } }
      );
    }

    res.json({ message: "Status booking berhasil diperbarui", booking });
  } catch (error) {
    console.error(" Gagal update status booking:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
// controllers/bookingController.js
exports.getBookingSlots = async (req, res) => {
  try {
    const { date, technicianId } = req.params;

    // Ambil semua booking pada tanggal & teknisi tsb
    const bookings = await Booking.findAll({
      where: {
        service_date: date,
        technician_id: technicianId,
        status: { [Op.in]: ["pending", "confirmed"] },
      },
      include: [ServiceType],
    });

    // Generate slot 30 menit (09:00–20:00)
    const slots = [];
    let hour = 9;
    let minute = 0;
    while (hour < 20 || (hour === 20 && minute === 0)) {
      const hh = String(hour).padStart(2, "0");
      const mm = String(minute).padStart(2, "0");
      const slotTime = `${hh}:${mm}`;

      // cek apakah slot ini bentrok dengan salah satu booking
      let isBooked = false;
      for (const b of bookings) {
        const bStart = new Date(`${b.service_date}T${b.service_time}`);
        const bEnd = new Date(
          bStart.getTime() + b.ServiceType.waktu_proses * 60000
        );

        const slotDate = new Date(`${date}T${slotTime}`);
        if (slotDate >= bStart && slotDate < bEnd) {
          isBooked = true;
          break;
        }
      }

      slots.push({ time: slotTime, booked: isBooked });

      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
    }

    res.json({ date, technicianId, slots });
  } catch (err) {
    console.error("❌ Gagal fetch slots:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/bookingController.js
exports.getBookingByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const bookings = await Booking.findAll({
      where: { service_date: date },
      attributes: ["service_time"], // ambil jam saja
    });
    res.json({ data: bookings });
  } catch (error) {
    console.error("❌ Gagal get booking by date:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params; // booking id
    const { status } = req.body; // payment status

    const payment = await BookingPayment.findOne({ where: { booking_id: id } });
    if (!payment) {
      return res.status(404).json({ message: "Data pembayaran tidak ditemukan" });
    }

    payment.payment_status = status;
    await payment.save();

    res.json({ message: "Status pembayaran berhasil diperbarui", payment });
  } catch (error) {
    console.error("Gagal update status pembayaran:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
