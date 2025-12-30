"use client";
import { useAuthGuard } from "@/hook/useAuthGuard";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import { Input } from '@/components/ui/input';
import Swal from "sweetalert2";
import LoadingAnimation from "@/components/loadingAnimation";
import { Loader2, Dot, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { getBaseUrl } from "@/lib/config";

function ServiceTracking() {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await apiFetch("/booking/getBookings");
        // Ambil booking terbaru (atau booking dengan status belum selesai)
        if (res.bookings && res.bookings.length > 0) {
          // Urutkan dari terbaru
          const sorted = [...res.bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBooking(sorted[0]);
        } else {
          setBooking(null);
        }
      } catch {
        setBooking(null);
      }
      setLoading(false);
    }
    fetchBooking();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingAnimation />
      </div>
    );
  }

  // Belum booking sama sekali
  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto mt-6 sm:mt-12 mb-12 sm:mb-16 px-4">
        <div className="bg-white border border-[#E3E8EF] rounded-xl sm:rounded-2xl shadow p-6 sm:p-10 flex flex-col items-center">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-[#1A3558] mb-2">Lacak Status Layanan Anda</h2>
          <p className="text-xs xs:text-sm sm:text-base text-[#64748b] mb-4 sm:mb-6 text-center">Lacak status perbaikan perangkat Anda secara real-time</p>
          <div className="w-full border border-[#E3E8EF] rounded-lg sm:rounded-xl bg-[#F7FAFC] p-6 sm:p-10 flex flex-col items-center">
            <h3 className="text-base xs:text-lg sm:text-xl font-bold text-[#1A3558] mb-2">Anda Belum Melakukan Layanan Service Go</h3>
            <p className="text-xs xs:text-sm sm:text-base text-[#64748b] mb-4 text-center">
              Lakukan booking layanan terlebih dahulu untuk dapat melacak status perbaikan perangkat Anda
            </p>
            <a
              href="#form-booking"
              className="bg-[#002B50] text-white px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-[#003366] transition text-xs xs:text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              Booking Layanan Sekarang
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Mapping status ke tahap dan progress
  // Stepper sesuai gambar
  const steps = [
    {
      label: "Pendaftaran Layanan",
      date: booking.createdAt,
      est: null,
      status: booking.status === "pending" || booking.status === "confirmed" || booking.status === "proses" || booking.status === "selesai" ? "done" : "",
    },
    {
      label: "Dalam Proses Perbaikan",
      date: booking.status === "proses" || booking.status === "selesai" ? booking.updatedAt : null,
      est: booking.status === "pending" || booking.status === "confirmed" ? booking.estimasi_proses : null,
      status: booking.status === "proses" || booking.status === "selesai" ? "active" : "",
    },
    {
      label: "Selesai",
      date: booking.status === "selesai" ? booking.updatedAt : null,
      est: booking.status !== "selesai" ? booking.estimasi_selesai : null,
      status: booking.status === "selesai" ? "active" : "",
    },
  ];
  // Determine visual step & progress
  let visualStep = 0;
  let progressPercent = 0;
  let detailIndex = 0;

  if (booking.status === "pending") {
    visualStep = 0;
    progressPercent = 10;
    detailIndex = 0;
  } else if (booking.status === "confirmed") {
    visualStep = 1; // Pindah ke langkah kedua (Proses) tapi masih awal
    progressPercent = 45;
    detailIndex = 1;
  } else if (booking.status === "proses") {
    visualStep = 1;
    progressPercent = 80;
    detailIndex = 2;
  } else if (booking.status === "selesai") {
    visualStep = 3; // Semua langkah selesai (hijau)
    progressPercent = 100;
    detailIndex = 3;
  } else if (booking.status === "cancelled") {
    visualStep = 0;
    progressPercent = 0;
    detailIndex = 0; // Atau buat index baru untuk cancelled
  }

  // Data tampilan detail
  const stepDetailData = [
    {
      title: "Pendaftaran Layanan",
      statusText: "Menunggu Konfirmasi",
      statusColor: "text-yellow-500",
      dotColor: "bg-yellow-500",
      date: booking.createdAt,
      desc: "Booking berhasil dibuat. Mohon tunggu konfirmasi admin atau check WhatsApp Anda.",
      note: "Menunggu admin memproses pesanan.",
      next: "Admin akan segera menghubungi/memverifikasi.",
    },
    {
      title: "Pendaftaran Diterima",
      statusText: "Dikonfirmasi / Menunggu Teknisi",
      statusColor: "text-blue-600",
      dotColor: "bg-blue-600",
      date: booking.BookingPayments?.[0]?.updatedAt || booking.updatedAt,
      desc: "Booking Anda telah dikonfirmasi. Kami sedang mempersiapkan teknisi dan sparepart yang dibutuhkan.",
      note: "Menunggu teknisi memulai pengerjaan.",
      next: "Teknisi akan segera memulai perbaikan.",
    },
    {
      title: "Dalam Proses Perbaikan",
      statusText: "Sedang Dikerjakan",
      statusColor: "text-orange-500",
      dotColor: "bg-orange-500",
      date: booking.updatedAt,
      desc: "Teknisi sedang melakukan perbaikan pada perangkat Anda saat ini.",
      note: "Perangkat sedang dalam penanganan.",
      next: "Tunggu status berubah menjadi Selesai.",
    },
    {
      title: "Selesai",
      statusText: "Perbaikan Selesai",
      statusColor: "text-emerald-600",
      dotColor: "bg-emerald-600",
      date: booking.updatedAt,
      desc: "Selamat! Perangkat Anda telah selesai diperbaiki dan berfungsi normal kembali.",
      note: "Layanan sukses.",
      next: "Silakan ambil perangkat Anda.",
    },
  ];

  const currentDetail = stepDetailData[detailIndex] || stepDetailData[0];

  return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-12 mb-12 sm:mb-16 px-4">
      <div className="bg-white border border-[#E3E8EF] rounded-xl sm:rounded-2xl shadow p-5 sm:p-8 md:p-10">
        <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-[#1A3558] mb-2 text-center">Lacak Status Layanan Anda</h2>
        <p className="text-xs xs:text-sm sm:text-base text-[#64748b] mb-5 sm:mb-6 md:mb-8 text-center">Lacak status perbaikan perangkat Anda secara real-time</p>
        <div className="bg-white border border-[#E3E8EF] rounded-xl p-4 md:p-8 mb-6">
          <div className="text-center font-bold text-base md:text-lg text-[#1A3558] mb-1">
            Status Layanan: {booking.ServiceType?.nama || "-"}
          </div>
          <div className="text-center text-sm md:text-base text-[#64748b] mb-4">
            ID: SG-{new Date(booking.createdAt).getFullYear()}-{String(booking.id).padStart(3, "0")} | {booking.model_perangkat}
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#E5EDF5] rounded-full mb-8 relative">
            <div
              className="h-2 bg-[#002B50] rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-start md:items-center px-0 md:px-8 mb-8">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex flex-col items-center w-1/3 relative">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 mb-2 z-10 ${idx < visualStep
                  ? "border-[#059669] bg-[#059669]"
                  : idx === visualStep
                    ? "border-[#002B50] bg-white"
                    : "border-[#B5C9DA] bg-white"
                  }`}>
                  {idx < visualStep ? (
                    <CheckCircle size={16} className="text-white md:w-6 md:h-6" />
                  ) : idx === visualStep ? (
                    <Dot size={24} className="text-[#002B50] md:w-8 md:h-8" />
                  ) : (
                    <Circle size={16} className="text-[#B5C9DA] md:w-6 md:h-6" />
                  )}
                </div>
                <div className={`font-semibold text-xs md:text-[15px] mb-1 text-center leading-tight ${idx === visualStep ? "text-[#002B50]" : "text-[#64748b]"}`}>
                  {step.label}
                </div>
                <div className="text-[10px] md:text-xs text-[#64748b] text-center">
                  {step.date ? (
                    <span>{new Date(step.date).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  ) : step.est ? (
                    <span>Estimasi: {new Date(step.est).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-[#64748b] font-semibold mb-4 text-sm md:text-base">
            {progressPercent}% Selesai
          </div>
          {/* Detail Step */}
          <div className="bg-[#F7FAFC] border border-[#E3E8EF] rounded-xl p-4 md:p-6 mt-4">
            {/* Judul dan status */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <div className="mb-2 md:mb-0">
                <div className="font-bold text-base md:text-lg text-[#1A3558] mb-1">
                  {currentDetail.title}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${currentDetail.dotColor}`}></span>
                  <span className={`font-semibold text-sm md:text-base ${currentDetail.statusColor}`}>{currentDetail.statusText}</span>
                </div>
                <div className="text-xs md:text-sm text-[#64748b]">
                  {currentDetail.date
                    ? new Date(currentDetail.date).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "-"}
                </div>
              </div>
              <div className="mt-2 md:mt-0 p-3 bg-white rounded-lg border border-slate-100 md:text-right">
                <div className="font-semibold text-sm md:text-base text-[#1A3558]">Teknisi</div>
                <div className="text-sm md:text-base text-[#64748b]">{booking.Technician?.name || "Sedang ditugaskan"}</div>
              </div>
            </div>
            {/* Deskripsi, Catatan, Langkah Berikutnya */}
            <div className="space-y-3">
              <div>
                <div className="font-semibold text-sm md:text-base text-[#1A3558]">Deskripsi</div>
                <div className="text-sm md:text-base text-[#64748b] leading-relaxed">
                  {currentDetail.desc}
                </div>
              </div>
              {booking.catatan && (
                <div>
                  <div className="font-semibold text-sm md:text-base text-[#1A3558]">Catatan</div>
                  <div className="text-sm md:text-base text-[#64748b]">
                    {booking.catatan}
                  </div>
                </div>
              )}
              <div>
                <div className="font-semibold text-sm md:text-base text-[#1A3558]">Langkah Berikutnya</div>
                <div className="text-sm md:text-base text-[#64748b]">
                  {currentDetail.next}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceGoPage() {
  const { loading } = useAuthGuard();
  const [cartCount, setCartCount] = useState(0);
  const [jenisPerangkat, setJenisPerangkat] = useState("");
  const [modelPerangkat, setModelPerangkat] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dpAmount, setDpAmount] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  // Pindahkan deklarasi function ke atas agar tidak ReferenceError
  const fetchTechnicians = async () => {
    try {
      const res = await apiFetch("/user/technicians");
      setTechnicians(res);
    } catch (err) {
      console.error("❌ Gagal fetch teknisi:", err);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const res = await apiFetch("/user/service");
      setServiceTypes(res.data);
    } catch (err) {
      console.error("❌ Gagal fetch service type:", err);
    }
  };

  useEffect(() => {
    fetchTechnicians();
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    // Hitung DP otomatis jika serviceTypeId berubah
    const selected = serviceTypes.find((s) => String(s.id) === String(serviceTypeId));
    if (selected) {
      setDpAmount(Math.round(Number(selected.harga) / 2));
    } else {
      setDpAmount("");
    }
  }, [serviceTypeId, serviceTypes]);

  // Fetch slots automatically when date & technician selected
  useEffect(() => {
    async function fetchSlots() {
      if (serviceDate && technicianId) {
        try {
          const res = await apiFetch(`/booking/slots/${serviceDate}/${technicianId}`);
          setSlots(res.slots || []);
          setServiceTime("");
        } catch (err) {
          setSlots([]);
        }
      } else {
        setSlots([]);
        setServiceTime("");
      }
    }
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceDate, technicianId]);

  // Gabungkan loading dan isLoading agar hanya ada satu return sebelum hooks lain
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#002B50]">
        <LoadingAnimation />
      </div>
    );
  }

  const handleSlotClick = (slot) => {
    if (slot.booked) {
      Swal.fire("Oops", "Slot ini sudah dibooking", "warning");
      return;
    }
    setServiceTime(slot.time);
  };

  const handleBooking = async () => {
    if (!jenisPerangkat || !modelPerangkat || !serviceDate || !serviceTime || !technicianId || !serviceTypeId) {
      return Swal.fire("Oops", "Harap isi semua field booking", "warning");
    }
    try {
      const res = await apiFetch("/booking", {
        method: "POST",
        body: JSON.stringify({
          jenis_perangkat: jenisPerangkat,
          model_perangkat: modelPerangkat,
          service_date: serviceDate,
          service_time: serviceTime,
          technician_id: technicianId,
          serviceType_id: serviceTypeId,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const bookingId = res.booking.id;
      const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;
      const messageRaw = `Halo Admin, saya ingin konfirmasi pembayaran Booking Service.\n\n` +
        `Booking ID: *#${bookingId}*\n` +
        `Nama: ${res.booking.user?.name || "Customer"}\n` +
        `Perangkat: ${jenisPerangkat} - ${modelPerangkat}\n` +
        `Jadwal: ${serviceDate} JAM ${serviceTime}\n` +
        `DP: Rp ${dpAmount ? dpAmount.toLocaleString('id-ID') : '-'}\n\n` +
        `Mohon info rekening untuk pembayaran DP. Terima kasih.`;

      const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageRaw)}`;

      Swal.fire({
        title: "Booking Berhasil!",
        text: "Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran DP.",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Lanjut ke WhatsApp",
        cancelButtonText: "Lihat Status Booking",
        confirmButtonColor: "#002B50"
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(waLink, "_blank");
          window.location.href = "/pesananSaya";
        } else {
          window.location.href = "/pesananSaya";
        }
      });
    } catch (err) {
      console.error("❌ Gagal booking:", err);
      Swal.fire("Error", err.message || "Gagal membuat booking", "error");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Navbar cartCount={cartCount} setCartCount={setCartCount} />
      {/* Tracking Service */}
      <ServiceTracking />
      <div className="max-w-6xl mx-auto py-8 md:py-12 px-4" id="form-booking">
        <div className="shadow-lg rounded-[16px] overflow-hidden border border-[#B5C9DA] bg-white">
          <div className="bg-white text-[#002B50] text-center py-6 md:py-8 border-b border-[#B5C9DA] px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Pesan Layanan Anda</h2>
            <p className="text-[#002B50]/80 text-base md:text-lg">Isi detail berikut untuk menjadwalkan layanan perbaikan</p>
          </div>
          <div className="p-4 md:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start">
              {/* Left: Form */}
              <form onSubmit={e => { e.preventDefault(); handleBooking(); }} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-[#002B50] font-medium text-sm md:text-base mb-1.5 block">Jenis Perangkat</Label>
                    <Input
                      type="text"
                      placeholder="Contoh: iPhone, Macbook"
                      value={jenisPerangkat}
                      onChange={e => setJenisPerangkat(e.target.value)}
                      className="w-full border-2 border-[#B5C9DA] px-4 py-3 rounded-[12px] bg-white text-[#002B50] text-sm md:text-base focus:border-[#002B50] focus:ring-2 focus:ring-[#B5C9DA]"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[#002B50] font-medium text-sm md:text-base mb-1.5 block">Model Perangkat</Label>
                    <Input
                      type="text"
                      placeholder="Contoh: 14 Pro Max"
                      value={modelPerangkat}
                      onChange={e => setModelPerangkat(e.target.value)}
                      className="w-full border-2 border-[#B5C9DA] px-4 py-3 rounded-[12px] bg-white text-[#002B50] text-sm md:text-base focus:border-[#002B50] focus:ring-2 focus:ring-[#B5C9DA]"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label className="text-[#002B50] font-medium text-sm md:text-base mb-1.5 block">Jenis Layanan</Label>
                  <select
                    value={serviceTypeId}
                    onChange={e => setServiceTypeId(e.target.value)}
                    className="w-full border-2 border-[#B5C9DA] px-4 py-3 rounded-[12px] bg-white text-[#002B50] text-sm md:text-base focus:border-[#002B50] focus:ring-2 focus:ring-[#B5C9DA]"
                    required
                  >
                    <option value="">Pilih jenis layanan</option>
                    {serviceTypes.map((s) => (
                      <option key={s.id} value={s.id}>{s.nama} - Rp {s.harga}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-[#002B50] font-medium text-sm md:text-base mb-1.5 block">Tanggal</Label>
                    <Input
                      type="date"
                      value={serviceDate}
                      onChange={e => setServiceDate(e.target.value)}
                      className="w-full border-2 border-[#B5C9DA] px-4 py-3 rounded-[12px] bg-white text-[#002B50] text-sm md:text-base focus:border-[#002B50] focus:ring-2 focus:ring-[#B5C9DA]"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[#002B50] font-medium text-sm md:text-base mb-1.5 block">Pembayaran DP (50% dari harga)</Label>
                    <Input
                      type="text"
                      value={dpAmount ? `Rp ${dpAmount.toLocaleString("id-ID")}` : ""}
                      readOnly
                      className="w-full border-2 border-[#B5C9DA] px-4 py-3 rounded-[12px] bg-[#F3F7FA] text-[#002B50] text-sm md:text-base"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label className="text-[#002B50] font-medium text-sm md:text-base mb-1.5 block">Teknisi</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {technicians.map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setTechnicianId(t.id)}
                        className={`flex items-center gap-4 p-4 rounded-[16px] border-2 transition-all duration-200 text-left ${technicianId === t.id ? "border-[#002B50] bg-[#F7FAFC] shadow-md ring-1 ring-[#002B50]" : "border-[#B5C9DA] bg-white hover:border-[#002B50]/50"}`}
                        style={{ minHeight: 100 }}
                      >
                        <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full overflow-hidden border-2 border-slate-200 bg-gray-100 flex items-center justify-center">
                          {/* Foto teknisi jika ada, jika tidak tampilkan inisial */}
                          {t.photoUrl ? (
                            <img
                              src={`${getBaseUrl()}/public${t.photoUrl}`}
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold text-gray-400">{t.name?.[0]}</span>
                          )}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-semibold text-[#002B50] text-sm md:text-base">{t.name}</span>
                          <span className="text-xs text-gray-500">{t.specialty || "-"}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 text-base font-semibold rounded-lg focus-visible:ring-2 focus-visible:ring-[#002B50] focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors !bg-[#002B50] hover:!bg-[#002B50]/90 !text-[#FDFEFF] border-2 disabled:!bg-white disabled:!text-[#002B50] disabled:!border-[#002B50] disabled:!opacity-100 disabled:!cursor-not-allowed"
                    disabled={!jenisPerangkat || !modelPerangkat || !serviceDate || !serviceTime || !technicianId || !serviceTypeId}
                  >
                    Booking Sekarang
                  </Button>
                </div>
              </form>
              {/* Right: Time List */}
              <div className="w-full max-w-xs mx-auto lg:mx-0">
                <Card className="border-2 border-[#B5C9DA] rounded-[16px] shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-[#002B50] text-xl">Pilih Waktu</CardTitle>
                    <CardDescription className="text-[#002B50]/80 text-base">Wajib pilih salah satu waktu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {renderSlotSection(
                        (serviceDate && technicianId && slots.length > 0) ? slots : null,
                        serviceTime,
                        setServiceTime,
                        serviceDate,
                        technicianId
                      )}
                    </div>
                    <div className="mt-4 text-sm text-slate-600 flex items-center gap-3">
                      <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-[#002B50]"></span> Tersedia</span>
                      <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-red-700"></span> Terbooking</span>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      {serviceTime ? (
                        <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#002B50] bg-white text-[#002B50] px-4 py-2 text-base font-medium">
                          <Clock className="h-4 w-4" />
                          {serviceTime}
                        </span>
                      ) : <span />}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setServiceTime("")}
                        disabled={!serviceTime}
                        aria-label="Batalkan waktu terpilih"
                        className="!bg-white !border-2 !border-[#002B50] !text-[#002B50] hover:!bg-white hover:!text-[#002B50] disabled:opacity-50 text-base px-4 py-2"
                      >
                        Batal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // Helper: Render slot section by time of day
  function renderSlotSection(slots, serviceTime, setServiceTime, serviceDate, technicianId) {
    // Bagi slot ke pagi, siang, sore, malam
    const slotGroups = [
      { label: "Pagi", start: "09:00", end: "11:30" },
      { label: "Siang", start: "12:00", end: "14:30" },
      { label: "Sore", start: "15:00", end: "17:30" },
      { label: "Malam", start: "18:00", end: "20:00" },
    ];
    const parseTime = (t) => t.split(":").map(Number);
    const toMinutes = (h, m) => h * 60 + m;
    // Default slots if not selected
    const defaultSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
      "18:00", "18:30", "19:00", "19:30", "20:00"
    ];
    const isActive = !!(serviceDate && technicianId && slots);
    return slotGroups.map((group) => {
      const [startH, startM] = parseTime(group.start);
      const [endH, endM] = parseTime(group.end);
      const startMin = toMinutes(startH, startM);
      const endMin = toMinutes(endH, endM);
      let groupSlots;
      if (isActive && slots) {
        groupSlots = slots.filter((slot) => {
          const [h, m] = parseTime(slot.time);
          const min = toMinutes(h, m);
          return min >= startMin && min <= endMin;
        });
      } else {
        groupSlots = defaultSlots.filter((t) => {
          const [h, m] = parseTime(t);
          const min = toMinutes(h, m);
          return min >= startMin && min <= endMin;
        }).map((t) => ({ time: t, booked: false }));
      }
      if (groupSlots.length === 0) return null;
      return (
        <div key={group.label}>
          <div className="font-semibold text-[#002B50] mb-2">{group.label}</div>
          <div className="flex flex-wrap gap-3 mb-2">
            {groupSlots.map((slot) => {
              const isSelected = serviceTime === slot.time;
              const isBooked = isActive ? slot.booked : false;
              return (
                <Button
                  key={slot.time}
                  type="button"
                  aria-pressed={isSelected}
                  aria-disabled={isBooked}
                  onClick={() => {
                    if (!isBooked && isActive) setServiceTime(slot.time);
                  }}
                  className={
                    !isActive
                      ? 'bg-white border-2 border-[#B5C9DA] text-[#002B50] font-semibold text-[18px] h-[48px] min-w-[80px] rounded-[10px]'
                      : isBooked
                        ? 'bg-red-700 border-2 border-red-700 text-white cursor-not-allowed pointer-events-none text-[18px] h-[48px] min-w-[80px] rounded-[10px]'
                        : isSelected
                          ? 'bg-[#002B50] text-white hover:bg-[#002B50]/90 shadow ring-2 ring-[#002B50] font-semibold text-[18px] h-[48px] min-w-[80px] rounded-[10px]'
                          : 'bg-white border-2 border-[#B5C9DA] text-[#002B50] hover:border-[#002B50] hover:bg-[#002B50]/5 font-semibold text-[18px] h-[48px] min-w-[80px] rounded-[10px]'
                  }
                  disabled={!isActive || isBooked}
                >
                  {slot.time}
                </Button>
              );
            })}
          </div>
        </div>
      );
    });
  }
}
