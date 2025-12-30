"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";
import { FileText, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await apiFetch("/blogs");
      setBlogs(data);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data blog", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus blog ini?",
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/blogs/${id}`, { method: "DELETE" });
        setBlogs(blogs.filter((b) => b.id !== id));
        Swal.fire("Berhasil!", "Blog berhasil dihapus.", "success");
      } catch (err) {
        Swal.fire("Error", "Gagal hapus blog", "error");
      }
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
  };

  const handleUpdate = async () => {
    try {
      await apiFetch(`/blogs/${editingBlog.id}`, {
        method: "PUT",
        body: JSON.stringify({ title }),
        headers: { "Content-Type": "application/json" },
      });
      setEditingBlog(null);
      fetchBlogs();
      Swal.fire("Berhasil!", "Blog berhasil diperbarui.", "success");
    } catch (err) {
      Swal.fire("Error", "Gagal update blog", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002B50]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-[#002B50]">Daftar Blog</h1>
          <p className="text-slate-500 text-sm">Kelola artikel dan berita terbaru</p>
        </div>
        <Link
          href="/dashboard/blog/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#002B50] hover:bg-[#002B50]/90 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} />
          Tambah Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-300 min-h-[400px]">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FileText size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#002B50]">Belum ada blog</h3>
          <p className="text-slate-500 mb-6 text-center max-w-sm">
            Artikel yang Anda buat akan muncul di sini. Mulai tulis artikel pertama Anda sekarang!
          </p>
          <Link
            href="/dashboard/blog/create"
            className="px-5 py-2.5 bg-white border border-[#002B50] text-[#002B50] hover:bg-[#002B50]/5 rounded-xl font-medium transition-colors"
          >
            Buat Artikel Baru
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              {/* Banner Image */}
              <div className="h-48 bg-slate-100 w-full flex items-center justify-center relative overflow-hidden">
                {blog.banner_image ? (
                  <img
                    src={`http://localhost:4000/public${blog.banner_image}`}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none'; // Hide broken image
                      e.target.nextSibling.style.display = 'flex'; // Show placeholder
                    }}
                  />
                ) : (
                  <FileText size={48} className="text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                )}

                {/* Fallback Placeholder (Hidden by default if image exists) */}
                <div className={`absolute inset-0 flex items-center justify-center ${blog.banner_image ? 'hidden' : 'flex'}`}>
                  {!blog.banner_image && <FileText size={48} className="text-slate-300 group-hover:scale-110 transition-transform duration-500" />}
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded-md">Article</span>
                  <div className="relative group/menu">
                    <button className="p-1 text-slate-400 hover:text-[#002B50] rounded-full hover:bg-slate-100 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-6 hidden group-hover/menu:block bg-white border border-slate-100 rounded-lg shadow-xl z-20 min-w-[140px] py-1">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>

                <h2 className="font-bold text-lg text-[#002B50] mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
                  {/* Description placeholder if needed */}
                  Slug: {blog.slug}
                </p>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                  <span>{new Date(blog.createdAt || Date.now()).toLocaleDateString("id-ID")}</span>
                  <span>Administrator</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Edit */}
      {editingBlog && (
        <div className="fixed inset-0 bg-[#002B50]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100">
            <h2 className="text-xl font-bold mb-6 text-[#002B50]">Edit Blog</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Artikel</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#002B50] focus:border-[#002B50] outline-none transition-all"
                  placeholder="Masukkan judul blog..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingBlog(null)}
                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2.5 bg-[#002B50] text-white rounded-xl font-medium hover:bg-[#002B50]/90 transition-all shadow-lg shadow-blue-900/20"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}