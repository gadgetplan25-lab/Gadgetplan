"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { useAuthGuard } from "@/hook/useAuthGuard";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { getProductImageUrl } from "@/lib/config";

export default function CartPage() {
  const { loading } = useAuthGuard();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");

  // Hitung total harga hanya yang dicentang
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );
  const total = selectedCartItems.reduce(
    (sum, item) => {
      const itemPrice = item.ProductVariant?.price || item.Product.price;
      return sum + itemPrice * item.quantity;
    },
    0
  );

  // Ambil data cart dari backend
  useEffect(() => {
    if (loading) return;
    const fetchCart = async () => {
      try {
        const res = await apiFetch("/cart", {
          credentials: "include",
        });
        setCartItems(res.cart?.CartItems || []);
      } catch (err) {
        console.error("Gagal fetch cart:", err);
      }
    };
    fetchCart();
  }, [loading]);

  // Ambil data user & address
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch("/user/profile", { method: "GET" });
        let rawAddress = res.address || res.user?.address || "";
        let addressParts = rawAddress.split("|");
        let cityIdValue = addressParts[0] || "";
        let addressValue =
          addressParts.length > 1 && addressParts[1]
            ? addressParts[1]
            : rawAddress || "-";
        setUser({ ...res, city_id: cityIdValue });
        setAddress(addressValue);
      } catch (err) {
        setUser(null);
        setAddress("-");
      }
    };
    fetchUser();
  }, []);

  // Toggle checkbox
  const toggleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Hapus item
  const handleDelete = async (itemId) => {
    try {
      await apiFetch(`/cart/remove/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      // Jika tidak throw error, berarti sukses
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      Swal.fire("Berhasil", "Item dihapus dari keranjang", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const data = await apiFetch(`/cart/update/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQty }),
      });
      // apiFetch sudah return data langsung
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: data.cartItem.quantity } : item
        )
      );
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Checkout → buka modal konfirmasi
  const handleOpenModal = () => {
    if (selectedItems.length === 0) {
      Swal.fire("Oops", "Pilih minimal 1 produk untuk checkout", "warning");
      return;
    }
    setShowModal(true);
  };

  // Checkout → hit endpoint
  const handleCheckout = async () => {
    try {
      const res = await apiFetch("/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          cart_item_ids: selectedItems,
          payment_method: "whatsapp",
        }),
      });

      if (!res || res.message !== "Checkout berhasil") {
        throw new Error(res?.message || "Gagal checkout");
      }

      setShowModal(false);

      // --- WhatsApp Redirect Logic ---
      const orderId = res.order.id;
      const totalBayar = total.toLocaleString("id-ID");
      const customerName = user?.user?.name || user?.name || "Customer";

      // Ambil nama-nama produk
      const productNames = selectedCartItems.map(item => `- ${item.Product?.name} (${item.quantity}x)`).join('%0a');

      const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;

      // Validasi nomor admin - DISABLED untuk testing
      // if (!adminPhone) {
      //   Swal.fire({
      //     icon: "warning",
      //     title: "Konfigurasi Belum Lengkap",
      //     text: "Nomor WhatsApp admin belum diatur. Silakan hubungi administrator.",
      //     confirmButtonColor: "#065f46"
      //   });
      //   setShowModal(false);
      //   return;
      // }
      const messageRaw = `Halo Admin, saya ingin konfirmasi pesanan baru.\n\n` +
        `Order ID: *#${orderId}*\n` +
        `Nama: ${customerName}\n` +
        `Detail Barang:\n${productNames}\n` +
        `Total: Rp ${totalBayar}\n\n` +
        `Mohon info pembayaran selanjutnya. Terima kasih.`;

      const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageRaw)}`;

      Swal.fire({
        title: "Checkout Berhasil!",
        text: "Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Lanjut ke WhatsApp",
        cancelButtonText: "Lihat Pesanan",
        confirmButtonColor: "#002B50" // Strict Theme
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(waLink, "_blank");
          window.location.href = "/pesananSaya";
        } else {
          window.location.href = "/pesananSaya";
        }
      });
    } catch (err) {
      console.error("❌ Checkout error:", err);
      Swal.fire({
        icon: "error",
        title: "Checkout Gagal",
        text: err.message || "Terjadi kesalahan saat checkout. Silakan coba lagi.",
        confirmButtonColor: "#002B50"
      });
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#002B50]">
            Keranjang Anda
          </h1>
          <div className="flex flex-col gap-3 sm:gap-4 max-h-[500px] overflow-y-auto pr-2">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-sm sm:text-base">Keranjang kosong</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 sm:gap-4 border border-slate-200 rounded-lg p-3 sm:p-4"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 accent-[#002B50] flex-shrink-0"
                  />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                    <Image
                      src={
                        item.Product?.ProductImages?.[0]?.image_url
                          ? getProductImageUrl(item.Product.ProductImages[0].image_url)
                          : "/default-product.png"
                      }
                      alt={item.Product?.name || "Product"}
                      fill
                      sizes="(max-width: 640px) 64px, 80px"
                      className="object-cover rounded-lg border border-slate-200"
                      loading="lazy"
                      quality={80}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-product.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm sm:text-base md:text-lg text-[#002B50] truncate">
                      {item.Product?.name}
                    </h2>
                    {/* NEW: Display variant info if exists */}
                    {item.ProductVariant && (
                      <div className="flex gap-2 mt-1">
                        {item.ProductVariant.Color && (
                          <span className="text-xs px-2 py-0.5 bg-white text-[#002B50] border border-[#002B50] rounded-full">
                            {item.ProductVariant.Color.name}
                          </span>
                        )}
                        {item.ProductVariant.Storage && (
                          <span className="text-xs px-2 py-0.5 bg-white text-[#002B50] border border-[#002B50] rounded-full">
                            {item.ProductVariant.Storage.name}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-1">
                      Rp. {(item.ProductVariant?.price || item.Product?.price).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs sm:text-sm text-[#002B50] opacity-80 mt-0.5">
                      Stock: {item.ProductVariant?.stock || item.Product?.stock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-400 hover:text-[#002B50] p-2 hover:bg-[#002B50]/5 rounded-lg transition-colors"
                      title="Hapus dari keranjang"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-sm sm:text-base min-w-[32px] min-h-[32px] text-[#002B50]"
                      >
                        -
                      </button>
                      <span className="font-semibold text-sm sm:text-base min-w-[24px] text-center text-[#002B50]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-sm sm:text-base min-w-[32px] min-h-[32px] text-[#002B50]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-[#002B50] mb-4">
            Ringkasan Harga
          </h2>
          <div className="flex justify-between mb-4 pb-4 border-b border-slate-100">
            <span className="text-slate-600">Total Harga</span>
            <span className="font-bold text-[#002B50] text-lg">
              Rp. {total.toLocaleString("id-ID")}
            </span>
          </div>
          <button
            onClick={handleOpenModal}
            className="w-full bg-[#002B50] text-white py-3 rounded-xl hover:bg-[#002B50]/90 font-semibold shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]"
          >
            Check out
          </button>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            {/* Modal Body */}
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-4 sm:p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-[#002B50] text-xl font-bold transition-colors"
                aria-label="Tutup"
                type="button"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-[#002B50]">Konfirmasi Checkout</h2>
              <div className="mb-2">
                <p className="text-slate-700"><strong>Nama:</strong> {user?.user?.name || user?.name || "-"}</p>
                <p className="text-slate-700"><strong>Email:</strong> {user?.user?.email || user?.email || "-"}</p>
                <label className="font-semibold mt-2 block text-[#002B50]">Alamat Pengiriman</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-[#002B50] focus:border-[#002B50] outline-none"
                  rows={2}
                  placeholder="Masukkan alamat pengiriman lengkap..."
                />
              </div>
              <div className="max-h-60 overflow-y-auto mb-4 border-t border-b border-slate-100 py-2">
                {selectedCartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start py-2"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-slate-900">{item.Product?.name} x {item.quantity}</span>
                      {item.ProductVariant && (
                        <div className="flex gap-1 mt-1">
                          {item.ProductVariant.Color && (
                            <span className="text-xs px-2 py-0.5 bg-white text-[#002B50] border border-[#002B50] rounded-full">
                              {item.ProductVariant.Color.name}
                            </span>
                          )}
                          {item.ProductVariant.Storage && (
                            <span className="text-xs px-2 py-0.5 bg-white text-[#002B50] border border-[#002B50] rounded-full">
                              {item.ProductVariant.Storage.name}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-[#002B50]">
                      Rp. {((item.ProductVariant?.price || item.Product?.price) * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mb-3 flex justify-between items-center bg-[#002B50]/5 p-3 rounded-lg">
                <p className="font-bold text-[#002B50]">Total Pembayaran:</p>
                <p className="font-bold text-xl text-[#002B50]">Rp {total.toLocaleString("id-ID")}</p>
              </div>
              <div className="flex gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1 bg-[#002B50] hover:bg-[#002B50]/90 text-white"
                  disabled={selectedCartItems.length === 0 || loading}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}