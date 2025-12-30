// "use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { useState } from "react";
// import ProductForm from "./ProductForm";
// import Swal from "sweetalert2";
// import { apiFetch } from "@/lib/api";

// export default function ProductCard({ product, onDeleted, onUpdated }) {
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   const handleDelete = async () => {
//     const result = await Swal.fire({
//       title: "Apakah Anda yakin?",
//       text: "Produk ini akan dihapus secara permanen!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Ya, hapus!",
//       cancelButtonText: "Batal",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const res = await apiFetch(`/admin/product/${product.id}`, { method: "DELETE" });
//       const data = await res.json();

//       if (res.ok) {
//         Swal.fire("Berhasil!", data.message, "success");
//         onDeleted();
//       } else {
//         Swal.fire("Gagal!", data.message || "Gagal menghapus produk", "error");
//       }
//     } catch (err) {
//       console.error("Gagal hapus produk", err);
//       Swal.fire("Error", "Terjadi kesalahan server", "error");
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
//       {product.ProductImages?.length > 0 ? (
//         <Swiper spaceBetween={10} slidesPerView={1}>
//           {product.ProductImages.map((img) => (
//             <SwiperSlide key={img.id}>
//               <img
//                 src={`http://localhost:4000/public/products/${img.image_url}`}
//                 alt={product.name}
//                 className="w-full h-40 object-cover"
//                 crossOrigin="anonymous"
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       ) : (
//         <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
//           No Image
//         </div>
//       )}
//       <div className="p-4">
//         <h2 className="font-bold text-lg text-blue-900">{product.name}</h2>
//         {/* <p className="text-sm text-gray-600">{product.description}</p> */}
//         <p className="text-blue-700 font-semibold mt-2">
//           Rp {product.price.toLocaleString("id-ID")}
//         </p>
//         <p className="text-sm text-gray-500">Stok: {product.stock}</p>
//         <p className="text-sm text-gray-500">
//           Kategori: {product.Category?.name || "-"}
//         </p>

//         {/* Tombol aksi */}
//         <div className="flex justify-between mt-4 cursor-pointer">
//           <button
//             onClick={() => setIsEditOpen(true)}
//             className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
//           >
//             Edit
//           </button>
//           <button
//             onClick={handleDelete}
//             className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       {isEditOpen && (
//         <ProductForm
//           product={product}
//           onClose={() => setIsEditOpen(false)}
//           onUpdated={onUpdated}
//         />
//       )}
//     </div>
//   );
// }


"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState } from "react";
import ProductForm from "./ProductForm";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";

export default function ProductCard({ product, onDeleted, onUpdated }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Produk ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const data = await apiFetch(`/admin/product/${product.id}`, { method: "DELETE" });
      Swal.fire("Berhasil!", data.message, "success");
      onDeleted();
    } catch (err) {
      console.error("Gagal hapus produk", err);
      Swal.fire("Error", "Terjadi kesalahan server", "error");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      {product.ProductImages?.length > 0 ? (
        <Swiper spaceBetween={10} slidesPerView={1}>
          {product.ProductImages.map((img) => (
            <SwiperSlide key={img.id}>
              <img
                src={`http://localhost:4000/public/products/${img.image_url}`}
                alt={product.name}
                className="w-full h-40 object-cover"
                crossOrigin="anonymous"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      <div className="p-4">
        <h2 className="font-bold text-lg text-blue-900">{product.name}</h2>
        <p className="text-blue-700 font-semibold mt-2">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
        <p className="text-sm text-gray-500">Stok: {product.stock}</p>
        <p className="text-sm text-gray-500">
          Kategori: {product.Category?.name || "-"}
        </p>

        <div className="flex justify-between mt-4 cursor-pointer">
          <button
            onClick={() => setIsEditOpen(true)}
            className="bg-slate-100 text-slate-700 font-bold border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditOpen && (
        <ProductForm
          product={product}
          onClose={() => setIsEditOpen(false)}
          onUpdated={onUpdated}
        />
      )}
    </div>
  );
}
