const multer = require("multer");
const path = require("path");
const fs = require("fs");

const blogDir = "public/uploads";
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, blogDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Hanya file gambar yang diperbolehkan"), false);
};

const uploadBlog = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "banner", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

module.exports = uploadBlog;