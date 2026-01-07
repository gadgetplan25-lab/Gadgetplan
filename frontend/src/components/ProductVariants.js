"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";
import { Plus, Edit2, Trash2, Package, DollarSign, Layers } from "lucide-react";

export default function ProductVariants({ productId, onClose }) {
    const [variants, setVariants] = useState([]);
    const [colors, setColors] = useState([]);
    const [storages, setStorages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);

    // Form state
    const [form, setForm] = useState({
        color_id: "",
        storage_id: "",
        price: "",
        stock: "",
        sku: ""
    });

    useEffect(() => {
        if (productId) {
            fetchData();
        }
    }, [productId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [variantsData, colorsData, storagesData] = await Promise.all([
                apiFetch(`/variants/product/${productId}`),
                apiFetch("/colors/"),
                apiFetch("/storages/")
            ]);

            setVariants(variantsData.variants || []);
            setColors(colorsData.colors || []);
            setStorages(storagesData.storages || []);
        } catch (err) {
            console.error("Error fetching data:", err);
            Swal.fire("Error", "Gagal memuat data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.price || !form.stock) {
            return Swal.fire("Error", "Harga dan stok wajib diisi", "error");
        }

        try {
            const payload = {
                color_id: form.color_id || null,
                storage_id: form.storage_id || null,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
                sku: form.sku || null
            };

            if (editingVariant) {
                await apiFetch(`/variants/${editingVariant.id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                    headers: { "Content-Type": "application/json" }
                });
                Swal.fire("Berhasil!", "Variant berhasil diupdate", "success");
            } else {
                await apiFetch(`/variants/product/${productId}`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: { "Content-Type": "application/json" }
                });
                Swal.fire("Berhasil!", "Variant berhasil ditambahkan", "success");
            }

            resetForm();
            fetchData();
        } catch (err) {
            console.error("Error saving variant:", err);
            Swal.fire("Error", err.message || "Gagal menyimpan variant", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus Variant?",
            text: "Tindakan ini tidak bisa dibatalkan",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        });

        if (result.isConfirmed) {
            try {
                await apiFetch(`/variants/${id}`, { method: "DELETE" });
                Swal.fire("Terhapus!", "Variant berhasil dihapus", "success");
                fetchData();
            } catch (err) {
                Swal.fire("Error", "Gagal menghapus variant", "error");
            }
        }
    };

    const handleEdit = (variant) => {
        setEditingVariant(variant);
        setForm({
            color_id: variant.color_id || "",
            storage_id: variant.storage_id || "",
            price: variant.price,
            stock: variant.stock,
            sku: variant.sku || ""
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setForm({ color_id: "", storage_id: "", price: "", stock: "", sku: "" });
        setEditingVariant(null);
        setShowForm(false);
    };

    const getColorName = (id) => colors.find(c => c.id === id)?.name || "-";
    const getStorageName = (id) => storages.find(s => s.id === id)?.name || "-";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002B50]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-[#002B50]">Product Variants</h3>
                    <p className="text-sm text-slate-500">Kelola harga & stok per kombinasi warna & storage</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#002B50] text-white rounded-lg hover:bg-[#002B50]/90 transition-colors"
                >
                    <Plus size={18} />
                    {showForm ? "Tutup Form" : "Tambah Variant"}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h4 className="font-bold text-[#002B50] mb-4">
                        {editingVariant ? "Edit Variant" : "Tambah Variant Baru"}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Warna</label>
                                <select
                                    value={form.color_id}
                                    onChange={(e) => setForm({ ...form, color_id: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none"
                                >
                                    <option value="">-- Pilih Warna --</option>
                                    {colors.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Storage</label>
                                <select
                                    value={form.storage_id}
                                    onChange={(e) => setForm({ ...form, storage_id: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none"
                                >
                                    <option value="">-- Pilih Storage --</option>
                                    {storages.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Harga (Rp) *</label>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    placeholder="0"
                                    required
                                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stok *</label>
                                <input
                                    type="number"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    placeholder="0"
                                    required
                                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#002B50] text-white rounded-lg hover:bg-[#002B50]/90 transition-colors"
                            >
                                {editingVariant ? "Update Variant" : "Simpan Variant"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Variants Table */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                {variants.length === 0 ? (
                    <div className="text-center py-12">
                        <Package size={48} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500">Belum ada variant</p>
                        <p className="text-sm text-slate-400">Klik "Tambah Variant" untuk mulai</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Warna</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Storage</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Harga</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Stok</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {variants.map((v) => (
                                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-slate-700">{getColorName(v.color_id)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{getStorageName(v.storage_id)}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-[#002B50]">
                                        Rp {parseInt(v.price).toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${v.stock > 10 ? "bg-green-100 text-green-700" :
                                            v.stock > 0 ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"
                                            }`}>
                                            {v.stock} unit
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(v)}
                                                className="p-2 text-[#002B50] hover:bg-[#002B50]/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(v.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Summary */}
            {variants.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#002B50]/5 border border-[#002B50]/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Layers size={16} className="text-[#002B50]" />
                            <span className="text-xs font-bold text-[#002B50] uppercase">Total Variants</span>
                        </div>
                        <p className="text-2xl font-bold text-[#002B50]">{variants.length}</p>
                    </div>
                    <div className="bg-[#002B50]/5 border border-[#002B50]/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Package size={16} className="text-[#002B50]" />
                            <span className="text-xs font-bold text-[#002B50] uppercase">Total Stok</span>
                        </div>
                        <p className="text-2xl font-bold text-[#002B50]">
                            {variants.reduce((sum, v) => sum + parseInt(v.stock), 0)} unit
                        </p>
                    </div>
                    <div className="bg-[#002B50]/5 border border-[#002B50]/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign size={16} className="text-[#002B50]" />
                            <span className="text-xs font-bold text-[#002B50] uppercase">Range Harga</span>
                        </div>
                        <p className="text-sm font-bold text-[#002B50]">
                            Rp {Math.min(...variants.map(v => parseInt(v.price))).toLocaleString("id-ID")} -
                            Rp {Math.max(...variants.map(v => parseInt(v.price))).toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
