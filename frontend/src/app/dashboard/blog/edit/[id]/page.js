"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import dynamic from 'next/dynamic';
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { getBaseUrl } from "@/lib/config";
import 'react-quill-new/dist/quill.snow.css';

// Import Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const blogId = params.id;

    const [title, setTitle] = useState("");
    const [banner, setBanner] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [existingBanner, setExistingBanner] = useState(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchBlog();
    }, [blogId]);

    const fetchBlog = async () => {
        try {
            const data = await apiFetch(`/blogs/id/${blogId}`);


            setTitle(data.title || "");
            setExistingBanner(data.banner_image);



            // Backend sends content directly as HTML string
            if (data.content && typeof data.content === 'string') {
                // Try to parse as JSON first (backward compatibility)
                try {
                    const parsedContent = JSON.parse(data.content);


                    if (Array.isArray(parsedContent) && parsedContent[0]?.value) {

                        setContent(parsedContent[0].value);
                    } else if (typeof parsedContent === 'string') {

                        setContent(parsedContent);
                    } else {
                        setContent("");
                    }
                } catch (e) {
                    setContent(data.content);
                }
            } else if (data.contents && Array.isArray(data.contents)) {
                // Fallback: combine contents array

                const htmlContent = data.contents
                    .filter(c => c.type === "html" || c.type === "text")
                    .map(c => c.content || "")
                    .join("");

                setContent(htmlContent);
            } else {

                setContent("");
            }
        } catch (err) {
            Swal.fire("Error", err.message || "Gagal memuat blog", "error");
            router.push("/dashboard/blog");
        } finally {
            setFetching(false);
        }
    };

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

            await apiFetch(`/blogs/${blogId}`, {
                method: "PUT",
                body: formData,
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Blog berhasil diperbarui",
                timer: 1500,
                showConfirmButton: false
            }).then(() => router.push("/dashboard/blog"));

        } catch (err) {
            // console.error(err);
            Swal.fire("Gagal!", err.message || "Blog gagal diperbarui", "error");
        } finally {
            setLoading(false);
        }
    };

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

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B50]"></div>
            </div>
        );
    }

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
                            <h1 className="text-xl font-bold text-[#002B50]">Edit Artikel</h1>
                            <p className="text-sm text-slate-500">Perbarui konten artikel Anda</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#002B50] hover:bg-[#002B50]/90 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
                                {bannerPreview || existingBanner ? (
                                    <div className="relative group">
                                        <img
                                            src={bannerPreview || `${getBaseUrl()}/public${existingBanner}`}
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

                    {/* Rich Text Editor */}
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
        /* Fix for black line next to images */
        .quill-editor-wrapper .ql-editor img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
        /* Remove cursor from image container */
        .quill-editor-wrapper .ql-editor p:has(img) {
          line-height: 0;
        }
      `}</style>
        </div>
    );
}
