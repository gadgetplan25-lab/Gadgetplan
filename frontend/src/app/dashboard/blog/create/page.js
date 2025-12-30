// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api";
// import Swal from "sweetalert2";

// export default function CreateBlogPage() {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [banner, setBanner] = useState(null);
//   const [bannerPreview, setBannerPreview] = useState(null);
//   const [contents, setContents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const addContentBlock = (type) => setContents([...contents, { type, value: "", file: null, preview: null }]);
//   const removeContentBlock = (i) => setContents(contents.filter((_, idx) => idx !== i));
//   const handleContentChange = (i, val) => { const newContents = [...contents]; newContents[i].value = val; setContents(newContents); };
//   const handleFileChange = (i, file) => { if(!file) return; if(file.size>2*1024*1024) return Swal.fire("Gagal!","Ukuran gambar maksimal 2MB","error"); const newContents = [...contents]; newContents[i].file=file; newContents[i].preview=URL.createObjectURL(file); setContents(newContents); };
//   const handleBannerChange = (file) => { if(!file) return; if(file.size>2*1024*1024) return Swal.fire("Gagal!","Ukuran banner maksimal 2MB","error"); setBanner(file); setBannerPreview(URL.createObjectURL(file)); };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if(!title.trim()) return Swal.fire("Gagal!","Judul wajib diisi","error");
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       if(banner) formData.append("banner", banner);
//       contents.forEach(c => { if(c.type==="image" && c.file) formData.append("images", c.file); });
//       const textContents = contents.filter(c=>c.type==="text").map(c=>({value:c.value}));
//       formData.append("content", JSON.stringify(textContents));
//       await apiFetch("/blogs", { method: "POST", body: formData });
//       Swal.fire("Berhasil!","Blog berhasil dibuat","success").then(()=>router.push("/dashboard/blog"));
//     } catch(err) {
//       console.error(err);
//       Swal.fire("Gagal!","Blog gagal dibuat","error");
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
//       <h1 className="text-2xl font-bold mb-4">Tambah Blog</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block font-semibold mb-1">Judul</label>
//           <input type="text" className="w-full border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} required />
//         </div>

//         <div>
//           <label className="block font-semibold mb-1">Banner</label>
//           <div className="border-dashed border-2 border-gray-400 rounded p-4 text-center cursor-pointer"
//                onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault(); if(e.dataTransfer.files.length>0) handleBannerChange(e.dataTransfer.files[0]);}}>
//             <input type="file" accept="image/*" className="hidden" id="bannerInput" onChange={e=>handleBannerChange(e.target.files[0])}/>
//             <label htmlFor="bannerInput" className="cursor-pointer">{bannerPreview ? <img src={bannerPreview} alt="Banner" className="mx-auto max-h-48 rounded"/> : <p>Drag & drop banner atau klik untuk pilih</p>}</label>
//           </div>
//         </div>

//         <div>
//           <label className="block font-semibold mb-1">Konten</label>
//           <div className="space-y-3">
//             {contents.map((c,i)=>(
//               <div key={i} className="border p-3 rounded relative">
//                 {c.type==="text" ? <textarea className="w-full border rounded p-2" rows={3} placeholder="Tulis teks..." value={c.value} onChange={e=>handleContentChange(i,e.target.value)}/> :
//                   <div className="border-dashed border-2 border-gray-400 rounded p-4 text-center cursor-pointer"
//                        onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault(); if(e.dataTransfer.files.length>0) handleFileChange(i,e.dataTransfer.files[0]);}}>
//                     <input type="file" accept="image/*" className="hidden" id={`imageInput-${i}`} onChange={e=>handleFileChange(i,e.target.files[0])}/>
//                     <label htmlFor={`imageInput-${i}`} className="cursor-pointer">{c.preview ? <img src={c.preview} alt="Preview" className="mx-auto max-h-48 rounded"/> : <p>Drag & drop gambar atau klik</p>}</label>
//                   </div>}
//                 <button type="button" onClick={()=>removeContentBlock(i)} className="absolute top-2 right-2 text-red-500 font-bold">✕</button>
//               </div>
//             ))}
//           </div>
//           <div className="flex gap-2 mt-2">
//             <button type="button" onClick={()=>addContentBlock("text")} className="px-3 py-1 bg-gray-600 text-white rounded">+ Teks</button>
//             <button type="button" onClick={()=>addContentBlock("image")} className="px-3 py-1 bg-gray-600 text-white rounded">+ Gambar</button>
//           </div>
//         </div>

//         <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Menyimpan..." : "Simpan Blog"}</button>
//       </form>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);

  const addContentBlock = (type) =>
    setContents([...contents, { type, value: "", file: null, preview: null }]);

  const removeContentBlock = (i) =>
    setContents(contents.filter((_, idx) => idx !== i));

  const handleContentChange = (i, val) => {
    const newContents = [...contents];
    newContents[i].value = val;
    setContents(newContents);
  };

  const handleFileChange = (i, file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024)
      return Swal.fire("Gagal!", "Ukuran gambar maksimal 2MB", "error");
    const newContents = [...contents];
    newContents[i].file = file;
    newContents[i].preview = URL.createObjectURL(file);
    setContents(newContents);
  };

  const handleBannerChange = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024)
      return Swal.fire("Gagal!", "Ukuran banner maksimal 2MB", "error");
    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim())
      return Swal.fire("Gagal!", "Judul wajib diisi", "error");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      if (banner) formData.append("banner", banner);

      // mapping konten sesuai urutan
      const mappedContents = contents
        .map((c, idx) => {
          if (c.type === "text") {
            return { type: "text", value: c.value };
          } else if (c.type === "image" && c.file) {
            formData.append("images", c.file); // kumpulkan semua image
            return { type: "image" }; // backend akan ambil berurutan
          }
          return null;
        })
        .filter(Boolean);

      formData.append("content", JSON.stringify(mappedContents));

      await apiFetch("/blogs", { method: "POST", body: formData });

      Swal.fire("Berhasil!", "Blog berhasil dibuat", "success").then(() =>
        router.push("/dashboard/blog")
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal!", "Blog gagal dibuat", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Tambah Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Judul */}
        <div>
          <label className="block font-semibold mb-1">Judul</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block font-semibold mb-1">Banner</label>
          <div
            className="border-dashed border-2 border-gray-400 rounded p-4 text-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length > 0)
                handleBannerChange(e.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="bannerInput"
              onChange={(e) => handleBannerChange(e.target.files[0])}
            />
            <label htmlFor="bannerInput" className="cursor-pointer">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner"
                  className="mx-auto max-h-48 rounded"
                />
              ) : (
                <p>Drag & drop banner atau klik untuk pilih</p>
              )}
            </label>
          </div>
        </div>

        {/* Konten */}
        <div>
          <label className="block font-semibold mb-1">Konten</label>
          <div className="space-y-3">
            {contents.map((c, i) => (
              <div key={i} className="border p-3 rounded relative">
                {c.type === "text" ? (
                  <textarea
                    className="w-full border rounded p-2"
                    rows={3}
                    placeholder="Tulis teks..."
                    value={c.value}
                    onChange={(e) => handleContentChange(i, e.target.value)}
                  />
                ) : (
                  <div
                    className="border-dashed border-2 border-gray-400 rounded p-4 text-center cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files.length > 0)
                        handleFileChange(i, e.dataTransfer.files[0]);
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`imageInput-${i}`}
                      onChange={(e) => handleFileChange(i, e.target.files[0])}
                    />
                    <label
                      htmlFor={`imageInput-${i}`}
                      className="cursor-pointer"
                    >
                      {c.preview ? (
                        <img
                          src={c.preview}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded"
                        />
                      ) : (
                        <p>Drag & drop gambar atau klik</p>
                      )}
                    </label>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeContentBlock(i)}
                  className="absolute top-2 right-2 text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => addContentBlock("text")}
              className="px-3 py-1 bg-gray-600 text-white rounded"
            >
              + Teks
            </button>
            <button
              type="button"
              onClick={() => addContentBlock("image")}
              className="px-3 py-1 bg-gray-600 text-white rounded"
            >
              + Gambar
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Menyimpan..." : "Simpan Blog"}
        </button>
      </form>
    </div>
  );
}
