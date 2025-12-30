"use client";
import { useAuthGuard } from "@/hook/useAuthGuard";
import LoadingAnimation from "@/components/loadingAnimation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";

export default function PengaturanPage() {
  const { loading } = useAuthGuard();
  const router = useRouter();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Semua field harus diisi!',
        didOpen: () => {
          if (window.innerWidth < 640) {
            const popup = document.querySelector('.swal2-popup');
            const title = document.querySelector('.swal2-title');
            const content = document.querySelector('.swal2-html-container');
            const confirmBtn = document.querySelector('.swal2-confirm');
            const icon = document.querySelector('.swal2-icon');

            if (popup) popup.style.fontSize = '10px';
            if (title) { title.style.fontSize = '12px'; title.style.marginBottom = '4px'; }
            if (content) { content.style.fontSize = '10px'; content.style.lineHeight = '1.3'; }
            if (confirmBtn) { confirmBtn.style.fontSize = '11px'; confirmBtn.style.padding = '6px 12px'; }
            if (icon) icon.style.transform = 'scale(0.7)';
          }
        }
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password baru dan konfirmasi password tidak cocok!'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password baru minimal 6 karakter!'
      });
      return;
    }

    try {
      const response = await apiFetch('/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Password berhasil diubah',
          timer: 1500,
          showConfirmButton: false
        });

        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: response.message || 'Password saat ini salah atau terjadi kesalahan'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat mengubah password'
      });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout dari Sesi Ini?',
      text: "Anda akan keluar dari akun Anda",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1A3558',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear token from localStorage
        localStorage.removeItem('token');

        Swal.fire({
          icon: 'success',
          title: 'Berhasil Logout',
          text: 'Anda telah keluar dari akun',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Redirect to login
          router.push('/login');
        });
      }
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#002B50]">
      <LoadingAnimation />
    </div>
  );
  return (
    <>
      <Navbar />
      <div className="bg-[#F7FAFC] container mx-auto px-4 py-4 sm:py-6 md:py-8 pb-8 sm:pb-10">
        <div className="">
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-[2rem] lg:text-[2.2rem] font-bold text-[#1A3558] mb-1 sm:mb-2">
            Pengaturan Akun
          </h1>
          <p className="text-[#5B6B7E] mb-3 xs:mb-4 sm:mb-6 text-[10px] xs:text-xs sm:text-sm md:text-[15px] lg:text-[16px]">
            Kelola password, keamanan, dan pengaturan akun Anda
          </p>
          {/* Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E3E8EF] p-3 xs:p-4 sm:p-6 md:p-8 shadow-sm">
            {/* Section: Akun & Keamanan */}
            <h2 className="text-[#1A3558] font-bold text-sm xs:text-base sm:text-lg md:text-[18px] mb-1 sm:mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Akun & Keamanan
            </h2>
            <p className="text-[#5B6B7E] mb-4 sm:mb-6 text-[10px] xs:text-xs sm:text-sm md:text-[14px] lg:text-[15px]">
              Ubah password dan kelola sesi login Anda
            </p>
            {/* Ubah Password */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-[#1A3558] mb-2 sm:mb-3 text-xs xs:text-sm sm:text-base md:text-[16px]">Ubah Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 mb-4">
                <div>
                  <label className="block text-[#5B6B7E] mb-1 text-xs xs:text-sm sm:text-[15px]">Password Saat Ini</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Masukkan password saat ini"
                    className="w-full border border-[#E3E8EF] rounded-[8px] px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-[15px] bg-[#F8FAFC] focus:outline-none focus:border-[#1A3558] transition-colors min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6B7E] mb-1 text-xs xs:text-sm sm:text-[15px]">Password Baru</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Masukkan password baru"
                    className="w-full border border-[#E3E8EF] rounded-[8px] px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-[15px] bg-[#F8FAFC] focus:outline-none focus:border-[#1A3558] transition-colors min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6B7E] mb-1 text-xs xs:text-sm sm:text-[15px]">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Konfirmasi password baru"
                    className="w-full border border-[#E3E8EF] rounded-[8px] px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-[15px] bg-[#F8FAFC] focus:outline-none focus:border-[#1A3558] transition-colors min-h-[44px]"
                  />
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                className="bg-[#1A3558] hover:bg-[#002B50] text-white px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-3.5 rounded-[8px] font-semibold text-xs xs:text-sm sm:text-[15px] transition-all min-h-[44px] flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Ubah Password
              </button>
            </div>
            {/* Login Sessions */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-[#1A3558] mb-2 sm:mb-3 text-xs xs:text-sm sm:text-base md:text-[16px]">Login Sessions</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 xs:gap-4 sm:gap-5">
                <div className="w-full md:flex-1 flex items-center gap-2 border border-[#E3E8EF] rounded-[8px] px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 bg-[#F8FAFC] min-h-[44px]">
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 text-[#1A3558] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <span className="text-[#1A3558] font-medium text-xs xs:text-sm sm:text-[15px] block">Chrome on Windows</span>
                    <span className="text-[#5B6B7E] text-[10px] xs:text-xs sm:text-[13px] block">Jakarta, Indonesia - Session aktif</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-[#1A3558] hover:bg-[#002B50] text-white px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-[8px] font-semibold text-xs xs:text-sm sm:text-[15px] transition-all min-h-[44px] flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
            {/* Manajemen Akun */}
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4 xs:p-5 sm:p-6 mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <svg className="w-5 h-5 xs:w-6 xs:h-6 text-[#DC2626] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-semibold text-[#DC2626] text-sm xs:text-base sm:text-[16px]">Hapus Akun</span>
              </div>
              <p className="text-[#DC2626] text-[10px] xs:text-xs sm:text-sm md:text-[15px] mb-2 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen.
              </p>
              <button className="bg-white border-2 border-[#DC2626] text-[#DC2626] px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-[8px] font-semibold text-xs xs:text-sm sm:text-[15px] hover:bg-[#FEF2F2] transition-all min-h-[44px] flex items-center justify-center gap-2 w-full sm:w-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus Akun Saya
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
