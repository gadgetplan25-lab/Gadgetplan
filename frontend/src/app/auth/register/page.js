"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import LoadingAnimation from "@/components/loadingAnimation";
import { provinces as staticProvinces } from "@/data/provinces";
import { getCitiesByProvince } from "@/data/cities";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    province_id: "",
    city_id: "",
    subdistrict: "", // Changed from subdistrict_id to text
    address_detail: "",
    postal_code: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const router = useRouter();

  // Load provinces saat component mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);

    // Langsung gunakan static data

    setProvinces(staticProvinces);

    return () => clearTimeout(timer);
  }, []);

  // Load cities ketika province dipilih
  useEffect(() => {
    if (!form.province_id) {
      setCities([]);
      return;
    }

    // Gunakan static data

    const cityList = getCitiesByProvince(form.province_id);

    setCities(cityList);
  }, [form.province_id]);


  const handleProvinceChange = (e) => {
    setForm((prev) => ({
      ...prev,
      province_id: e.target.value,
      city_id: "",
      subdistrict: "",
    }));
  };

  const handleCityChange = (e) => {
    setForm((prev) => ({
      ...prev,
      city_id: e.target.value,
      subdistrict: "",
    }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address_detail,
          city_id: form.city_id || "1",
          postal_code: form.postal_code,
        }),
      });

      if (data?.userId) {
        setMessage("✅ Registrasi berhasil! OTP dikirim ke email.");
        setTimeout(
          () => router.push(`/auth/verify-register?email=${form.email}`),
          1500
        );
        return;
      }

      throw new Error(data?.message || "Register gagal.");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-6 sm:py-8">
      <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl w-full max-w-md md:max-w-2xl p-5 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-3 text-[#002B50]">Create Account</h2>
        <p className="text-xs sm:text-sm text-gray-600 text-center mb-5 sm:mb-6">
          Enter your details to create a new account
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Kolom 1 */}
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={form.name}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="No. Telepon"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Kolom 2 */}
            <div className="space-y-4">
              {/* Dropdown Provinsi */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Provinsi</label>
                <select
                  value={form.province_id}
                  onChange={handleProvinceChange}
                  className="border border-gray-300 p-3 w-full rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((prov) => (
                    <option key={prov.province_id} value={prov.province_id}>
                      {prov.province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown Kota/Kabupaten */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Kabupaten/Kota</label>
                <select
                  value={form.city_id}
                  onChange={handleCityChange}
                  className={`border p-3 w-full rounded-lg text-gray-900 text-sm ${!form.province_id ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                  disabled={!form.province_id}
                  required
                >
                  <option value="">Pilih Kabupaten/Kota</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.type} {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Input Kecamatan */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Kecamatan</label>
                <input
                  type="text"
                  name="subdistrict"
                  value={form.subdistrict}
                  onChange={handleChange}
                  placeholder="Contoh: Kebayoran Baru"
                  className="border border-gray-300 p-3 w-full rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <input
                type="text"
                name="postal_code"
                placeholder="Kode Pos"
                value={form.postal_code}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
              />

              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">
                  Alamat Lengkap
                </label>
                <textarea
                  name="address_detail"
                  placeholder="Alamat lengkap (nama jalan, RT/RW, dst)"
                  value={form.address_detail}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full text-gray-900 text-sm rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#002B50] text-white py-3.5 rounded-lg font-medium hover:bg-[#003b6e] transition disabled:opacity-70 mt-6"
          >
            {loading ? "Loading..." : "Continue →"}
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="text-red-600 hover:underline">
              Sign in
            </a>
          </p>




        </form>
      </div>
    </div>
  );
}
