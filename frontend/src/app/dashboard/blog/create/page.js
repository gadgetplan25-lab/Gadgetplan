"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import dynamic from 'next/dynamic';
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import 'react-quill-new/dist/quill.snow.css';

// Import Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBannerChange = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024)
      return Swal.fire("Gagal!", "Ukuran banner maksimal 2MB", "error");
    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return Swal.fire("Gagal!", "Judul wajib diisi", "error");
    }

    if (!content.trim() || content === '<p><br></p>') {
      return Swal.fire("Gagal!", "Konten blog tidak boleh kosong", "error");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", JSON.stringify([{ type: "html", value: content }]));

      if (banner) {
        formData.append("banner", banner);
      }

      await apiFetch("/blogs", {
        method: "POST",
        body: formData
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Blog berhasil dibuat",
        timer: 1500,
        showConfirmButton: false
      }).then(() => router.push("/dashboard/blog"));

    } catch (err) {
      console.error(err);
      Swal.fire("Gagal!", err.message || "Blog gagal dibuat", "error");
    } finally {
      setLoading(false);
    }
  };

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list',
    'align',
    'link', 'image'
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/blog"
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#002B50]">Buat Artikel Baru</h1>
              <p className="text-sm text-slate-500">Tulis dan publikasikan artikel Anda</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#002B50] hover:bg-[#002B50]/90 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {loading ? "Menyimpan..." : "Publikasikan"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <label className="block text-sm font-bold text-slate-500 uppercase mb-3">
              Judul Artikel
            </label>
            <input
              type="text"
              className="w-full text-3xl font-bold text-[#002B50] border-none outline-none focus:ring-0 placeholder:text-slate-300"
              placeholder="Masukkan judul artikel yang menarik..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Banner */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <label className="block text-sm font-bold text-slate-500 uppercase mb-3">
              Banner Artikel
            </label>
            <div
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#002B50] hover:bg-slate-50 transition-all"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0)
                  handleBannerChange(e.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="bannerInput"
                onChange={(e) => handleBannerChange(e.target.files[0])}
              />
              <label htmlFor="bannerInput" className="cursor-pointer">
                {bannerPreview ? (
                  <div className="relative group">
                    <img
                      src={bannerPreview}
                      alt="Banner Preview"
                      className="mx-auto max-h-96 rounded-lg shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <p className="text-white font-medium">Klik untuk ganti gambar</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12">
                    <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-600 font-medium mb-1">
                      Drag & drop banner atau klik untuk pilih
                    </p>
                    <p className="text-sm text-slate-400">
                      Ukuran maksimal 2MB (JPG, PNG, WebP)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Rich Text Editor - Quill */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <label className="block text-sm font-bold text-slate-500 uppercase mb-3">
              Konten Artikel
            </label>
            <div className="quill-editor-wrapper">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Mulai menulis artikel Anda di sini..."
                className="bg-white"
                style={{ height: '400px', marginBottom: '50px' }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-3">
              💡 Tips: Gunakan heading untuk struktur artikel yang baik, tambahkan gambar untuk memperkaya konten
            </p>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .quill-editor-wrapper .ql-container {
          font-size: 16px;
          font-family: inherit;
        }
        .quill-editor-wrapper .ql-editor {
          min-height: 400px;
        }
        .quill-editor-wrapper .ql-editor.ql-blank::before {
          color: #cbd5e1;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
