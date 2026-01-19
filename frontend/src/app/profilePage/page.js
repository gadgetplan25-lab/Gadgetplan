"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hook/useAuthGuard";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LoadingAnimation from "@/components/loadingAnimation";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const { loading } = useAuthGuard();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [wishlistCount, setWishlistCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  useEffect(() => {
    apiFetch("/user/profile/details")
      .then((res) => {
        if (res?.user) {
          setProfile(res.user);
          setFormData({
            name: res.user.name || "",
            email: res.user.email || "",
            phone: res.user.phone || "",
            address: res.user.address || "",
          });
        }
      })
      .catch((err) => console.error("❌ Gagal fetch profil:", err));

    // Fetch wishlist count
    apiFetch("/user/wishlist")
      .then((res) => {
        if (res?.success) {
          setWishlistCount(res.count || 0);
        }
      })
      .catch((err) => { });

    // Fetch orders count
    apiFetch("/user/orders")
      .then((res) => {
        if (res?.orders) {
          setTotalOrdersCount(res.orders.length);
          const completedOrders = res.orders.filter(
            (order) => order.status === "completed" || order.status === "selesai"
          );
          setCompletedOrdersCount(completedOrders.length);
        }
      })
      .catch((err) => { });
  }, []);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    });
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSave = async () => {
    try {
      const res = await apiFetch("/user/settings", {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      if (res?.success) {
        setProfile((prev) => ({ ...prev, ...formData }));
        setEditMode(false);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Profil berhasil diperbarui",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res?.message || "Gagal update profil",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal update profil",
      });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#002B50]">
      <LoadingAnimation />
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="bg-white container mx-auto px-4 sm:px-6 md:px-[60px] py-4 sm:py-6 md:py-[40px]">
        <h1 className="text-xl xs:text-2xl sm:text-[28px] md:text-[32px] font-bold text-[#1A3558] mb-1 sm:mb-2">Profil Saya</h1>
        <p className="text-[#5B6B7E] mb-4 sm:mb-6 md:mb-8 text-xs xs:text-sm sm:text-[15px] md:text-[16px]">Kelola informasi akun dan preferensi Anda</p>
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-[32px]">
          {/* Kiri: Avatar & Info Singkat */}
          <div className="bg-white border border-[#E3E8EF] rounded-[16px] w-full lg:w-[340px] flex flex-col items-center py-6 sm:py-8 px-4 sm:px-6">
            <div className="relative mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px] rounded-full bg-[#F97316] flex items-center justify-center text-white text-3xl sm:text-4xl md:text-[48px] font-bold">
                {profile?.name?.[0]?.toUpperCase()}
              </div>
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-[#1A3558] rounded-full p-1.5 sm:p-2 border-2 border-white">
                <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="white"><circle cx="8" cy="8" r="6" className="sm:cx-10 sm:cy-10 sm:r-8" /><rect x="5" y="5" width="6" height="6" rx="1" fill="#1A3558" /></svg>
              </div>
            </div>
            <div className="text-base xs:text-lg sm:text-xl md:text-[22px] font-semibold text-[#1A3558] mb-1 text-center leading-tight">{profile?.name || "-"}</div>
            <div className="text-xs xs:text-sm sm:text-base md:text-[16px] text-[#5B6B7E] mb-2 text-center break-all">{profile?.email || "-"}</div>
            <div className="bg-[#F1F5F9] rounded-[8px] px-2.5 xs:px-3 sm:px-[12px] py-1 xs:py-1.5 sm:py-[4px] text-[#1A3558] text-[10px] xs:text-xs sm:text-sm md:text-[14px] font-medium mb-3 xs:mb-4 sm:mb-5 text-center">
              Member sejak {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("id-ID") : "1/10/2025"}
            </div>
            <div className="w-full flex flex-col gap-2 sm:gap-3">
              <div className="bg-[#F1F5F9] rounded-[8px] px-3 sm:px-[12px] py-2 sm:py-[10px] flex items-center gap-2">
                <span className="w-5 h-5 sm:w-[22px] sm:h-[22px] bg-[#E3E8EF] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" className="sm:w-4 sm:h-4" fill="#1A3558"><path d="M8 2a3 3 0 0 1 3 3v1a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </span>
                <span className="text-[#1A3558] text-xs sm:text-sm md:text-[15px] font-medium">Akun Terverifikasi</span>
                <span className="text-[#5B6B7E] text-[10px] sm:text-xs md:text-[13px] ml-auto hidden sm:inline">Email terverifikasi</span>
              </div>
              <div className="bg-[#F1F5F9] rounded-[8px] px-3 sm:px-[12px] py-2 sm:py-[10px] flex items-center gap-2">
                <span className="w-5 h-5 sm:w-[22px] sm:h-[22px] bg-[#E3E8EF] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" className="sm:w-4 sm:h-4" fill="#1A3558"><path d="M8 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </span>
                <span className="text-[#1A3558] text-xs sm:text-sm md:text-[15px] font-medium">Status Keanggotaan</span>
                <span className="text-[#5B6B7E] text-[10px] sm:text-xs md:text-[13px] ml-auto hidden sm:inline">Member Regular</span>
              </div>
            </div>
          </div>
          {/* Kanan: Detail & Statistik */}
          <div className="bg-white border border-[#E3E8EF] rounded-[16px] flex-1 py-6 sm:py-8 px-4 sm:px-6 md:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
              <div>
                <h2 className="text-lg sm:text-xl md:text-[22px] font-bold text-[#1A3558]">Informasi Pribadi</h2>
                <p className="text-[#5B6B7E] text-xs sm:text-sm md:text-[15px]">Perbarui informasi pribadi Anda</p>
              </div>
              {!editMode ? (
                <button
                  className="bg-[#1A3558] hover:bg-[#002B50] text-white rounded-[8px] px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5 min-h-[44px] text-xs xs:text-sm sm:text-base font-semibold transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                  onClick={handleEdit}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profil
                </button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    className="bg-[#1A3558] hover:bg-[#002B50] text-white rounded-[8px] px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5 min-h-[44px] text-xs xs:text-sm sm:text-base font-semibold transition-all flex-1 sm:flex-none flex items-center justify-center gap-2"
                    onClick={handleSave}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan
                  </button>
                  <button
                    className="border-2 border-[#E3E8EF] hover:border-[#1A3558] hover:bg-[#F7FAFC] text-[#1A3558] rounded-[8px] px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5 min-h-[44px] text-xs xs:text-sm sm:text-base font-semibold transition-all flex-1 sm:flex-none flex items-center justify-center gap-2"
                    onClick={handleCancel}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Batal
                  </button>
                </div>
              )}
            </div>
            <div className="mb-5 sm:mb-6 md:mb-[24px]">
              <h3 className="text-sm xs:text-base sm:text-[17px] font-semibold text-[#1A3558] mb-3 sm:mb-[12px] flex items-center gap-2">
                <span>
                  <svg width="20" height="20" fill="#1A3558"><circle cx="10" cy="10" r="9" stroke="#E3E8EF" strokeWidth="2" fill="none" /><circle cx="10" cy="8" r="3" fill="#1A3558" /><rect x="7" y="13" width="6" height="2" rx="1" fill="#1A3558" /></svg>
                </span>
                Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-[#5B6B7E] text-xs xs:text-sm sm:text-[14px] mb-1">Nama Lengkap</label>
                  <div className="flex items-center bg-[#F7FAFC] rounded-[8px] px-3 xs:px-[12px] py-2 xs:py-[8px] min-h-[44px]">
                    {/* ...icon... */}
                    {!editMode ? (
                      <span className="text-[#5B6B7E] text-[15px]">{profile?.name || "-"}</span>
                    ) : (
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="text-[#5B6B7E] text-[15px] bg-transparent border-none outline-none flex-1"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-[#5B6B7E] text-xs xs:text-sm sm:text-[14px] mb-1">Email</label>
                  <div className="flex items-center bg-[#F7FAFC] rounded-[8px] px-3 xs:px-[12px] py-2 xs:py-[8px] min-h-[44px]">
                    {/* ...icon... */}
                    {!editMode ? (
                      <span className="text-[#5B6B7E] text-[15px]">{profile?.email || "-"}</span>
                    ) : (
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="text-[#5B6B7E] text-[15px] bg-transparent border-none outline-none flex-1"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-[#5B6B7E] text-xs xs:text-sm sm:text-[14px] mb-1">Nomor Telepon</label>
                  <div className="flex items-center bg-[#F7FAFC] rounded-[8px] px-3 xs:px-[12px] py-2 xs:py-[8px] min-h-[44px]">
                    {/* ...icon... */}
                    {!editMode ? (
                      <span className="text-[#5B6B7E] text-[15px]">{profile?.phone || "-"}</span>
                    ) : (
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="text-[#5B6B7E] text-[15px] bg-transparent border-none outline-none flex-1"
                      />
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#5B6B7E] text-xs xs:text-sm sm:text-[14px] mb-1">Alamat</label>
                  <div className="flex items-center bg-[#F7FAFC] rounded-[8px] px-3 xs:px-[12px] py-2 xs:py-[8px] min-h-[44px]">
                    {/* ...icon... */}
                    {!editMode ? (
                      <span className="text-[#5B6B7E] text-[15px]">{profile?.address || "-"}</span>
                    ) : (
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="text-[#5B6B7E] text-[15px] bg-transparent border-none outline-none flex-1"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm xs:text-base sm:text-[17px] font-semibold text-[#1A3558] mb-3 sm:mb-[12px]">Statistik Akun</h3>
              <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
                <div className="bg-[#F1F5F9] rounded-[12px] px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-8 flex flex-col items-center border border-[#E3E8EF]">
                  <div className="text-xl xs:text-2xl sm:text-3xl md:text-[32px] font-bold text-[#1A3558] mb-1">{completedOrdersCount}</div>
                  <div className="text-[#5B6B7E] text-xs xs:text-sm sm:text-base md:text-[16px] text-center leading-tight">Pesanan Selesai</div>
                </div>
                <div
                  className="bg-[#F1F5F9] rounded-[12px] px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-8 flex flex-col items-center border border-[#E3E8EF] cursor-pointer hover:bg-[#E3E8EF] transition"
                  onClick={() => window.location.href = '/wishlist'}
                  title="Lihat Wishlist"
                >
                  <div className="text-xl xs:text-2xl sm:text-3xl md:text-[32px] font-bold text-[#1A3558] mb-1">{wishlistCount}</div>
                  <div className="text-[#5B6B7E] text-xs xs:text-sm sm:text-base md:text-[16px] text-center leading-tight">Wishlist</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
