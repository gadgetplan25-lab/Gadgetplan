"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { FaShoppingCart, FaTimes, FaHeart } from "react-icons/fa";
import clsx from "clsx";
import { apiFetch } from "@/lib/api";
import { clearAllCookies } from "@/lib/cookieUtils";
import UserMenu from "@/components/userMenu/UserMenu";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const router = useRouter();
  const pathname = usePathname(); // ✅ untuk deteksi halaman aktif
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [layananOpen, setLayananOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // ✅ Internal state
  const [wishlistCount, setWishlistCount] = useState(0); // ✅ Wishlist count

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔍 [Navbar] Checking auth for pathname:", pathname);
        const res = await apiFetch("/auth/me", { method: "GET", credentials: "include" });

        if (res.user) {
          console.log("👤 [Navbar] User:", res.user.email, "| Role:", res.user.role);
          setUserData(res.user);

          // ✅ Auto-redirect admin ke dashboard jika akses halaman customer
          if (res.user.role === 'admin' && !pathname.startsWith('/dashboard') && !pathname.startsWith('/auth')) {
            console.log("🚫 [Navbar] Admin on customer page → redirecting to /dashboard");
            router.push('/dashboard');
          }
          // ✅ Auto-redirect customer dari dashboard ke homepage
          else if (res.user.role === 'customer' && pathname.startsWith('/dashboard')) {
            console.log("🚫 [Navbar] Customer on admin page → redirecting to /");
            router.push('/');
          }
          else {
            console.log("✅ [Navbar] User authorized for:", pathname);
          }
        }
      } catch (error) {
        console.log("❌ [Navbar] Auth failed:", error.message);
        setUserData(null);
      }
    };
    checkAuth();
  }, [pathname]); // ✅ Re-fetch saat pathname berubah (setelah login/logout)

  // 🛒 Fetch cart count globally (hanya jika sudah login)
  useEffect(() => {
    if (!userData) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const res = await apiFetch("/cart", {
          credentials: "include",
          redirectOnError: false
        });
        const count = res.cart?.CartItems?.length || 0;
        setCartCount(count);
      } catch (err) {
        // Silent fail - jangan log error untuk menghindari spam console
        setCartCount(0);
      }
    };

    const fetchWishlistCount = async () => {
      try {
        const res = await apiFetch("/user/wishlist", {
          credentials: "include",
          redirectOnError: false
        });
        setWishlistCount(res.count || 0);
      } catch (err) {
        // Silent fail - jangan log error untuk menghindari spam console
        setWishlistCount(0);
      }
    };

    // Fetch saat component mount
    fetchCartCount();
    fetchWishlistCount();

    // Refresh cart count setiap 60 detik (reduced from 30s for better performance)
    const interval = setInterval(() => {
      fetchCartCount();
      fetchWishlistCount();
    }, 60000);
    return () => clearInterval(interval);
  }, [userData]); // ✅ Dependency: userData


  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST", credentials: "include" });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Force clear all cookies from client-side
      clearAllCookies();

      // Clear state
      setUserData(null);
      setCartCount(0);

      // Redirect to login
      router.push("/auth/login");
    }
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Layanan", dropdown: true },
    { label: "Product", path: "/products" },
    { label: "Blog", path: "/blog" },
  ];

  const layananDropdown = [
    { label: "ServiceGo", desc: "Perbaikan gadget", path: "/serviceGo" },
    { label: "Tukar Tambah", desc: "Tukar gadget lama", path: "/tukarTambah" },
    { label: "Konsultasi", desc: "Konsultasi gratis", path: "/konsultasi" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 py-[5px] bg-white/70 backdrop-blur-md shadow-sm" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          {/* Logo */}
          <div
            className="text-2xl font-bold text-blue-900 cursor-pointer flex items-center"
            onClick={() => router.push("/")}
          >
            <div className="relative h-[32px] sm:h-[40px] md:h-[48px] lg:h-[56px] w-auto">
              <Image
                src="/logo-gadgetplan-biru.png"
                alt="GadgetPlan Logo"
                width={200}
                height={56}
                className="h-full w-auto object-contain"
                priority
                quality={90}
              />
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8 relative" aria-label="Main navigation">
            {/* Home */}
            <button
              key="home"
              onClick={() => router.push("/")}
              className={clsx(
                "relative text-sm font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-200 cursor-pointer",
                pathname === "/"
                  ? "text-blue-900 after:scale-x-100 after:bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:after:scale-x-100 after:bg-[#002B50]"
              )}
            >
              Beranda
            </button>
            {/* Layanan Dropdown */}
            {/* Layanan Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setLayananOpen(true)}
              onMouseLeave={() => setLayananOpen(false)}
            >
              <button
                onClick={() => setLayananOpen(!layananOpen)}
                className={clsx(
                  "relative text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center gap-1 py-2",
                  pathname.startsWith("/serviceGo") || pathname.startsWith("/tukarTambah") || pathname.startsWith("/konsultasi")
                    ? "text-blue-900"
                    : "text-gray-700 hover:text-blue-900"
                )}
              >
                Layanan
                <svg
                  className={clsx(
                    "w-4 h-4 ml-1 transition-transform duration-200",
                    layananOpen ? "rotate-180" : ""
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={clsx(
                  "absolute left-0 top-full pt-2 min-w-[260px] z-20 transition-all duration-200 origin-top",
                  layananOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                )}
              >
                <div className="bg-white rounded-xl shadow-lg border border-[#E3E8EF] py-2 px-0">
                  {layananDropdown.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        router.push(item.path);
                        setLayananOpen(false);
                      }}
                      className="w-full text-left px-6 py-3 hover:bg-[#F7FAFC] transition rounded-xl flex flex-col border-b last:border-b-0 border-[#F1F5F9]"
                    >
                      <span className="font-semibold text-[#1A3558] text-[15px]">{item.label}</span>
                      <span className="text-[#64748b] text-sm">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Product */}
            <button
              key="product"
              onClick={() => router.push("/products")}
              className={clsx(
                "relative text-sm font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-200 cursor-pointer",
                pathname.startsWith("/products")
                  ? "text-blue-900 after:scale-x-100 after:bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:after:scale-x-100 after:bg-[#002B50]"
              )}
            >
              Produk
            </button>
            {/* ...existing code... */}
            {/* Blog */}
            <button
              key="blog"
              onClick={() => router.push("/blog")}
              className={clsx(
                "relative text-sm font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-200 cursor-pointer",
                pathname.startsWith("/blog")
                  ? "text-blue-900 after:scale-x-100 after:bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:after:scale-x-100 after:bg-[#002B50]"
              )}
            >
              Blog
            </button>
          </nav>

          {/* Aksi kanan */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Wishlist */}
            <button
              className="relative cursor-pointer hover:bg-gray-100 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10"
              onClick={() => router.push("/wishlist")}
              aria-label="View wishlist"
              title="Wishlist"
            >
              <FaHeart className="text-gray-700 w-4 h-4 md:w-5 md:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-red-500 text-white text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-semibold shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              className="relative cursor-pointer hover:bg-gray-100 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10"
              onClick={() => router.push("/cart")}
              aria-label="View shopping cart"
            >
              <FaShoppingCart className="text-gray-700 w-4 h-4 md:w-5 md:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-red-500 text-white text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-semibold shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* UserMenu */}
            {userData ? (
              <UserMenu user={userData} onLogout={handleLogout} />
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-[#002B50] text-white px-6 py-2.5 min-h-[44px] rounded-[5px] hover:bg-[#023b6e] transition cursor-pointer text-sm md:text-base"
              >
                Login
              </button>
            )}

            {/* Tombol Menu Mobile */}
            <button
              className={clsx(
                "md:hidden p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex flex-col justify-center items-center touch-target group",
                menuOpen ? "bg-gray-200" : ""
              )}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={clsx(
                  "block w-6 h-0.5 bg-gray-700 transition-all duration-300",
                  menuOpen ? "rotate-45 translate-y-2" : ""
                )}
              ></span>
              <span
                className={clsx(
                  "block w-6 h-0.5 bg-gray-700 my-1 transition-all duration-300",
                  menuOpen ? "opacity-0" : ""
                )}
              ></span>
              <span
                className={clsx(
                  "block w-6 h-0.5 bg-gray-700 transition-all duration-300",
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                )}
              ></span>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Mobile */}
      <aside
        className={clsx(
          "fixed inset-0 z-50 flex md:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-modal="true"
        role="dialog"
      >
        {/* Overlay */}
        <button
          className={clsx(
            "absolute inset-0 w-full h-full bg-black bg-opacity-80 transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMenuOpen(false)}
        ></button>

        {/* Sidebar */}
        <nav
          className={clsx(
            "relative w-full h-full bg-white shadow-lg flex flex-col max-w-full transform transition-transform duration-300",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-4 border-b py-4 bg-white">
            <button
              className="text-xl font-bold text-blue-900 cursor-pointer bg-transparent border-0 p-0"
              onClick={() => {
                router.push("/");
                setMenuOpen(false);
              }}
            >
              <div className="relative h-[40px] w-auto">
                <Image
                  src="/logo-gadgetplan-biru.png"
                  alt="GadgetPlan Logo"
                  width={150}
                  height={40}
                  className="h-full w-auto object-contain"
                  priority
                  quality={90}
                />
              </div>
            </button>
            <button onClick={() => setMenuOpen(false)} className="p-2">
              <FaTimes
                className={clsx(
                  "text-gray-700 transition-all duration-300",
                  menuOpen ? "rotate-90" : "rotate-0"
                )}
              />
            </button>
          </div>

          <ul className="flex flex-col gap-2 px-4 bg-white">
            {menuItems.map((item, idx) => {
              // Handle Layanan Dropdown specifically for mobile
              if (item.dropdown) {
                return (
                  <li key={idx} className="flex flex-col border-b pb-2 border-gray-100 last:border-0">
                    {/* Layanan Header - Clickable */}
                    <button
                      onClick={() => setLayananOpen(!layananOpen)}
                      className="w-full text-lg font-medium text-gray-700 hover:text-blue-900 text-left py-3 px-2 rounded transition-colors min-h-[48px] flex items-center justify-between"
                    >
                      <span>Layanan</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${layananOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Submenu - Collapsible */}
                    {layananOpen && (
                      <div className="flex flex-col gap-1 pl-4 mt-1">
                        {layananDropdown.map((subItem) => (
                          <button
                            key={subItem.path}
                            onClick={() => {
                              router.push(subItem.path);
                              setMenuOpen(false);
                              setLayananOpen(false);
                            }}
                            className={clsx(
                              "w-full text-base font-medium text-gray-600 hover:text-blue-900 text-left py-2.5 px-4 rounded transition-colors min-h-[44px] flex items-center",
                              pathname === subItem.path ? "text-blue-900 bg-blue-50 font-semibold" : ""
                            )}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              // Handle regular links
              const isActive =
                pathname === item.path ||
                (item.path && item.path !== "/" && pathname?.startsWith(item.path));

              return (
                <li key={item.path || item.label + idx}>
                  <button
                    onClick={() => {
                      if (item.path) {
                        router.push(item.path);
                        setMenuOpen(false);
                      }
                    }}
                    className={clsx(
                      "w-full text-lg font-medium text-gray-700 hover:text-blue-900 text-left py-3 px-2 rounded transition-colors relative min-h-[48px] flex items-center",
                      isActive
                        ? "text-blue-900 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-900"
                        : ""
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto border-t pt-4 px-4 pb-6 bg-white">
            {!userData ? (
              <button
                onClick={() => {
                  router.push("/auth/login");
                  setMenuOpen(false);
                }}
                className="w-full bg-[#002B50] text-white py-3 min-h-[48px] rounded-lg hover:bg-[#003d73] font-medium transition-colors"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-3 min-h-[48px] rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </aside>
    </header>
  );
};

export default Navbar;
