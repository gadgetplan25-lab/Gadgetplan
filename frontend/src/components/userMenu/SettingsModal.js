// "use client";
// import { Dialog } from "@headlessui/react";
// import { useState } from "react";
// import { apiFetch } from "@/lib/api";

// export default function SettingsModal({ user, onClose }) {
//   const [form, setForm] = useState({
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     address: user.address,
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSave = async () => {
//     await apiFetch(`/users/settings`, {
//       method: "PUT",
//       body: JSON.stringify(form),
//     });
//     alert("Profil diperbarui!");
//     onClose();
//   };

//   return (
//     <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Pengaturan Akun</h2>
//         <div className="space-y-3">
//           {["name", "email", "phone", "address"].map((field) => (
//             <div key={field}>
//               <label className="block text-sm font-medium capitalize">{field}</label>
//               <input
//                 name={field}
//                 value={form[field]}
//                 onChange={handleChange}
//                 className="border rounded w-full px-3 py-2 mt-1"
//               />
//             </div>
//           ))}
//         </div>
//         <div className="mt-4 flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2 border rounded">Batal</button>
//           <button onClick={handleSave} className="px-4 py-2 bg-blue-900 text-white rounded">Simpan</button>
//         </div>
//       </div>
//     </Dialog>
//   );
// }

"use client";
import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

export default function SettingsModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Ambil data user saat modal dibuka
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiFetch("/user/profile/details", {
          method: "GET",
        });
        if (res.success && res.user) {
          setForm({
            name: res.user.name || "",
            email: res.user.email || "",
            phone: res.user.phone || "",
            address: res.user.address || "",
          });
        }
      } catch (err) {
        console.error("❌ Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await apiFetch("/user/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      if (res.success) {
        alert("✅ Profil berhasil diperbarui!");
        onClose();
      } else {
        alert("⚠️ Gagal memperbarui profil!");
      }
    } catch (err) {
      console.error("❌ Gagal menyimpan:", err);
      alert("Terjadi kesalahan saat menyimpan perubahan!");
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Pengaturan Akun</h2>

        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : (
          <div className="space-y-3">
            {["name", "email", "phone", "address"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="border rounded w-full px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Simpan
          </button>
        </div>
      </div>
    </Dialog>
  );
}
