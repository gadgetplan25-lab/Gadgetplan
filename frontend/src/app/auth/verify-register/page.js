// "use client";
// import { useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axios from "axios";

// export default function VerifyOtpPage() {
//   const [code, setCode] = useState("");
//   const [message, setMessage] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:4000/api/auth/verify-register-otp", {
//         email,
//         code,
//       });
//       setMessage(res.data.message);
//       if (res.data.success) {
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.message || "OTP salah / kadaluarsa");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md w-96"
//       >
//         <h2 className="text-2xl font-bold mb-4">Verifikasi OTP</h2>
//         <p className="mb-3 text-gray-600">
//           Masukkan kode OTP yang dikirim ke email <b>{email}</b>
//         </p>
//         {message && <p className="mb-3 text-red-500">{message}</p>}
//         <input
//           type="text"
//           placeholder="Masukkan OTP"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           className="w-full p-2 border rounded mb-3"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//         >
//           Verifikasi
//         </button>
//       </form>
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axios from "axios";

// export default function VerifyOtpPage() {
//   const [code, setCode] = useState("");
//   const [message, setMessage] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email"); // sekarang tidak null lagi

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:4000/api/auth/verify-register-otp", {
//         email,
//         code,
//       });
//       setMessage(res.data.message);
//       if (res.data.success) {
//         setTimeout(() => router.push("/auth/login"), 2000);
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.message || "OTP salah / kadaluarsa");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md w-96"
//       >
//         <h2 className="text-2xl font-bold mb-4">Verifikasi OTP</h2>
//         <p className="mb-3 text-gray-600">
//           Masukkan kode OTP yang dikirim ke email <b>{email}</b>
//         </p>
//         {message && <p className="mb-3 text-red-500">{message}</p>}
//         <input
//           type="text"
//           placeholder="Masukkan OTP"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           className="w-full p-2 border rounded mb-3"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//         >
//           Verifikasi
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";
import LoadingAnimation from "@/components/loadingAnimation";

function VerifyOtpContent() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await apiFetch("/auth/verify-register-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
          code,
        }),
      });

      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Verifikasi Berhasil",
          text: "Akun kamu telah aktif. Silakan login.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => router.push("/auth/login"));
      } else {
        setMessage(res.message || "OTP salah / kadaluarsa");
      }
    } catch (err) {
      setMessage(err.message || "OTP salah / kadaluarsa");
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
    <main className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 relative">
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
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#002B50] mb-3">
            Verifikasi OTP
          </h1>
          <p className="text-sm text-gray-600">
            Masukkan kode OTP yang dikirim ke email
          </p>
          <p className="text-sm font-semibold text-[#002B50] mt-2">
            {email}
          </p>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#002B50] mb-2">
            Aktivasi Akun Kamu
          </h2>
          <p className="text-sm text-gray-600">
            Silakan masukkan kode OTP untuk melanjutkan
          </p>
        </div>

        {/* Error Message */}
        {message && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-center text-red-600 text-sm font-medium">
              {message}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kode OTP
            </label>
            <input
              type="text"
              placeholder="Masukkan kode OTP"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-center tracking-widest text-lg font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002B50] focus:border-transparent transition-all"
              required
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#002B50] text-white py-3.5 rounded-lg font-medium hover:bg-[#003b6e] transition disabled:opacity-70"
          >
            {loading ? "Memverifikasi..." : "Verifikasi Akun"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Sudah punya akun?{" "}
          <a href="/auth/login" className="font-semibold text-red-600 hover:text-red-700 hover:underline">
            Login di sini
          </a>
        </p>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-[#002B50]">
        <LoadingAnimation />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}

