"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Calendar, Clock, MapPin, Tool, User, Phone, ArrowLeft, CheckCircle2, XCircle, AlertCircle, CreditCard, CheckCircle } from "lucide-react";

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchBookingDetail();
        }
    }, [params.id]);

    const fetchBookingDetail = async () => {
        try {
            setLoading(true);
            const res = await apiFetch(`/booking/detail/${params.id}`);
            if (res.booking) {
                setBooking(res.booking);
            } else {
                alert("Booking tidak ditemukan");
                router.push("/pesananSaya");
            }
        } catch (error) {
            console.error("Error fetching booking:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!booking) return <div className="text-center py-20">Booking not found</div>;

    const steps = [
        { key: "pending", label: "Menunggu Konfirmasi", description: "Booking diterima, menunggu konfirmasi admin." },
        { key: "confirmed", label: "Dikonfirmasi", description: "Jadwal dan teknisi telah dikonfirmasi." },
        { key: "proses", label: "Sedang Dikerjakan", description: "Teknisi sedang melakukan perbaikan." },
        { key: "selesai", label: "Selesai", description: "Perbaikan selesai, silakan ambil perangkat Anda." },
    ];

    const currentStepIndex = steps.findIndex(s => s.key === booking.status);
    let paymentStatus = booking.BookingPayments?.[0]?.payment_status || "pending";
    if (['confirmed', 'proses', 'selesai'].includes(booking.status)) {
        paymentStatus = 'paid';
    }
    const dpAmount = booking.BookingPayments?.[0]?.amount || 0;

    const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;

    const handleContactAdmin = () => {
        const messageRaw = `Halo Admin, saya ingin menanyakan status Booking Service *#${booking.id}*.\n\nStatus saat ini: ${booking.status}`;
        const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageRaw)}`;
        window.open(waLink, "_blank");
    };

    const handlePayDP = () => {
        const messageRaw = `Halo Admin, saya mau bayar DP Booking Service *#${booking.id}* sebesar Rp ${dpAmount.toLocaleString("id-ID")}. Mohon infonya.`;
        const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageRaw)}`;
        window.open(waLink, "_blank");
    }

    const handlePayFull = () => {
        const messageRaw = `Halo Admin, saya mau melunasi pembayaran Booking Service *#${booking.id}*. Mohon infonya.`;
        const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageRaw)}`;
        window.open(waLink, "_blank");
    }

    return (
        <>
            <Navbar />
            <div className="bg-slate-50 min-h-screen py-10">
                <div className="container mx-auto px-4 md:px-8 lg:px-[60px]">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 mb-6 hover:text-[#002B50] transition">
                        <ArrowLeft size={20} /> Kembali
                    </button>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#002B50] p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-bold">Booking #{booking.id}</h1>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/20 text-white border border-white/30`}>
                                        {steps.find(s => s.key === booking.status)?.label || booking.status}
                                    </span>
                                </div>
                                <p className="text-blue-100 flex items-center gap-2">
                                    <Calendar size={16} /> {booking.service_date} • <Clock size={16} /> {booking.service_time}
                                </p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-sm opacity-80 mb-1">Total Estimasi Biaya</p>
                                <p className="text-3xl font-bold">Rp {booking.ServiceType?.harga?.toLocaleString("id-ID") || "-"}</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Status & Timeline */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Status Timeline */}
                                <div>
                                    <h3 className="text-lg font-bold text-[#002B50] mb-6">Status Pengerjaan</h3>
                                    <div className="relative">
                                        {booking.status === 'cancelled' ? (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-bold flex items-center gap-3">
                                                <XCircle className="w-6 h-6" /> Booking ini telah dibatalkan.
                                            </div>
                                        ) : (
                                            <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                                {steps.map((step, idx) => {
                                                    const isCompleted = idx <= currentStepIndex;
                                                    const isCurrent = idx === currentStepIndex;

                                                    return (
                                                        <div key={step.key} className="relative flex gap-4">
                                                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-300 text-slate-300"
                                                                }`}>
                                                                {isCompleted ? <CheckCircle2 size={16} /> : <span className="w-2 h-2 rounded-full bg-current" />}
                                                            </div>
                                                            <div className={`pt-1 ${isCompleted ? "opacity-100" : "opacity-50"}`}>
                                                                <h4 className={`font-bold text-sm md:text-base ${isCurrent ? "text-[#002B50]" : "text-slate-700"}`}>{step.label}</h4>
                                                                <p className="text-xs md:text-sm text-slate-500 mt-1">{step.description}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Device Info */}
                                <div>
                                    <h3 className="text-lg font-bold text-[#002B50] mb-4">Informasi Perangkat</h3>
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Model Perangkat</p>
                                            <p className="font-medium text-[#002B50]">{booking.model_perangkat}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Jenis Perangkat</p>
                                            <p className="font-medium text-[#002B50]">{booking.jenis_perangkat}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Keluhan / Catatan</p>
                                            <p className="font-medium text-[#002B50]">{booking.catatan || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column: Payment & Technician */}
                            <div className="space-y-6">

                                {/* Technician Card */}
                                <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm">
                                    <h3 className="text-sm font-bold text-[#002B50] mb-4 flex items-center gap-2">
                                        <User size={18} className="text-slate-400" /> Teknisi
                                    </h3>
                                    {booking.Technician ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#002B50]">{booking.Technician.name}</p>
                                                <p className="text-xs text-slate-500">GadgetPlan Expert</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 text-sm italic py-2">
                                            Teknisi sedang ditugaskan...
                                        </div>
                                    )}
                                </div>

                                {/* Payment Detail */}
                                <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm">
                                    <h3 className="text-sm font-bold text-[#002B50] mb-4 flex items-center gap-2">
                                        <CreditCard size={18} className="text-slate-400" /> Status Pembayaran
                                    </h3>

                                    <div className={`p-3 rounded-lg flex items-center gap-3 mb-4 ${paymentStatus === 'paid' || paymentStatus === 'success'
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        : "bg-orange-50 text-orange-700 border border-orange-100"
                                        }`}>
                                        {paymentStatus === 'paid' || paymentStatus === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                        <div>
                                            <p className="font-bold text-sm uppercase">{paymentStatus === 'paid' || paymentStatus === 'success' ? "Lunas" : "Belum Lunas / DP Pending"}</p>
                                            <p className="text-xs opacity-80">
                                                {paymentStatus === 'paid' ? "Pembayaran telah dikonfirmasi" : "Mohon selesaikan pembayaran"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-3 border-t border-slate-100 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Down Payment (DP)</span>
                                            <span className="font-bold text-[#002B50]">Rp {dpAmount.toLocaleString("id-ID")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Sisa Pembayaran</span>
                                            <span className="font-bold text-[#002B50]">
                                                Rp {((booking.ServiceType?.harga || 0) - dpAmount).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        {paymentStatus !== 'paid' && paymentStatus !== 'success' && booking.status !== 'cancelled' && (
                                            <button onClick={handlePayDP} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2">
                                                Bayar DP Sekarang
                                            </button>
                                        )}

                                        {(paymentStatus === 'paid' || paymentStatus === 'success') && booking.status === 'selesai' && (
                                            // Logic pelunasan if needed, but if status is paid assuming full? 
                                            // Usually DP is just DP. But admin marks 'paid' usually means fully paid or DP paid?
                                            // Assuming 'paid' in this context means 'Sufficiently Paid to proceed'.
                                            // If system is strictly DP based, we might need a 'Full Paid' status. 
                                            // For now, let's keep it simple.
                                            <button disabled className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                                Pembayaran Selesai
                                            </button>
                                        )}

                                        <button onClick={handleContactAdmin} className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition flex items-center justify-center gap-2">
                                            <Phone size={18} /> Hubungi Admin
                                        </button>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
