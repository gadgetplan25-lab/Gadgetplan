"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import LoadingAnimation from "@/components/loadingAnimation";
import Swal from "sweetalert2";
import { HiMail, HiLockClosed } from "react-icons/hi";
import ShiningText from "@/components/shiningText";
import ShiningLogo from "@/components/shiningLogo";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (process.env.NODE_ENV === 'development') {

      }

      if (res?.message?.toLowerCase().includes("berhasil")) {
        if (process.env.NODE_ENV === 'development') {

        }

        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Selamat datang kembali!",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // Cek role terlebih dahulu
          if (res.user?.role === "admin") {
            // Admin selalu ke dashboard, abaikan redirectPath
            sessionStorage.removeItem("redirectAfterLogin");
            router.push("/dashboard");
          } else {
            // Customer: cek apakah ada redirect path dari session expired
            const redirectPath = sessionStorage.getItem("redirectAfterLogin");

            if (redirectPath) {
              // Hapus dari sessionStorage dan redirect ke halaman sebelumnya
              sessionStorage.removeItem("redirectAfterLogin");
              router.push(redirectPath);
            } else {
              router.push("/");
            }
          }
        });
        return;
      }

      if (res?.message?.includes("OTP") && res?.userId) {
        localStorage.setItem("pendingUserId", res.userId);
        Swal.fire({
          icon: "info",
          title: "Verifikasi OTP",
          text: "Kode OTP telah dikirim ke email kamu.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => router.push("/auth/verify-login"));
        return;
      }

      throw new Error(res?.message || "Login gagal.");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#002B50]">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen bg-white">
      {/* LEFT SIDE: Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#f7fbfd] relative items-center justify-center overflow-hidden">
        <div className="relative z-10 px-16 py-12 text-center max-w-full flex flex-col items-center justify-center h-full">
          {/* GadgetPlan Text with Shining Effect */}
          <h2 className="font-extrabold tracking-tight leading-none mb-4" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}>
            <ShiningText text="GadgetPlan" duration={6} className="font-extrabold" />
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg lg:text-xl text-[#002B50] font-medium max-w-lg leading-relaxed text-center mt-6">
            Toko & Service iPhone Premium Terpercaya
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-gray-50 relative">
        {/* Overlay loading */}
        {loading && (
          <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#002B50] border-t-transparent"></div>
              <span className="text-sm font-semibold text-[#002B50]">Memverifikasi...</span>
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Mobile Logo - Only visible on small screens */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-extrabold">
              <ShiningText text="GadgetPlan" duration={6} className="!text-3xl font-extrabold" />
            </h2>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              <ShiningText text="Sign In" duration={6} className="!text-3xl font-bold" />
            </h1>
            <p className="mt-3 pt-4 text-sm text-gray-600">
              Akses akun Anda untuk belanja produk dan layanan service iPhone premium
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002B50] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002B50] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#002B50] hover:bg-[#003b6e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002B50] transition-all hover:shadow-lg"
            >
              Sign In
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <a href="/auth/register" className="font-semibold text-red-600 hover:text-red-700 hover:underline">
              Daftar
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}