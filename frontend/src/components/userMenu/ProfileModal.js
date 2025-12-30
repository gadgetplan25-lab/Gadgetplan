// "use client";
// import { Dialog } from "@headlessui/react";

// export default function ProfileModal({ user, onClose }) {
//   return (
//     <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Profil Saya</h2>
//         <div className="space-y-2">
//           <p><strong>Nama:</strong> {user?.name}</p>
//           <p><strong>Email:</strong> {user?.email}</p>
//           <p><strong>Telepon:</strong> {user?.phone}</p>
//           <p><strong>Alamat:</strong> {user?.address}</p>
//         </div>
//         <button onClick={onClose} className="mt-4 bg-blue-900 text-white px-4 py-2 rounded">
//           Tutup
//         </button>
//       </div>
//     </Dialog>
//   );
// }

"use client";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProfileModal({ user, onClose }) {
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    apiFetch("/user/profile/details")
      .then((res) => {
        if (res?.user) setProfile(res.user);
      })
      .catch((err) => console.error("❌ Gagal fetch profil:", err));
  }, []);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Container to center modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Modal content */}
        <Dialog.Panel className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-[#002B50]">Profil Saya</h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <strong className="text-[#002B50] min-w-[100px]">Nama:</strong>
              <span className="text-gray-700">{profile?.name || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <strong className="text-[#002B50] min-w-[100px]">Email:</strong>
              <span className="text-gray-700 break-all">{profile?.email || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <strong className="text-[#002B50] min-w-[100px]">Telepon:</strong>
              <span className="text-gray-700">{profile?.phone || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <strong className="text-[#002B50] min-w-[100px]">Alamat:</strong>
              <span className="text-gray-700">{profile?.address || '-'}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full sm:w-auto bg-[#002B50] hover:bg-[#003d73] text-white px-6 py-2.5 rounded-lg transition-colors min-h-[44px]"
          >
            Tutup
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
