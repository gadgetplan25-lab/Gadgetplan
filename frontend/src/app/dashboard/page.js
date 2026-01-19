"use client";
import { useEffect, useState } from "react";
import { withAdminProtection } from "@/lib/withRoleProtection";
import { Users, Package, ShoppingCart, Calendar, TrendingUp } from "lucide-react";

function DashboardHome() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { apiFetch } = require("@/lib/api");
        const res = await apiFetch("/admin/dashboard/stats");
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Gagal ambil statistik:", err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users", value:
        stats.users, icon: Users, color:
        "text-[#002B50]", bg:
        "bg-[#002B50]/5"
    },
    {
      title: "Total Produk", value:
        stats.products, icon: Package,
      color: "text-[#002B50]", bg:
        "bg-[#002B50]/5"
    },
    {
      title: "Total Pesanan", value:
        stats.orders, icon: ShoppingCart,
      color: "text-[#002B50]", bg:
        "bg-[#002B50]/5"
    },
    {
      title: "Total Booking", value:
        stats.bookings, icon: Calendar,
      color: "text-[#002B50]", bg:
        "bg-[#002B50]/5"
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#002B50]">Dashboard Overview</h1>
        <p className="text-[#002B50]/60 mt-1 text-sm sm:text-base">Ringkasan aktivitas toko dan layanan perbaikan Anda.</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-[20px] p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <Icon size={20} className="sm:w-6 sm:h-6" />
                </div>
              </div>
              <h3 className="text-slate-500 text-xs sm:text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-[#002B50]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Welcome Message / Quick Actions Placeholder */}
      <div className="bg-[#002B50] rounded-[24px] p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Selamat Datang di Admin Panel GadgetPlan</h2>
          <p className="text-white/80 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed">
            Kelola semua aspek bisnis Anda dari satu tempat. Pantau pesanan terbaru, update stok produk, dan atur jadwal teknisi dengan mudah.
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAdminProtection(DashboardHome);