// "use client";
// import { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import { apiFetch } from "@/lib/api";

// export default function CategoriesPage() {
//   const [categories, setCategories] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [form, setForm] = useState({ name: "", description: "" });

//   // Fetch kategori
//   const fetchCategories = async () => {
//     try {
//       const res = await apiFetch("/admin/categories", {
//         credentials: "include",
//       });
//       setCategories(data.categories || []);
//     } catch (err) {
//       console.error("Gagal fetch categories", err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Handle form change
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Simpan kategori
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const url = editingCategory
//       ? `/admin/category/${editingCategory.id}`
//       : "/admin/category";

//     const method = editingCategory ? "PUT" : "POST";

//     try {
//       const res = await apiFetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         Swal.fire({
//           icon: "success",
//           title: "Berhasil",
//           text: data.message,
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         fetchCategories();
//         setIsModalOpen(false);
//         setForm({ name: "", description: "" });
//         setEditingCategory(null);
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Gagal",
//           text: data.message || "Terjadi kesalahan",
//         });
//       }
//     } catch (err) {
//       console.error("Gagal simpan kategori", err);
//     }
//   };

//   // Hapus kategori
//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Yakin hapus?",
//       text: "Kategori ini akan dihapus permanen",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Ya, hapus!",
//       cancelButtonText: "Batal",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const res = await apiFetch(
//             `http://localhost:4000/api/admin/category/${id}`,
//             { method: "DELETE", credentials: "include" }
//           );
//           const data = await res.json();
//           if (res.ok) {
//             Swal.fire("Dihapus!", data.message, "success");
//             fetchCategories();
//           } else {
//             Swal.fire("Gagal!", data.message, "error");
//           }
//         } catch (err) {
//           console.error("Gagal hapus kategori", err);
//         }
//       }
//     });
//   };

//   // Modal tambah/edit
//   const openAddModal = () => {
//     setEditingCategory(null);
//     setForm({ name: "", description: "" });
//     setIsModalOpen(true);
//   };

//   const openEditModal = (category) => {
//     setEditingCategory(category);
//     setForm({ name: category.name, description: category.description || "" });
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
//         <h1 className="text-2xl font-bold text-black">Manajemen Kategori</h1>
//         <button
//           onClick={openAddModal}
//           className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
//         >
//           + Tambah Kategori
//         </button>
//       </div>

//       {/* Tabel kategori */}
//       <div className="overflow-x-auto">
//         <table className="w-full border border-black text-sm text-black">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="border border-black px-4 py-2 w-12">No</th>
//               <th className="border border-black px-4 py-2">Nama</th>
//               <th className="border border-black px-4 py-2">Deskripsi</th>
//               <th className="border border-black px-4 py-2 w-40">Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.length > 0 ? (
//               categories.map((cat, i) => (
//                 <tr key={cat.id} className="hover:bg-gray-100">
//                   <td className="border border-black px-4 py-2 text-center">
//                     {i + 1}
//                   </td>
//                   <td className="border border-black px-4 py-2">{cat.name}</td>
//                   <td className="border border-black px-4 py-2">
//                     {cat.description || "-"}
//                   </td>
//                   <td className="border border-black px-4 py-2 text-center space-x-2">
//                     <button
//                       onClick={() => openEditModal(cat)}
//                       className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(cat.id)}
//                       className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
//                     >
//                       Hapus
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="4"
//                   className="text-center py-4 text-gray-500 border border-black"
//                 >
//                   Belum ada kategori
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal Tambah/Edit */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-[400px]">
//             <h2 className="text-xl font-bold mb-4 text-black">
//               {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Nama Kategori"
//                 className="w-full border border-black px-3 py-2 rounded text-black"
//                 required
//               />
//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 placeholder="Deskripsi"
//                 className="w-full border border-black px-3 py-2 rounded text-black"
//               />
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="bg-gray-500 text-white px-4 py-2 rounded"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//                 >
//                   Simpan
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  X,
  Layers,
  Package,
  ArrowUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/admin/categories");
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Gagal fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter Categories
  const filteredCategories = useMemo(() => {
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [categories, searchQuery]);

  // Handle Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCategory
      ? `/admin/category/${editingCategory.id}`
      : "/admin/category";
    const method = editingCategory ? "PUT" : "POST";

    try {
      const data = await apiFetch(url, {
        method,
        body: JSON.stringify(form),
      });

      if (data.message) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchCategories();
        closeModal();
      } else {
        throw new Error(data.message || "Gagal menyimpan kategori");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi kesalahan server" });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Kategori?",
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
        const data = await apiFetch(`/admin/category/${id}`, { method: "DELETE" });
        if (data.message) {
          Swal.fire("Terhapus!", data.message, "success");
          fetchCategories();
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        Swal.fire("Gagal!", "Tidak dapat menghapus kategori", "error");
      }
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ name: "", description: "" });
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#002B50] tracking-tight">Kategori Produk</h1>
          <p className="text-slate-500 mt-1">Kelola kategori untuk mengorganisir produk Anda.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Layers size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Kategori</p>
              <h3 className="text-2xl font-bold text-[#002B50]">{categories.length}</h3>
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
            placeholder="Cari kategori..."
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
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Categories Grid/Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Produk Terkait</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">Loading data...</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <Package size={48} className="mx-auto mb-3 opacity-20" />
                    <p>Tidak ada kategori ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#002B50]/5 text-[#002B50] flex items-center justify-center font-bold text-lg">
                          {cat.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-500 text-sm">
                      {cat.description || <span className="italic opacity-50">Tidak ada deskripsi</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                      {/* You could add a count here if the API provides it, e.g. cat.productsCount */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        <Package size={12} />
                        {cat.Products?.length || 0} Item
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
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
            {/* Backdrop */}
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
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#002B50]">
                  {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Smartphone"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all font-medium text-[#002B50]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Deskripsi</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Deskripsi singkat kategori ini..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#002B50] outline-none transition-all resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#002B50] hover:bg-[#002B50]/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]"
                  >
                    {editingCategory ? "Simpan Perubahan" : "Buat Kategori"}
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
