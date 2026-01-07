"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";
import { Plus, Edit2, Trash2, X, Palette, HardDrive } from "lucide-react";

export default function MasterDataModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("colors"); // 'colors' or 'storages'
    const [colors, setColors] = useState([]);
    const [storages, setStorages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({ name: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [colorsData, storagesData] = await Promise.all([
                apiFetch("/colors/"),
                apiFetch("/storages/")
            ]);
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
        if (!formData.name.trim()) {
            Swal.fire("Error", "Nama tidak boleh kosong", "warning");
            return;
        }

        try {
            const endpoint = activeTab === "colors" ? "/colors" : "/storages";
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${endpoint}/${editingId}` : endpoint;

            await apiFetch(url, {
                method,
                body: JSON.stringify(formData)
            });

            Swal.fire("Berhasil", `${editingId ? "Update" : "Tambah"} berhasil!`, "success");
            fetchData();
            resetForm();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus data?",
            text: "Data yang sudah dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        });

        if (!result.isConfirmed) return;

        try {
            const endpoint = activeTab === "colors" ? "/colors" : "/storages";
            await apiFetch(`${endpoint}/${id}`, { method: "DELETE" });
            Swal.fire("Terhapus!", "Data berhasil dihapus", "success");
            fetchData();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({ name: item.name });
    };

    const resetForm = () => {
        setFormData({ name: "" });
        setEditingId(null);
    };

    const currentData = activeTab === "colors" ? colors : storages;
    const label = activeTab === "colors" ? "Warna" : "Storage";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Master Data</h2>
                        <p className="text-sm text-slate-500 mt-1">Kelola warna dan storage untuk variants</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("colors")}
                        className={`flex-1 py-3 px-4 font-medium transition-colors ${activeTab === "colors"
                            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        <Palette size={18} className="inline mr-2" />
                        Warna
                    </button>
                    <button
                        onClick={() => setActiveTab("storages")}
                        className={`flex-1 py-3 px-4 font-medium transition-colors ${activeTab === "storages"
                            ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        <HardDrive size={18} className="inline mr-2" />
                        Storage
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mb-6 bg-slate-50 p-4 rounded-xl">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {editingId ? `Edit ${label}` : `Tambah ${label} Baru`}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ name: e.target.value })}
                                placeholder={`Nama ${label}...`}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#002B50] hover:bg-[#003d73] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
                                {editingId ? "Update" : "Tambah"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                                >
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>

                    {/* List */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">
                            Daftar {label} ({currentData.length})
                        </h3>
                        {loading ? (
                            <p className="text-center text-slate-500 py-8">Loading...</p>
                        ) : currentData.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">Belum ada data {label}</p>
                        ) : (
                            currentData.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <span className="font-medium text-slate-800">{item.name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-[#002B50] hover:bg-[#003d73] text-white rounded-xl font-medium transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
