"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaWrench, FaClock } from "react-icons/fa";
import { apiFetch } from "@/lib/api";

const PopularServices = () => {
  const router = useRouter();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiFetch("/user/service", { method: "GET" });
        // ambil maksimal 3 service saja
        setServices(res.data.slice(0, 3));
      } catch (err) {
        console.error("❌ Gagal fetch service:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="py-8 sm:py-12 md:py-20 container mx-auto px-4">
      <div className="flex flex-row justify-between items-center mb-6 md:mb-8 gap-2 sm:gap-4">
        <div className="flex-1">
          <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-[#002B50] mb-1 sm:mb-2">
            Layanan Populer
          </h2>
          <p className="hidden sm:block text-slate-500 text-xs sm:text-sm">Pilihan layanan terbaik untukmu</p>
        </div>
        <Link
          href="/serviceGo"
          className="text-[#002B50] font-semibold hover:text-[#004a8f] transition-colors flex items-center gap-1 sm:gap-2 group text-xs xs:text-sm md:text-base whitespace-nowrap flex-shrink-0"
        >
          Lihat Semua
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>


      {/* Mobile & Tablet: Horizontal Scroll */}
      <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 sm:gap-6 pb-2">
          {services.map((service) => (
            <div key={service.id} className="w-[300px] sm:w-[340px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#002B50]/5 flex items-center justify-center text-[#002B50] group-hover:bg-[#002B50] group-hover:text-white transition-colors duration-300">
                      <FaWrench size={16} className="sm:hidden" />
                      <FaWrench size={20} className="hidden sm:block" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#002B50] line-clamp-1">
                      {service.nama}
                    </h3>
                  </div>
                  <p className="text-[#002B50] font-bold text-xl sm:text-2xl mb-2">
                    Rp {parseInt(service.harga).toLocaleString("id-ID")}
                  </p>
                  <p className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                    <FaClock className="text-slate-400" /> Estimasi {service.waktu_proses} menit
                  </p>
                </div>
                <button
                  onClick={() => router.push('/serviceGo')}
                  className="w-full bg-[#F1F5F9] text-[#002B50] font-bold py-3 md:py-4 min-h-[48px] rounded-xl hover:bg-[#002B50] hover:text-white transition-all duration-300 text-sm sm:text-base cursor-pointer"
                >
                  Pesan Layanan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#002B50]/5 flex items-center justify-center text-[#002B50] group-hover:bg-[#002B50] group-hover:text-white transition-colors duration-300">
                  <FaWrench size={16} className="sm:hidden" />
                  <FaWrench size={20} className="hidden sm:block" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#002B50] line-clamp-1">
                  {service.nama}
                </h3>
              </div>
              <p className="text-[#002B50] font-bold text-xl sm:text-2xl mb-2">
                Rp {parseInt(service.harga).toLocaleString("id-ID")}
              </p>
              <p className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <FaClock className="text-slate-400" /> Estimasi {service.waktu_proses} menit
              </p>
            </div>
            <button
              onClick={() => router.push('/serviceGo')}
              className="w-full bg-[#F1F5F9] text-[#002B50] font-bold py-3 md:py-4 min-h-[48px] rounded-xl hover:bg-[#002B50] hover:text-white transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              Pesan Layanan
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularServices;
