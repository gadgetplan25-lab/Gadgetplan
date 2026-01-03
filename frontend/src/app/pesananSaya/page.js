"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const statusList = [
  { label: "Menunggu Pembayaran", key: "waiting", color: "#F1F5F9" },
  { label: "Diproses", key: "processed", color: "#F1F5F9" },
  { label: "Dikirim", key: "shipped", color: "#F1F5F9" },
  { label: "Selesai", key: "done", color: "#F1F5F9" },
  { label: "Dibatalkan", key: "cancelled", color: "#F1F5F9" },
];

const tabList = [
  { label: "Semua", key: "all" },
  { label: "Menunggu", key: "waiting" },
  { label: "Diproses", key: "processed" },
  { label: "Dikirim", key: "shipped" },
  { label: "Selesai", key: "done" },
  { label: "Dibatalkan", key: "cancelled" },
];

function mapOrderStatus(order) {
  const status = order.status; // status dari backend (lowercase)

  if (status === "pending") return "waiting";
  if (status === "paid" || status === "processing" || status === "diproses") return "processed";
  if (status === "shipped" || status === "dikirim") return "shipped";
  if (status === "completed" || status === "selesai") return "done";
  if (status === "cancelled" || status === "dibatalkan") return "cancelled";

  return "waiting";
}

function mapBookingStatus(booking) {
  const paymentStatus = booking.BookingPayments?.[0]?.payment_status;
  const bookingStatus = booking.status;

  if (bookingStatus === "cancelled") return "cancelled";
  if (bookingStatus === "selesai") return "done";

  // Prioritize Booking Status: If confirmed or processing, move to 'processed' tab
  if (bookingStatus === "confirmed" || bookingStatus === "proses") return "processed";

  // Check Payment Status
  if (paymentStatus === "paid" || paymentStatus === "success") {
    return "processed";
  }

  // Default
  return "waiting";
}

const getReadableStatus = (status) => {
  const map = {
    pending: "Menunggu Pembayaran",
    confirmed: "Dikonfirmasi",
    proses: "Sedang Diproses",
    selesai: "Selesai",
    cancelled: "Dibatalkan"
  };
  return map[status] || status;
};

const getStatusClassName = (status) => {
  const styles = {
    pending: "bg-orange-100 text-orange-600",
    confirmed: "bg-blue-100 text-blue-600",
    proses: "bg-indigo-100 text-indigo-600",
    selesai: "bg-emerald-100 text-emerald-600",
    cancelled: "bg-slate-100 text-slate-600"
  };
  return styles[status] || "bg-slate-100 text-slate-600";
}

function PesananSayaContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // Add search state
  const [selectedStatus, setSelectedStatus] = useState("all"); // Add filter state

  const [statusCount, setStatusCount] = useState({
    waiting: 0,
    processed: 0,
    shipped: 0,
    done: 0,
    cancelled: 0,
  });



  const fetchAllData = () => {
    const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;
    if (!adminPhone) console.error("NEXT_PUBLIC_ADMIN_PHONE is not set!");
    console.log("Debug Admin Phone Env:", adminPhone);

    // Ambil pesanan
    // Ambil pesanan

    apiFetch("/user/orders").then((res) => {
      const orders = (res.orders || []).map((o) => {
        const productNames = o.OrderItems?.map(item => `- ${item.Product?.name} (${item.quantity}x)`).join('\n') || '-';
        const totalBayar = o.total_price?.toLocaleString("id-ID");

        const messageRaw = `Halo Admin, saya mau bayar pesanan *#${o.id}*.\n\nDetail:\n${productNames}\nTotal: Rp ${totalBayar}\n\nMohon infonya.`;
        const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageRaw)}`;

        return {
          ...o,
          type: "order",
          mappedStatus: mapOrderStatus(o),
          invoiceUrl: null, // Xendit removed
          waLink: waLink
        };
      });
      setOrders(orders);
    });

    // Ambil booking
    apiFetch("/booking/getBookings").then((res) => {
      const bookings = (res.bookings || []).map((b) => {
        const dpAmount = b.BookingPayments?.[0]?.amount || 0;
        const messageRaw = `Halo Admin, saya mau bayar DP Booking Service *#${b.id}* sebesar Rp ${dpAmount.toLocaleString("id-ID")}. Mohon infonya.`;
        const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageRaw)}`;

        console.log("Generated Booking WA Link:", waLink);

        return {
          ...b,
          type: "booking",
          mappedStatus: mapBookingStatus(b),
          invoiceUrl: null, // Xendit removed
          waLink: waLink
        };
      });
      setBookings(bookings);
    });
  };

  useEffect(() => {
    // Fetch pertama kali
    fetchAllData();

    // Auto refresh setiap 5 detik
    const interval = setInterval(fetchAllData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCompleteOrder = async (orderId) => {
    if (!confirm("Apakah Anda yakin pesanan sudah diterima dan ingin menyelesaikan pesanan ini?")) {
      return;
    }

    try {
      await apiFetch(`/user/orders/${orderId}/complete`, {
        method: "PUT",
      });

      alert("Pesanan berhasil diselesaikan!");
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Gagal menyelesaikan pesanan. Silakan coba lagi.");
    }
  };

  const handleViewDetail = (item) => {
    if (item.type === "order") {
      window.location.href = `/pesananSaya/${item.id}`;
    } else {
      window.location.href = `/pesananSaya/booking/${item.id}`;
    }
  };




  // Gabungkan pesanan dan booking
  const allData = [...orders, ...bookings];

  useEffect(() => {
    // Hitung status
    setStatusCount({
      waiting: allData.filter((o) => o.mappedStatus === "waiting").length,
      processed: allData.filter((o) => o.mappedStatus === "processed").length,
      shipped: allData.filter((o) => o.mappedStatus === "shipped").length,
      done: allData.filter((o) => o.mappedStatus === "done").length,
      cancelled: allData.filter((o) => o.mappedStatus === "cancelled").length,
    });
  }, [orders, bookings]);

  // Filter data based on search query and selected status
  const searchFilteredData = allData.filter((item) => {
    // Search filter - search by ID or product/service name
    const matchesSearch = searchQuery === "" ||
      (item.type === "order" && (
        item.id?.toString().includes(searchQuery) ||
        item.OrderItems?.some(oi =>
          oi.Product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )) ||
      (item.type === "booking" && (
        item.id?.toString().includes(searchQuery) ||
        item.Service?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    // Status filter from dropdown
    const matchesStatus = selectedStatus === "all" || item.mappedStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Apply tab filter
  const filteredData =
    activeTab === "all"
      ? searchFilteredData
      : searchFilteredData.filter((o) => o.mappedStatus === activeTab);

  return (
    <>
      <Navbar />



      <div className="bg-white container mx-auto py-4 px-4 sm:px-6 md:px-8 lg:px-[60px] lg:py-[40px]">
        <h1 className="text-xl sm:text-2xl md:text-[2.2rem] lg:text-[32px] font-bold text-[#1A3558] mb-2">
          Pesanan Saya
        </h1>
        <p className="text-[#5B6B7E] mb-4 sm:mb-6 md:mb-8 text-sm sm:text-[15px] md:text-[16px]">
          Lihat dan kelola semua pesanan dan booking Anda
        </p>
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nomor pesanan atau produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-[#E3E8EF] rounded-[12px] px-[44px] py-[14px] text-[16px] text-[#1A3558] bg-[#F8FAFC] focus:outline-none focus:border-[#002B50]"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5B6B7E]">
                <svg width="22" height="22" fill="none"><circle cx="10" cy="10" r="8" stroke="#5B6B7E" strokeWidth="2" /><path d="M16 16L20 20" stroke="#5B6B7E" strokeWidth="2" strokeLinecap="round" /></svg>
              </span>
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-[#E3E8EF] rounded-[12px] px-[18px] pr-[40px] py-[12px] text-[#1A3558] bg-[#F8FAFC] text-[16px] w-full md:w-auto appearance-none"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%231A3558' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 18px center"
            }}
          >
            <option value="all">Semua Status</option>
            {statusList.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
        {/* Tab - Horizontal Scroll on Mobile */}
        <div className="mb-6">
          <div
            className="scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
            style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div
              className="md:flex md:flex-wrap"
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: '8px'
              }}
            >
              {tabList.map((tab, idx) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 md:px-[32px] py-2 md:py-[10px] text-[15px] md:text-[16px] font-medium border border-[#E3E8EF] rounded-t-[10px] ${activeTab === tab.key
                    ? "bg-[#F8FAFC] text-[#1A3558] border-b-0"
                    : "bg-white text-[#5B6B7E] border-b"
                    }`}
                  style={{
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    borderBottom: activeTab === tab.key ? "none" : "2px solid #E3E8EF"
                  }}
                >
                  {tab.label} ({tab.key === "all" ? allData.length : statusCount[tab.key]})
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Orders & Bookings List */}
        <div>
          {filteredData.length === 0 ? (
            <div className="text-[#5B6B7E] text-[16px] py-[40px] text-center border border-[#E3E8EF] rounded-[14px] bg-[#F8FAFC]">
              Belum ada pesanan atau booking.
            </div>
          ) : (
            filteredData.map((item) =>
              item.type === "order" ? (
                <div
                  key={"order-" + item.id}
                  className="border border-[#E3E8EF] rounded-[14px] bg-white px-4 py-4 md:px-[32px] md:py-[24px] mb-6 flex flex-col"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-[12px] gap-2">
                    <div className="font-bold text-[#1A3558] text-[18px]">Order #{item.id}</div>
                    <div className="flex items-center gap-2 justify-between md:justify-end w-full md:w-auto">
                      <span className="bg-[#F1F5F9] text-[#1A3558] px-[12px] py-[4px] rounded-[8px] text-[14px] font-medium flex items-center gap-1">
                        {statusList.find((s) => s.key === item.mappedStatus)?.label}
                      </span>
                      <div className="flex items-center gap-1 ml-4">
                        <span className="text-[#1A3558] text-[16px] md:text-[20px] font-bold">
                          Rp {item.total_price?.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[#5B6B7E] text-[15px] mb-[16px] flex items-center gap-2">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    <span className="ml-4 text-[#5B6B7E] text-[15px]">{item.OrderItems?.length || 0} produk</span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-[16px] mb-[14px] flex-wrap">
                    {item.OrderItems?.map((p, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F8FAFC] border border-[#E3E8EF] rounded-[10px] px-[18px] py-[12px] flex items-center gap-2"
                      >
                        <div>
                          <div className="text-[#1A3558] text-[15px] font-medium">{p.Product?.name}</div>
                          <div className="text-[#5B6B7E] text-[14px]">Rp {p.price?.toLocaleString("id-ID")} x {p.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[#5B6B7E] text-[15px] mb-[10px]">
                    {item.User?.address || "-"}
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex gap-2 flex-wrap">
                      {/* Tombol Bayar Sekarang untuk order */}
                      {/* Tombol Bayar Sekarang untuk order (ke WA) */}
                      {item.mappedStatus === "waiting" && (
                        <a
                          href={item.waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-[#25D366] bg-[#25D366] text-white rounded-[8px] px-4 py-2 font-semibold hover:bg-[#20bd5a] transition flex items-center gap-2"
                        >
                          <span>Konfirmasi Bayar</span>
                        </a>
                      )}
                      {/* Tombol Selesai untuk order yang sudah dikirim */}
                      {item.mappedStatus === "shipped" && (
                        <button
                          onClick={() => handleCompleteOrder(item.id)}
                          className="border border-[#10B981] bg-[#10B981] text-white rounded-[8px] px-4 py-2 font-semibold hover:bg-[#059669] transition"
                        >
                          Selesai
                        </button>
                      )}
                      <button onClick={() => handleViewDetail(item)} className="border border-[#E3E8EF] rounded-[8px] px-4 py-2 text-[#1A3558] font-semibold hover:bg-[#F1F5F9] transition">Detail</button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#5B6B7E] text-[15px]">No. Resi:</span>
                      <span className="bg-[#F1F5F9] text-[#1A3558] px-3 py-1 rounded-[8px] text-[14px] font-medium">{item.tracking_number || "-"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={"booking-" + item.id}
                  className="border border-[#E3E8EF] rounded-[14px] bg-white px-4 py-4 md:px-[32px] md:py-[24px] mb-6 flex flex-col"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-[12px] gap-2">
                    <div className="font-bold text-[#1A3558] text-[18px]">Booking #{item.id}</div>
                    <div className="flex items-center gap-2 justify-between md:justify-end w-full md:w-auto">
                      <span className="bg-[#F1F5F9] text-[#1A3558] px-[12px] py-[4px] rounded-[8px] text-[14px] font-medium flex items-center gap-1">
                        {statusList.find((s) => s.key === item.mappedStatus)?.label}
                      </span>
                      <div className="flex items-center gap-1 ml-4">
                        <span className="text-[#1A3558] text-[16px] md:text-[20px] font-bold">Rp</span>
                        <span className="text-[#1A3558] text-[16px] md:text-[20px] font-bold">
                          {item.BookingPayments?.[0]?.amount?.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[#5B6B7E] text-[15px] mb-[16px] flex items-center gap-2">
                    {item.service_date} {item.service_time}
                    <span className="ml-4 text-[#5B6B7E] text-[15px]">{item.ServiceType?.nama || "-"}</span>
                  </div>
                  <div className="text-[#5B6B7E] text-[15px] mb-[10px]">
                    Teknisi: {item.Technician?.name || "-"}
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex gap-2 flex-wrap">
                      {item.mappedStatus === "waiting" && (
                        <a
                          href={item.waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-[#25D366] bg-[#25D366] text-white rounded-[8px] px-4 py-2 font-semibold hover:bg-[#20bd5a] transition flex items-center gap-2"
                        >
                          <span>Bayar DP</span>
                        </a>
                      )}
                      <button onClick={() => handleViewDetail(item)} className="border border-[#E3E8EF] rounded-[8px] px-4 py-2 text-[#1A3558] font-semibold hover:bg-[#F1F5F9] transition">Detail</button>
                    </div>

                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function PesananSayaPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3558]"></div>
      </div>
    }>
      <PesananSayaContent />
    </Suspense>
  );
}

