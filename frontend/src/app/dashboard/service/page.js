"use client";
import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import {
  Wrench,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Clock,
  Banknote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceTypePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [form, setForm] = useState({ nama: "", harga: "", waktu_proses: "" });

  const API_URL = "/admin/service";

  // Ambil semua service
  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(API_URL, { credentials: "include" });
      setServices(data.data || []);
    } catch (err) {
      console.error("Gagal fetch services", err);
      Swal.fire("Error", "Gagal memuat data service", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter Services
  const filteredServices = useMemo(() => {
    return services.filter(s =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [services, searchQuery]);

  // Handle Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama.trim() || !form.harga || !form.waktu_proses.trim()) {
      return Swal.fire("Gagal!", "Semua field wajib diisi", "error");
    }

    const payload = { ...form, harga: parseInt(form.harga) };
    const url = editingService ? `${API_URL}/${editingService.id}` : API_URL;
    const method = editingService ? "PUT" : "POST";

    try {
      const data = await apiFetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        fetchServices();
      } else {
        throw new Error(data.message || "Terjadi kesalahan");
      }
    } catch (err) {
      console.error("Gagal simpan service", err);
      Swal.fire("Error", "Gagal menyimpan service", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Layanan?",
      text: "Data service ini akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const data = await apiFetch(`${API_URL}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (data.message) {
          Swal.fire("Terhapus!", data.message, "success");
          fetchServices();
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error("Gagal hapus service", err);
        Swal.fire("Error", "Gagal menghapus service", "error");
      }
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setForm({ nama: "", harga: "", waktu_proses: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setForm({
      nama: service.nama,
      harga: service.harga.toString(),
      waktu_proses: service.waktu_proses,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setForm({ nama: "", harga: "", waktu_proses: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#002B50] tracking-tight">Kelola Layanan</h1>
          <p className="text-slate-500 mt-1">Atur jenis layanan dan estimasi harga.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Wrench size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Layanan</p>
              <h3 className="text-2xl font-bold text-[#002B50]">{services.length}</h3>
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
            placeholder="Cari layanan..."
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
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Services Grid/Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Layanan</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Harga Estimasi</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu Proses</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">Loading data...</td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <Wrench size={48} className="mx-auto mb-3 opacity-20" />
                    <p>Tidak ada layanan ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredServices.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-700">{s.nama}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Banknote size={16} className="text-slate-400" />
                        <span>Rp {parseInt(s.harga).toLocaleString("id-ID")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={16} className="text-slate-400" />
                        <span>{s.waktu_proses}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 ring-1 ring-slate-900/5"
            >
              {/* Modal Header */}
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#002B50]">
                  {editingService ? "Edit Layanan" : "Tambah Layanan"}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Layanan</label>
                  <input
                    type="text"
                    name="nama"
                    required
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Contoh: Ganti LCD iPhone 13"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all font-medium text-[#002B50]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Harga (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                      <input
                        type="number"
                        name="harga"
                        required
                        value={form.harga}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all font-medium text-[#002B50]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Waktu Proses</label>
                    <input
                      type="text"
                      name="waktu_proses"
                      required
                      value={form.waktu_proses}
                      onChange={handleChange}
                      placeholder="Contoh: 1-2 Jam"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all font-medium text-[#002B50]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#002B50] hover:bg-[#002B50]/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]"
                  >
                    {editingService ? "Simpan Perubahan" : "Simpan Layanan"}
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