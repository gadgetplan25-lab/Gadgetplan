"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import LoadingAnimation from "@/components/loadingAnimation";
import Swal from "sweetalert2";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [step, setStep] = useState("email");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Cek apakah ada redirect dari session expired
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      setSessionExpired(true);
      // Tampilkan alert sesi habis
      Swal.fire({
        icon: "warning",
        title: "Sesi Habis",
        text: "Sesi login Anda telah habis. Silakan login kembali.",
        confirmButtonText: "OK",
        confirmButtonColor: "#1e3a8a",
      });
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch("/auth/check-email", {
        method: "POST",
        body: JSON.stringify({ email: form.email }),
      });

      if (res?.message?.includes("valid")) {
        setStep("password");
      } else {
        Swal.fire("Error", res?.message || "Email tidak ditemukan", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

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
        console.log("Login response:", res);
      }

      if (res?.message?.toLowerCase().includes("berhasil")) {
        if (process.env.NODE_ENV === 'development') {
          console.log("User role:", res.user?.role);
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
    <main className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900 relative">
      {/* Overlay loading */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900 border-solid"></div>
        </div>
      )}

      {/* Outer Card */}
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 w-full max-w-md mx-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Sign In</h1>
        <p className="text-center text-sm sm:text-base text-gray-500 mt-1 mb-3 sm:mb-4">
          Enter your credentials to access your account
        </p>

        {/* Inner Card */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-center text-gray-800">
            Sign in to My Application
          </h3>
          <p className="text-xs sm:text-sm text-center text-gray-500 mb-3 sm:mb-4">
            Welcome back! Please sign in to continue
          </p>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => Swal.fire("Info", "Google Sign-In belum diimplementasi", "info")}
            className="w-full flex items-center justify-center gap-2 border rounded-md py-2.5 min-h-[44px] hover:bg-gray-100 transition mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <FaGoogle className="text-red-500" />
            <span className="font-medium text-gray-700">
              Continue with Google
            </span>
          </button>

          {/* OR separator */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <form onSubmit={step === "email" ? handleCheckEmail : handleLogin}>
            {step === "email" && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full mb-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-900 text-white py-2 rounded-md w-full hover:bg-blue-800 transition"
                >
                  Continue →
                </button>
              </>
            )}

            {step === "password" && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full mb-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-900 text-white py-2 rounded-md w-full hover:bg-blue-800 transition"
                >
                  Continue →
                </button>
              </>
            )}
          </form>
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <a href="/auth/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}