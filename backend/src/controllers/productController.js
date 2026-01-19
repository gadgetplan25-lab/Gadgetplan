const { Product, ProductImage, Tag, Color, Storage, ProductVariant } = require("../models");
const Category = require("../models/category");
const path = require("path");
const { Op } = require("sequelize");
const fs = require("fs");

// ✅ NEW: All-in-One Product Creation with Variants
exports.addProduct = async (req, res) => {
  const t = await Product.sequelize.transaction();

  try {
    const {
      name, description, category_id,
      tag_ids, // JSON string array of tag IDs
      variants // JSON string array of variant objects: [{color_id, storage_id, price, stock}]
    } = req.body;

    console.log("📦 Creating product:", { name, category_id });

    // Validate required fields
    if (!name || !category_id) {
      await t.rollback();
      return res.status(400).json({ message: "Nama produk dan kategori wajib diisi" });
    }

    // Parse variants
    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      } catch (e) {
        await t.rollback();
        return res.status(400).json({ message: "Format variant tidak valid" });
      }
    }

    // Validate variants
    if (!parsedVariants || parsedVariants.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Minimal harus ada 1 variant" });
    }

    // ✅ Create product (price & stock will be calculated from variants)
    const product = await Product.create({
      name,
      description: description || "",
      price: 0, // Will be updated to min price from variants
      stock: 0, // Will be updated to total stock from variants
      category_id
    }, { transaction: t });

    console.log("✅ Product created:", product.id);

    // Save images
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        product_id: product.id,
        image_url: file.filename
      }));
      await ProductImage.bulkCreate(images, { transaction: t });
      console.log(`✅ ${images.length} images saved`);
    }

    // Process Tags
    if (tag_ids) {
      try {
        const parsedTagIds = typeof tag_ids === 'string' ? JSON.parse(tag_ids) : tag_ids;
        if (Array.isArray(parsedTagIds) && parsedTagIds.length > 0) {
          await product.setTags(parsedTagIds, { transaction: t });
          console.log("✅ Tags associated:", parsedTagIds);
        }
      } catch (e) {
        console.error("Failed to parse tag_ids:", e);
      }
    }

    // ✅ Create variants and calculate min price & total stock
    let minPrice = Infinity;
    let totalStock = 0;

    for (const variant of parsedVariants) {
      const { color_id, storage_id, price, stock } = variant;

      if (!color_id || !storage_id || !price || !stock) {
        await t.rollback();
        return res.status(400).json({
          message: "Setiap variant harus memiliki color_id, storage_id, price, dan stock"
        });
      }

      const variantPrice = parseFloat(price);
      const variantStock = parseInt(stock);

      await ProductVariant.create({
        product_id: product.id,
        color_id: parseInt(color_id),
        storage_id: parseInt(storage_id),
        price: variantPrice,
        stock: variantStock
      }, { transaction: t });

      // Track min price and total stock
      if (variantPrice < minPrice) minPrice = variantPrice;
      totalStock += variantStock;
    }

    // ✅ Update product with calculated price & stock
    product.price = minPrice;
    product.stock = totalStock;
    await product.save({ transaction: t });

    console.log(`✅ ${parsedVariants.length} variants created`);
    console.log(`✅ Product price set to: ${minPrice}, stock: ${totalStock}`);

    await t.commit();

    // Fetch complete product data
    const completeProduct = await Product.findByPk(product.id, {
      include: [
        { model: Tag, as: "tags", through: { attributes: [] } },
        { model: Category, attributes: ["id", "name"] },
        { model: ProductImage, attributes: ["id", "image_url"] },
        {
          model: ProductVariant,
          as: "variants",
          include: [
            { model: Color, attributes: ["id", "name"] },
            { model: Storage, attributes: ["id", "name"] }
          ]
        }
      ]
    });

    res.status(201).json({
      message: "Produk dan variant berhasil ditambahkan",
      product: completeProduct
    });

  } catch (err) {
    if (!t.finished) {
      await t.rollback();
    }
    console.error("❌ addProduct error:", err);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: err.message
    });
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
        { model: ProductImage, attributes: ["id", "image_url"] },
        {
          model: ProductVariant,
          as: "variants",
          include: [
            { model: Color, attributes: ["id", "name"] },
            { model: Storage, attributes: ["id", "name"] }
          ]
        }
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

// ✅ Get single product by ID with all relations
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const product = await Product.findByPk(productId, {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: ProductImage, attributes: ["id", "image_url"] },
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "name"],
          // Removed through attributes to let Sequelize handle it
        },
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["id", "color_id", "storage_id", "price", "stock"],
          include: [
            { model: Color, attributes: ["id", "name"] },
            { model: Storage, attributes: ["id", "name"] }
          ]
        }
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Format ProductTags for easier frontend consumption
    const formattedProduct = product.toJSON();
    if (formattedProduct.tags) {
      formattedProduct.ProductTags = formattedProduct.tags.map(tag => ({
        tag_id: tag.id
      }));
    }

    res.json({ product: formattedProduct });
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ message: "Gagal memuat produk", error: err.message });
  }
};
