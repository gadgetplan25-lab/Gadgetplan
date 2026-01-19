"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { getProductImageUrl } from "@/lib/config";
import { X, Upload, Plus, Check } from "lucide-react";

export default function ProductSidebar({ isOpen, onClose, onAdded, editingProduct }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category_id: "",
  });

  const [images, setImages] = useState([]); // New files
  const [previewUrls, setPreviewUrls] = useState([]); // Previews for new files
  const [existingImages, setExistingImages] = useState([]); // Objects {id, url}
  const [deletedImageIds, setDeletedImageIds] = useState([]); // IDs to delete

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Selected IDs
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  // New Items (Dynamic Creation)
  const [newTags, setNewTags] = useState([]);

  // UI States for adding new items
  const [showTagInput, setShowTagInput] = useState(false);

  const [tempTag, setTempTag] = useState("");

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catData, tagData] = await Promise.all([
          apiFetch("/admin/categories"),
          apiFetch("/tags/")
        ]);
        setCategories(catData.categories || []);
        setTags(tagData.tags || []);
      } catch (err) {
        console.error("Failed to load options", err);
      }
    };
    fetchOptions();
  }, []);

  // --- POPULATE FORM ON EDIT ---
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || "",
        price: editingProduct.price || "",
        description: editingProduct.description || "",
        stock: editingProduct.stock || "",
        category_id: editingProduct.category_id || "",
      });
      // Map existing relations to IDs
      // Note: This relies on the product object having these relations loaded.
      // If the list API doesn't return full relations, this might be partial.
      // Assuming typical structure: editingProduct.ProductTags = [{id, Tag: {id, name}}] or similar
      // We'll inspect what we usually get. If it's just IDs, we use them.
      // For now, we'll try to safe-map. 
      // If the backend returns `tags` array of IDs, use that.

      // Since I don't see the exact structure of `editingProduct` relations in the previous file, 
      // I'll assume they might be missing or complex. 
      // Ideally, we should fetch the single product detail if relations are missing.
      // But let's set basic fields at least.

      setExistingImages(
        editingProduct.ProductImages?.map(img => ({
          id: img.id,
          url: getProductImageUrl(img.image_url)
        })) || []
      );
      setDeletedImageIds([]);

      // Reset new selections
      setSelectedTagIds([]);
      setNewTags([]);
      setImages([]); setPreviewUrls([]);

    } else {
      // RESET FORM FOR ADD
      setForm({ name: "", price: "", description: "", stock: "", category_id: "" });
      setImages([]);
      setPreviewUrls([]);
      setExistingImages([]);
      setSelectedTagIds([]);
      setNewTags([]);
    }
  }, [editingProduct, isOpen]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (files) => {
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (id) => {
    setDeletedImageIds(prev => [...prev, id]);
    setExistingImages(prev => prev.filter(img => img.id !== id));
  };

  const toggleSelect = (id, setState, state) => {
    setState(state.includes(id) ? state.filter((x) => x !== id) : [...state, id]);
  };

  const addNewItem = (type) => {
    if (type === "tag" && tempTag.trim()) {
      if (!newTags.includes(tempTag)) setNewTags([...newTags, tempTag]);
      setTempTag("");
      setShowTagInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((file) => formData.append("images", file));

    selectedTagIds.forEach((id) => formData.append("tagIds[]", id));
    newTags.forEach((name) => formData.append("newTags[]", name));

    deletedImageIds.forEach((id) => formData.append("deletedImageIds[]", id));

    try {
      let data;
      if (editingProduct) {
        // EDIT MODE (PUT)
        // We typically don't send *new* images key 'images' for append in PUT unless backend supports it.
        // Assuming backend supports partial update via POST or PUT.
        // Standard rest: PUT /admin/product/:id
        data = await apiFetch(`/admin/product/${editingProduct.id}`, {
          method: "PUT",
          body: formData, // Note: formData in PUT might require backend support (e.g. method-override) or just works if backend uses multer.
        });
      } else {
        // ADD MODE (POST)
        data = await apiFetch("/admin/product", {
          method: "POST",
          body: formData,
        });
      }

      if (data.message || data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: data.message || "Produk berhasil disimpan",
          timer: 1500,
          showConfirmButton: false,
        });
        onAdded(); // Refresh list
        onClose();
      } else {
        throw new Error(data.message || "Gagal menyimpan produk");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err.message || "Terjadi kesalahan server" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex justify-end">
          {/* Backdrop */}
          <motion.div
            className="flex-1 bg-transparent"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-[500px] bg-white shadow-2xl flex flex-col self-start"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-[#002B50]">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="overflow-y-auto p-6 pb-0">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-3">

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Foto Produk</label>
                  <div
                    className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm font-medium text-slate-600">Klik atau drag & drop gambar</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(e.target.files)}
                    />
                  </div>

                  {/* Previews */}
                  {(previewUrls.length > 0 || existingImages.length > 0) && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {existingImages.map((img, i) => (
                        <div key={`exist-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                          <img src={img.url} className="w-full h-full object-cover" alt="existing" />
                          <span className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">Exist</span>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-all hover:scale-110 z-10"
                            title="Hapus Gambar"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                      {previewUrls.map((src, i) => (
                        <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-blue-100 ring-2 ring-blue-500/20 ring-offset-2 bg-slate-50">
                          <img src={src} className="w-full h-full object-cover" alt="new" />
                          <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">New</span>
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-all hover:scale-110 z-10"
                            title="Batal Upload"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Produk</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Contoh: iPhone 13 Pro" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Harga (Rp)</label>
                      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stok</label>
                      <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori</label>
                    <select value={form.category_id} onChange={handleChange} name="category_id" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all cursor-pointer" required>
                      <option value="">-- Pilih Kategori --</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Deskripsi produk..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all" />
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-4" />

                {/* Attributes (Tags, Colors, Storage) */}
                <div className="space-y-6">
                  {/* Tags */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tags</label>
                      {!showTagInput && <button type="button" onClick={() => setShowTagInput(true)} className="text-[#002B50] text-xs font-bold hover:underline">+ New Tag</button>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <label key={t.id} className={`cursor-pointer border rounded-lg px-3 py-1.5 text-xs font-medium transition-all select-none ${selectedTagIds.includes(t.id) ? 'bg-[#002B50] text-white border-[#002B50]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                          <input type="checkbox" className="hidden" checked={selectedTagIds.includes(t.id)} onChange={() => toggleSelect(t.id, setSelectedTagIds, selectedTagIds)} />
                          {t.name}
                        </label>
                      ))}
                      {newTags.map((t, i) => <span key={i} className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg border border-green-200 flex items-center gap-1"><Check size={10} /> {t}</span>)}
                    </div>
                    {showTagInput && (
                      <div className="flex gap-2 mt-2 animate-in fade-in slide-in-from-top-2">
                        <input value={tempTag} onChange={(e) => setTempTag(e.target.value)} placeholder="Nama tag baru..." className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#002B50]" />
                        <button type="button" onClick={() => addNewItem("tag")} className="bg-[#002B50] text-white px-3 py-1 rounded-lg text-xs font-bold">Add</button>
                      </div>
                    )}
                  </div>



                </div>

              </form>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                type="submit"
                form="productForm"
                className="w-full bg-[#002B50] hover:bg-[#002B50]/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]"
              >
                {editingProduct ? "Simpan Perubahan" : "Terbitkan Produk"}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}