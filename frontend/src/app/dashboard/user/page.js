"use client";
import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import {
  Users,
  Search,
  Trash2,
  Shield,
  User,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/admin/users", { credentials: "include" });
      setUsers(data.users || []);
    } catch (err) {
      console.error("Gagal fetch users", err);
      // Swal.fire("Error", err.message || "Gagal memuat data user", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleRoleChange = async (id, role) => {
    try {
      const data = await apiFetch(`/admin/user/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      });

      if (data.message) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        fetchUsers();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Gagal update role", err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || "Tidak dapat mengubah role"
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: "Aksi ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const data = await apiFetch(`/admin/user/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (data.message) {
          Swal.fire("Terhapus!", data.message, "success");
          fetchUsers();
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error("Gagal hapus user", err);
        Swal.fire("Error", err.message || "Tidak dapat menghapus user", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#002B50] tracking-tight">Manajemen User</h1>
          <p className="text-slate-500 mt-1">Kelola akun dan hak akses pengguna.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total User</p>
              <h3 className="text-2xl font-bold text-[#002B50]">{users.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
              <Shield size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Admin</p>
              <h3 className="text-2xl font-bold text-[#002B50]">{users.filter(u => u.role === 'admin').length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari user (nama/email)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#002B50]/20 transition-all text-[#002B50]"
          />
        </div>
      </div>

      {/* Users Grid/Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">Loading data...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <Users size={48} className="mx-auto mb-3 opacity-20" />
                    <p>Tidak ada user ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`
                              appearance-none py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
                              ${user.role === 'admin'
                              ? 'bg-[#002B50] text-white border-transparent focus:ring-[#002B50]'
                              : 'bg-slate-100 text-slate-700 border-slate-200 focus:ring-slate-500'}
                            `}
                        >
                          <option value="customer" className="bg-white text-slate-700">Customer</option>
                          <option value="admin" className="bg-white text-slate-700">Admin</option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                          <MoreHorizontal size={12} className={user.role === 'admin' ? 'text-white/50' : 'text-slate-500'} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          title="Hapus Account"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}