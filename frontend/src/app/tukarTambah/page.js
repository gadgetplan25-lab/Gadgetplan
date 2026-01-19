"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  Smartphone,
  Calculator,
  Box,
  Info,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ShiningText from "@/components/shiningText";


const COMPONENT_LABELS = {
  battery: "Baterai",
  lcd: "LCD/Layar",
  kamera_belakang: "Kamera Belakang",
  kamera_depan: "Kamera Depan",
  glass_kamera: "Glass Kamera",
  jamur: "Jamur/Moisture",
  backglass: "Backglass",
  housing: "Housing",
  speaker_bawah: "Speaker Bawah",
  speaker_atas: "Speaker Atas",
  charger: "Flexible Charger",
  onoff: "Flexible On/Off",
  volume: "Flexible Volume",
  vibrate: "Vibrate Motor",
  faceid: "Face ID",
};

export default function TukarTambahPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Data from API
  const [phones, setPhones] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);

  // Kondisi kerusakan
  const [kerusakan, setKerusakan] = useState({
    battery: false,
    lcd: false,
    kamera_belakang: false,
    kamera_depan: false,
    glass_kamera: false,
    jamur: false,
    backglass: false,
    housing: false,
    speaker_bawah: false,
    speaker_atas: false,
    charger: false,
    onoff: false,
    volume: false,
    vibrate: false,
    faceid: false,
  });

  const [newPhoneId, setNewPhoneId] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // For search in Step 1


  // Fetch phones
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/trade-in/phones");
        const phoneList = res.phones || [];
        setPhones(phoneList);

        if (phoneList.length > 0) {
          setSelectedPhone(phoneList[0]);
          setNewPhoneId(phoneList[0].id);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch phones:", error);
        setLoading(false);
      }
    };

    fetchPhones();
  }, []);

  // Calculate deductions
  const deductionList = [];
  let totalDeduction = 0;

  if (selectedPhone && selectedPhone.deductions) {
    Object.keys(kerusakan).forEach(component => {
      if (kerusakan[component] && selectedPhone.deductions[component]) {
        const amount = selectedPhone.deductions[component];
        deductionList.push({
          label: COMPONENT_LABELS[component] || component,
          value: amount
        });
        totalDeduction += amount;
      }
    });
  }

  const hargaNoMinus = selectedPhone?.price_min || 0;
  let estimasiHarga = hargaNoMinus - totalDeduction;
  if (estimasiHarga < 0) estimasiHarga = 0;

  // Calculate target price
  const targetPhone = phones.find(p => p.id === parseInt(newPhoneId));
  const estimasiTarget = targetPhone?.price_min || 0;
  const tambahanBudget = estimasiTarget - estimasiHarga;

  // Group phones by model for easier selection
  const phonesByModel = phones.reduce((acc, phone) => {
    if (!acc[phone.model]) {
      acc[phone.model] = [];
    }
    acc[phone.model].push(phone);
    return acc;
  }, {});

  // Step 1: Pilih HP & Kerusakan
  function renderStep1() {
    // Filter phones based on search
    const filteredPhones = phones.filter(phone => {
      const searchLower = searchTerm.toLowerCase();
      return (
        phone.model.toLowerCase().includes(searchLower) ||
        phone.category.toLowerCase().includes(searchLower)
      );
    });

    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg border border-[#E3E8EF] p-4 sm:p-6 md:p-10 mt-4 sm:mt-6 md:mt-10 animate-leftIn" style={{ marginTop: 32, marginBottom: 32 }}>
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Smartphone className="text-[#002B50] w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[#002B50]">Pilih HP Anda</h2>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <label className="block text-[#002B50] mb-2 font-medium text-sm">Cari iPhone</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ketik model atau storage (contoh: iPhone 13, 128GB, Pro Max)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-[#002B50]/30 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-[#002B50] focus:border-[#002B50] text-sm"
            />
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#002B50]/40 w-5 h-5" />
          </div>
          <p className="text-xs text-[#002B50]/70 mt-1">
            {filteredPhones.length} iPhone ditemukan
          </p>
        </div>

        {/* iPhone Cards Grid */}
        <div className="mb-6">
          <label className="block text-[#002B50] mb-3 font-medium text-sm">Pilih iPhone & Storage</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
            {filteredPhones.length === 0 ? (
              <div className="col-span-full text-center py-8 text-[#002B50]/70">
                Tidak ada iPhone yang cocok dengan pencarian "{searchTerm}"
              </div>
            ) : (
              filteredPhones.map(phone => (
                <button
                  key={phone.id}
                  type="button"
                  onClick={() => setSelectedPhone(phone)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${selectedPhone?.id === phone.id
                    ? "border-[#002B50] bg-blue-50 shadow-md"
                    : "border-[#002B50]/20 hover:border-[#002B50] hover:shadow"
                    }`}
                >
                  <div className="font-semibold text-[#002B50] text-sm mb-1">
                    {phone.model}
                  </div>
                  <div className="text-xs text-slate-600 mb-2">
                    <span className="bg-[#002B50]/10 text-[#002B50] px-2 py-0.5 rounded font-medium">
                      {phone.category}
                    </span>
                  </div>
                  <div className="text-[#002B50] font-bold text-base">
                    Rp {phone.price_min.toLocaleString("id-ID")}
                  </div>
                  {selectedPhone?.id === phone.id && (
                    <div className="mt-2 text-xs text-[#002B50] font-semibold">
                      ✓ Dipilih
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {selectedPhone && (
          <>
            {/* HP yang Dipilih - Ultra Clean */}
            <div className="bg-white border-l-4 border-[#002B50] p-5 rounded-lg mb-6 shadow-sm">
              <div className="text-xs font-semibold text-[#002B50] uppercase tracking-wide mb-2">
                HP yang Dipilih
              </div>
              <div className="text-xl font-bold text-[#002B50] mb-3">
                {selectedPhone.model} {selectedPhone.category}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-[#002B50]/70">Harga No Minus:</span>
                <span className="text-2xl font-bold text-[#002B50]">
                  Rp {hargaNoMinus.toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-xs text-[#002B50]/60">
                Harga ini untuk HP tanpa kerusakan apapun
              </p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                setStep(2);
              }}
            >
              {/* Kerusakan Section - Minimal */}
              <div className="mb-6">
                <h3 className="font-bold text-[#002B50] text-lg mb-1">
                  Apakah Ada Kerusakan?
                </h3>
                <p className="text-sm text-[#002B50]/70 mb-4">
                  Centang jika ada kerusakan. Harga akan dikurangi sesuai kerusakan.
                </p>

                {/* Checkbox List - 2 Columns */}
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(COMPONENT_LABELS).map(component => (
                    <label
                      key={component}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${kerusakan[component]
                        ? 'border-[#002B50] bg-blue-50'
                        : 'border-[#002B50]/20 hover:border-[#002B50]/40'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={kerusakan[component]}
                          onChange={e => setKerusakan(prev => ({ ...prev, [component]: e.target.checked }))}
                          className="w-4 h-4 text-[#002B50] focus:ring-[#002B50] rounded"
                        />
                        <span className="text-sm text-[#002B50] font-medium">
                          {COMPONENT_LABELS[component]}
                        </span>
                      </div>
                      {selectedPhone?.deductions?.[component] && (
                        <span className="text-xs text-[#002B50] font-semibold">
                          -Rp {selectedPhone.deductions[component].toLocaleString("id-ID")}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Total Potongan - Clean */}
              <div className="bg-white border-2 border-[#002B50] rounded-lg p-5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#002B50]/70 mb-1">Total Potongan</div>
                    {deductionList.length === 0 ? (
                      <div className="text-lg font-bold text-[#002B50]">
                        Rp 0
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-[#002B50]">
                        -Rp {totalDeduction.toLocaleString("id-ID")}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-[#002B50] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#003d75] transition"
                  >
                    Hitung Estimasi →
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        <div className="mt-6 bg-[#F1F5F9] rounded-lg p-3 xs:p-4 sm:p-5 flex items-start gap-2 xs:gap-3 text-[#1A3558] text-xs xs:text-sm sm:text-base">
          <Info className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[#2563eb] flex-shrink-0 mt-0.5" />
          <span>
            Estimasi harga berdasarkan data yang Anda berikan. Nilai akhir akan ditentukan setelah inspeksi fisik menyeluruh di toko kami.
          </span>
        </div>
      </div>
    );
  }

  // Step 2: Estimasi Harga
  function renderStep2() {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg border border-[#E3E8EF] p-4 sm:p-6 md:p-10 mt-4 sm:mt-6 md:mt-10 animate-rightIn">
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Calculator className="text-[#059669] w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[#1A3558]">Estimasi Harga HP Anda</h2>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 xs:p-5 sm:p-6 mb-4">
          <div className="text-[#059669] text-sm xs:text-base sm:text-lg mb-1 font-semibold">Estimasi Nilai Tukar</div>
          <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#059669] mb-2">Rp {estimasiHarga.toLocaleString("id-ID")}</div>

          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Harga No Minus:</span>
              <span className="font-semibold text-green-700">Rp {hargaNoMinus.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Potongan Kerusakan:</span>
              <span className="font-semibold text-red-600">-Rp {totalDeduction.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-semibold text-[#1A3558] mb-1">HP Anda:</div>
          <div className="flex flex-col gap-1 text-[#1A3558] text-sm">
            <span>{selectedPhone?.model} {selectedPhone?.category}</span>
            {deductionList.length > 0 && (
              <span className="text-red-600">Kerusakan: {deductionList.map(d => d.label).join(", ")}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 border border-[#002B50] text-[#002B50] rounded-lg py-3 font-semibold transition hover:bg-[#F1F5F9]"
            onClick={() => setStep(1)}
          >
            &larr; Kembali
          </button>
          <button
            className="flex-1 bg-[#002B50] text-white rounded-lg py-3 font-semibold transition hover:bg-[#003366]"
            onClick={() => setStep(3)}
          >
            Pilih HP Baru &rarr;
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Pilih HP Baru
  function renderStep3() {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-[#E3E8EF] p-6 md:p-10 mt-6 md:mt-10 animate-leftIn">
        <div className="flex items-center gap-3 mb-6">
          <Box className="text-[#002B50] w-7 h-7" />
          <h2 className="text-xl md:text-2xl font-bold text-[#1A3558]">Pilih HP Impian Anda</h2>
        </div>
        <div className="bg-[#F1F5F9] border border-[#B5C9DA] rounded-lg p-4 mb-4 text-center">
          <div className="text-[#1A3558] text-[15px] mb-1">Budget Tersedia:</div>
          <div className="text-2xl font-bold text-[#002B50]">Rp {estimasiHarga.toLocaleString("id-ID")}</div>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            setStep(4);
          }}
        >
          <div className="mb-4">
            <label className="block text-[#1A3558] mb-1 font-medium">Pilih iPhone Baru</label>
            <select
              className="w-full border border-[#B5C9DA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002B50]"
              value={newPhoneId}
              onChange={e => setNewPhoneId(e.target.value)}
              required
            >
              {Object.keys(phonesByModel).map(model => (
                <optgroup key={model} label={model}>
                  {phonesByModel[model].map(phone => (
                    <option key={phone.id} value={phone.id}>
                      {phone.model} {phone.category} - Rp {(phone.price_min / 1000000).toFixed(1)}jt
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-4 mb-4 text-[#B45309]">
            <div className="font-semibold mb-2">Perbandingan Harga:</div>
            <div className="flex flex-col gap-1 text-[15px]">
              <div className="flex justify-between">
                <span>Estimasi HP Anda:</span>
                <span className="font-semibold">Rp {estimasiHarga.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi HP Target:</span>
                <span className="font-semibold">Rp {estimasiTarget.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-yellow-300">
                <span>Tambahan Budget:</span>
                <span className={tambahanBudget >= 0 ? "text-green-600" : "text-red-600"}>
                  Rp {tambahanBudget.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              className="flex-1 border border-[#002B50] text-[#002B50] rounded-lg py-3 font-semibold transition hover:bg-[#F1F5F9]"
              onClick={() => setStep(2)}
            >
              &larr; Kembali
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#002B50] text-white rounded-lg py-3 font-semibold transition hover:bg-[#003366]"
            >
              Ajukan Tukar Tambah
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Step 4: Selesai
  function renderStep4() {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-[#E3E8EF] p-10 mt-10 text-center animate-rightIn">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A3558] mb-2">Pengajuan Berhasil!</h2>
        <p className="text-[#5B6B7E] mb-6">Pengajuan tukar tambah Anda telah dikirim. Kami akan menghubungi Anda untuk proses selanjutnya.</p>
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="text-sm text-blue-900 mb-2">
            <strong>Ringkasan:</strong>
          </div>
          <div className="text-sm text-blue-800">
            <div>HP Lama: {selectedPhone?.model} {selectedPhone?.category}</div>
            <div>Estimasi: Rp {estimasiHarga.toLocaleString("id-ID")}</div>
            <div>HP Baru: {targetPhone?.model} {targetPhone?.category}</div>
            <div>Tambahan: Rp {tambahanBudget.toLocaleString("id-ID")}</div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#002B50] text-white rounded-lg px-8 py-3 font-semibold text-[16px] transition hover:bg-[#003366]"
            onClick={() => {
              setStep(1);
              setKerusakan({
                battery: false,
                lcd: false,
                kamera_belakang: false,
                kamera_depan: false,
                glass_kamera: false,
                jamur: false,
                backglass: false,
                housing: false,
                speaker_bawah: false,
                speaker_atas: false,
                charger: false,
                onoff: false,
                volume: false,
                vibrate: false,
                faceid: false,
              });
            }}
          >
            Kembali ke Awal
          </button>
        </div>
      </div>
    );
  }

  // Stepper
  function renderStepper() {
    return (
      <div className="flex items-center justify-center gap-4 md:gap-8 mt-8">
        <div className="flex flex-col items-center">
          <div className={`rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 ${step >= 1 ? "bg-[#002B50] text-white border-[#002B50]" : "bg-[#F1F5F9] text-[#002B50] border-[#F1F5F9]"}`}>
            <Smartphone className="w-6 h-6" />
          </div>
          <span className={`mt-2 text-[15px] font-semibold ${step === 1 ? "text-[#002B50]" : "text-[#5B6B7E]"}`}>Pilih HP</span>
        </div>
        <div className={`h-1 w-10 md:w-16 ${step >= 2 ? "bg-[#059669]" : "bg-[#F1F5F9]"}`}></div>
        <div className="flex flex-col items-center">
          <div className={`rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 ${step >= 2 ? "bg-[#059669] text-white border-[#059669]" : "bg-[#F1F5F9] text-[#002B50] border-[#F1F5F9]"}`}>
            <Calculator className="w-6 h-6" />
          </div>
          <span className={`mt-2 text-[15px] font-semibold ${step === 2 ? "text-[#002B50]" : "text-[#5B6B7E]"}`}>Estimasi</span>
        </div>
        <div className={`h-1 w-10 md:w-16 ${step >= 3 ? "bg-[#002B50]" : "bg-[#F1F5F9]"}`}></div>
        <div className="flex flex-col items-center">
          <div className={`rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 ${step >= 3 ? "bg-[#002B50] text-white border-[#002B50]" : "bg-[#F1F5F9] text-[#002B50] border-[#F1F5F9]"}`}>
            <Box className="w-6 h-6" />
          </div>
          <span className={`mt-2 text-[15px] font-semibold ${step === 3 ? "text-[#002B50]" : "text-[#5B6B7E]"}`}>HP Baru</span>
        </div>
      </div>
    );
  }

  // Banner
  function renderBanner() {
    return (
      <section className="container mx-auto px-4 pt-8 pb-12">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-3 sm:mb-4 md:mb-6">
            <ShiningText
              text="Tukar Tambah iPhone"
              duration={6}
              className="!text-3xl xs:!text-4xl sm:!text-5xl md:!text-6xl lg:!text-7xl font-extrabold"
            />
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
            Upgrade iPhone lama Anda dengan yang baru. Proses cepat, transparan, dan harga terbaik!
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B50] mx-auto mb-4"></div>
            <p className="text-slate-600">Memuat data...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7FAFC] pb-10">
        {renderBanner()}
        <div className="max-w-3xl mx-auto pt-0 mt-[20px] md:pt-8 px-2 md:px-4 relative z-10">
          {renderStepper()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
      <Footer />
    </>
  );
}
