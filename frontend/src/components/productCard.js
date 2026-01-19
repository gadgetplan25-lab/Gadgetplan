"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { getProductImageUrl } from "@/lib/config";

export default function ProductCard({ products = [] }) {
  const router = useRouter();

  return (
    <section aria-label="Product list">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.length > 0 ? (
          products.map((product, index) => (
            <article
              key={product.id}
              onClick={() => router.push(`/detailProduct/${product.id}`)}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden cursor-pointer transform transition duration-300 hover:scale-[1.03] hover:shadow-lg flex flex-col"
              tabIndex={0}
              role="button"
              aria-label={`Lihat detail ${product.name || "Produk"}`}
            >
              {/* Gambar Produk - Optimized for mobile */}
              <div className="w-full h-[220px] sm:h-[240px] md:h-[260px] relative flex items-center justify-center bg-white p-6">
                {product.ProductImages?.length > 0 ? (
                  <Image
                    src={getProductImageUrl(product.ProductImages[0].image_url)}
                    alt={product.name || "Produk"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-contain"
                    loading={index < 4 ? "eager" : "lazy"}
                    priority={index < 4}
                    quality={index < 4 ? 80 : 70}
                  />
                ) : (
                  <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
                )}
              </div>

              {/* Konten Produk */}
              <div className="p-4 flex flex-col justify-between flex-1">
                {/* Nama dan Kategori */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-semibold text-base md:text-lg text-gray-900 leading-snug line-clamp-2">
                    {product.name || "Tanpa Nama"}
                  </h2>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-200 shrink-0 whitespace-nowrap">
                    {product.Category?.name || "Tanpa Kategori"}
                  </span>
                </div>

                {/* Deskripsi singkat (opsional) */}
                {product.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                )}

                {/* Harga dan Tombol */}
                <div className="flex flex-col gap-3 mt-auto">
                  <span className="text-[#002B50] text-lg font-bold">
                    Rp {product.price?.toLocaleString("id-ID") || "0"}
                  </span>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 bg-[#002B50] hover:bg-[#003b6e] text-white text-sm font-medium py-2.5 min-h-[44px] rounded-xl transition"
                  >
                    <ShoppingCart size={16} />
                    Lihat Detail
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-sm sm:text-base">
            Produk tidak ditemukan
          </p>
        )}
      </div>
    </section>
  );
}
