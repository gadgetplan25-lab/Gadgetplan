
"use client";
import { useState } from "react";
import {
  RefreshCw,
  Smartphone,
  Calculator,
  Box,
  Info,
  ShieldCheck,
  Timer,
  Star,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const IPHONE_MODELS = [
  "iPhone X",
  "iPhone XS Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12 Mini",
  "iPhone 12",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13 Mini",
  "iPhone 13",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",
];

// Harga iPhone bekas (range)
const IPHONE_PRICES = {
  "iPhone X": [3500000, 5500000],
  "iPhone XS Max": [4500000, 6500000],
  "iPhone 11": [5500000, 7500000],
  "iPhone 11 Pro": [6500000, 8500000],
  "iPhone 11 Pro Max": [7500000, 9500000],
  "iPhone 12 Mini": [5000000, 7000000],
  "iPhone 12": [6000000, 8000000],
  "iPhone 12 Pro": [7000000, 9000000],
  "iPhone 12 Pro Max": [8000000, 10000000],
  "iPhone 13 Mini": [6000000, 8000000],
  "iPhone 13": [7000000, 9000000],
  "iPhone 13 Pro": [8000000, 12000000],
  "iPhone 13 Pro Max": [9000000, 14000000],
  "iPhone 14": [9000000, 12000000],
  "iPhone 14 Plus": [10000000, 13000000],
  "iPhone 14 Pro": [12000000, 16000000],
  "iPhone 14 Pro Max": [14000000, 18000000],
  "iPhone 15": [13000000, 16000000],
  "iPhone 15 Plus": [14000000, 17000000],
  "iPhone 15 Pro": [16000000, 20000000],
  "iPhone 15 Pro Max": [18000000, 24000000],
  "iPhone 16": [16000000, 20000000],
  "iPhone 16 Plus": [18000000, 22000000],
  "iPhone 16 Pro": [20000000, 26000000],
  "iPhone 16 Pro Max": [24000000, 32000000],
};

// Harga iPhone baru resmi
const IPHONE_NEW_PRICES = {
  "iPhone 13 128GB": 8249000,
  "iPhone 14 128GB": 9749000,
  "iPhone 15 128GB": 12999000,
  "iPhone 15 Plus 128GB": 14499000,
  "iPhone 15 Pro 128GB": 17999000,
  "iPhone 15 Pro Max 256GB": 22999000,
  "iPhone 16 128GB": 16999000,
  "iPhone 16 Plus 128GB": 18499000,
  "iPhone 16 Pro 128GB": 21999000,
  "iPhone 16 Pro Max 256GB": 28999000,
  "iPhone 16 Pro Max 1TB": 32499000,
};

// Potongan harga kerusakan
const DEDUCTIONS = {
  battery: {
    "iPhone XR": 260000, "iPhone 11": 300000, "iPhone 11 Pro": 320000, "iPhone 11 Pro Max": 350000, "iPhone 12": 370000, "iPhone 12 Mini": 380000, "iPhone 12 Pro": 400000, "iPhone 12 Pro Max": 425000, "iPhone 13": 450000, "iPhone 13 Mini": 460000, "iPhone 13 Pro": 500000, "iPhone 13 Pro Max": 550000, "iPhone 14": 520000, "iPhone 14 Pro": 550000, "iPhone 14 Pro Max": 575000, "iPhone 15": 750000, "iPhone 15 Pro": 865000, "iPhone 15 Pro Max": 950000,
  },
  lcd: {
    "iPhone XR": 600000, "iPhone 11": 700000, "iPhone 11 Pro": 1000000, "iPhone 11 Pro Max": 1100000, "iPhone 12": 1250000, "iPhone 12 Mini": 1300000, "iPhone 12 Pro": 1350000, "iPhone 12 Pro Max": 1800000, "iPhone 13": 1950000, "iPhone 13 Mini": 1750000, "iPhone 13 Pro": 2800000, "iPhone 13 Pro Max": 3000000, "iPhone 14": 1800000, "iPhone 14 Pro": 3500000, "iPhone 14 Pro Max": 3800000, "iPhone 15": 3300000, "iPhone 15 Pro": 4500000, "iPhone 15 Pro Max": 4800000,
  },
  kamera_belakang: {
    "iPhone XR": 600000, "iPhone 11": 750000, "iPhone 11 Pro": 1100000, "iPhone 11 Pro Max": 1250000, "iPhone 12": 800000, "iPhone 12 Mini": 850000, "iPhone 12 Pro": 1600000, "iPhone 12 Pro Max": 1800000, "iPhone 13": 780000, "iPhone 13 Mini": 750000, "iPhone 13 Pro": 1700000, "iPhone 13 Pro Max": 1900000, "iPhone 14": 1300000, "iPhone 14 Pro": 1800000, "iPhone 14 Pro Max": 1900000, "iPhone 15": 1200000, "iPhone 15 Pro": 1600000, "iPhone 15 Pro Max": 1800000,
  },
  kamera_depan: {
    "iPhone XR": 250000, "iPhone 11": 300000, "iPhone 11 Pro": 325000, "iPhone 11 Pro Max": 325000, "iPhone 12": 350000, "iPhone 12 Mini": 350000, "iPhone 12 Pro": 350000, "iPhone 12 Pro Max": 350000, "iPhone 13": 450000, "iPhone 13 Mini": 450000, "iPhone 13 Pro": 500000, "iPhone 13 Pro Max": 500000, "iPhone 14": 600000, "iPhone 14 Pro": 700000, "iPhone 14 Pro Max": 750000, "iPhone 15": 800000, "iPhone 15 Pro": 900000, "iPhone 15 Pro Max": 950000,
  },
  glass_kamera: {
    "iPhone XR": 50000, "iPhone 11": 75000, "iPhone 11 Pro": 75000, "iPhone 11 Pro Max": 75000, "iPhone 12": 100000, "iPhone 12 Mini": 100000, "iPhone 12 Pro": 120000, "iPhone 12 Pro Max": 150000, "iPhone 13": 125000, "iPhone 13 Mini": 100000, "iPhone 13 Pro": 150000, "iPhone 13 Pro Max": 175000, "iPhone 14": 200000, "iPhone 14 Pro": 250000, "iPhone 14 Pro Max": 270000, "iPhone 15": 280000, "iPhone 15 Pro": 300000, "iPhone 15 Pro Max": 300000,
  },
  jamur: {
    "iPhone XR": 150000, "iPhone 11": 200000, "iPhone 11 Pro": 220000, "iPhone 11 Pro Max": 220000, "iPhone 12": 230000, "iPhone 12 Mini": 230000, "iPhone 12 Pro": 250000, "iPhone 12 Pro Max": 250000, "iPhone 13": 250000, "iPhone 13 Mini": 250000, "iPhone 13 Pro": 280000, "iPhone 13 Pro Max": 280000, "iPhone 14": 280000, "iPhone 14 Pro": 330000, "iPhone 14 Pro Max": 350000, "iPhone 15": 450000, "iPhone 15 Pro": 500000, "iPhone 15 Pro Max": 500000,
  },
  backglass: {
    "iPhone XR": 225000, "iPhone 11": 250000, "iPhone 11 Pro": 275000, "iPhone 11 Pro Max": 300000, "iPhone 12": 350000, "iPhone 12 Mini": 300000, "iPhone 12 Pro": 375000, "iPhone 12 Pro Max": 400000, "iPhone 13": 350000, "iPhone 13 Mini": 325000, "iPhone 13 Pro": 375000, "iPhone 13 Pro Max": 400000, "iPhone 14": 400000, "iPhone 14 Pro": 450000, "iPhone 14 Pro Max": 450000, "iPhone 15": 450000, "iPhone 15 Pro": 500000, "iPhone 15 Pro Max": 500000,
  },
  housing: {
    "iPhone XR": 350000, "iPhone 11": 475000, "iPhone 11 Pro": 550000, "iPhone 11 Pro Max": 550000, "iPhone 12": 550000, "iPhone 12 Mini": 550000, "iPhone 12 Pro": 650000, "iPhone 12 Pro Max": 650000, "iPhone 13": 600000, "iPhone 13 Mini": 650000, "iPhone 13 Pro": 750000, "iPhone 13 Pro Max": 750000, "iPhone 14": 750000, "iPhone 14 Pro": 900000, "iPhone 14 Pro Max": 950000, "iPhone 15": 1100000, "iPhone 15 Pro": 1500000, "iPhone 15 Pro Max": 1600000,
  },
  speaker_bawah: {
    "iPhone XR": 160000, "iPhone 11": 200000, "iPhone 11 Pro": 220000, "iPhone 11 Pro Max": 240000, "iPhone 12": 350000, "iPhone 12 Mini": 320000, "iPhone 12 Pro": 370000, "iPhone 12 Pro Max": 380000, "iPhone 13": 400000, "iPhone 13 Mini": 380000, "iPhone 13 Pro": 400000, "iPhone 13 Pro Max": 400000, "iPhone 14": 450000, "iPhone 14 Pro": 500000, "iPhone 14 Pro Max": 500000, "iPhone 15": 500000, "iPhone 15 Pro": 500000, "iPhone 15 Pro Max": 500000,
  },
  speaker_atas: {
    "iPhone XR": 220000, "iPhone 11": 300000, "iPhone 11 Pro": 350000, "iPhone 11 Pro Max": 380000, "iPhone 12": 350000, "iPhone 12 Mini": 350000, "iPhone 12 Pro": 380000, "iPhone 12 Pro Max": 380000, "iPhone 13": 400000, "iPhone 13 Mini": 400000, "iPhone 13 Pro": 420000, "iPhone 13 Pro Max": 420000, "iPhone 14": 450000, "iPhone 14 Pro": 480000, "iPhone 14 Pro Max": 480000, "iPhone 15": 500000, "iPhone 15 Pro": 500000, "iPhone 15 Pro Max": 500000,
  },
  charger: {
    "iPhone XR": 230000, "iPhone 11": 275000, "iPhone 11 Pro": 650000, "iPhone 11 Pro Max": 680000, "iPhone 12": 600000, "iPhone 12 Mini": 500000, "iPhone 12 Pro": 625000, "iPhone 12 Pro Max": 625000, "iPhone 13": 650000, "iPhone 13 Mini": 650000, "iPhone 13 Pro": 750000, "iPhone 13 Pro Max": 850000, "iPhone 14": 950000, "iPhone 14 Pro": 1200000, "iPhone 14 Pro Max": 1200000, "iPhone 15": 1200000, "iPhone 15 Pro": 1200000, "iPhone 15 Pro Max": 1400000,
  },
  onoff: {
    "iPhone XR": 225000, "iPhone 11": 270000, "iPhone 11 Pro": 300000, "iPhone 11 Pro Max": 320000, "iPhone 12": 350000, "iPhone 12 Mini": 350000, "iPhone 12 Pro": 350000, "iPhone 12 Pro Max": 380000, "iPhone 13": 380000, "iPhone 13 Mini": 400000, "iPhone 13 Pro": 420000, "iPhone 13 Pro Max": 400000, "iPhone 14": 400000, "iPhone 14 Pro": 450000, "iPhone 14 Pro Max": 450000, "iPhone 15": 500000, "iPhone 15 Pro": 550000, "iPhone 15 Pro Max": 550000,
  },
  volume: {
    "iPhone XR": 200000, "iPhone 11": 300000, "iPhone 11 Pro": 350000, "iPhone 11 Pro Max": 380000, "iPhone 12": 350000, "iPhone 12 Mini": 350000, "iPhone 12 Pro": 350000, "iPhone 12 Pro Max": 400000, "iPhone 13": 400000, "iPhone 13 Mini": 400000, "iPhone 13 Pro": 400000, "iPhone 13 Pro Max": 400000, "iPhone 14": 400000, "iPhone 14 Pro": 400000, "iPhone 14 Pro Max": 400000, "iPhone 15": 400000, "iPhone 15 Pro": 530000, "iPhone 15 Pro Max": 530000,
  },
  vibrate: {
    "iPhone XR": 200000, "iPhone 11": 250000, "iPhone 11 Pro": 250000, "iPhone 11 Pro Max": 250000, "iPhone 12": 250000, "iPhone 12 Mini": 300000, "iPhone 12 Pro": 300000, "iPhone 12 Pro Max": 300000, "iPhone 13": 300000, "iPhone 13 Mini": 320000, "iPhone 13 Pro": 320000, "iPhone 13 Pro Max": 320000, "iPhone 14": 350000, "iPhone 14 Pro": 380000, "iPhone 14 Pro Max": 380000, "iPhone 15": 400000, "iPhone 15 Pro": 420000, "iPhone 15 Pro Max": 420000,
  },
  faceid: {
    "iPhone XR": 850000, "iPhone 11": 950000, "iPhone 11 Pro": 1000000, "iPhone 11 Pro Max": 1200000, "iPhone 12": 1300000, "iPhone 12 Mini": 1300000, "iPhone 12 Pro": 1300000, "iPhone 12 Pro Max": 1300000, "iPhone 13": 1500000, "iPhone 13 Mini": 1500000, "iPhone 13 Pro": 1700000, "iPhone 13 Pro Max": 1800000, "iPhone 14": 1900000, "iPhone 14 Pro": 2200000, "iPhone 14 Pro Max": 2200000, "iPhone 15": 2100000, "iPhone 15 Pro": 2200000, "iPhone 15 Pro Max": 2200000,
  },
};
const STORAGES = ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"];
const YEARS = Array.from({ length: 8 }, (_, i) => `${2018 + i}`);
const CONDITIONS = [
  { label: "Mint (Seperti baru, tidak ada cacat)", value: "Mint" },
  { label: "Sangat Baik (Gores halus minimal)", value: "Sangat Baik" },
  { label: "Baik (Tanda pemakaian normal)", value: "Baik" },
  { label: "Cukup (Beberapa cacat)", value: "Cukup" },
  { label: "Kurang (Banyak cacat/kerusakan)", value: "Kurang" },
];
const ACCESSORIES = [
  { label: "Lengkap (Dus, charger, buku manual, dll)", value: "Lengkap" },
  { label: "Sebagian (Charger saja)", value: "Sebagian" },
  { label: "Unit saja", value: "Unit" },
];
const BATTERY = [
  { label: "Sangat Baik (>85%)", value: ">85%" },
  { label: "Baik (70-85%)", value: "70-85%" },
  { label: "Cukup (50-70%)", value: "50-70%" },
  { label: "Kurang (<50%)", value: "<50%" },
];
const YESNO = [
  { label: "Sempurna", value: "Sempurna" },
  { label: "Ada Masalah", value: "Ada Masalah" },
];
const WATER = [
  { label: "Tidak Pernah Terkena Air", value: "Tidak Pernah" },
  { label: "Pernah Terkena Air", value: "Pernah" },
];

export default function TukarTambahPage() {
  const [step, setStep] = useState(1);
  // Form State
  const [model, setModel] = useState("iPhone 13");
  const [year, setYear] = useState("2023");
  const [storage, setStorage] = useState("128 GB");
  const [condition, setCondition] = useState("Mint");
  const [accessory, setAccessory] = useState("Sebagian");
  // Kondisi detail kerusakan
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

  // Hitung potongan kerusakan secara realtime
  const deductionList = [];
  let totalDeduction = 0;
  const deductionMap = [
    { key: "battery", label: "Baterai", data: DEDUCTIONS.battery },
    { key: "lcd", label: "LCD/Layar", data: DEDUCTIONS.lcd },
    { key: "kamera_belakang", label: "Kamera Belakang", data: DEDUCTIONS.kamera_belakang },
    { key: "kamera_depan", label: "Kamera Depan", data: DEDUCTIONS.kamera_depan },
    { key: "glass_kamera", label: "Glass Kamera", data: DEDUCTIONS.glass_kamera },
    { key: "jamur", label: "Jamur/Moisture", data: DEDUCTIONS.jamur },
    { key: "backglass", label: "Backglass", data: DEDUCTIONS.backglass },
    { key: "housing", label: "Housing", data: DEDUCTIONS.housing },
    { key: "speaker_bawah", label: "Speaker Bawah", data: DEDUCTIONS.speaker_bawah },
    { key: "speaker_atas", label: "Speaker Atas", data: DEDUCTIONS.speaker_atas },
    { key: "charger", label: "Flexible Charger", data: DEDUCTIONS.charger },
    { key: "onoff", label: "Flexible On/Off", data: DEDUCTIONS.onoff },
    { key: "volume", label: "Flexible Volume", data: DEDUCTIONS.volume },
    { key: "vibrate", label: "Vibrate Motor", data: DEDUCTIONS.vibrate },
    { key: "faceid", label: "Face ID", data: DEDUCTIONS.faceid },
  ];
  deductionMap.forEach(item => {
    if (kerusakan[item.key] && item.data && item.data[model]) {
      deductionList.push({ label: item.label, value: item.data[model] });
      totalDeduction += item.data[model];
    }
  });

  const priceRange = IPHONE_PRICES[model] || [0, 0];
  let estimasiHarga = priceRange[0] - totalDeduction;
  if (estimasiHarga < 0) estimasiHarga = 0;
  // Pilihan HP baru resmi
  const IPHONE_NEW_MODELS = Object.keys(IPHONE_NEW_PRICES);
  const [newModel, setNewModel] = useState(IPHONE_NEW_MODELS[0]);
  const [newCondition, setNewCondition] = useState("Baru iBox");
  // Hitung estimasi harga target sesuai kondisi
  let estimasiTarget = IPHONE_NEW_PRICES[newModel] || 0;
  if (newCondition === "Bekas iBox") {
    estimasiTarget = Math.round(estimasiTarget * 0.8); // 80% dari harga baru
  } else if (newCondition === "Bekas Inter") {
    estimasiTarget = Math.round(estimasiTarget * 0.7); // 70% dari harga baru
  }
  const tambahanBudget = estimasiTarget - estimasiHarga;

  // Step 1: Data HP User
  function renderStep1() {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg border border-[#E3E8EF] p-4 sm:p-6 md:p-10 mt-4 sm:mt-6 md:mt-10 animate-leftIn" style={{ marginTop: 32, marginBottom: 32 }}>
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Smartphone className="text-[#002B50] w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[#1A3558]">Data HP Anda</h2>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#1A3558] mb-1 font-medium text-xs xs:text-sm sm:text-base">Model/Seri</label>
              <select
                className="w-full border border-[#B5C9DA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002B50] text-xs xs:text-sm sm:text-base"
                value={model}
                onChange={e => setModel(e.target.value)}
              >
                {IPHONE_MODELS.map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#1A3558] mb-1 font-medium text-xs xs:text-sm sm:text-base">Tahun Pembelian</label>
              <select
                className="w-full border border-[#B5C9DA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002B50] text-xs xs:text-sm sm:text-base"
                value={year}
                onChange={e => setYear(e.target.value)}
              >
                {YEARS.map(y => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#1A3558] mb-1 font-medium text-xs xs:text-sm sm:text-base">Storage</label>
              <select
                className="w-full border border-[#B5C9DA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002B50] text-xs xs:text-sm sm:text-base"
                value={storage}
                onChange={e => setStorage(e.target.value)}
              >
                {STORAGES.map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#1A3558] mb-1 font-medium text-xs xs:text-sm sm:text-base">Kondisi Fisik</label>
              <select
                className="w-full border border-[#B5C9DA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002B50] text-xs xs:text-sm sm:text-base"
                value={condition}
                onChange={e => setCondition(e.target.value)}
              >
                {CONDITIONS.map(c => (
                  <option key={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#1A3558] mb-1 font-medium text-xs xs:text-sm sm:text-base">Kelengkapan Aksesoris</label>
              <select
                className="w-full border border-[#B5C9DA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002B50] text-xs xs:text-sm sm:text-base"
                value={accessory}
                onChange={e => setAccessory(e.target.value)}
              >
                {ACCESSORIES.map(a => (
                  <option key={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="border-t pt-4 mt-2 mb-2">
            <div className="font-semibold text-[#1A3558] mb-2 text-sm xs:text-base sm:text-lg">Kondisi Kerusakan HP Anda</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deductionMap.map(item => (
                <div key={item.key}>
                  <label className="block text-[#1A3558] mb-1 font-medium text-xs xs:text-sm sm:text-base">{item.label}</label>
                  <select
                    className="w-full border border-[#B5C9DA] rounded-lg px-3 py-2 text-xs xs:text-sm sm:text-base"
                    value={kerusakan[item.key] ? "Ada Kerusakan" : "Tidak Ada Kerusakan"}
                    onChange={e => setKerusakan(prev => ({ ...prev, [item.key]: e.target.value === "Ada Kerusakan" }))}
                  >
                    <option value="Tidak Ada Kerusakan">Tidak Ada Kerusakan</option>
                    <option value="Ada Kerusakan">Ada Kerusakan</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
            <div>
              <div className="text-[#ef4444] font-bold text-sm xs:text-base sm:text-lg mb-1">Estimasi Potongan Kerusakan:</div>
              {deductionList.length === 0 ? (
                <div className="text-[#ef4444] text-xs xs:text-sm sm:text-base">Tidak ada potongan</div>
              ) : (
                <ul className="text-[#ef4444] text-xs xs:text-sm sm:text-base mb-1">
                  {deductionList.map((d, i) => (
                    <li key={d.label + i}>{d.label}: -Rp {d.value.toLocaleString("id-ID")}</li>
                  ))}
                </ul>
              )}
              <div className="font-bold text-[#ef4444] text-sm xs:text-base sm:text-lg">Total Potongan: -Rp {totalDeduction.toLocaleString("id-ID")}</div>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-[#002B50] text-white font-semibold rounded-lg py-2.5 xs:py-3 sm:py-3.5 px-6 xs:px-8 sm:px-10 text-xs xs:text-sm sm:text-base transition hover:bg-[#003366] shadow min-h-[44px]"
            >
              Hitung Estimasi Harga
            </button>
          </div>
        </form>
        <div className="mt-6 bg-[#F1F5F9] rounded-lg p-3 xs:p-4 sm:p-5 flex items-start gap-2 xs:gap-3 text-[#1A3558] text-xs xs:text-sm sm:text-base">
          <Info className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[#2563eb] flex-shrink-0 mt-0.5" />
          <span>
            Estimasi harga berdasarkan data yang Anda berikan. Nilai akhir akan ditentukan setelah inspeksi fisik menyeluruh di toko kami (30-60 menit).
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
        <div className="bg-[#E6F9F0] border border-[#A7F3D0] rounded-lg p-4 xs:p-5 sm:p-6 mb-4 text-center">
          <div className="text-[#059669] text-sm xs:text-base sm:text-lg mb-1 font-semibold">Estimasi Nilai Tukar</div>
          <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#059669] mb-1">Rp {estimasiHarga.toLocaleString("id-ID")}</div>
        </div>
        <div className="bg-[#F1F5F9] rounded-lg p-4 mb-4">
          <div className="font-semibold mb-2 text-[#1A3558]">Tips:</div>
          <ul className="list-disc ml-5 text-[#1A3558] text-[15px]">
            <li>Gadget Anda dalam kondisi sangat baik, nilai tukar tinggi</li>
            <li>Pertimbangkan untuk upgrade ke model terbaru</li>
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-[#1A3558] mb-1">HP:</div>
          <div className="flex flex-col gap-1 text-[#1A3558] text-[15px]">
            <span>Apple {model}</span>
            <span>Kondisi: {condition}</span>
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
        <div className="mt-6 bg-[#F1F5F9] rounded-lg p-4 flex items-center gap-3 text-[#1A3558] text-[15px]">
          <Info className="w-5 h-5 text-[#2563eb]" />
          <span>
            Estimasi harga berdasarkan data yang Anda berikan. Nilai akhir akan ditentukan setelah inspeksi fisik menyeluruh di toko kami (30-60 menit).
          </span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#1A3558] mb-1 font-medium">Model HP Baru Resmi</label>
              <select
                className="w-full border border-[#B5C9DA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002B50]"
                value={newModel}
                onChange={e => setNewModel(e.target.value)}
              >
                {IPHONE_NEW_MODELS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#1A3558] mb-1 font-medium">Kondisi</label>
              <select
                className="w-full border border-[#B5C9DA] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002B50]"
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
              >
                <option value="Baru iBox">Baru iBox</option>
                <option value="Bekas iBox">Bekas iBox</option>
                <option value="Bekas Inter">Bekas Inter</option>
              </select>
            </div>
          </div>
          <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-4 mb-4 text-[#B45309]">
            <div className="font-semibold mb-2">Perbandingan Harga:</div>
            <div className="flex flex-col gap-1 text-[15px]">
              <div className="flex justify-between">
                <span>Estimasi HP Anda:</span>
                <span>Rp {estimasiHarga.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi HP Target:</span>
                <span>Rp {estimasiTarget.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Tambahan Budget:</span>
                <span>Rp {tambahanBudget.toLocaleString("id-ID")}</span>
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
        <div className="mt-6 bg-[#F1F5F9] rounded-lg p-4 flex items-center gap-3 text-[#1A3558] text-[15px]">
          <Info className="w-5 h-5 text-[#2563eb]" />
          <span>
            Estimasi harga berdasarkan data yang Anda berikan. Nilai akhir akan ditentukan setelah inspeksi fisik menyeluruh di toko kami (30-60 menit).
          </span>
        </div>
      </div>
    );
  }

  // Step 4: Selesai
  function renderStep4() {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow border border-[#E3E8EF] p-8 mt-8 text-center">
        <h2 className="text-2xl font-bold text-[#1A3558] mb-2">Tukar Tambah HP</h2>
        <p className="text-[#5B6B7E] mb-6">Pengajuan tukar tambah Anda telah dikirim. Kami akan menghubungi Anda untuk proses selanjutnya.</p>
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#002B50] text-white rounded-lg px-8 py-3 font-semibold text-[16px] transition hover:bg-[#003366]"
            onClick={() => setStep(1)}
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
          <span className={`mt-2 text-[15px] font-semibold ${step === 1 ? "text-[#002B50]" : "text-[#5B6B7E]"}`}>Data HP Anda</span>
        </div>
        <div className={`h-1 w-10 md:w-16 ${step >= 2 ? "bg-[#059669]" : "bg-[#F1F5F9]"}`}></div>
        <div className="flex flex-col items-center">
          <div className={`rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 ${step >= 2 ? "bg-[#059669] text-white border-[#059669]" : "bg-[#F1F5F9] text-[#002B50] border-[#F1F5F9]"}`}>
            <Calculator className="w-6 h-6" />
          </div>
          <span className={`mt-2 text-[15px] font-semibold ${step === 2 ? "text-[#002B50]" : "text-[#5B6B7E]"}`}>Estimasi Harga</span>
        </div>
        <div className={`h-1 w-10 md:w-16 ${step >= 3 ? "bg-[#002B50]" : "bg-[#F1F5F9]"}`}></div>
        <div className="flex flex-col items-center">
          <div className={`rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 ${step >= 3 ? "bg-[#002B50] text-white border-[#002B50]" : "bg-[#F1F5F9] text-[#002B50] border-[#F1F5F9]"}`}>
            <Box className="w-6 h-6" />
          </div>
          <span className={`mt-2 text-[15px] font-semibold ${step === 3 ? "text-[#002B50]" : "text-[#5B6B7E]"}`}>Pilih HP Baru</span>
        </div>
      </div>
    );
  }

  // Banner - Updated to match Konsultasi style
  function renderBanner() {
    return (
      <div className="w-full bg-[#002B50] pt-12 pb-16 px-4 md:px-0 text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Tukar Tambah Gadget
          </h1>
          <p className="text-white/80 text-lg mb-2 max-w-2xl mx-auto">
            Upgrade gadget lama Anda dengan yang baru. Proses cepat, transparan, dan harga terbaik!
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-3 justify-center mb-8 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <ShieldCheck className="w-4 h-4" /> Aman & Terpercaya
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <Timer className="w-4 h-4" /> Estimasi Instan
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <Star className="w-4 h-4" /> Harga Terbaik
            </span>
          </div>

          <p className="text-white/60 text-sm">
            ⚡ Dapatkan estimasi harga dalam hitungan menit • 🔒 Proses transparan
          </p>
        </div>
      </div>
    );
  }

  // Selesai
  function renderStep4() {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-[#E3E8EF] p-10 mt-10 text-center animate-rightIn">
        <h2 className="text-2xl font-bold text-[#1A3558] mb-2">Tukar Tambah HP</h2>
        <p className="text-[#5B6B7E] mb-6">Pengajuan tukar tambah Anda telah dikirim. Kami akan menghubungi Anda untuk proses selanjutnya.</p>
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#002B50] text-white rounded-lg px-8 py-3 font-semibold text-[16px] transition hover:bg-[#003366]"
            onClick={() => setStep(1)}
          >
            Kembali ke Awal
          </button>
        </div>
      </div>
    );
  }

  // Footer Info
  function renderFooterInfo() {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="bg-[#F1F5F9] rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between text-[#1A3558] text-[15px] border border-[#E3E8EF]">
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#059669]" /> Garansi Harga</div>
          <div className="flex items-center gap-2"><Timer className="w-5 h-5 text-[#2563eb]" /> Proses Cepat</div>
          <div className="flex items-center gap-2"><Star className="w-5 h-5 text-[#f59e42]" /> Kepuasan Terjamin</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7FAFC] pb-10">
        {renderBanner()}
        <div className="max-w-3xl mx-auto pt-0 mt-[20px] md:pt-8 px-2 md:px-4 -mt-16 relative z-10">
          {renderStepper()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {renderFooterInfo()}
        </div>
      </div>
      <Footer />
    </>
  );
}
