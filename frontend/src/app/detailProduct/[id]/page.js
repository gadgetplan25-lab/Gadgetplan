"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import Swal from "sweetalert2";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RelatedProducts from "@/components/RelatedProducts";
import LoadingAnimation from "@/components/loadingAnimation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { getProductImageUrl } from "@/lib/config";
import { Heart } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [count, setCount] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // 🔹 Wishlist state
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // 🔹 User data
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");

  // 🔹 Loading sementara
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Ambil detail produk
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiFetch(`/user/products/${id}`, { method: "GET" });
        setProduct(res.product);
      } catch (err) {
        console.error("❌ Gagal fetch produk:", err);
        Swal.fire("Error", "Gagal memuat detail produk", "error");
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // 🔹 Check wishlist status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const res = await apiFetch(`/user/wishlist/check/${id}`, {
          method: "GET",
          credentials: "include",
          redirectOnError: false,
        });
        if (res?.success) {
          setIsInWishlist(res.inWishlist);
        }
      } catch (err) {
        // User belum login, abaikan error
        console.log("Wishlist check skipped (not logged in)");
      }
    };
    if (id) checkWishlistStatus();
  }, [id]);

  // 🔹 Ambil profil user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch("/user/profile", { method: "GET", redirectOnError: false });
        // Cek kemungkinan field address dan city_id
        let rawAddress = res.address || res.user?.address || "";
        let addressParts = rawAddress.split("|");
        let cityIdValue = addressParts[0] || "";
        // Jika tidak ada bagian kedua, gunakan rawAddress jika ada, jika kosong fallback "-"
        let addressValue =
          addressParts.length > 1 && addressParts[1]
            ? addressParts[1]
            : rawAddress || "-";
        setUser({ ...res, city_id: cityIdValue });
        setAddress(addressValue);
        if (process.env.NODE_ENV === 'development') {
          console.log("[DEBUG] address:", addressValue, "city_id:", cityIdValue);
        }
      } catch (err) {
        console.error("❌ Gagal fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Tambah ke keranjang
  const handleAddToCart = async () => {
    // Validasi dinamis: hanya cek varian yang memang ada
    const hasColors = product.colors?.length > 0;
    const hasStorages = product.storages?.length > 0;

    if (hasColors && !selectedColor) {
      Swal.fire("Pilih Warna", "Silakan pilih warna terlebih dahulu.", "warning");
      return;
    }

    if (hasStorages && !selectedStorage) {
      Swal.fire("Pilih Kapasitas", "Silakan pilih kapasitas penyimpanan terlebih dahulu.", "warning");
      return;
    }

    try {
      const body = {
        product_id: product.id,
        quantity: count,
        color_id: selectedColor || null,
        storage_id: selectedStorage || null,
      };

      await apiFetch("/cart/add", {
        method: "POST",
        body: JSON.stringify(body),
      });

      Swal.fire("Berhasil!", "Produk berhasil ditambahkan ke keranjang.", "success");
      setCartCount((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Gagal menambahkan ke keranjang:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menambahkan produk ke cart.", "error");
    }
  };


  // 🔹 Toggle Wishlist
  const handleToggleWishlist = async () => {
    try {
      setWishlistLoading(true);

      if (isInWishlist) {
        // Remove from wishlist
        const res = await apiFetch(`/user/wishlist/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res?.success) {
          setIsInWishlist(false);
          Swal.fire({
            icon: "success",
            title: "Dihapus dari Wishlist",
            text: "Produk berhasil dihapus dari wishlist",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } else {
        // Add to wishlist
        const res = await apiFetch("/user/wishlist", {
          method: "POST",
          body: JSON.stringify({ product_id: id }),
          credentials: "include",
        });

        if (res?.success) {
          setIsInWishlist(true);
          Swal.fire({
            icon: "success",
            title: "Ditambahkan ke Wishlist",
            text: "Produk berhasil ditambahkan ke wishlist",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    } catch (error) {
      console.error("❌ Gagal toggle wishlist:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Silakan login terlebih dahulu",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  // Beli Sekarang - langsung checkout ke WhatsApp
  const handleBuyNow = async () => {
    // Validasi dinamis: hanya cek varian yang memang ada
    const hasColors = product.colors?.length > 0;
    const hasStorages = product.storages?.length > 0;

    if (hasColors && !selectedColor) {
      Swal.fire("Pilih Warna", "Silakan pilih warna terlebih dahulu.", "warning");
      return;
    }

    if (hasStorages && !selectedStorage) {
      Swal.fire("Pilih Kapasitas", "Silakan pilih kapasitas penyimpanan terlebih dahulu.", "warning");
      return;
    }

    try {
      setLoading(true);

      // Buat order langsung
      const res = await apiFetch("/order/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: [
            {
              product_id: product.id,
              quantity: count,
              color_id: selectedColor || null,
              storage_id: selectedStorage || null,
            },
          ],
          payment_method: "whatsapp",
        }),
      });

      if (res?.message === "Checkout berhasil") {
        // Siapkan pesan WhatsApp
        const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;
        const orderId = res.order.id;
        const totalBayar = (product.price * count).toLocaleString("id-ID");
        const customerName = user?.user?.name || user?.name || "Customer";

        const messageRaw = `Halo Admin, saya ingin konfirmasi pesanan baru.\\n\\n` +
          `Order ID: *#${orderId}*\\n` +
          `Nama: ${customerName}\\n` +
          `Produk: ${product.name} (${count}x)\\n` +
          `Total Produk: Rp ${totalBayar}\\n` +
          `(Belum termasuk ongkir)\\n\\n` +
          `Mohon info total pembayaran + ongkir. Terima kasih.`;

        const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageRaw)}`;

        Swal.fire({
          title: "Checkout Berhasil!",
          text: "Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Lanjut ke WhatsApp",
          cancelButtonText: "Lihat Pesanan",
          confirmButtonColor: "#065f46"
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(waLink, "_blank");
            window.location.href = "/pesananSaya";
          } else {
            window.location.href = "/pesananSaya";
          }
        });
      } else {
        throw new Error("Checkout gagal");
      }
    } catch (error) {
      console.error("❌ Gagal checkout:", error);
      Swal.fire("Error", error.message || "Terjadi kesalahan saat checkout.", "error");
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

  if (!product) {
    return <p className="text-center mt-20 text-gray-500">Produk tidak ditemukan</p>;
  }

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        setCartCount={setCartCount}
      />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start">
          <div className="space-y-3 sm:space-y-4">
            {product.ProductImages?.length > 0 ? (
              <>
                <Swiper
                  spaceBetween={10}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Thumbs]}
                  className="mb-4"
                >
                  {product.ProductImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={getProductImageUrl(img.image_url)}
                        alt={product.name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-containt rounded-2xl border border-[#B5C9DA]"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* Thumbnail Gambar */}
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  modules={[Thumbs]}
                  watchSlidesProgress
                >
                  {product.ProductImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={getProductImageUrl(img.image_url)}
                        alt={product.name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-containt rounded-xl border border-[#B5C9DA] hover:border-[#002B50] cursor-pointer"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            ) : (
              <div className="w-full h-[420px] flex items-center justify-center bg-gray-100 rounded-2xl border">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>

          {/* 🔹 Detail Produk */}
          <div className="bg-white border text-[#002B50] rounded-2xl shadow-md p-4 sm:p-6 border-[#B5C9DA]">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#002B50] mb-2 sm:mb-3">{product.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
              {product.description || "Tidak ada deskripsi untuk produk ini."}
            </p>
            <p className="text-xl sm:text-2xl font-semibold text-[#002B50] mb-1">
              Rp {product.price?.toLocaleString("id-ID")}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Stok tersedia ({product.stock})</p>

            {/* Pilihan Warna */}
            {product.colors?.length > 0 && (
              <div className="mb-3 sm:mb-4">
                <h2 className="text-sm sm:text-md font-semibold mb-2">Warna</h2>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`px-3 sm:px-4 py-2 min-h-[44px] border rounded-lg border-[#B5C9DA] text-[#002B50] font-semibold cursor-pointer transition text-sm sm:text-base ${selectedColor === color.id
                        ? "bg-[#002B50] text-white border-[#002B50]"
                        : "bg-white hover:bg-gray-100"
                        }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pilihan Storage */}
            {product.storages?.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-md font-semibold mb-2">Kapasitas Penyimpanan</h2>
                <div className="flex flex-wrap gap-2">
                  {product.storages.map((storage) => (
                    <button
                      key={storage.id}
                      onClick={() => setSelectedStorage(storage.id)}
                      className={`px-4 py-2 border rounded-lg transition border-[#B5C9DA] text-[#002B50] font-semibold cursor-pointer ${selectedStorage === storage.id
                        ? "bg-[#002B50] text-white border-[#002B50]"
                        : "bg-white hover:bg-gray-100"
                        }`}
                    >
                      {storage.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Jumlah */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <button
                onClick={() => setCount(count > 1 ? count - 1 : 1)}
                className="px-3 sm:px-4 py-2 min-h-[44px] min-w-[44px] border rounded-lg hover:bg-gray-100 text-sm sm:text-base font-medium"
              >
                -
              </button>
              <span className="text-base sm:text-lg font-semibold min-w-[32px] text-center">{count}</span>
              <button
                onClick={() => setCount(count + 1)}
                className="px-3 sm:px-4 py-2 min-h-[44px] min-w-[44px] border rounded-lg hover:bg-gray-100 text-sm sm:text-base font-medium"
              >
                +
              </button>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              {/* Tombol Wishlist */}
              <button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className={`flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-lg font-semibold transition text-sm sm:text-base ${isInWishlist
                  ? "bg-red-50 border-2 border-red-500 text-red-500 hover:bg-red-100"
                  : "bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                title={isInWishlist ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
              >
                <Heart
                  className={`w-5 h-5 ${wishlistLoading ? "animate-pulse" : ""}`}
                  fill={isInWishlist ? "currentColor" : "none"}
                />
                <span className="hidden xs:inline">Wishlist</span>
              </button>

              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="flex-1 bg-gray-100 border border-[#002B50] text-[#002B50] py-3 min-h-[48px] rounded-lg font-semibold hover:bg-gray-200 transition text-sm sm:text-base"
              >
                Tambah ke Keranjang
              </button>
              <button
                onClick={handleBuyNow}
                disabled={loading}
                className="flex-1 bg-[#002B50] text-white py-3 min-h-[48px] rounded-lg font-semibold hover:bg-[#003366] transition text-sm sm:text-base"
              >
                {loading ? "Memproses..." : "Beli Sekarang"}
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 Produk Terkait */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#002B50]">Produk Terkait</h2>
          <RelatedProducts
            tagIds={product?.tags?.map((t) => t.id) || []}
            currentProductId={product?.id}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}