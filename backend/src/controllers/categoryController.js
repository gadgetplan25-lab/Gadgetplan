const { Category, Product } = require("../models");

// Tambah kategori baru
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Nama kategori wajib diisi" });

    const category = await Category.create({ name, description });
    res.status(201).json({ message: "Kategori berhasil dibuat", category });
  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Kategori sudah ada" });
    }
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get semua kategori
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Product,
        attributes: ['id'], // Only need IDs to count length
      }]
    });
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil kategori", error: err.message });
  }
};

// Update kategori
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });

    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();

    res.json({ message: "Kategori berhasil diperbarui", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Hapus kategori
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });

    await category.destroy();
    res.json({ message: "Kategori berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};