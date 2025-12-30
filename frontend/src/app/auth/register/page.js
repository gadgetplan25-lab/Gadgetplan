"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/loadingAnimation";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    province_id: "",
    city_id: "",
    subdistrict_id: "",
    address_detail: "",
    postal_code: "", // ✅ Tambahkan ini
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [wilayahLoading, setWilayahLoading] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [subdistrictSearch, setSubdistrictSearch] = useState("");
  const [provinceSuggestions, setProvinceSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [subdistrictSuggestions, setSubdistrictSuggestions] = useState([]);
  const provinceDebounce = useRef();
  const cityDebounce = useRef();
  const subdistrictDebounce = useRef();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Autocomplete provinsi
  useEffect(() => {
    if (provinceSearch.length < 3) {
      setProvinceSuggestions([]);
      return;
    }
    clearTimeout(provinceDebounce.current);
    provinceDebounce.current = setTimeout(() => {
      fetchProvinces(provinceSearch);
    }, 500); // Naikkan debounce ke 500ms
  }, [provinceSearch]);

  // Autocomplete kota
  useEffect(() => {
    if (!form.province_id || citySearch.length < 3) {
      setCitySuggestions([]);
      return;
    }
    clearTimeout(cityDebounce.current);
    cityDebounce.current = setTimeout(() => {
      fetchCities(form.province_id, citySearch);
    }, 500);
  }, [citySearch, form.province_id]);

  // Autocomplete subdistrict
  useEffect(() => {
    if (!form.city_id || subdistrictSearch.length < 3) {
      setSubdistrictSuggestions([]);
      return;
    }
    clearTimeout(subdistrictDebounce.current);
    subdistrictDebounce.current = setTimeout(() => {
      fetchSubdistricts(form.city_id, subdistrictSearch);
    }, 500);
  }, [subdistrictSearch, form.city_id]);

  // Helper parsing response
  const parseRajaOngkirData = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data; // Komerce standard
    if (data?.rajaongkir?.results && Array.isArray(data.rajaongkir.results)) return data.rajaongkir.results; // RajaOngkir standard
    return [];
  };

  // Gunakan fallback jika env tidak terbaca ATAU masih Ngrok (tapi ngrok mati)
  let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  if (API_BASE_URL.includes("ngrok")) {
    API_BASE_URL = "http://localhost:4000/api";
  }

  const fetchProvinces = async (search) => {
    // 🔥 Prevent Empty Search causing API Error
    if (!search || search.trim().length === 0) {
      setProvinceSuggestions([]);
      return;
    }

    setWilayahLoading(true);
    try {
      const url = `${API_BASE_URL}/user/rajaongkir/province?search=${encodeURIComponent(search)}`;
      console.log("Fetching provinces:", url);

      const res = await fetch(url, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setProvinceSuggestions(parseRajaOngkirData(data));
    } catch (err) {
      console.error("Fetch province failed:", err);
      setProvinceSuggestions([]);
    }
    setWilayahLoading(false);
  };

  const fetchCities = async (province_id, search) => {
    if (!province_id) return;
    // 🔥 Prevent Empty Search
    if (!search || search.trim().length === 0) {
      setCitySuggestions([]);
      return;
    }

    setWilayahLoading(true);
    try {
      const url = `${API_BASE_URL}/user/rajaongkir/city?province=${province_id}&search=${encodeURIComponent(search)}`;

      const res = await fetch(url, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setCitySuggestions(parseRajaOngkirData(data));
    } catch (err) {
      console.error("Fetch city failed:", err);
      setCitySuggestions([]);
    }
    setWilayahLoading(false);
  };

  const fetchSubdistricts = async (city_id, search) => {
    if (!city_id) return;
    // 🔥 Prevent Empty Search
    if (!search || search.trim().length === 0) {
      setSubdistrictSuggestions([]);
      return;
    }

    setWilayahLoading(true);
    try {
      const url = `${API_BASE_URL}/user/rajaongkir/subdistrict?city=${city_id}&search=${encodeURIComponent(search)}`;

      const res = await fetch(url, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setSubdistrictSuggestions(parseRajaOngkirData(data));
    } catch (err) {
      console.error("Fetch subdistrict failed:", err);
      setSubdistrictSuggestions([]);
    }
    setWilayahLoading(false);
  };

  const handleProvinceChange = (e) => {
    setForm((prev) => ({
      ...prev,
      province_id: e.target.value,
      city_id: "",
      subdistrict_id: "",
    }));
    setCities([]);
    setSubdistricts([]);
    if (e.target.value) fetchCities(e.target.value);
  };

  const handleCityChange = (e) => {
    setForm((prev) => ({
      ...prev,
      city_id: e.target.value,
      subdistrict_id: "",
    }));
    setSubdistricts([]);
  };

  const handleSubdistrictChange = (e) => {
    setForm((prev) => ({
      ...prev,
      subdistrict_id: e.target.value,
    }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 🔥 TEMPORARY: Disable validasi city_id karena autocomplete error
    // if (!form.city_id) {
    //   setMessage("Silakan pilih kota/kabupaten dari daftar autokomplit.");
    //   setLoading(false);
    //   return;
    // }

    // Konstruksi alamat lengkap
    // Format: "Kecamatan, Alamat Detail" (agar lebih rapi)
    let fullAddress = form.address_detail;
    if (subdistrictSearch) {
      fullAddress = `${subdistrictSearch}, ${fullAddress}`;
    }

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: fullAddress, // Kirim alamat yang sudah digabung
          city_id: form.city_id || "1", // Default city_id jika kosong
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl w-full max-w-md md:max-w-2xl p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-xs sm:text-sm text-gray-600 text-center mb-4 sm:mb-6">
          Enter your details to create a new account
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kolom 1 */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={form.name}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="No. Telepon"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Kolom 2 */}
            <div>
              {/* Autocomplete Provinsi */}
              <label className="block mb-1 text-sm text-gray-700">Provinsi</label>
              <input
                type="text"
                placeholder="Ketik nama provinsi (min 3 huruf)"
                value={provinceSearch}
                onChange={e => {
                  setProvinceSearch(e.target.value);
                  setForm(prev => ({ ...prev, province_id: "" }));
                }}
                className="border border-gray-300 p-3 w-full mb-2 rounded-lg text-gray-900 text-sm"
                autoComplete="off"
              />
              {provinceSuggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {provinceSuggestions.map((prov) => (
                    <li
                      key={prov.id}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm text-gray-700"
                      onClick={() => {
                        setForm(prev => ({ ...prev, province_id: prov.id, city_id: "", subdistrict_id: "" }));
                        setProvinceSearch(prov.province_name);
                        setProvinceSuggestions([]);
                      }}
                    >
                      {prov.province_name}
                    </li>
                  ))}
                </ul>
              )}

              {/* Autocomplete Kota/Kabupaten */}
              <label className="block mt-3 mb-1 text-sm text-gray-700">Kabupaten/Kota</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik nama kabupaten/kota (min 3 huruf)"
                  value={citySearch}
                  onChange={e => {
                    setCitySearch(e.target.value);
                    setForm(prev => ({ ...prev, city_id: "", subdistrict_id: "" }));
                  }}
                  className={`border p-3 w-full rounded-lg text-gray-900 text-sm ${!form.province_id ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                  disabled={!form.province_id}
                  autoComplete="off"
                />
                {citySuggestions.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {citySuggestions.map((city) => (
                      <li
                        key={city.id}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm text-gray-700"
                        onClick={() => {
                          setForm(prev => ({ ...prev, city_id: city.id, subdistrict_id: "" }));
                          setCitySearch(city.city_name);
                          setCitySuggestions([]);
                        }}
                      >
                        {city.type} {city.city_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Autocomplete Kecamatan/Kampung/Desa */}
              <label className="block mt-3 mb-1 text-sm text-gray-700">Kecamatan/Desa/Kampung</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik nama kecamatan/desa/kampung (min 3 huruf)"
                  value={subdistrictSearch}
                  onChange={e => {
                    setSubdistrictSearch(e.target.value);
                    setForm(prev => ({ ...prev, subdistrict_id: "" }));
                  }}
                  className={`border p-3 w-full rounded-lg text-gray-900 text-sm ${!form.city_id ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                  disabled={!form.city_id}
                  autoComplete="off"
                />
                {subdistrictSuggestions.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {subdistrictSuggestions.map((sub) => (
                      <li
                        key={sub.id}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm text-gray-700"
                        onClick={() => {
                          setForm(prev => ({ ...prev, subdistrict_id: sub.id }));
                          setSubdistrictSearch(sub.subdistrict_name);
                          setSubdistrictSuggestions([]);
                        }}
                      >
                        {sub.subdistrict_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <input
                type="text"
                name="postal_code"
                placeholder="Kode Pos"
                value={form.postal_code}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
              />

              <label className="block mb-1 text-sm text-gray-700">
                Alamat Lengkap
              </label>
              <textarea
                name="address_detail"
                placeholder="Alamat lengkap (nama jalan, RT/RW, dst)"
                value={form.address_detail}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full mb-3 text-gray-900 text-sm rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-70"
          >
            {loading ? "Loading..." : "Continue →"}
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>

          {message && (
            <p
              className={`mt-4 text-sm text-center ${message.includes("OTP") ? "text-green-600" : "text-red-600"
                }`}
            >
              {message}
            </p>
          )}

          {wilayahLoading && (
            <div className="text-xs text-gray-500 text-center mt-2">
              Memuat wilayah...
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
