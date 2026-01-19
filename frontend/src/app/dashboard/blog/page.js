"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";
import { FileText, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { getBaseUrl } from "@/lib/config";

// Helper function to strip HTML and decode entities
const getPlainText = (html) => {
  if (!html) return '';
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
          {blogs.map((blog) => {
            // Get plain text excerpt
            const contentText = blog.contents && blog.contents.length > 0
              ? blog.contents
                .filter(c => c.type === "html" || c.type === "text" || c.type === "" || !c.type)
                .map(c => getPlainText(c.content || ""))
                .join(" ")
                .trim()
              : '';

            const excerpt = contentText
              ? (contentText.substring(0, 150) + (contentText.length > 150 ? '...' : ''))
              : 'Tidak ada konten';

            return (
              <div
                key={blog.id}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                {/* Banner Image */}
                <div className="h-48 bg-slate-100 w-full flex items-center justify-center relative overflow-hidden">
                  {blog.banner_image ? (
                    <img
                      src={`${getBaseUrl()}/public${blog.banner_image}`}
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
                    <span className="text-xs font-semibold px-2 py-1 bg-[#002B50]/10 text-[#002B50] rounded-md">Article</span>
                    <div className="relative group/menu">
                      <button className="p-1 text-slate-400 hover:text-[#002B50] rounded-full hover:bg-slate-100 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-6 hidden group-hover/menu:block bg-white border border-slate-100 rounded-lg shadow-xl z-20 min-w-[140px] py-1">
                        <Link
                          href={`/dashboard/blog/edit/${blog.id}`}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={14} /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>

                  <h2 className="font-bold text-lg text-[#002B50] mb-2 line-clamp-2 leading-tight group-hover:text-[#003d70] transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
                    {excerpt}
                  </p>

                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                    <span>{new Date(blog.createdAt || Date.now()).toLocaleDateString("id-ID")}</span>
                    <span>Administrator</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}