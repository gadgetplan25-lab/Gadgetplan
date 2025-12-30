"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { User, Package, Settings, LogOut } from "lucide-react";

export default function UserMenu({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      label: "Profil Saya",
      desc: "Kelola informasi akun",
      icon: <User className="w-5 h-5 text-blue-900" />,
      path: "/profilePage",
    },
    {
      label: "Pesanan Saya",
      desc: "Lihat riwayat pembelian",
      icon: <Package className="w-5 h-5 text-blue-900" />,
      path: "/pesananSaya",
    },
    {
      label: "Pengaturan",
      desc: "Preferensi akun",
      icon: <Settings className="w-5 h-5 text-blue-900" />,
      path: "/pengaturan",
    },
  ];

  const dropdownContent = menuOpen && mounted ? (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/30 z-[9998] md:hidden"
        onClick={() => setMenuOpen(false)}
      />

      {/* Dropdown Menu */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:absolute md:left-auto md:top-auto md:translate-x-0 md:translate-y-0 md:right-0 md:mt-3 w-[90%] max-w-[320px] md:w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] overflow-hidden"
        style={{
          position: window.innerWidth < 768 ? 'fixed' : 'absolute'
        }}
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-4 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col py-2">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                router.push(item.path);
                setMenuOpen(false);
              }}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-all text-left min-h-[56px]"
            >
              {item.icon}
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 transition-all text-left min-h-[56px]"
          >
            <LogOut className="w-5 h-5" />
            <div>
              <p className="text-sm font-semibold">Keluar</p>
              <p className="text-xs">Sign out dari akun</p>
            </div>
          </button>
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-lg shadow hover:bg-orange-600 transition-colors"
      >
        <User className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Render dropdown using portal for mobile, normal for desktop */}
      {mounted && typeof window !== 'undefined' && window.innerWidth < 768
        ? createPortal(dropdownContent, document.body)
        : dropdownContent
      }
    </div>
  );
}
