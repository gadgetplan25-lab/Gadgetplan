const Tag = require("../models/tag");

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({ include: ["category"] });
    res.json({ tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil tag", error: err.message });
  }
};

exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, { include: ["category"] });
    if (!tag) return res.status(404).json({ message: "Tag tidak ditemukan" });
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil tag", error: err.message });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;
    if (!name) return res.status(400).json({ message: "Nama tag wajib diisi" });

    const tag = await Tag.create({ name, description, categoryId: categoryId || null });
    res.status(201).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat tag", error: err.message });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag tidak ditemukan" });

    tag.name = name || tag.name;
    tag.description = description || tag.description;
    tag.categoryId = categoryId !== undefined ? categoryId : tag.categoryId;

    await tag.save();
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui tag", error: err.message });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag tidak ditemukan" });

    await tag.destroy();
    res.json({ message: "Tag berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus tag", error: err.message });
  }
};