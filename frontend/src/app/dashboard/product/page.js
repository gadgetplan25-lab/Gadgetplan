"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getProductImageUrl } from "@/lib/config";
import ProductSidebar from "./ProductSidebar";
import ProductForm from "./ProductForm";

import Swal from "sweetalert2";
import {
  Plus, Search, Filter, Trash2, Edit, Package,
  Tag, BarChart3, MoreHorizontal, Image as ImageIcon,
  LayoutGrid, List as ListIcon, AlertCircle, Layers, X
} from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Sidebar / Modal State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // If null, it's Add Mode

  // Category Panel State
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      // setLoading(true); // Soft loading
      const [prodRes, catRes] = await Promise.all([
        apiFetch("/admin/products"),
        apiFetch("/admin/categories")
      ]);

      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FILTERS ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || p.category_id === Number(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // --- STATS ---
  const stats = useMemo(() => {
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const lowStock = products.filter(p => p.stock < 5).length;
    return {
      total: products.length,
      value: totalValue,
      lowStock
    };
  }, [products]);

  // --- HANDLERS ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Produk?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/admin/product/${id}`, { method: "DELETE" });
      Swal.fire("Terhapus!", "Produk berhasil dihapus.", "success");
      fetchData();
    } catch (err) {
      Swal.fire("Error", "Gagal menghapus produk", "error");
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsSidebarOpen(true);
  };

  // Category handlers
  const handleAddCategory = async () => {
    const { value: categoryName } = await Swal.fire({
      title: 'Tambah Kategori Baru',
      input: 'text',
      inputLabel: 'Nama Kategori',
      inputPlaceholder: 'Contoh: iPhone',
      showCancelButton: true,
      confirmButtonText: 'Tambah',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#002B50',
      inputValidator: (value) => {
        if (!value) return 'Nama kategori tidak boleh kosong!';
      }
    });

    if (categoryName) {
      try {
        await apiFetch("/admin/category", {
          method: "POST",
          body: JSON.stringify({ name: categoryName }),
        });
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Kategori "${categoryName}" berhasil ditambahkan`,
          timer: 1500,
          showConfirmButton: false
        });
        fetchData();
      } catch (error) {
        Swal.fire("Error", error.message || "Gagal menambahkan kategori", "error");
      }
    }
  };

  const handleEditCategory = async (category) => {
    const { value: categoryName } = await Swal.fire({
      title: 'Edit Kategori',
      input: 'text',
      inputLabel: 'Nama Kategori',
      inputValue: category.name,
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#002B50',
      inputValidator: (value) => {
        if (!value) return 'Nama kategori tidak boleh kosong!';
      }
    });

    if (categoryName && categoryName !== category.name) {
      try {
        await apiFetch(`/admin/category/${category.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: categoryName }),
        });
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kategori berhasil diupdate',
          timer: 1500,
          showConfirmButton: false
        });
        fetchData();
      } catch (error) {
        Swal.fire("Error", error.message || "Gagal mengupdate kategori", "error");
      }
    }
  };

  const handleDeleteCategory = async (category) => {
    const result = await Swal.fire({
      title: 'Hapus Kategori?',
      text: `Kategori "${category.name}" akan dihapus. Produk dengan kategori ini akan kehilangan kategorinya.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/admin/category/${category.id}`, { method: "DELETE" });
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Kategori berhasil dihapus',
          timer: 1500,
          showConfirmButton: false
        });
        fetchData();
      } catch (error) {
        Swal.fire("Error", error.message || "Gagal menghapus kategori", "error");
      }
    }
  };



  // --- COMPONENTS ---
  const StatusBadge = ({ stock }) => {
    if (stock === 0) return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">Out of Stock</span>;
    if (stock < 5) return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Low Stock</span>;
    return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">In Stock</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 space-y-8 pb-20">

      {/* 1. HEADER & STATS */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#002B50] tracking-tight">Manajemen Produk</h1>
            <p className="text-slate-500 mt-1">Kelola katalog produk, stok, dan kategori.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCategoryPanelOpen(true)}
              className="bg-white hover:bg-slate-50 text-[#002B50] px-5 py-2.5 rounded-xl font-bold border-2 border-[#002B50] flex items-center gap-2 transition-all active:scale-95 justify-center"
            >
              <Layers size={20} /> Kelola Kategori
            </button>
            <Link
              href="/dashboard/product/create"
              className="bg-[#002B50] hover:bg-[#002B50]/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/10 flex items-center gap-2 transition-all active:scale-95 justify-center"
            >
              <Plus size={20} /> Tambah Produk
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
            <div><p className="text-xs font-bold text-slate-400 uppercase">Total Produk</p><p className="text-xl font-bold text-slate-900">{stats.total}</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Tag size={24} /></div>
            <div><p className="text-xs font-bold text-slate-400 uppercase">Estimasi Aset</p><p className="text-xl font-bold text-slate-900">Rp {(stats.value / 1000000).toFixed(1)} Jt</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><AlertCircle size={24} /></div>
            <div><p className="text-xs font-bold text-slate-400 uppercase">Stok Menipis</p><p className="text-xl font-bold text-slate-900">{stats.lowStock} Item</p></div>
          </div>
        </div>
      </div>

      {/* 2. MAIN TOOLBAR */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white sticky top-0 z-10">

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari nama produk..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#002B50] outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#002B50] outline-none cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* 3. CONTENT AREA */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading data...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <Package size={48} className="mb-4 opacity-20" />
            <p>Tidak ada produk ditemukan.</p>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4 font-semibold w-20">Image</th>
                  <th className="px-6 py-4 font-semibold">Nama Produk</th>
                  <th className="px-6 py-4 font-semibold">Kategori</th>
                  <th className="px-6 py-4 font-semibold">Harga</th>
                  <th className="px-6 py-4 font-semibold">Stok</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                        {p.ProductImages?.[0] ? (
                          <img
                            src={getProductImageUrl(p.ProductImages[0].image_url)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = "/default-product.png"; }}
                          />
                        ) : (
                          <ImageIcon size={16} className="text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <p className="font-bold text-[#002B50]">{p.name}</p>
                      {/* <p className="text-xs text-slate-400 truncate max-w-[200px]">{p.description}</p> */}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {p.Category?.name || "-"}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-900">
                      Rp {p.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge stock={p.stock} />
                      <span className="text-xs text-slate-400 ml-2">({p.stock})</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/product/edit/${p.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  {p.ProductImages?.[0] ? (
                    <img
                      src={getProductImageUrl(p.ProductImages[0].image_url)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.onerror = null; e.target.src = "/default-product.png"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusBadge stock={p.stock} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">{p.Category?.name}</p>
                  <h3 className="font-bold text-[#002B50] line-clamp-1 mb-2">{p.name}</h3>
                  <div className="flex justify-between items-end">
                    <p className="text-lg font-bold text-[#002B50]">Rp {p.price.toLocaleString("id-ID")}</p>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/product/edit/${p.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={16} /></Link>
                      <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Form reused for specific Edit/Add logic if necessary */}
      {/* We are passing 'editingProduct' to ProductSidebar so it knows what to fill */}
      <ProductSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAdded={fetchData}
        editingProduct={editingProduct} // Need to ensure ProductSidebar handles this prop
      />

      {/* Category Side Panel */}
      {isCategoryPanelOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
          {/* Side Panel */}
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full pointer-events-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-[#002B50] text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Kelola Kategori</h2>
                  <p className="text-sm text-white/70 mt-1">Tambah, edit, atau hapus kategori produk</p>
                </div>
                <button
                  onClick={() => setIsCategoryPanelOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Add Category Button */}
              <button
                onClick={handleAddCategory}
                className="w-full bg-[#002B50] hover:bg-[#003d75] text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors mb-6"
              >
                <Plus size={20} />
                Tambah Kategori Baru
              </button>

              {/* Categories List */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 mb-3">
                  Daftar Kategori ({categories.length})
                </p>
                {categories.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Layers size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Belum ada kategori</p>
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#002B50] text-white rounded-lg">
                          <Layers size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{category.name}</p>
                          <p className="text-xs text-slate-500">ID: {category.id}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
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
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsCategoryPanelOpen(false)}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
