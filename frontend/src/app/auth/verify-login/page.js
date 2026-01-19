// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api";

// export default function VerifyLoginPage() {
//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const userId = localStorage.getItem("pendingUserId"); // ambil dari localStorage
//       if (!userId) throw new Error("UserId tidak ditemukan");

//       const data = await apiFetch("/auth/verify-login-otp", {
//         method: "POST",
//         body: JSON.stringify({ userId, code: otp }), // kirim lewat body
//       });

//       if (data?.token) {
//         localStorage.removeItem("pendingUserId"); // bersihkan
//         localStorage.setItem("token", data.token);

//         setMessage("✅ Login berhasil!");
//         setTimeout(() => router.push("/home"), 1000);
//       }
//     } catch (err) {
//       setMessage(`❌ ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg p-6 rounded-xl w-96 border border-black"
//       >
//         <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">
//           Verifikasi OTP Login
//         </h1>

//         <input
//           type="text"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           placeholder="Masukkan kode OTP"
//           className="border border-black p-2 w-full mb-4 rounded text-gray-900"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-900 text-white py-2 px-4 rounded w-full hover:bg-blue-800 disabled:opacity-70"
//         >
//           {loading ? "Memverifikasi..." : "Verifikasi"}
//         </button>

//         {message && (
//           <p className="mt-4 text-sm text-center text-red-600">{message}</p>
//         )}
//       </form>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";

export default function VerifyLoginPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const userId = localStorage.getItem("pendingUserId");
      if (!userId) throw new Error("UserId tidak ditemukan");

      const data = await apiFetch("/auth/verify-login-otp", {
        method: "POST",
        body: JSON.stringify({ userId, code: otp }),
      });

      if (data?.token) {
        localStorage.removeItem("pendingUserId");
        localStorage.setItem("token", data.token);

        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Anda akan diarahkan ke halaman utama.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => router.push("/"));
      }
    } catch (err) {
      setMessage(err.message || "OTP salah / kadaluarsa");
    } finally {
      setLoading(false);
    }
  };

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
            Masukkan kode yang dikirim ke email Anda
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
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Masukkan 6 digit kode OTP"
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
            {loading ? "Memverifikasi..." : "Verifikasi OTP →"}
          </button>
        </form>


      </div>
    </main>
  );
}
