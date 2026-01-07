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
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Nama storage wajib diisi" });

    const storage = await Storage.create({ name });
    res.status(201).json(storage);
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan storage", error: err.message });
  }
};

exports.updateStorage = async (req, res) => {
  try {
    const { name } = req.body;
    const storage = await Storage.findByPk(req.params.id);
    if (!storage) return res.status(404).json({ message: "Storage tidak ditemukan" });

    storage.name = name || storage.name;
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