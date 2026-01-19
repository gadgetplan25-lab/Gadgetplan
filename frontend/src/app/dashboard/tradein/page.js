"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Swal from "sweetalert2";
import { Smartphone, Plus, Edit, Trash2, Search } from "lucide-react";

const COMPONENTS = [
    "battery", "lcd", "kamera_belakang", "kamera_depan", "glass_kamera",
    "jamur", "backglass", "housing", "speaker_bawah", "speaker_atas",
    "charger", "onoff", "volume", "vibrate", "faceid"
];

const COMPONENT_LABELS = {
    battery: "Baterai",
    lcd: "LCD/Layar",
    kamera_belakang: "Kamera Belakang",
    kamera_depan: "Kamera Depan",
    glass_kamera: "Glass Kamera",
    jamur: "Jamur/Moisture",
    backglass: "Backglass",
    housing: "Housing",
    speaker_bawah: "Speaker Bawah",
    speaker_atas: "Speaker Atas",
    charger: "Flexible Charger",
    onoff: "Flexible On/Off",
    volume: "Flexible Volume",
    vibrate: "Vibrate Motor",
    faceid: "Face ID",
};

const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"];

export default function TradeInPage() {
    const [loading, setLoading] = useState(true);
    const [phones, setPhones] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPhones();
    }, []);

    const fetchPhones = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/trade-in/admin/phones");
            setPhones(res.phones || []);
        } catch (error) {
            Swal.fire("Error", "Gagal memuat data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        const { value: formValues } = await Swal.fire({
            title: '<strong style="color: #002B50;">Tambah iPhone Baru</strong>',
            html: `
        <div style="text-align: left; padding: 10px;">
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; color: #002B50; display: block; margin-bottom: 6px; font-size: 13px;">Model iPhone</label>
            <input id="model" placeholder="iPhone 13 Pro Max" style="margin: 0; width: 100%; padding: 10px; border: 2px solid #002B50; border-radius: 6px; font-size: 14px; box-sizing: border-box; height: 44px;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div>
              <label style="font-weight: 600; color: #002B50; display: block; margin-bottom: 6px; font-size: 13px;">Storage</label>
              <select id="storage" style="margin: 0; width: 100%; padding: 10px; border: 2px solid #002B50; border-radius: 6px; font-size: 14px; box-sizing: border-box; background-color: white; -webkit-appearance: menulist; -moz-appearance: menulist; appearance: menulist; cursor: pointer; height: 44px; line-height: 1.5;">
                <option value="">Pilih</option>
                ${STORAGE_OPTIONS.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-weight: 600; color: #002B50; display: block; margin-bottom: 6px; font-size: 13px;">Tahun</label>
              <input id="year" type="number" placeholder="2023" style="margin: 0; width: 100%; padding: 10px; border: 2px solid #002B50; border-radius: 6px; font-size: 14px; box-sizing: border-box; height: 44px;">
            </div>
          </div>
          <div style="margin-bottom: 15px;">
            <label style="font-weight: 600; color: #002B50; display: block; margin-bottom: 6px; font-size: 13px;">Harga No Minus (Rp)</label>
            <input id="price" type="number" placeholder="10000000" style="margin: 0; width: 100%; padding: 10px; border: 2px solid #002B50; border-radius: 6px; font-size: 14px; box-sizing: border-box; height: 44px;">
            <p style="font-size: 11px; color: #002B50; margin: 4px 0 0 0; opacity: 0.7;">Harga untuk HP tanpa kerusakan</p>
          </div>
          <details style="border: 2px solid #002B50; border-radius: 6px; padding: 10px; margin-bottom: 10px;">
            <summary style="font-weight: 700; color: #002B50; cursor: pointer; font-size: 14px; user-select: none; outline: none;">Detail Potongan Kerusakan (Klik untuk expand)</summary>
            <div style="margin-top: 10px; max-height: 300px; overflow-y: auto;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${COMPONENTS.map(comp => `
                  <div>
                    <label style="font-size: 11px; color: #002B50; display: block; margin-bottom: 3px; font-weight: 600;">${COMPONENT_LABELS[comp]}</label>
                    <input id="comp_${comp}" type="number" class="swal2-input" placeholder="0" value="0" style="margin: 0; padding: 6px; font-size: 12px; border: 1px solid #002B50; border-radius: 4px; width: 100%; box-sizing: border-box;">
                  </div>
                `).join('')}
              </div>
            </div>
          </details>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#002B50',
            cancelButtonColor: '#FFFFFF',
            width: '650px',
            preConfirm: () => {
                const model = document.getElementById("model").value;
                const storage = document.getElementById("storage").value;
                const year = parseInt(document.getElementById("year").value);
                const price = parseInt(document.getElementById("price").value);

                if (!model || !storage || !year || !price) {
                    Swal.showValidationMessage('Semua field wajib diisi!');
                    return false;
                }

                const custom_deductions = {};
                COMPONENTS.forEach(comp => {
                    const value = parseInt(document.getElementById(`comp_${comp}`).value) || 0;
                    custom_deductions[comp] = value;
                });

                return {
                    model,
                    category: storage, // Storage disimpan sebagai category
                    year,
                    price_min: price, // Harga fix (tidak ada range)
                    price_max: price, // Same as min
                    custom_deductions,
                };
            },
        });

        if (formValues) {
            try {
                await apiFetch("/trade-in/admin/phones", {
                    method: "POST",
                    body: JSON.stringify(formValues),
                });
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Data berhasil ditambahkan!",
                    timer: 3000,
                    showConfirmButton: false,
                });
                fetchPhones();
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            }
        }
    };

    const handleEdit = async (phone) => {
        const deductions = phone.deductions || phone.custom_deductions || {};

        const { value: formValues } = await Swal.fire({
            title: `<strong style="color: #002B50;">Edit ${phone.model} ${phone.category}</strong>`,
            html: `
        <div style="text-align: left; max-height: 550px; overflow-y: auto; padding: 20px;">
          
          <!-- Form Fields -->
          <div style="margin-bottom: 15px;">
            <label style="font-weight: 600; color: #002B50; display: block; margin-bottom: 8px; font-size: 14px;">Model iPhone</label>
            <input id="model" value="${phone.model}" style="margin: 0; width: 100%; padding: 12px; border: 2px solid #002B50; border-radius: 8px; font-size: 14px; box-sizing: border-box; height: 48px;">
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="font-weight: 600; color: #002B50; display: block; margin-bottom: 8px; font-size: 14px;">Storage</label>
            <select id="storage" style="margin: 0; width: 100%; padding: 12px; border: 2px solid #002B50; border-radius: 8px; font-size: 14px; background-color: white; box-sizing: border-box; height: 48px; -webkit-appearance: menulist; appearance: menulist; cursor: pointer;">
              ${STORAGE_OPTIONS.map(s => `<option value="${s}" ${phone.category === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="font-weight: 600; color: #002B50; display: block; margin-bottom: 8px; font-size: 14px;">Tahun</label>
            <input id="year" type="number" value="${phone.year || ''}" style="margin: 0; width: 100%; padding: 12px; border: 2px solid #002B50; border-radius: 8px; font-size: 14px; box-sizing: border-box; height: 48px;">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="font-weight: 600; color: #002B50; display: block; margin-bottom: 8px; font-size: 14px;">Harga No Minus (Rp)</label>
            <input id="price" type="number" value="${phone.price_min}" style="margin: 0; width: 100%; padding: 12px; border: 2px solid #002B50; border-radius: 8px; font-size: 14px; box-sizing: border-box; height: 48px;">
            <p style="font-size: 12px; color: #002B50; margin-top: 5px; opacity: 0.7;">
              Harga ini untuk HP tanpa kerusakan apapun
            </p>
          </div>

          <!-- Deductions Section -->
          <div style="border-top: 2px solid #002B50; padding-top: 20px; margin-top: 20px;">
            <h4 style="color: #002B50; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">
              Potongan Kerusakan
            </h4>
            <p style="font-size: 12px; color: #002B50; margin-bottom: 15px; opacity: 0.7;">
              Isi potongan harga untuk setiap kerusakan (dalam Rupiah)
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              ${COMPONENTS.map(comp => `
                <div>
                  <label style="font-size: 12px; color: #002B50; display: block; margin-bottom: 5px; font-weight: 600;">${COMPONENT_LABELS[comp]}</label>
                  <input id="comp_${comp}" type="number" class="swal2-input" value="${deductions[comp] || 0}" style="margin: 0; padding: 10px; font-size: 13px; border: 1px solid #002B50; border-radius: 6px; width: 100%;">
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#002B50',
            cancelButtonColor: '#FFFFFF',
            width: '850px',
            customClass: {
                popup: 'swal-custom-popup',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn'
            },
            preConfirm: () => {
                const price = parseInt(document.getElementById("price").value);
                const custom_deductions = {};
                COMPONENTS.forEach(comp => {
                    const value = parseInt(document.getElementById(`comp_${comp}`).value) || 0;
                    custom_deductions[comp] = value;
                });

                return {
                    model: document.getElementById("model").value,
                    category: document.getElementById("storage").value,
                    year: parseInt(document.getElementById("year").value),
                    price_min: price,
                    price_max: price,
                    custom_deductions,
                };
            },
        });

        if (formValues) {
            try {
                await apiFetch(`/trade-in/admin/phones/${phone.id}`, {
                    method: "PUT",
                    body: JSON.stringify(formValues),
                });
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Data berhasil diupdate",
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchPhones();
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            }
        }
    };

    const handleDelete = async (id, model, category) => {
        const result = await Swal.fire({
            title: "Hapus Data?",
            html: `Yakin ingin menghapus <strong>${model} ${category}</strong>?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        });

        if (result.isConfirmed) {
            try {
                await apiFetch(`/trade-in/admin/phones/${id}`, { method: "DELETE" });
                Swal.fire({
                    icon: "success",
                    title: "Terhapus!",
                    text: "Data berhasil dihapus",
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchPhones();
            } catch (error) {
                Swal.fire("Error", "Gagal menghapus data", "error");
            }
        }
    };

    const filteredPhones = phones.filter(p =>
        p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 bg-[#FFFFFF]">
            {/* Header */}
            <div className="mb-6 bg-[#002B50] text-[#FFFFFF] rounded-lg p-6 shadow-md">
                <h1 className="text-2xl font-bold">Manajemen Tukar Tambah</h1>
                <p className="text-[#FFFFFF]/80 text-sm mt-1">
                    Kelola harga iPhone dan potongan kerusakan
                </p>
            </div>

            {/* Search & Add */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari model atau storage..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002B50] focus:border-transparent outline-none transition shadow-sm"
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-[#002B50] text-[#FFFFFF] rounded-xl font-semibold hover:bg-[#003d75] transition shadow-md"
                >
                    <Plus size={20} />
                    Tambah iPhone
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-12 bg-[#FFFFFF] rounded-lg shadow">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B50] mx-auto"></div>
                    <p className="text-[#002B50] mt-4">Loading...</p>
                </div>
            ) : (
                <div className="bg-[#FFFFFF] rounded-lg shadow-md overflow-hidden border border-[#002B50]/10">
                    <table className="w-full">
                        <thead className="bg-[#002B50] text-[#FFFFFF]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Model</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Storage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tahun</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Harga (No Minus)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#002B50]/10">
                            {filteredPhones.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        Tidak ada data. Klik "Tambah iPhone" untuk menambah data baru.
                                    </td>
                                </tr>
                            ) : (
                                filteredPhones.map((phone, index) => (
                                    <tr key={phone.id} className="hover:bg-[#002B50]/5 transition">
                                        <td className="px-6 py-4 text-sm text-[#002B50]">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-[#002B50]">{phone.model}</td>
                                        <td className="px-6 py-4 text-sm text-[#002B50]/70">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                                {phone.category || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#002B50]/70">{phone.year || '-'}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                            Rp {phone.price_min.toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(phone)}
                                                className="text-[#002B50] hover:text-[#003d75] mr-3 transition"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(phone.id, phone.model, phone.category)}
                                                className="text-red-600 hover:text-red-800 transition"
                                                title="Hapus"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
