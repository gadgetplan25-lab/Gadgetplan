const Color = require("../models/color");

exports.getColors = async (req, res) => {
  try {
    const colors = await Color.findAll();
    res.json({ colors });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil warna", error: err.message });
  }
};

exports.getColorById = async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);
    if (!color) return res.status(404).json({ message: "Warna tidak ditemukan" });
    res.json(color);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil warna", error: err.message });
  }
};

exports.addColor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Nama warna wajib diisi" });

    const color = await Color.create({ name });
    res.status(201).json(color);
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan warna", error: err.message });
  }
};

exports.updateColor = async (req, res) => {
  try {
    const { name } = req.body;
    const color = await Color.findByPk(req.params.id);
    if (!color) return res.status(404).json({ message: "Warna tidak ditemukan" });

    color.name = name || color.name;
    await color.save();
    res.json(color);
  } catch (err) {
    res.status(500).json({ message: "Gagal update warna", error: err.message });
  }
};

exports.deleteColor = async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);
    if (!color) return res.status(404).json({ message: "Warna tidak ditemukan" });

    await color.destroy();
    res.json({ message: "Warna berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal hapus warna", error: err.message });
  }
};