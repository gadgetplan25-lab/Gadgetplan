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
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";
import LoadingAnimation from "@/components/loadingAnimation";

export default function VerifyOtpPage() {
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
    <main className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900 relative">
      {/* Overlay loading */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900 border-solid"></div>
        </div>
      )}

      {/* Outer Card */}
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Verifikasi OTP
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-4">
          Masukkan kode OTP yang dikirim ke email <br />
          <span className="font-semibold text-blue-800">{email}</span>
        </p>

        {/* Inner Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
            Aktivasi Akun Kamu
          </h3>
          <p className="text-sm text-center text-gray-500 mb-4">
            Silakan masukkan kode OTP untuk melanjutkan
          </p>

          {message && (
            <div className="mb-3 text-center text-red-600 text-sm font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kode OTP
            </label>
            <input
              type="text"
              placeholder="Masukkan kode OTP"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 p-3 w-full mb-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest font-semibold"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-900 text-white py-2 rounded-md w-full hover:bg-blue-800 transition disabled:opacity-70"
            >
              {loading ? "Memverifikasi..." : "Verifikasi Akun"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Sudah punya akun?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Login di sini
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
