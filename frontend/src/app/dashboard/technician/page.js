"use client";
import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  User,
  ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getBaseUrl } from "@/lib/config";

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState(null);

  // Form State
  const [form, setForm] = useState({ name: "" });
  const [photo, setPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const API_URL = "/admin";
  const BASE_IMAGE_URL = getBaseUrl(); // Dynamically get backend URL

  // Fetch semua teknisi
  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`${API_URL}/technicians`, { credentials: "include" });
      setTechnicians(data || []);
    } catch (err) {
      console.error("Gagal fetch technicians", err);
      Swal.fire("Error", "Gagal memuat data teknisi", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  // Filter Technicians
  const filteredTechnicians = useMemo(() => {
    return technicians.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [technicians, searchQuery]);

  // Modal Handlers
  const openAddModal = () => {
    setEditingTech(null);
    setForm({ name: "" });
    setPhoto(null);
    setPreviewPhoto(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tech) => {
    setEditingTech(tech);
    setForm({ name: tech.name });
    setPhoto(null);
    setPreviewPhoto(tech.photoUrl ? `${BASE_IMAGE_URL}/public${tech.photoUrl}` : null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTech(null);
    setForm({ name: "" });
    setPhoto(null);
    setPreviewPhoto(null);
  };

  // Image Upload Handler
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return Swal.fire("Gagal!", "Nama wajib diisi", "error");
    }

    const formData = new FormData();
    formData.append("name", form.name);
    if (photo) formData.append("photo", photo);

    const url = editingTech ? `${API_URL}/technician/${editingTech.id}` : `${API_URL}/technician`;
    const method = editingTech ? "PUT" : "POST";

    try {
      const data = await apiFetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (data.message) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
        });
        closeModal();
        fetchTechnicians();
      } else {
        throw new Error(data.message || "Terjadi kesalahan");
      }
    } catch (err) {
      console.error("Gagal simpan teknisi", err);
      Swal.fire("Error", "Gagal menyimpan teknisi", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Teknisi?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const data = await apiFetch(`${API_URL}/technician/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (data.message) {
          Swal.fire("Terhapus!", data.message, "success");
          fetchTechnicians();
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error("Gagal hapus teknisi", err);
        Swal.fire("Error", "Gagal menghapus teknisi", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#002B50] tracking-tight">Kelola Teknisi</h1>
          <p className="text-slate-500 mt-1">Manajemen data teknisi dan staff.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Teknisi</p>
              <h3 className="text-2xl font-bold text-[#002B50]">{technicians.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari teknisi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#002B50]/20 transition-all text-[#002B50]"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#002B50] text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all"
        >
          <Plus size={20} className="stroke-[3]" />
          <span>Tambah Teknisi</span>
        </button>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading Skeletons
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-4 animate-pulse">
              <div className="w-24 h-24 rounded-full bg-slate-200" />
              <div className="h-4 bg-slate-200 w-1/2 rounded" />
              <div className="flex gap-2 w-full mt-2">
                <div className="h-10 bg-slate-200 flex-1 rounded-xl" />
                <div className="h-10 bg-slate-200 flex-1 rounded-xl" />
              </div>
            </div>
          ))
        ) : filteredTechnicians.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-400">
            <User size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Tidak ada teknisi ditemukan</p>
          </div>
        ) : (
          filteredTechnicians.map((t) => (
            <div
              key={t.id}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center hover:shadow-md hover:border-blue-100 transition-all duration-300"
            >
              {/* Photo Area */}
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                  {t.photoUrl ? (
                    <img
                      src={`${BASE_IMAGE_URL}/public${t.photoUrl}`}
                      alt={t.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`;
                      }}
                    />
                  ) : (
                    <User className="text-slate-300" size={48} />
                  )}
                </div>
                {/* Status Indicator (Optional aesthetic touch) */}
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="Active"></div>
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-[#002B50] mb-1 text-center">{t.name}</h3>
              <p className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full mb-6">
                Teknisi Service
              </p>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                <button
                  onClick={() => openEditModal(t)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop - Transparent as requested */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-transparent"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 ring-1 ring-slate-900/5"
            >
              {/* Modal Header */}
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#002B50]">
                  {editingTech ? "Edit Teknisi" : "Tambah Teknisi"}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Photo Upload */}
                <div className="flex justify-center">
                  <div className="relative group cursor-pointer" onClick={() => document.getElementById("photoInput").click()}>
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                      {previewPhoto ? (
                        <img src={previewPhoto} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-slate-300" size={40} />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="text-white" size={24} />
                    </div>
                    <input
                      type="file"
                      id="photoInput"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Teknisi</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all font-medium text-[#002B50]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#002B50] hover:bg-[#002B50]/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]"
                  >
                    {editingTech ? "Simpan Perubahan" : "Simpan Teknisi"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}