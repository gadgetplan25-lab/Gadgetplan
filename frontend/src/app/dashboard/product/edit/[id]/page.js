"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { getProductImageUrl } from "@/lib/config";
import { ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const [loading, setLoading] = useState(false);
    const [fetchingProduct, setFetchingProduct] = useState(true);

    // Product basic info
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);

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

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setFetchingProduct(true);
                const product = await apiFetch(`/admin/product/${productId}`);

                // Populate basic info
                setName(product.name || "");
                setDescription(product.description || "");
                setCategoryId(product.category_id || "");

                // Populate tags
                const tagIds = product.ProductTags?.map(pt => pt.tag_id) || [];
                setSelectedTags(tagIds);

                // Populate existing images
                const imgs = product.ProductImages?.map(img => ({
                    id: img.id,
                    url: getProductImageUrl(img.image_url)
                })) || [];
                setExistingImages(imgs);

                // Populate variants
                const productVariants = product.variants || [];
                if (productVariants.length > 0) {
                    const formattedVariants = productVariants.map(v => ({
                        id: v.id,
                        color_id: v.color_id || "",
                        storage_id: v.storage_id || "",
                        price: v.price || "",
                        stock: v.stock || ""
                    }));
                    setVariants(formattedVariants);
                } else {
                    setVariants([{ color_id: "", storage_id: "", price: "", stock: "" }]);
                }

            } catch (error) {
                console.error("Failed to fetch product:", error);
                Swal.fire("Error", "Gagal memuat data produk", "error");
                router.push("/dashboard/product");
            } finally {
                setFetchingProduct(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, router]);

    // Image handlers
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
    };

    const removeNewImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const removeExistingImage = (id) => {
        setDeletedImageIds([...deletedImageIds, id]);
        setExistingImages(existingImages.filter(img => img.id !== id));
    };

    // Variant handlers
    const addVariant = () => {
        setVariants([...variants, { color_id: "", storage_id: "", price: "", stock: "" }]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    // Tag handlers
    const toggleTag = (tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    // Submit handler
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

            // Append new images
            images.forEach((image) => {
                formData.append("images", image);
            });

            // Append deleted image IDs
            deletedImageIds.forEach((id) => {
                formData.append("deletedImageIds[]", id);
            });

            // Append only filled variants
            formData.append("variants", JSON.stringify(filledVariants));

            const response = await apiFetch(`/admin/product/${productId}`, {
                method: "PUT",
                body: formData,
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Produk berhasil diupdate",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => router.push("/dashboard/product"));

        } catch (error) {
            console.error("Failed to update product:", error);
            Swal.fire("Error", error.message || "Gagal mengupdate produk", "error");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingProduct) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B50] mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading product...</p>
                </div>
            </div>
        );
    }

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
                            <h1 className="text-xl font-bold text-[#002B50]">Edit Produk</h1>
                            <p className="text-sm text-slate-500">Update informasi produk</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#002B50] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#003d75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-lg font-bold text-[#002B50] mb-4">Informasi Dasar</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Nama Produk *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: iPhone 13 Pro Max"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Kategori *
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none"
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

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    placeholder="Deskripsi produk..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none resize-none"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <label
                                            key={tag.id}
                                            className={`cursor-pointer px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${selectedTags.includes(tag.id)
                                                ? "bg-[#002B50] text-white border-[#002B50]"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-[#002B50]"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedTags.includes(tag.id)}
                                                onChange={() => toggleTag(tag.id)}
                                            />
                                            {tag.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-lg font-bold text-[#002B50] mb-4">Gambar Produk</h2>

                        <div className="space-y-4">
                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#002B50] transition-colors">
                                <Upload className="mx-auto text-slate-400 mb-3" size={40} />
                                <p className="text-sm text-slate-600 mb-2">
                                    Klik untuk upload gambar
                                </p>
                                <p className="text-xs text-slate-400">PNG, JPG, WebP (Max 2MB)</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="imageUpload"
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className="inline-block mt-4 px-6 py-2 bg-[#002B50] text-white rounded-lg cursor-pointer hover:bg-[#003d75] transition-colors"
                                >
                                    Pilih Gambar
                                </label>
                            </div>

                            {/* Image Previews */}
                            {(existingImages.length > 0 || imagePreviews.length > 0) && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {/* Existing Images */}
                                    {existingImages.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200 group">
                                            <img
                                                src={img.url}
                                                alt="Product"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                Existing
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(img.id)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New Images */}
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-200 group">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                New
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Variants Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-[#002B50]">Variant Produk</h2>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center gap-2 px-4 py-2 bg-[#002B50] text-white rounded-lg hover:bg-[#003d75] transition-colors text-sm font-semibold"
                            >
                                <Plus size={16} />
                                Tambah Variant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div
                                    key={index}
                                    className="border border-slate-200 rounded-lg p-4 relative"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-slate-700">
                                            Variant #{index + 1}
                                        </h3>
                                        {variants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Warna *
                                            </label>
                                            <select
                                                value={variant.color_id}
                                                onChange={(e) =>
                                                    updateVariant(index, "color_id", e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none"
                                            >
                                                <option value="">Pilih Warna</option>
                                                {colors.map((color) => (
                                                    <option key={color.id} value={color.id}>
                                                        {color.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Kapasitas *
                                            </label>
                                            <select
                                                value={variant.storage_id}
                                                onChange={(e) =>
                                                    updateVariant(index, "storage_id", e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none"
                                            >
                                                <option value="">Pilih Kapasitas</option>
                                                {storages.map((storage) => (
                                                    <option key={storage.id} value={storage.id}>
                                                        {storage.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Harga (Rp) *
                                            </label>
                                            <input
                                                type="number"
                                                value={variant.price}
                                                onChange={(e) =>
                                                    updateVariant(index, "price", e.target.value)
                                                }
                                                placeholder="0"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Stok *
                                            </label>
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) =>
                                                    updateVariant(index, "stock", e.target.value)
                                                }
                                                placeholder="0"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none"
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
