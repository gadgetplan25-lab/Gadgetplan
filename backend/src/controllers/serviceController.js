const ServiceType = require("../models/serviceType");

exports.getAllServiceTypes = async (req, res) => {
  try {
    const services = await ServiceType.findAll();
    res.json({ data: services });
  } catch (error) {
    console.error("❌ Gagal get service types:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.addServiceType = async (req, res) => {
  try {
    const { nama, harga, waktu_proses } = req.body;

    if (!nama || !harga || !waktu_proses) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const newServiceType = await ServiceType.create({
      nama,
      harga,
      waktu_proses,
    });

    res.status(201).json({
      message: "Service type berhasil ditambahkan",
      data: newServiceType,
    });
  } catch (error) {
    console.error("❌ Gagal tambah service type:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// 🔹 Update service type
exports.updateServiceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, harga, waktu_proses } = req.body;

    const serviceType = await ServiceType.findByPk(id);
    if (!serviceType) {
      return res.status(404).json({ message: "Service type tidak ditemukan" });
    }

    serviceType.nama = nama || serviceType.nama;
    serviceType.harga = harga || serviceType.harga;
    serviceType.waktu_proses = waktu_proses || serviceType.waktu_proses;

    await serviceType.save();

    res.json({
      message: "Service type berhasil diperbarui",
      data: serviceType,
    });
  } catch (error) {
    console.error("❌ Gagal update service type:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// 🔹 Hapus service type
exports.deleteServiceType = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceType = await ServiceType.findByPk(id);

    if (!serviceType) {
      return res.status(404).json({ message: "Service type tidak ditemukan" });
    }

    await serviceType.destroy();

    res.json({ message: "Service type berhasil dihapus" });
  } catch (error) {
    console.error("❌ Gagal delete service type:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};