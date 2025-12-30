// "use client";
// import React from "react";

// export default function FilterContent({
//   searchQuery,
//   setSearchQuery,
//   categories,
//   selectedCategories,
//   tags,
//   selectedTags,
//   colors,
//   selectedColors,
//   storages,
//   selectedStorages,
//   handleCheckbox,
// }) {
//   return (
//     <div className="w-full max-w-[240px] rounded-xl shadow-md border border-gray-200 overflow-hidden bg-white">
//       {/* Search */}
//       <div className="p-4">
//         <input
//           type="text"
//           placeholder="Cari produk..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#002B50] text-sm text-[#002B50]"
//         />
//       </div>

//       <div className="p-4 space-y-6">
//         {/* Kategori */}
//         <div>
//           <h2 className="font-semibold mb-2 text-[#002B50] text-sm">Kategori</h2>
//           <div className="space-y-1">
//             {categories.map((cat) => (
//               <label
//                 key={cat.id}
//                 className="flex items-center gap-2 text-[#002B50] text-sm cursor-pointer"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedCategories.includes(cat.id)}
//                   onChange={() => handleCheckbox(cat.id, setSelectedCategories, selectedCategories)}
//                   className="accent-[#002B50] w-4 h-4"
//                 />
//                 {cat.name}
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Kondisi */}
//         <div>
//           <h2 className="font-semibold mb-2 text-[#002B50] text-sm">Kondisi</h2>
//           <div className="space-y-1">
//             {tags.length > 0 ? (
//               tags.map((tag) => (
//                 <label
//                   key={tag.id}
//                   className="flex items-center gap-2 text-[#002B50] text-sm cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedTags.includes(tag.id)}
//                     onChange={() => handleCheckbox(tag.id, setSelectedTags, selectedTags)}
//                     className="accent-[#002B50] w-4 h-4"
//                   />
//                   {tag.name}
//                 </label>
//               ))
//             ) : (
//               <span className="text-gray-400 text-xs">Tidak ada data kondisi</span>
//             )}
//           </div>
//         </div>

//         {/* Warna */}
//         <div>
//           <h2 className="font-semibold mb-2 text-[#002B50] text-sm">Warna</h2>
//           <div className="space-y-1">
//             {colors.length > 0 ? (
//               colors.map((color) => (
//                 <label
//                   key={color.id}
//                   className="flex items-center gap-2 text-[#002B50] text-sm cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedColors.includes(color.name)}
//                     onChange={() => handleCheckbox(color.name, setSelectedColors, selectedColors)}
//                     className="accent-[#002B50] w-4 h-4"
//                   />
//                   {color.name}
//                 </label>
//               ))
//             ) : (
//               <span className="text-gray-400 text-xs">Tidak ada data warna</span>
//             )}
//           </div>
//         </div>

//         {/* Storage */}
//         <div>
//           <h2 className="font-semibold mb-2 text-[#002B50] text-sm">Storage</h2>
//           <div className="space-y-1">
//             {storages.length > 0 ? (
//               storages.map((s) => (
//                 <label
//                   key={s.id}
//                   className="flex items-center gap-2 text-[#002B50] text-sm cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedStorages.includes(s.name)}
//                     onChange={() => handleCheckbox(s.name, setSelectedStorages, selectedStorages)}
//                     className="accent-[#002B50] w-4 h-4"
//                   />
//                   {s.name}
//                 </label>
//               ))
//             ) : (
//               <span className="text-gray-400 text-xs">Tidak ada data storage</span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React from "react";

export default function FilterContent({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategories,
  setSelectedCategories,
  tags,
  selectedTags,
  setSelectedTags,
  colors,
  selectedColors,
  setSelectedColors,
  storages,
  selectedStorages,
  setSelectedStorages,
}) {
  const handleCheckbox = (value, setter, selectedArray) => {
    if (selectedArray.includes(value)) {
      setter(selectedArray.filter((v) => v !== value));
    } else {
      setter([...selectedArray, value]);
    }
  };

  return (
    <div className="w-full max-w-[240px] rounded-xl shadow-md border border-gray-200 overflow-hidden bg-white">
      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#002B50] text-sm text-[#002B50]"
        />
      </div>

      <div className="p-4 space-y-6">
        {/* Kategori */}
        <div>
          <h2 className="font-semibold mb-2 text-[#002B50] text-sm">Kategori</h2>
          <div className="space-y-1">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-[#002B50] text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => handleCheckbox(cat.id, setSelectedCategories, selectedCategories)}
                  className="accent-[#002B50] w-4 h-4"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* Tags / Kondisi */}
        <div>
          <h2 className="font-semibold mb-2 text-[#002B50] text-sm">Kondisi</h2>
          <div className="space-y-1">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 text-[#002B50] text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleCheckbox(tag.id, setSelectedTags, selectedTags)}
                    className="accent-[#002B50] w-4 h-4"
                  />
                  {tag.name}
                </label>
              ))
            ) : (
              <span className="text-gray-400 text-xs">Tidak ada data kondisi</span>
            )}
          </div>
        </div>

        {/* Warna */}
        <div>
          <h2 className="font-semibold mb-2 text-[#002B50] text-sm">Warna</h2>
          <div className="space-y-1">
            {colors.length > 0 ? (
              colors.map((color) => (
                <label key={color.id} className="flex items-center gap-2 text-[#002B50] text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.name)}
                    onChange={() => handleCheckbox(color.name, setSelectedColors, selectedColors)}
                    className="accent-[#002B50] w-4 h-4"
                  />
                  {color.name}
                </label>
              ))
            ) : (
              <span className="text-gray-400 text-xs">Tidak ada data warna</span>
            )}
          </div>
        </div>

        {/* Storage */}
        <div>
          <h2 className="font-semibold mb-2 text-[#002B50] text-sm">Storage</h2>
          <div className="space-y-1">
            {storages.length > 0 ? (
              storages.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-[#002B50] text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStorages.includes(s.name)}
                    onChange={() => handleCheckbox(s.name, setSelectedStorages, selectedStorages)}
                    className="accent-[#002B50] w-4 h-4"
                  />
                  {s.name}
                </label>
              ))
            ) : (
              <span className="text-gray-400 text-xs">Tidak ada data storage</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
