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

        setMessage("✅ Login berhasil!");
        setTimeout(() => router.push("/"), 1000);
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
          Verify OTP
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-4">
          Enter the code sent to your email to continue
        </p>

        {/* Inner Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-center text-gray-800">
            OTP Verification
          </h3>
          <p className="text-sm text-center text-gray-500 mb-4">
            Please check your inbox and enter the verification code below
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              One-Time Password (OTP)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your 6-digit OTP code"
              className="border border-gray-300 p-3 w-full mb-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-900 text-white py-2 rounded-md w-full hover:bg-blue-800 transition disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-sm text-center ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-sm text-center mt-4">
            Didn’t receive the code?{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Resend
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}