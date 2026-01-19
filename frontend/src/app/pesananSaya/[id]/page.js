"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getProductImageUrl } from "@/lib/config";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";



export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const data = await apiFetch(`/user/orders/${id}`);
            setOrder(data.order);
        } catch (error) {
            console.error("Error fetching order:", error);
            alert("Gagal memuat detail pesanan");
            router.push("/pesananSaya");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: "Menunggu Pembayaran", color: "bg-yellow-500" },
            paid: { label: "Dibayar", color: "bg-blue-900" },
            processing: { label: "Diproses", color: "bg-indigo-500" },
            shipped: { label: "Dikirim", color: "bg-purple-500" },
            completed: { label: "Selesai", color: "bg-green-500" },
            cancelled: { label: "Dibatalkan", color: "bg-red-500" },
        };

        const statusInfo = statusMap[status] || { label: status, color: "bg-gray-500" };
        return (
            <span className={`${statusInfo.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                {statusInfo.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Pesanan tidak ditemukan</h2>
                <button
                    onClick={() => router.push("/pesananSaya")}
                    className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
                >
                    Kembali ke Pesanan Saya
                </button>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Detail Pesanan #{order.id}</h1>
                        {getStatusBadge(order.status)}
                    </div>

                    {/* Order Info Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Informasi Pesanan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 text-sm">Tanggal Pemesanan</p>
                                <p className="font-semibold text-gray-800">
                                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Metode Pembayaran</p>
                                <p className="font-semibold text-gray-800 capitalize">
                                    {order.Payment?.method || "Belum dibayar"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Status Pembayaran</p>
                                <p className="font-semibold text-gray-800 capitalize">
                                    {order.Payment?.status || "Pending"}
                                </p>
                            </div>
                            {order.tracking_number && (
                                <div>
                                    <p className="text-gray-600 text-sm">Nomor Resi</p>
                                    <p className="font-semibold text-gray-800">{order.tracking_number}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Produk yang Dipesan</h2>
                        <div className="space-y-4">
                            {order.OrderItems?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                                    <img
                                        src={getProductImageUrl(item.Product?.images?.[0]) || "/default-product.png"}
                                        alt={item.Product?.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "/default-product.png"; }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.Product?.name}</h3>
                                        <p className="text-gray-600 text-sm">Jumlah: {item.quantity}</p>
                                        {item.Color && (
                                            <p className="text-gray-600 text-sm">Warna: {item.Color.name}</p>
                                        )}
                                        {item.Storage && (
                                            <p className="text-gray-600 text-sm">Storage: {item.Storage.size}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">
                                            Rp {item.price?.toLocaleString("id-ID")}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Subtotal: Rp {(item.price * item.quantity)?.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>



                    {/* Total Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Ringkasan Pembayaran</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">Total Pembayaran</span>
                                <span className="text-lg font-bold text-blue-900">
                                    Rp {order.total_price?.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <button
                            onClick={() => router.push("/pesananSaya")}
                            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold text-center"
                        >
                            Kembali
                        </button>
                        {order.status === "paid" && order.Payment?.invoiceUrl && (
                            <a
                                href={order.Payment.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-semibold text-center"
                            >
                                Lihat Invoice
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
