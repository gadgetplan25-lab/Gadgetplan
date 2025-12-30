// "use client";
// import { useState } from "react";
// import Swal from "sweetalert2";
// import { apiFetch } from "@/lib/api";

// export default function ProductForm({ product, onClose, onUpdated }) {
//   const [form, setForm] = useState({
//     name: product.name,
//     price: product.price,
//     description: product.description,
//     stock: product.stock,
//     category_id: product.category_id,
//   });
//   const [images, setImages] = useState([]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setImages(Array.from(e.target.files));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     Object.keys(form).forEach((key) => {
//       formData.append(key, form[key]);
//     });

//     images.forEach((file) => {
//       formData.append("images", file);
//     });

//     try {
//       const res = await apiFetch(`/admin/product/${product.id}`, {
//         method: "PUT",
//         body: formData,
//         credentials: "include",
//       });
//       const data = await res.json();

//       if (res.ok) {
//         Swal.fire({
//           icon: "success",
//           title: "Berhasil!",
//           text: data.message,
//           timer: 2000,
//           showConfirmButton: false,
//         }).then(() => {
//           onUpdated();
//           onClose();
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Gagal",
//           text: data.message || "Terjadi kesalahan",
//         });
//       }
//     } catch (err) {
//       console.error("Gagal update produk", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Tidak dapat terhubung ke server",
//       });
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
//         <h2 className="text-xl font-bold mb-4">Edit Produk</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Nama Produk"
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="number"
//             name="price"
//             value={form.price}
//             onChange={handleChange}
//             placeholder="Harga"
//             className="w-full border p-2 rounded"
//           />
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Deskripsi"
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="number"
//             name="stock"
//             value={form.stock}
//             onChange={handleChange}
//             placeholder="Stok"
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="number"
//             name="category_id"
//             value={form.category_id}
//             onChange={handleChange}
//             placeholder="Kategori ID"
//             className="w-full border p-2 rounded"
//           />

//           <div className="flex gap-2 flex-wrap">
//             {product.ProductImages?.map((img) => (
//               <img
//                 key={img.id}
//                 src={`http://localhost:4000/public/products/${img.image_url}`}
//                 alt=""
//                 className="w-16 h-16 object-cover border rounded"
//                 crossOrigin="anonymous"
//               />
//             ))}
//           </div>

//           <input
//             type="file"
//             multiple
//             onChange={handleFileChange}
//             className="w-full"
//           />

//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-400 text-white px-4 py-2 rounded"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Simpan
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";

export default function ProductForm({ product, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    stock: product.stock,
    category_id: product.category_id,
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((file) => formData.append("images", file));

    try {
      const data = await apiFetch(`/admin/product/${product.id}`, {
        method: "PUT",
        body: formData,
      });
      Swal.fire({ icon: "success", title: "Berhasil!", text: data.message, timer: 2000, showConfirmButton: false }).then(() => {
        onUpdated();
        onClose();
      });
    } catch (err) {
      console.error("Gagal update produk", err);
      Swal.fire({ icon: "error", title: "Error", text: "Tidak dapat terhubung ke server" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
        <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama Produk" className="w-full border p-2 rounded" />
          <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Harga" className="w-full border p-2 rounded" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="w-full border p-2 rounded" />
          <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Stok" className="w-full border p-2 rounded" />
          <input type="number" name="category_id" value={form.category_id} onChange={handleChange} placeholder="Kategori ID" className="w-full border p-2 rounded" />

          {product.ProductImages?.map((img) => (
            <img key={img.id} src={`http://localhost:4000/public/products/${img.image_url}`} alt="" className="w-16 h-16 object-cover border rounded" crossOrigin="anonymous" />
          ))}

          <input type="file" multiple onChange={handleFileChange} className="w-full" />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Batal</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
