"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";

export default function CreateProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Product basic info
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Variants
    const [variants, setVariants] = useState([
        { color_id: "", storage_id: "", price: "", stock: "" }
    ]);

    // Master data
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [colors, setColors] = useState([]);
    const [storages, setStorages] = useState([]);

    // Fetch master data
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [categoriesRes, tagsRes, colorsRes, storagesRes] = await Promise.all([
                    apiFetch("/admin/categories"),
                    apiFetch("/tags"),
                    apiFetch("/colors"),
                    apiFetch("/storages"),
                ]);
                setCategories(categoriesRes.categories || categoriesRes || []);
                setTags(tagsRes.tags || tagsRes || []);
                setColors(colorsRes.colors || colorsRes || []);
                setStorages(storagesRes.storages || storagesRes || []);
            } catch (error) {
                console.error("Failed to fetch master data:", error);
                Swal.fire("Error", "Gagal memuat data master", "error");
            }
        };
        fetchMasterData();
    }, []);

    // Add new color
    const handleAddNewColor = async () => {
        const { value: colorName } = await Swal.fire({
            title: 'Tambah Warna Baru',
            input: 'text',
            inputLabel: 'Nama Warna',
            inputPlaceholder: 'Contoh: Midnight Black',
            showCancelButton: true,
            confirmButtonText: 'Tambah',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#002B50',
            inputValidator: (value) => {
                if (!value) {
                    return 'Nama warna tidak boleh kosong!';
                }
            }
        });

        if (colorName) {
            try {
                const newColor = await apiFetch("/colors", {
                    method: "POST",
                    body: JSON.stringify({ name: colorName }),
                });
                setColors([...colors, newColor]);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: `Warna "${colorName}" berhasil ditambahkan`,
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire("Error", "Gagal menambahkan warna", "error");
            }
        }
    };

    // Add new storage
    const handleAddNewStorage = async () => {
        const { value: storageName } = await Swal.fire({
            title: 'Tambah Kapasitas Baru',
            input: 'text',
            inputLabel: 'Kapasitas',
            inputPlaceholder: 'Contoh: 512GB',
            showCancelButton: true,
            confirmButtonText: 'Tambah',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#002B50',
            inputValidator: (value) => {
                if (!value) {
                    return 'Kapasitas tidak boleh kosong!';
                }
            }
        });

        if (storageName) {
            try {
                const newStorage = await apiFetch("/storages", {
                    method: "POST",
                    body: JSON.stringify({ name: storageName }),
                });
                setStorages([...storages, newStorage]);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: `Kapasitas "${storageName}" berhasil ditambahkan`,
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire("Error", "Gagal menambahkan kapasitas", "error");
            }
        }
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            Swal.fire("Peringatan", "Maksimal 5 gambar", "warning");
            return;
        }

        setImages([...images, ...files]);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    // Remove image
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    // Add variant
    const addVariant = () => {
        setVariants([...variants, { color_id: "", storage_id: "", price: "", stock: "" }]);
    };

    // Remove variant
    const removeVariant = (index) => {
        if (variants.length === 1) {
            Swal.fire("Peringatan", "Minimal harus ada 1 variant", "warning");
            return;
        }
        setVariants(variants.filter((_, i) => i !== index));
    };

    // Update variant
    const updateVariant = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            Swal.fire("Gagal", "Nama produk wajib diisi", "error");
            return;
        }

        if (!categoryId) {
            Swal.fire("Gagal", "Kategori wajib dipilih", "error");
            return;
        }

        if (images.length === 0) {
            Swal.fire("Gagal", "Minimal upload 1 gambar", "error");
            return;
        }

        // Validate variants - only check non-empty variants
        const filledVariants = variants.filter(v =>
            v.color_id || v.storage_id || v.price || v.stock
        );

        if (filledVariants.length === 0) {
            Swal.fire("Gagal", "Minimal tambahkan 1 variant produk", "error");
            return;
        }

        for (let i = 0; i < filledVariants.length; i++) {
            const v = filledVariants[i];
            if (!v.color_id || !v.storage_id || !v.price || !v.stock) {
                Swal.fire("Gagal", `Variant ${i + 1} belum lengkap`, "error");
                return;
            }
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("category_id", categoryId);
            formData.append("tag_ids", JSON.stringify(selectedTags));

            // Append images
            images.forEach((image) => {
                formData.append("images", image);
            });

            // Append only filled variants
            formData.append("variants", JSON.stringify(filledVariants));

            const response = await apiFetch("/admin/product", {
                method: "POST",
                body: formData,
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Produk berhasil ditambahkan",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => router.push("/dashboard/product"));

        } catch (error) {
            console.error("Failed to create product:", error);
            Swal.fire("Error", error.message || "Gagal menambahkan produk", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/product"
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} className="text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-[#002B50]">Tambah Produk Baru</h1>
                            <p className="text-sm text-slate-500">Isi semua informasi produk dan variant</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#002B50] hover:bg-[#002B50]/90 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Menyimpan..." : "Simpan Produk"}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Produk */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#002B50] mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#002B50] text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
                            Informasi Produk
                        </h2>

                        <div className="space-y-4">
                            {/* Nama Produk */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Nama Produk <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: iPhone 13 Pro Max"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none transition"
                                    required
                                />
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none transition"
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Tags (Opsional)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => {
                                                if (selectedTags.includes(tag.id)) {
                                                    setSelectedTags(selectedTags.filter(t => t !== tag.id));
                                                } else {
                                                    setSelectedTags([...selectedTags, tag.id]);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedTags.includes(tag.id)
                                                ? "bg-[#002B50] text-white"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Deskripsikan produk Anda..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none transition resize-none"
                                />
                            </div>

                            {/* Upload Gambar */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Gambar Produk <span className="text-red-500">*</span> (Maks. 5)
                                </label>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-5 gap-3 mb-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border-2 border-slate-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                {images.length < 5 && (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#002B50] hover:bg-slate-50 transition">
                                        <Upload size={32} className="text-slate-400 mb-2" />
                                        <span className="text-sm text-slate-600 font-medium">
                                            Klik untuk upload gambar
                                        </span>
                                        <span className="text-xs text-slate-400 mt-1">
                                            PNG, JPG, WebP (Maks. 2MB per file)
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Variant Produk */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-[#002B50] flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#002B50] text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
                                Variant Produk
                            </h2>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center gap-2 px-4 py-2 bg-[#002B50] text-white rounded-lg hover:bg-[#003366] transition text-sm font-medium"
                            >
                                <Plus size={16} />
                                Tambah Variant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div key={index} className="p-4 border-2 border-slate-200 rounded-xl relative">
                                    {/* Remove button */}
                                    {variants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                                            title="Hapus variant"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}

                                    <h3 className="font-semibold text-[#002B50] mb-3">Variant #{index + 1}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        {/* Warna */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Warna <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={variant.color_id}
                                                    onChange={(e) => updateVariant(index, "color_id", e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none text-sm"
                                                    required
                                                >
                                                    <option value="">Pilih Warna</option>
                                                    {colors.map((color) => (
                                                        <option key={color.id} value={color.id}>
                                                            {color.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={handleAddNewColor}
                                                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                                    title="Tambah warna baru"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Storage */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Kapasitas <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={variant.storage_id}
                                                    onChange={(e) => updateVariant(index, "storage_id", e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none text-sm"
                                                    required
                                                >
                                                    <option value="">Pilih Kapasitas</option>
                                                    {storages.map((storage) => (
                                                        <option key={storage.id} value={storage.id}>
                                                            {storage.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={handleAddNewStorage}
                                                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                                    title="Tambah kapasitas baru"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Harga */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Harga <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={variant.price}
                                                onChange={(e) => updateVariant(index, "price", e.target.value)}
                                                placeholder="0"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none text-sm"
                                                required
                                                min="0"
                                            />
                                        </div>

                                        {/* Stok */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Stok <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, "stock", e.target.value)}
                                                placeholder="0"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none text-sm"
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                </form>
            </div>
        </div>
    );
}
