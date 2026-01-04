"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getProductImageUrl } from "@/lib/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function RelatedProducts({ tagIds = [], currentProductId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        if (!tagIds || tagIds.length === 0) {
          setRelated([]);
          setLoading(false);
          return;
        }

        const q = `/user/products/filter/by-tags?tagIds=${tagIds.join(",")}&excludeId=${currentProductId}`;
        const res = await apiFetch(q, { method: "GET", credentials: "include" });
        setRelated(res?.products || []);
      } catch (err) {
        console.error("Gagal fetch related products:", err);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [tagIds, currentProductId]);

  if (loading) {
    return (
      <div className="mt-10">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!related || related.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-gray-500">Belum ada produk terkait</p>
      </div>
    );
  }

  return (
    <div className="mt-10">

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        // pagination={{ clickable: true }}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-10"
      >
        {related.map((product) => (
          <SwiperSlide key={product.id}>
            <div
              onClick={() => router.push(`/detailProduct/${product.id}`)}
              className="bg-white border border-[#B5C9DA] rounded-xl p-4 cursor-pointer hover:shadow-md transition"
            >
              <div className="relative w-full h-40">
                <Image
                  src={getProductImageUrl(product.ProductImages[0]?.image_url)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
              <h4 className="font-semibold mt-2">{product.name}</h4>
              <p className="text-sm text-gray-500">
                Rp {product.price?.toLocaleString("id-ID")}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
