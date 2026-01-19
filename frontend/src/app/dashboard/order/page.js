"use client";
import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { getValidStatusOptions, getStatusLabel } from "@/lib/orderStatusHelper";
import Swal from "sweetalert2";
import {
  X, Save, Truck, Package, CreditCard, CheckCircle,
  Clock, Search, Filter, ArrowUpRight, Calendar, User, MapPin,
  ChevronRight, AlertCircle, ShoppingBag, Trash2
} from "lucide-react";

// --- CONSTANTS ---
const ALL_STATUSES = [
  { value: "pending", label: "Menunggu Pembayaran", color: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "paid", label: "Sudah Dibayar", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "processing", label: "Sedang Diproses", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "shipped", label: "Sedang Dikirim", color: "bg-sky-100 text-sky-800 border-sky-200" },
  { value: "completed", label: "Selesai", color: "bg-[#002B50] text-white border-[#002B50]" },
  { value: "cancelled", label: "Dibatalkan", color: "bg-red-50 text-red-700 border-red-200" },
];

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // --- DATA FETCHING ---
  const fetchOrders = async () => {
    try {
      // setLoading(true); // Don't show full loading on refresh interval
      const data = await apiFetch("/admin/orders");
      setOrders(data.orders || []);
      setLoading(false);
    } catch (err) {
      console.error("Gagal fetch orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      if (!isModalOpen) fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, [isModalOpen]);

  // --- FILTERING ---
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch =
        o.id.toString().includes(searchTerm) ||
        o.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.User?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // --- HELPER: Calculate Real Product Total (No Shipping) ---
  const calculateProductTotal = (order) => {
    if (!order.OrderItems) return 0;
    return order.OrderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  // --- STATS ---
  const stats = useMemo(() => {
    return {
      total: orders.length,
      revenue: orders.reduce((acc, o) => o.status !== 'cancelled' ? acc + calculateProductTotal(o) : acc, 0),
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => ['paid', 'processing'].includes(o.status)).length
    };
  }, [orders]);

  // --- MODAL HANDLERS ---
  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.tracking_number || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedOrder(null), 200); // Wait for anim
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    if (newStatus === "shipped" && !trackingNumber.trim()) {
      alert("Peringatan: Nomor resi (Tracking ID) wajib diisi untuk status 'Sedang Dikirim'!");
      return;
    }

    setIsUpdating(true);
    try {
      const body = { status: newStatus, tracking_number: trackingNumber };
      await apiFetch(`/admin/orders/${selectedOrder.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      alert("Sukses: Status berhasil diperbarui!");
      closeModal();
      fetchOrders();
    } catch (error) {
      console.error("Gagal update status:", error);
      alert(error.message || "Gagal update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Hapus Order?",
      text: "Order yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      Swal.fire({
        icon: "success",
        title: "Order Dihapus",
        text: "Order berhasil dihapus.",
        timer: 2000,
        showConfirmButton: false
      });

      fetchOrders();
    } catch (error) {
      console.error("Gagal hapus order:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: error.message || "Gagal menghapus order. Silakan coba lagi.",
        confirmButtonColor: "#dc2626"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 space-y-8 pb-20">

      {/* 1. HEADER & STATS */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#002B50] tracking-tight">Order Management</h1>
            <p className="text-slate-500 mt-1">Pantau transaksi dan kelola pengiriman.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchOrders} className="p-2 text-slate-400 hover:text-[#002B50] transition-colors" title="Refresh">
              <Clock size={20} />
            </button>
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-semibold text-[#002B50]">
              Total Revenue: Rp {stats.revenue.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Order", val: stats.total, icon: ShoppingBag, color: "text-[#002B50]", bg: "bg-[#002B50]/5" },
            { label: "Menunggu Bayar", val: stats.pending, icon: Clock, color: "text-[#002B50]", bg: "bg-[#002B50]/5" },
            { label: "Perlu Proses", val: stats.processing, icon: Package, color: "text-[#002B50]", bg: "bg-[#002B50]/5" },
            { label: "Total Omzet", val: `Rp ${(stats.revenue / 1000000).toFixed(1)}jt`, icon: ArrowUpRight, color: "text-[#002B50]", bg: "bg-[#002B50]/5" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN CONTENT (FILTERS & TABLE) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari Order ID, Nama Customer..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#002B50] transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['all', 'pending', 'paid', 'processing', 'shipped', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${statusFilter === status
                  ? 'bg-[#002B50] text-white border-[#002B50]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-6 py-4 font-semibold">Pelanggan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Total (Produk)</th>
                <th className="px-6 py-4 font-semibold">Waktu</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Skeleton Loading
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 rounded w-8 inline-block"></div></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full"><Search size={24} /></div>
                      <p>Tidak ada pesanan yang ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[#002B50]">#{o.id}</span>
                      <div className="text-xs text-slate-400 mt-1">{o.OrderItems?.length} Item</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 uppercase border border-white shadow-sm">
                          {o.User?.name?.charAt(0) || "G"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm line-clamp-1">{o.User?.name}</p>
                          <p className="text-xs text-slate-500">{o.User?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      Rp {calculateProductTotal(o).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={12} />
                        {new Date(o.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative z-10">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(o)}
                          className="p-2 text-slate-400 hover:text-[#002B50] hover:bg-blue-50 rounded-lg transition-all group-hover:scale-110 active:scale-95"
                          title="Edit Order"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(o.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all group-hover:scale-110 active:scale-95"
                          title="Hapus Order"
                        >
                          <Trash2 size={18} />
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

      {/* 3. MODAL OVERHAUL (FIXED CENTERED LAYOUT) */}
      {isModalOpen && selectedOrder && (
        <div className="relative z-[99999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">

          {/* Backdrop (Invisible but blocking) */}
          <div className="fixed inset-0 bg-black/0 transition-opacity" onClick={closeModal} aria-hidden="true" />

          {/* Scrollable Container - THE KEY TO FIXING POSITIONING */}
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">

              {/* Modal Panel */}
              <div
                className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all sm:my-8 w-full max-w-4xl border border-slate-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
              >

                {/* Header */}
                <div className="bg-[#002B50] px-6 py-4 flex justify-between items-center sticky top-0 z-20">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-2 rounded-lg text-white">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-none">Order #{selectedOrder.id}</h3>
                      <p className="text-blue-200 text-xs mt-1 flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(selectedOrder.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <button onClick={closeModal} className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all">
                    <X size={20} />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 md:p-8 bg-slate-50/50 space-y-6">

                  {/* Top Section: Status & Tracking */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                      <Truck size={14} /> Update Status
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Status Baru</label>
                        <select
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#002B50]/20 focus:border-[#002B50]"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        >
                          {ALL_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>

                      <div className={`transition-all ${newStatus === 'shipped' ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tracking Number / Resi {newStatus === 'shipped' && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#002B50]/20 focus:border-[#002B50]"
                          placeholder="Masukan Resi JNE/J&T/Sicepat..."
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-50">
                        <User size={14} /> Informasi Pelanggan
                      </h4>
                      <div className="space-y-4 flex-1">
                        <div>
                          <p className="text-xs text-slate-400">Nama Penerima</p>
                          <p className="font-semibold text-slate-900 text-lg">{selectedOrder.User?.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-slate-400">Email</p>
                            <p className="text-sm font-medium text-slate-700 truncate" title={selectedOrder.User?.email}>{selectedOrder.User?.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Telepon</p>
                            <p className="text-sm font-medium text-slate-700">{selectedOrder.User?.phone}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 mt-2">
                          <p className="text-xs text-blue-500 flex items-center gap-1 mb-1"><MapPin size={10} /> Alamat Pengiriman</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{selectedOrder.User?.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-50">
                        <ShoppingBag size={14} /> Item Pesanan ({selectedOrder.OrderItems?.length})
                      </h4>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[250px] pr-1">
                        {selectedOrder.OrderItems?.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-start p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center shrink-0">
                              <Package size={16} className="text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{item.Product?.name}</p>
                              <p className="text-xs text-slate-500">{item.Color?.name} • {item.Storage?.name}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs text-slate-400">x{item.quantity}</p>
                              <p className="text-sm font-bold text-slate-900">
                                {new Intl.NumberFormat('id-ID').format(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Total Produk</span>
                        <span className="text-xl font-bold text-[#002B50]">
                          Rp {new Intl.NumberFormat('id-ID').format(calculateProductTotal(selectedOrder))}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 sticky bottom-0 z-20">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
                    className="px-6 py-3 rounded-xl bg-[#002B50] text-white font-bold hover:bg-[#002B50]/90 shadow-lg shadow-blue-900/10 flex items-center gap-2 disabled:bg-slate-300 disabled:shadow-none transition-all"
                  >
                    {isUpdating ? 'Menyimpan...' : <><Save size={18} /> Simpan Perubahan</>}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- SUBCOMPONENTS ---
function StatusBadge({ status }) {
  const config = ALL_STATUSES.find(s => s.value === status) || { label: status, color: "bg-gray-100 text-gray-800" };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}>
      {config.label}
    </span>
  );
}
