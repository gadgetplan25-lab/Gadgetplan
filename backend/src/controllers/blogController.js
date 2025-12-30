const slugify = require("slugify");
const { Blog, BlogContent } = require("../models");

exports.addBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: "Title wajib diisi" });

    // banner
    const bannerFile = req.files?.banner?.[0];

    // buat blog utama
    const blog = await Blog.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      banner_image: bannerFile ? `/uploads/${bannerFile.filename}` : null,
      author_id: 1,
    });

    // parse konten dari frontend
    const parsedContent = content ? JSON.parse(content) : [];
    const imageFiles = req.files?.images || [];
    let imgIndex = 0;

    // simpan konten sesuai urutan admin input
    for (let i = 0; i < parsedContent.length; i++) {
      const c = parsedContent[i];

      if (c.type === "text") {
        await BlogContent.create({
          blog_id: blog.id,
          type: "text",
          content: c.value,
          position: i + 1,
        });
      } else if (c.type === "image") {
        const imgFile = imageFiles[imgIndex++];
        if (imgFile) {
          await BlogContent.create({
            blog_id: blog.id,
            type: "image",
            image_url: `/uploads/${imgFile.filename}`,
            position: i + 1,
          });
        }
      }
    }

    res.status(201).json({ message: "Blog berhasil dibuat", blog });
  } catch (err) {
    console.error("addBlog error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};


exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        {
          model: BlogContent,
          as: "contents",
          attributes: ["id", "type", "content", "image_url", "position"],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        [{ model: BlogContent, as: "contents" }, "position", "ASC"],
      ],
    });

    res.json(blogs);
  } catch (err) {
    console.error("Error getBlogs:", err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({
      where: { slug },
      include: [
        {
          model: BlogContent,
          as: "contents",
          attributes: ["content", "image_url", "type", "position"],
        },
      ],
      order: [[{ model: BlogContent, as: "contents" }, "position", "ASC"]],
    });

    if (!blog) return res.status(404).json({ message: "Blog tidak ditemukan" });

    res.json(blog);
  } catch (err) {
    console.error("Error getBlogBySlug:", err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog tidak ditemukan" });

    // update title & banner
    const bannerFile = req.files?.banner?.[0];
    await blog.update({
      title: title || blog.title,
      slug: title ? slugify(title, { lower: true, strict: true }) : blog.slug,
      banner_image: bannerFile ? `/uploads/${bannerFile.filename}` : blog.banner_image,
    });

    // hapus semua konten lama
    await BlogContent.destroy({ where: { blog_id: blog.id } });

    // simpan ulang konten baru
    const parsedContent = content ? JSON.parse(content) : [];
    const imageFiles = req.files?.images || [];
    let imgIndex = 0;

    for (let i = 0; i < parsedContent.length; i++) {
      const c = parsedContent[i];

      if (c.type === "text") {
        await BlogContent.create({
          blog_id: blog.id,
          type: "text",
          content: c.value,
          position: i + 1,
        });
      } else if (c.type === "image") {
        const imgFile = imageFiles[imgIndex++];
        if (imgFile) {
          await BlogContent.create({
            blog_id: blog.id,
            type: "image",
            image_url: `/uploads/${imgFile.filename}`,
            position: i + 1,
          });
        }
      }
    }

    res.json({ message: "Blog berhasil diperbarui", blog });
  } catch (err) {
    console.error("updateBlog error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog tidak ditemukan" });

    await BlogContent.destroy({ where: { blog_id: id } });
    await blog.destroy();

    res.json({ message: "Blog berhasil dihapus" });
  } catch (err) {
    console.error("deleteBlog error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};  