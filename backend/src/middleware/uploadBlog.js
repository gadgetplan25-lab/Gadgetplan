const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const blogDir = "public/uploads";
const tempDir = "public/temp";

// Buat folder jika belum ada
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Temporary storage (akan diproses dengan sharp)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Hanya file gambar yang diperbolehkan"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB untuk raw upload
}).fields([
  { name: "banner", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// Middleware untuk optimasi gambar setelah upload
const optimizeImages = async (req, res, next) => {
  try {
    if (!req.files) return next();

    const optimizedFiles = {};

    // Optimasi Banner (1200x630px - Open Graph standard)
    if (req.files.banner && req.files.banner[0]) {
      const bannerFile = req.files.banner[0];
      const outputFilename = `banner-${Date.now()}.jpg`;
      const outputPath = path.join(blogDir, outputFilename);

      await sharp(bannerFile.path)
        .resize(1200, 630, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(outputPath);

      // Hapus file temporary
      fs.unlinkSync(bannerFile.path);

      optimizedFiles.banner = [{
        filename: outputFilename,
        path: outputPath,
        size: fs.statSync(outputPath).size,
      }];
    }

    // Optimasi Content Images (800px width, maintain aspect ratio)
    if (req.files.images && req.files.images.length > 0) {
      optimizedFiles.images = [];

      for (const imageFile of req.files.images) {
        const outputFilename = `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
        const outputPath = path.join(blogDir, outputFilename);

        await sharp(imageFile.path)
          .resize(800, null, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85, progressive: true })
          .toFile(outputPath);

        // Hapus file temporary
        fs.unlinkSync(imageFile.path);

        optimizedFiles.images.push({
          filename: outputFilename,
          path: outputPath,
          size: fs.statSync(outputPath).size,
        });
      }
    }

    // Replace req.files dengan file yang sudah dioptimasi
    req.files = optimizedFiles;
    next();
  } catch (error) {
    console.error("Error optimizing images:", error);
    next(error);
  }
};

// Export sebagai array middleware
const uploadBlogWithOptimization = [upload, optimizeImages];

module.exports = uploadBlogWithOptimization;