"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { LogOut, LayoutDashboard, Package, Layers, Wrench, Settings, Users, Calendar, FileText, ShoppingCart, RefreshCw } from "lucide-react";
import "./dashboard.css";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userAdmin, setUserAdmin] = useState({ name: "Admin" });

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/dashboard/product", icon: Package },
    { name: "Technicians", path: "/dashboard/technician", icon: Wrench },
    { name: "Services", path: "/dashboard/service", icon: Settings },
    { name: "Users", path: "/dashboard/user", icon: Users },
    { name: "Bookings", path: "/dashboard/booking", icon: Calendar },
    { name: "Blogs", path: "/dashboard/blog", icon: FileText },
    { name: "Orders", path: "/dashboard/order", icon: ShoppingCart },
    { name: "Trade-In", path: "/dashboard/tradein", icon: RefreshCw },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await apiFetch("/auth/me");
        if (data?.user?.role === "admin") {
          setIsAdmin(true);
          setUserAdmin(data.user);
        } else {
          router.replace("/auth/login");
        }
      } catch (err) {
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    router.replace("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002B50]"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#F7FAFC]">
      {/* Sidebar Fixed */}
      <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-[#002B50] text-[#FDFEFF] shadow-xl z-50">
        <div className="flex-none">
          <div className="p-6 border-b border-[#FDFEFF]/10">
            <h2 className="text-2xl font-bold tracking-tight text-[#FDFEFF]">
              Admin Panel
            </h2>
            <p className="text-sm text-[#FDFEFF]/60 mt-1">GadgetPlan Manager</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <ul className="flex flex-col gap-1">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const isActive = pathname === menu.path;
              return (
                <li key={menu.path}>
                  <Link
                    href={menu.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                      ? "bg-[#FDFEFF] text-[#002B50] font-semibold shadow-md"
                      : "text-[#FDFEFF]/80 hover:bg-[#FDFEFF]/10 hover:text-[#FDFEFF]"
                      }`}
                  >
                    <Icon size={20} className={isActive ? "text-[#002B50]" : "text-[#FDFEFF]/70 group-hover:text-[#FDFEFF] transition-colors"} />
                    <span>{menu.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User & Logout */}
        <div className="flex-none p-4 border-t border-[#FDFEFF]/10 bg-[#002340]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-[#FDFEFF]/20 flex items-center justify-center text-sm font-bold">
              {userAdmin.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{userAdmin.name}</p>
              <p className="text-xs text-[#FDFEFF]/50">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 py-2.5 px-3 font-medium transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 bg-[#F7FAFC]">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}