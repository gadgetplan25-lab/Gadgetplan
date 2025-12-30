"use client";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function OrdersModal({ user, onClose }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiFetch(`/user/orders`).then((res) => setOrders(res.orders || []));
  }, [user]);

  return (
    <>
      <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Pesanan Saya</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">Belum ada pesanan.</p>
          ) : (
            <ul className="divide-y">
              {orders.map((order) => (
                <li key={order.id} className="py-3">
                  <p><strong>ID Pesanan:</strong> {order.id}</p>
                  <p><strong>Tanggal:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                </li>
              ))}
            </ul>
          )}
          <button onClick={onClose} className="mt-4 bg-blue-900 text-white px-4 py-2 rounded">
            Tutup
          </button>
        </div>
      </Dialog>
    </>
  );
}