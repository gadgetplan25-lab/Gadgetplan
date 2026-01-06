"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Users,
  Clock,
  CheckCircle2,
  Star,
  MessageCircle,
  Headphones,
  CalendarCheck2,
  Info,
  Phone,
  Mail,
  MapPin,
  Send,
  ChevronRight,
  User,
  Smartphone,
  MessageSquare,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const quickActions = [
  {
    icon: <Headphones className="w-5 h-5 text-[#002B50]" />,
    title: "Technical Support",
    desc: "Masalah teknis dan kerusakan gadget",
    whatsappMsg: "Halo, saya butuh bantuan technical support untuk gadget saya"
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-[#059669]" />,
    title: "Sales Inquiry",
    desc: "Informasi produk dan pembelian",
    whatsappMsg: "Halo, saya ingin menanyakan informasi produk"
  },
  {
    icon: <CalendarCheck2 className="w-5 h-5 text-[#f59e42]" />,
    title: "Service Status",
    desc: "Status service dan garansi",
    whatsappMsg: "Halo, saya ingin mengecek status service saya"
  },
  {
    icon: <Info className="w-5 h-5 text-[#64748b]" />,
    title: "General",
    desc: "Pertanyaan umum lainnya",
    whatsappMsg: "Halo, saya ingin bertanya tentang layanan GadgetPlan"
  },
];

const faqs = [
  {
    q: "Berapa lama estimasi waktu perbaikan?",
    a: "Estimasi waktu perbaikan bervariasi tergantung kerusakan: 1-3 hari untuk kerusakan ringan, 3-7 hari untuk kerusakan sedang, dan 1-2 minggu untuk kerusakan berat."
  },
  {
    q: "Apakah ada garansi untuk hasil perbaikan?",
    a: "Ya, kami memberikan garansi 30 hari untuk suku cadang yang diganti dan 7 hari untuk jasa service. Garansi tidak berlaku untuk kerusakan akibat penggunaan."
  },
  {
    q: "Bagaimana cara mengetahui biaya perbaikan?",
    a: "Setelah diagnosa awal, kami akan memberikan estimasi biaya terlebih dahulu. Perbaikan baru dilakukan setelah Anda menyetujui biaya tersebut."
  },
  {
    q: "Apakah data saya aman saat service?",
    a: "Kami menjamin keamanan data pribadi Anda. Namun kami sarankan untuk backup data penting sebelum menyerahkan gadget untuk service."
  },
  {
    q: "Bagaimana jika saya tidak puas dengan hasil service?",
    a: "Kami memberikan garansi kepuasan pelanggan. Jika ada masalah setelah service, kami akan cek ulang tanpa biaya tambahan."
  },
];

const whyChooseUs = [
  {
    icon: <Zap className="w-6 h-6 text-[#f59e42]" />,
    title: "Respon Cepat",
    desc: "Balasan dalam 1-2 menit via WhatsApp"
  },
  {
    icon: <Shield className="w-6 h-6 text-[#002B50]" />,
    title: "Tim Profesional",
    desc: "Teknisi bersertifikat & berpengalaman"
  },
  {
    icon: <Award className="w-6 h-6 text-[#059669]" />,
    title: "Garansi Terpercaya",
    desc: "Garansi service hingga 30 hari"
  },
];

export default function KonsultasiPage() {
  const [tab, setTab] = useState(0); // 0: WhatsApp, 1: Form, 2: FAQ
  const [expandedFaq, setExpandedFaq] = useState(null);

  // WhatsApp Configuration
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_PHONE; // Load from env
  const DEFAULT_MESSAGE = "Halo GadgetPlan! Saya ingin berkonsultasi tentang gadget saya.";

  const openWhatsApp = (customMessage = DEFAULT_MESSAGE) => {
    const message = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Dummy form state
  const [form, setForm] = useState({
    nama: "",
    wa: "",
    email: "",
    jenis: "",
    model: "",
    masalah: "",
    urgensi: "Prioritas (24 jam)",
    preferensi: "WhatsApp",
    deskripsi: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Generate WhatsApp message from form
    const message = `*Konsultasi Gadget*\n\nNama: ${form.nama}\nNo. WA: ${form.wa}\nEmail: ${form.email}\n\nJenis Gadget: ${form.jenis}\nModel: ${form.model}\nMasalah: ${form.masalah}\n\nDeskripsi:\n${form.deskripsi}\n\nUrgensi: ${form.urgensi}\nPreferensi Kontak: ${form.preferensi}`;
    openWhatsApp(message);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F0F6FF] pb-10">
        {/* Hero Banner - Updated to Brand Color #002B50 */}
        <div className="w-full bg-[#002B50] pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 max-w-4xl mx-auto">

            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Pusat Konsultasi GadgetPlan
            </h1>
            <p className="text-white/90 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Tim ahli kami siap membantu Anda dengan konsultasi gratis dan solusi terbaik untuk gadget Anda
            </p>

            <button
              onClick={() => openWhatsApp()}
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-5 xs:px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full text-xs xs:text-sm sm:text-base md:text-lg shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 transform hover:scale-105 min-h-[48px] sm:min-h-[52px] w-full xs:w-auto max-w-sm mx-auto"
            >
              <FaWhatsapp className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:rotate-12 transition-transform" />
              <span>Chat WhatsApp</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-0 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-[#E3E8EF] p-6 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="bg-[#F0F6FF] w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-[#002B50]">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#002B50] text-lg mb-2">{item.title}</h3>
                <p className="text-[#64748b] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row rounded-xl sm:rounded-2xl overflow-hidden border border-[#E3E8EF] bg-white mb-6 sm:mb-8 shadow-sm">
            <button
              onClick={() => setTab(0)}
              className={`flex-1 py-3.5 sm:py-4 text-center text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all min-h-[52px] ${tab === 0
                ? "bg-[#25D366] text-white shadow-md relative z-10"
                : "text-[#002B50] hover:bg-[#F7FAFC] bg-white"
                }`}
            >
              <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">WA</span>
            </button>
            <button
              onClick={() => setTab(1)}
              className={`flex-1 py-3.5 sm:py-4 text-center text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all min-h-[52px] ${tab === 1
                ? "bg-[#002B50] text-white shadow-md relative z-10"
                : "text-[#002B50] hover:bg-[#F7FAFC] bg-white"
                }`}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Form Konsultasi</span>
              <span className="sm:hidden">Form</span>
            </button>
            <button
              onClick={() => setTab(2)}
              className={`flex-1 py-3.5 sm:py-4 text-center text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all min-h-[52px] ${tab === 2
                ? "bg-[#002B50] text-white shadow-md relative z-10"
                : "text-[#002B50] hover:bg-[#F7FAFC] bg-white"
                }`}
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              FAQ
            </button>
          </div>

          {/* Tab Content */}
          {tab === 0 && (
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              {/* WhatsApp Quick Actions */}
              <div className="flex-1 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-[#E3E8EF] p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="bg-[#E6F9EE] p-2.5 sm:p-3 rounded-xl">
                    <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 text-[#25D366]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#002B50] text-base xs:text-lg sm:text-xl">Konsultasi via WhatsApp</h2>
                    <p className="text-[#64748b] text-[10px] xs:text-xs sm:text-sm">Pilih topik konsultasi Anda</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => openWhatsApp(action.whatsappMsg)}
                      className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-[#E3E8EF] bg-[#F7FAFC] hover:border-[#25D366] hover:bg-white hover:shadow-md transition-all hover:-translate-y-1 min-h-[80px] text-left"
                    >
                      <div className="bg-white p-2.5 sm:p-3 rounded-lg shadow-sm group-hover:shadow-none border border-[#E3E8EF] group-hover:border-transparent transition-all flex-shrink-0">
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#002B50] text-sm sm:text-base mb-1 group-hover:text-[#25D366] transition-colors">
                          {action.title}
                        </div>
                        <div className="text-xs text-[#64748b] leading-tight">{action.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#64748b] group-hover:text-[#25D366] group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </button>
                  ))}
                </div>

                {/* General WhatsApp Button */}
                <button
                  onClick={() => openWhatsApp()}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] min-h-[48px] sm:min-h-[52px]"
                >
                  <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs xs:text-sm sm:text-base">
                    <span className="hidden xs:inline">Mulai Chat WhatsApp</span>
                    <span className="xs:hidden">Chat WhatsApp</span>
                  </span>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="mt-5 sm:mt-6 bg-[#F0F6FF] rounded-xl p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 border border-[#E3E8EF]">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-[#002B50] flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-[#002B50] leading-relaxed">
                    <span className="font-semibold">Tips:</span> Siapkan informasi gadget Anda (merk, model, masalah) untuk konsultasi yang lebih cepat dan akurat.
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-6 w-full md:w-[340px]">
                <div className="bg-white rounded-2xl shadow-lg border border-[#E3E8EF] p-6">
                  <div className="font-bold text-[#002B50] text-lg mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#002B50]" />
                    Kontak Lainnya
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F7FAFC] border border-[#E3E8EF]">
                      <div className="bg-white p-2 rounded-lg box-shadow-sm">
                        <Phone className="w-5 h-5 text-[#002B50]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#64748b]">Call Center</div>
                        <div className="font-semibold text-[#002B50]">0800-1234-5678</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F7FAFC] border border-[#E3E8EF]">
                      <div className="bg-white p-2 rounded-lg box-shadow-sm">
                        <Mail className="w-5 h-5 text-[#059669]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#64748b]">Email</div>
                        <div className="font-semibold text-[#002B50] text-sm">support@gadgetplan.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F7FAFC] border border-[#E3E8EF]">
                      <div className="bg-white p-2 rounded-lg box-shadow-sm">
                        <MapPin className="w-5 h-5 text-[#f59e42]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#64748b]">Service Center</div>
                        <div className="font-semibold text-[#002B50] text-sm">Jakarta, Surabaya, Bandung</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#25D366] rounded-2xl shadow-lg p-6 text-white">
                  <div className="font-bold text-lg mb-2">Jam Operasional</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Senin - Jumat</span>
                      <span className="font-semibold">08:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Sabtu - Minggu</span>
                      <span className="font-semibold">09:00 - 17:00</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <FaWhatsapp className="w-4 h-4" />
                        <span className="text-sm">WhatsApp 24/7 Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 1 && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Form Konsultasi */}
              <div className="flex-1 bg-white rounded-2xl shadow-lg border border-[#E3E8EF] p-8">
                <div className="font-bold text-[#002B50] text-2xl mb-2">Form Konsultasi</div>
                <div className="text-[#64748b] mb-6">Isi form berikut untuk konsultasi dengan tim ahli kami</div>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                  <div>
                    <div className="font-semibold text-[#002B50] mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#002B50]" />
                      Informasi Pribadi
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        value={form.nama}
                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                        className="rounded-xl border border-[#E3E8EF] px-4 py-3 text-base focus:border-[#002B50] focus:outline-none transition-colors"
                        placeholder="Nama Lengkap"
                        required
                      />
                      <input
                        value={form.wa}
                        onChange={(e) => setForm({ ...form, wa: e.target.value })}
                        className="rounded-xl border border-[#E3E8EF] px-4 py-3 text-base focus:border-[#002B50] focus:outline-none transition-colors"
                        placeholder="No. WhatsApp (08xxx)"
                        required
                      />
                      <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="rounded-xl border border-[#E3E8EF] px-4 py-3 text-base md:col-span-2 focus:border-[#002B50] focus:outline-none transition-colors"
                        placeholder="Email"
                        type="email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-[#002B50] mb-3 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#002B50]" />
                      Informasi Gadget
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={form.jenis}
                        onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                        className="rounded-xl border border-[#E3E8EF] px-4 py-3 text-base focus:border-[#002B50] focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Pilih jenis gadget</option>
                        <option>Smartphone</option>
                        <option>Laptop</option>
                        <option>Tablet</option>
                        <option>Smartwatch</option>
                      </select>
                      <input
                        value={form.model}
                        onChange={(e) => setForm({ ...form, model: e.target.value })}
                        className="rounded-xl border border-[#E3E8EF] px-4 py-3 text-base focus:border-[#002B50] focus:outline-none transition-colors"
                        placeholder="Model Gadget (contoh: iPhone 13 Pro)"
                        required
                      />
                      <select
                        value={form.masalah}
                        onChange={(e) => setForm({ ...form, masalah: e.target.value })}
                        className="rounded-xl border border-[#E3E8EF] px-4 py-3 text-base md:col-span-2 focus:border-[#002B50] focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Pilih jenis masalah</option>
                        <option>Teknis / Kerusakan</option>
                        <option>Pembelian Produk</option>
                        <option>Garansi / Service</option>
                        <option>Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-[#002B50] mb-3 flex items-center gap-2">
                      <CalendarCheck2 className="w-5 h-5 text-[#002B50]" />
                      Preferensi Konsultasi
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={form.urgensi}
                        onChange={(e) => setForm({ ...form, urgensi: e.target.value })}
                        className="rounded-xl border border-[#E3E8EF] px-4 py-3 text-base focus:border-[#002B50] focus:outline-none transition-colors"
                      >
                        <option>Prioritas (24 jam)</option>
                        <option>Biasa (1-3 hari)</option>
                      </select>
                      <select
                        value={form.preferensi}
                        onChange={(e) => setForm({ ...form, preferensi: e.target.value })}
                        className="rounded-xl border border-[#E3E8EF] px-4 py-3 text-base focus:border-[#002B50] focus:outline-none transition-colors"
                      >
                        <option>WhatsApp</option>
                        <option>Email</option>
                        <option>Telepon</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    value={form.deskripsi}
                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                    className="rounded-xl border border-[#E3E8EF] px-4 py-3 text-base min-h-[120px] focus:border-[#002B50] focus:outline-none transition-colors"
                    placeholder="Jelaskan masalah gadget Anda secara detail..."
                    required
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg sm:rounded-xl py-3 sm:py-4 text-sm xs:text-base sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 sm:gap-3 min-h-[48px] sm:min-h-[52px]"
                  >
                    <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="hidden xs:inline">Kirim via WhatsApp</span>
                    <span className="xs:hidden">Kirim</span>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </form>
              </div>

              {/* Proses Konsultasi */}
              <div className="w-full md:w-[360px] flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-[#E3E8EF] p-6">
                  <div className="font-bold text-[#002B50] text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#25D366]" />
                    Proses Konsultasi
                  </div>
                  <ol className="space-y-4">
                    {[
                      { title: "Form Diterima", desc: "Tim kami akan menerima form Anda" },
                      { title: "Analisis Masalah", desc: "Tim ahli menganalisis kasus Anda" },
                      { title: "Respon Cepat", desc: "Hubungi sesuai preferensi Anda" },
                      { title: "Solusi Terbaik", desc: "Dapatkan solusi yang tepat" }
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E6F9EE] text-[#002B50] flex items-center justify-center font-bold text-sm border border-[#25D366]/20">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-[#002B50]">{step.title}</div>
                          <div className="text-sm text-[#64748b]">{step.desc}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-[#F0F6FF] rounded-xl p-5 border border-[#E3E8EF]">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#002B50] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-[#002B50]">
                      <span className="font-semibold">Respon rata-rata:</span> 30 menit untuk form konsultasi, 1-2 menit untuk WhatsApp.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 2 && (
            <div className="bg-white rounded-2xl shadow-lg border border-[#E3E8EF] p-8">
              <div className="font-bold text-[#002B50] text-2xl mb-2">Frequently Asked Questions</div>
              <div className="text-[#64748b] mb-6">Pertanyaan yang sering diajukan tentang layanan kami</div>

              <div className="flex flex-col gap-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border-2 border-[#E3E8EF] rounded-xl p-5 hover:border-[#002B50] transition-all cursor-pointer"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E6F9EE] text-[#002B50] flex items-center justify-center font-bold text-sm border border-[#25D366]/20">
                        Q
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#002B50] mb-2">{faq.q}</div>
                        {expandedFaq === i && (
                          <div className="text-[#64748b] text-sm leading-relaxed pl-4 border-l-2 border-[#25D366]">
                            {faq.a}
                          </div>
                        )}
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-[#64748b] transition-transform ${expandedFaq === i ? "rotate-90" : ""
                          }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-[#F0F6FF] rounded-xl p-6 text-center border border-[#E3E8EF]">
                <div className="text-[#002B50] font-semibold mb-2">Masih ada pertanyaan?</div>
                <div className="text-[#64748b] text-sm mb-4">Hubungi kami melalui WhatsApp untuk bantuan lebih lanjut</div>
                <button
                  onClick={() => openWhatsApp("Halo, saya memiliki pertanyaan yang tidak ada di FAQ")}
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-3.5 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-xs xs:text-sm sm:text-base min-h-[44px] sm:min-h-[48px] w-full xs:w-auto"
                >
                  <FaWhatsapp className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  <span className="hidden xs:inline">Tanya via WhatsApp</span>
                  <span className="xs:hidden">Tanya</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating WhatsApp Button */}
        <button
          onClick={() => openWhatsApp()}
          className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl hover:shadow-[#25D366]/50 transition-all transform hover:scale-110 z-50 animate-bounce"
          title="Chat WhatsApp"
        >
          <FaWhatsapp className="w-7 h-7" />
        </button>
      </div >
      <Footer />
    </>
  );
}
