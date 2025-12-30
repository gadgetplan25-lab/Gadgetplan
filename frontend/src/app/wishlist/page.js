"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getProductImageUrl } from "@/lib/config";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LoadingAnimation from "@/components/loadingAnimation";
import Swal from "sweetalert2";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

export default function WishlistPage() {
    const router = useRouter();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await apiFetch("/user/wishlist", {
                method: "GET",
                credentials: "include"
            });

            if (res?.success) {
                setWishlist(res.wishlist || []);
            }
        } catch (error) {
            console.error("❌ Gagal fetch wishlist:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal memuat wishlist. Silakan login terlebih dahulu.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const result = await Swal.fire({
                title: "Hapus dari Wishlist?",
                text: "Produk akan dihapus dari daftar favorit Anda",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#002B50",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya, Hapus",
                cancelButtonText: "Batal",
            });

            if (result.isConfirmed) {
                const res = await apiFetch(`/user/wishlist/${productId}`, {
                    method: "DELETE",
                    credentials: "include",
                });

                if (res?.success) {
                    setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
                    Swal.fire({
                        icon: "success",
                        title: "Berhasil",
                        text: "Produk dihapus dari wishlist",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            }
        } catch (error) {
            console.error("❌ Gagal hapus wishlist:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal menghapus produk dari wishlist",
            });
        }
    };

    const handleAddToCart = async (product) => {
        try {
            // Cek apakah produk punya varian (colors atau storages)
            // Jika ya, redirect ke detail produk untuk pilih varian
            const productDetail = await apiFetch(`/user/products/${product.id}`, {
                method: "GET",
            });

            const hasVariants =
                (productDetail.product?.colors && productDetail.product.colors.length > 0) ||
                (productDetail.product?.storages && productDetail.product.storages.length > 0);

            if (hasVariants) {
                // Redirect ke detail produk untuk pilih varian
                Swal.fire({
                    icon: "info",
                    title: "Pilih Varian",
                    text: "Produk ini memiliki varian. Silakan pilih varian terlebih dahulu.",
                    confirmButtonColor: "#002B50",
                    confirmButtonText: "Pilih Varian",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push(`/detailProduct/${product.id}`);
                    }
                });
                return;
            }

            // Produk tanpa varian, langsung tambahkan ke cart
            await apiFetch("/cart/add", {
                method: "POST",
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: 1,
                }),
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Produk ditambahkan ke keranjang",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("❌ Gagal tambah ke cart:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Gagal menambahkan ke keranjang",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#002B50]">
                <LoadingAnimation />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-6 sm:py-10 min-h-screen">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[#002B50]" fill="#002B50" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#002B50]">Wishlist Saya</h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">
                        {wishlist.length} produk favorit Anda
                    </p>
                </div>

                {/* Wishlist Items */}
                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                        <Heart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mb-3 sm:mb-4" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                            Wishlist Kosong
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 text-center px-4">
                            Anda belum menambahkan produk ke wishlist
                        </p>
                        <button
                            onClick={() => router.push("/products")}
                            className="bg-[#002B50] text-white px-6 py-3 min-h-[48px] rounded-lg hover:bg-[#003366] transition text-sm sm:text-base"
                        >
                            Jelajahi Produk
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {wishlist.map((item) => {
                            const product = item.Product;
                            if (!product) return null;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                                >
                                    {/* Product Image */}
                                    <div
                                        className="relative w-full h-64 bg-gray-100 cursor-pointer"
                                        onClick={() => router.push(`/detailProduct/${product.id}`)}
                                    >
                                        {product.images ? (
                                            <img
                                                src={getProductImageUrl(product.images)}
                                                alt={product.name}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                No Image
                                            </div>
                                        )}

                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFromWishlist(product.id);
                                            }}
                                            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition"
                                            title="Hapus dari Wishlist"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3
                                            className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-[#002B50]"
                                            onClick={() => router.push(`/detailProduct/${product.id}`)}
                                        >
                                            {product.name}
                                        </h3>

                                        {product.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                {product.description}
                                            </p>
                                        )}

                                        <div className="mt-auto">
                                            <p className="text-2xl font-bold text-[#002B50] mb-3">
                                                Rp {product.price?.toLocaleString("id-ID") || "0"}
                                            </p>

                                            {product.stock > 0 ? (
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="w-full flex items-center justify-center gap-2 bg-[#002B50] text-white py-2.5 rounded-lg hover:bg-[#003366] transition"
                                                >
                                                    <ShoppingCart className="w-5 h-5" />
                                                    Tambah ke Keranjang
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full bg-gray-300 text-gray-500 py-2.5 rounded-lg cursor-not-allowed"
                                                >
                                                    Stok Habis
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
