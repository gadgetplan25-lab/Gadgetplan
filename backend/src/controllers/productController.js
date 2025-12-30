const { Product, ProductImage, Tag, Color, Storage } = require("../models");
const Category = require("../models/category");
const path = require("path");
const { Op } = require("sequelize");
const fs = require("fs");


exports.addProduct = async (req, res) => {
  try {
    const {
      name, description, price, stock, category_id,
      tagIds = [], newTags = [],
      colorIds = [], newColors = [],
      storageIds = [], newStorages = []
    } = req.body;

    // Buat product
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category_id
    });

    // Simpan gambar
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        product_id: product.id,
        image_url: file.filename
      }));
      await ProductImage.bulkCreate(images);
    }

    // Process Tags
    const parsedTagIds = Array.isArray(tagIds)
      ? tagIds.map(Number)
      : String(tagIds).split(",").map(Number);

    let newTagIds = [];
    if (newTags.length > 0) {
      newTagIds = await Promise.all(
        newTags.map(async (name) => {
          const [tag] = await Tag.findOrCreate({ where: { name }, defaults: { name } });
          return tag.id;
        })
      );
    }

    const allTagIds = [...parsedTagIds, ...newTagIds].filter(Boolean);
    if (allTagIds.length > 0) await product.setTags(allTagIds);

    // Process Colors
    const parsedColorIds = Array.isArray(colorIds)
      ? colorIds.map(Number)
      : colorIds ? String(colorIds).split(",").map(Number) : [];

    let newColorIds = [];
    if (newColors.length > 0) {
      newColorIds = await Promise.all(
        newColors.map(async (name) => {
          const [color] = await Color.findOrCreate({ where: { name }, defaults: { name } });
          return color.id;
        })
      );
    }

    const allColorIds = [...parsedColorIds, ...newColorIds].filter(Boolean);
    if (allColorIds.length > 0) await product.setColors(allColorIds);

    // Process Storages
    const parsedStorageIds = Array.isArray(storageIds)
      ? storageIds.map(Number)
      : storageIds ? String(storageIds).split(",").map(Number) : [];

    let newStorageIds = [];
    if (newStorages.length > 0) {
      newStorageIds = await Promise.all(
        newStorages.map(async (name) => {
          const [storage] = await Storage.findOrCreate({ where: { name }, defaults: { name } });
          return storage.id;
        })
      );
    }

    const allStorageIds = [...parsedStorageIds, ...newStorageIds].filter(Boolean);
    if (allStorageIds.length > 0) await product.setStorages(allStorageIds);

    res.json({ message: "Produk berhasil ditambahkan", product });
  } catch (err) {
    console.error("addProduct error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};


// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, price, description, stock, category_id,
      tagIds = [], newTags = [],
      deletedImageIds = []
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product tidak ditemukan" });

    // Update field lain
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.stock = stock || product.stock;
    product.category_id = category_id || product.category_id;
    await product.save();

    // Hapus gambar yang diminta
    if (deletedImageIds && deletedImageIds.length > 0) {
      // Ensure specific ids are handled (handle single or array)
      const idsToDelete = Array.isArray(deletedImageIds)
        ? deletedImageIds
        : String(deletedImageIds).split(',').filter(Boolean);

      const imagesToDelete = await ProductImage.findAll({
        where: {
          id: { [Op.in]: idsToDelete },
          product_id: product.id
        }
      });

      for (const img of imagesToDelete) {
        try {
          const imgPath = path.resolve(__dirname, "../../public/products", img.image_url);
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        } catch (err) {
          console.error("Gagal hapus file:", err);
        }
        await img.destroy();
      }
    }

    // Tambahkan gambar baru jika ada file
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await ProductImage.create({
          product_id: product.id,
          image_url: file.filename,
        });
      }
    }

    // Buat tag baru jika ada
    let newTagIds = [];
    if (newTags.length > 0) {
      const createdTags = await Promise.all(
        newTags.map(name => Tag.create({ name }))
      );
      newTagIds = createdTags.map(t => t.id);
    }

    // Update tags
    const allTagIds = [...tagIds, ...newTagIds];
    if (allTagIds.length > 0) {
      await product.setTags(allTagIds);
    }

    res.json({ message: "Produk berhasil diupdate", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


// Tampilkan semua product beserta kategori
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Tag, as: "tags", through: { attributes: [] } },
        { model: Color, as: "colors", through: { attributes: [] } },
        { model: Storage, as: "storages", through: { attributes: [] } },
        { model: Category, attributes: ["id", "name"] },
        { model: ProductImage, attributes: ["id", "image_url"] }
      ]
    });
    res.json({ products });
  } catch (err) {
    console.error("❌ Error in getAllProducts:", err);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{ model: ProductImage }]
    });

    if (!product) return res.status(404).json({ message: "Product tidak ditemukan" });

    if (product.ProductImages && product.ProductImages.length > 0) {
      product.ProductImages.forEach(img => {
        const imgPath = path.resolve(__dirname, "../../public/products", img.image_url);
        console.log("Trying to delete:", imgPath);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
          console.log("Deleted:", imgPath);
        } else {
          console.log("File not found:", imgPath);
        }
      });
    }
    await product.destroy();

    res.json({ message: "Produk dan gambar berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Tag, as: "tags", through: { attributes: [] } },
        { model: Color, as: "colors", through: { attributes: [] } },
        { model: Storage, as: "storages", through: { attributes: [] } },
        { model: Category, attributes: ["id", "name"] },
        { model: ProductImage, attributes: ["id", "image_url"] }
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// GET products by tag
exports.getProductsByTag = async (req, res) => {
  try {
    let { tagIds } = req.query;
    if (!tagIds) {
      return res.status(400).json({ message: "Tag ID harus diberikan" });
    }

    // ubah "1,3,5" => [1,3,5]
    tagIds = tagIds.split(",").map((id) => parseInt(id));

    const products = await Product.findAll({
      include: [
        {
          model: Tag,
          as: "tags",
          where: { id: tagIds },
          through: { attributes: [] },
        },
      ],
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal filter produk", error: err.message });
  }
};

// exports.filterByTags = async (req, res) => {
//   try {
//     let { tagIds, excludeId } = req.query;

//     if (!tagIds) {
//       return res.status(400).json({ message: "Tag IDs harus diberikan" });
//     }

//     // "5,6,7" -> [5,6,7] (integer)
//     const tagIdsArr = String(tagIds)
//       .split(",")
//       .map((t) => parseInt(t))
//       .filter((n) => !isNaN(n));

//     if (tagIdsArr.length === 0) {
//       return res.status(400).json({ message: "Tag IDs tidak valid" });
//     }

//     const whereClause = {};
//     if (excludeId !== undefined) {
//       const ex = parseInt(excludeId);
//       if (!isNaN(ex)) whereClause.id = { [Op.ne]: ex };
//     }

//     const products = await Product.findAll({
//       where: whereClause,
//       include: [
//         { model: ProductImage, attributes: ["id", "image_url"] },
//         {
//           model: Tag,
//           as: "tags", // pastikan alias ini sesuai relasi di models/index
//           where: { id: { [Op.in]: tagIdsArr } }, // cari produk yg punya minimal 1 tag di list
//           through: { attributes: [] },
//         },
//       ],
//       distinct: true,
//     });

//     return res.json({ products });
//   } catch (err) {
//     console.error("filterByTags error:", err);
//     return res
//       .status(500)
//       .json({ message: "Gagal filter produk by tags", error: err.message });
//   }
// };


exports.filterByTags = async (req, res) => {
  try {
    let { tagIds, excludeId } = req.query;

    if (!tagIds) {
      return res.status(400).json({ message: "Tag IDs harus diberikan" });
    }

    // "5,6,7" -> [5,6,7] (integer)
    const tagIdsArr = String(tagIds)
      .split(",")
      .map((t) => parseInt(t))
      .filter((n) => !isNaN(n));

    if (tagIdsArr.length === 0) {
      return res.status(400).json({ message: "Tag IDs tidak valid" });
    }

    const whereClause = {};
    if (excludeId !== undefined) {
      const ex = parseInt(excludeId);
      if (!isNaN(ex)) whereClause.id = { [Op.ne]: ex };
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [
        { model: ProductImage, attributes: ["id", "image_url"] },
        {
          model: Tag,
          as: "tags",
          where: { id: { [Op.in]: tagIdsArr } },
          through: { attributes: [] },
        },
      ],
      distinct: true,
      limit: 8,
      order: [["createdAt", "DESC"]],
    });

    return res.json({ products });
  } catch (err) {
    console.error("filterByTags error:", err);
    return res
      .status(500)
      .json({ message: "Gagal filter produk by tags", error: err.message });
  }
};


exports.getProductsByCategory = async (req, res) => {
  try {
    let { categoryIds } = req.query;
    if (!categoryIds) {
      return res.status(400).json({ message: "Category ID harus diberikan" });
    }

    categoryIds = categoryIds.split(",").map((id) => parseInt(id));

    const products = await Product.findAll({
      where: { category_id: { [Op.in]: categoryIds } },
      include: [
        { model: Category, as: "Category" },
        { model: Tag, as: "tags", through: { attributes: [] } },
        { model: ProductImage, as: "ProductImages" },
      ],
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal filter produk", error: err.message });
  }
};


// Filter by color
exports.filterByColor = async (req, res) => {
  try {
    let { colors } = req.query;
    if (!colors) return res.status(400).json({ message: "Color harus diberikan" });

    const colorArr = colors.split(",").map(c => c.trim());
    const products = await Product.findAll({
      where: { color: { [Op.in]: colorArr } },
      include: [{ model: ProductImage, as: "ProductImages" }]
    });

    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal filter produk berdasarkan warna", error: err.message });
  }
};

// Filter by storage
exports.filterByStorage = async (req, res) => {
  try {
    let { storages } = req.query;
    if (!storages) return res.status(400).json({ message: "Storage harus diberikan" });

    const storageArr = storages.split(",").map(s => parseInt(s.trim()));
    const products = await Product.findAll({
      where: { storage: { [Op.in]: storageArr } },
      include: [{ model: ProductImage, as: "ProductImages" }]
    });

    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal filter produk berdasarkan storage", error: err.message });
  }
};

// GET /api/user/products/filter
exports.filterProducts = async (req, res) => {
  try {
    const { categoryIds, tagIds, colors, storages, search } = req.query;

    // Buat whereClause untuk filter
    const whereClause = {};
    if (categoryIds) whereClause.category_id = { [Op.in]: categoryIds.split(",").map(Number) };
    if (colors) whereClause.color = { [Op.in]: colors.split(",") };
    if (storages) whereClause.storage = { [Op.in]: storages.split(",").map(Number) };
    if (search) whereClause.name = { [Op.like]: `%${search}%` };

    // Query product dengan relasi
    const products = await Product.findAll({
      where: whereClause,
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: ProductImage, attributes: ["id", "image_url"] },
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    res.json({ products });
  } catch (err) {
    console.error("filterProducts error:", err);
    res.status(500).json({ message: "Gagal filter produk", error: err.message });
  }
};
