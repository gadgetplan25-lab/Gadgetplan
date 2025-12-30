"use client";
import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";
import {
  CalendarDays,
  Search,
  Clock,
  User,
  Wrench,
  CreditCard,
  CheckCircle2,
  Hourglass,
  PlayCircle,
  X,
  Edit,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status management state inside modal
  const [statusToUpdate, setStatusToUpdate] = useState("");
  const [paymentStatusToUpdate, setPaymentStatusToUpdate] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/admin/bookings");
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("❌ Gagal fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiFetch(`/booking/${id}/status/booking`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `Status booking diubah menjadi ${status}`,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      fetchBookings();
      setIsModalOpen(false);
    } catch (err) {
      Swal.fire("Error", "Gagal update status", "error");
    }
  };

  const handleUpdatePaymentStatus = async (id, status) => {
    try {
      await apiFetch(`/booking/${id}/status/payment`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `Status pembayaran diubah menjadi ${status}`,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      fetchBookings();
    } catch (err) {
      Swal.fire("Error", "Gagal update status pembayaran", "error");
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setStatusToUpdate(booking.status);
    const currentPaymentStatus = booking.BookingPayments?.[0]?.payment_status || "pending";
    setPaymentStatusToUpdate(currentPaymentStatus);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b =>
      b.User?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.User?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ServiceType?.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bookings, searchQuery]);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-slate-100 text-slate-600 border-slate-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      proses: "bg-orange-50 text-orange-700 border-orange-200",
      selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200"
    };

    const labels = {
      pending: "Menunggu Pembayaran",
      confirmed: "Dikonfirmasi",
      proses: "Diproses",
      selesai: "Selesai",
      cancelled: "Dibatalkan"
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
        {labels[status] || status}
      </span>
    );
  };

  const statusOptions = [
    { value: "pending", label: "Menunggu Pembayaran", description: "Booking baru, menunggu pembayaran DP." },
    { value: "confirmed", label: "Dikonfirmasi", description: "DP diterima, jadwal service disetujui." },
    { value: "proses", label: "Sedang Diproses", description: "Teknisi sedang mengerjakan perbaikan." },
    { value: "selesai", label: "Selesai", description: "Perbaikan selesai, unit siap diambil." },
    { value: "cancelled", label: "Dibatalkan", description: "Booking dibatalkan." },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#002B50] tracking-tight">Manajemen Booking</h1>
          <p className="text-slate-500 mt-1">Pantau jadwal service dan kelola status pengerjaan.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CalendarDays size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Booking</p>
              <h3 className="text-2xl font-bold text-[#002B50]">{bookings.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
              <Hourglass size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <h3 className="text-2xl font-bold text-[#002B50]">{bookings.filter(b => b.status === "pending").length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <PlayCircle size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Diproses</p>
              <h3 className="text-2xl font-bold text-[#002B50]">{bookings.filter(b => b.status === "proses").length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-[#002B50] text-white rounded-xl">
              <CheckCircle2 size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Selesai</p>
              <h3 className="text-2xl font-bold text-[#002B50]">{bookings.filter(b => b.status === "selesai").length}</h3>
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
            placeholder="Cari booking (user/service)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#002B50]/20 transition-all text-[#002B50]"
          />
        </div>
      </div>

      {/* Bookings Grid/Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Jadwal</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Layanan</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pembayaran</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">Loading data...</td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <CalendarDays size={48} className="mx-auto mb-3 opacity-20" />
                    <p>Tidak ada booking ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-slate-500">#{b.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-700 flex items-center gap-2">
                          <CalendarDays size={14} className="text-slate-400" /> {b.service_date}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" /> {b.service_time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 text-sm">{b.User?.name}</span>
                        <span className="text-xs text-slate-500">{b.User?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-[#002B50] flex items-center gap-2">
                          <Wrench size={14} className="text-slate-400" /> {b.ServiceType?.nama || "-"}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-2">
                          <User size={14} className="text-slate-400" /> {b.Technician?.name || "Belum ditunjuk"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        {b.BookingPayments && b.BookingPayments.length > 0 ? (
                          b.BookingPayments.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">
                              <CreditCard size={12} />
                              <span>Rp {parseInt(p.amount).toLocaleString('id-ID')}</span>
                              <span className={`font-bold uppercase ${p.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>{p.payment_status}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">Belum ada pembayaran</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(b)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors border border-slate-200 flex items-center gap-2 ml-auto"
                      >
                        <Edit size={14} /> Kelola
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Management Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-transparent"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 ring-1 ring-slate-900/5 max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-[#002B50] p-6 text-white flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Kelola Booking</h3>
                  <p className="text-blue-100 text-sm mt-1">ID: #SG-{selectedBooking.id}</p>
                </div>
                <button onClick={closeModal} className="text-white/70 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg hover:bg-white/20">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 font-semibold uppercase mb-1">Customer</div>
                    <div className="font-bold text-[#002B50] text-sm">{selectedBooking.User?.name}</div>
                    <div className="text-xs text-slate-500">{selectedBooking.User?.email}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 font-semibold uppercase mb-1">Jadwal</div>
                    <div className="font-bold text-[#002B50] text-sm">{selectedBooking.service_date}</div>
                    <div className="text-xs text-slate-500">Jam {selectedBooking.service_time}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-semibold uppercase mb-1">Layanan</div>
                  <div className="font-bold text-[#002B50]">{selectedBooking.ServiceType?.nama}</div>
                  <div className="text-sm text-slate-600 mt-1">Teknisi: {selectedBooking.Technician?.name || "-"}</div>
                  <div className="text-sm text-slate-600">Perangkat: {selectedBooking.jenis_perangkat} - {selectedBooking.model_perangkat}</div>
                  <div className="text-sm text-slate-600 italic mt-2">&quot;{selectedBooking.catatan || "Tidak ada catatan"}&quot;</div>
                </div>

                {/* Info Tagihan */}
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-emerald-800">Total Biaya Service</span>
                    <span className="font-bold text-emerald-900">Rp {selectedBooking.ServiceType?.harga?.toLocaleString("id-ID") || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-emerald-800">Tagihan DP (50%)</span>
                    <span className="font-bold text-emerald-900 text-lg">Rp {selectedBooking.BookingPayments?.[0]?.amount?.toLocaleString("id-ID") || 0}</span>
                  </div>
                </div>

                {/* Status Changer */}
                <div>
                  <label className="block text-sm font-bold text-[#002B50] mb-2">Update Status Pengerjaan</label>
                  <div className="flex gap-2">
                    <select
                      value={statusToUpdate}
                      onChange={(e) => setStatusToUpdate(e.target.value)}
                      className="flex-1 w-full border border-slate-300 rounded-xl px-4 py-3 text-[#002B50] focus:ring-2 focus:ring-[#002B50]/20 focus:outline-none appearance-none bg-white"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking.id, statusToUpdate)}
                      className="bg-[#002B50] hover:bg-[#002B50]/90 text-white font-bold px-6 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {statusOptions.find(o => o.value === statusToUpdate)?.description}
                  </p>
                </div>

                {/* Payment Status Changer Removed */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}