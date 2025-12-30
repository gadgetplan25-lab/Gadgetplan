const Storage = require("../models/storage");

exports.getStorages = async (req, res) => {
  try {
    const storages = await Storage.findAll();
    res.json({ storages });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil storage", error: err.message });
  }
};

exports.getStorageById = async (req, res) => {
  try {
    const storage = await Storage.findByPk(req.params.id);
    if (!storage) return res.status(404).json({ message: "Storage tidak ditemukan" });
    res.json(storage);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil storage", error: err.message });
  }
};

exports.addStorage = async (req, res) => {
  try {
    const { size } = req.body;
    if (!size) return res.status(400).json({ message: "Ukuran wajib diisi" });

    const storage = await Storage.create({ size });
    res.status(201).json(storage);
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan storage", error: err.message });
  }
};

exports.updateStorage = async (req, res) => {
  try {
    const { size } = req.body;
    const storage = await Storage.findByPk(req.params.id);
    if (!storage) return res.status(404).json({ message: "Storage tidak ditemukan" });

    storage.size = size || storage.size;
    await storage.save();
    res.json(storage);
  } catch (err) {
    res.status(500).json({ message: "Gagal update storage", error: err.message });
  }
};

exports.deleteStorage = async (req, res) => {
  try {
    const storage = await Storage.findByPk(req.params.id);
    if (!storage) return res.status(404).json({ message: "Storage tidak ditemukan" });

    await storage.destroy();
    res.json({ message: "Storage berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal hapus storage", error: err.message });
  }
};