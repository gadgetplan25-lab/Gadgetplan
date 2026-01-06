// Data kota/kabupaten per provinsi (simplified - top cities)
export const cities = {
    "6": [ // DKI Jakarta
        { city_id: "151", city_name: "Jakarta Barat", type: "Kota" },
        { city_id: "152", city_name: "Jakarta Pusat", type: "Kota" },
        { city_id: "153", city_name: "Jakarta Selatan", type: "Kota" },
        { city_id: "154", city_name: "Jakarta Timur", type: "Kota" },
        { city_id: "155", city_name: "Jakarta Utara", type: "Kota" },
        { city_id: "156", city_name: "Kepulauan Seribu", type: "Kabupaten" },
    ],
    "9": [ // Jawa Barat
        { city_id: "22", city_name: "Bandung", type: "Kota" },
        { city_id: "23", city_name: "Bandung Barat", type: "Kabupaten" },
        { city_id: "24", city_name: "Bekasi", type: "Kota" },
        { city_id: "25", city_name: "Bekasi", type: "Kabupaten" },
        { city_id: "26", city_name: "Bogor", type: "Kota" },
        { city_id: "27", city_name: "Bogor", type: "Kabupaten" },
        { city_id: "78", city_name: "Cimahi", type: "Kota" },
        { city_id: "79", city_name: "Cirebon", type: "Kota" },
        { city_id: "80", city_name: "Cirebon", type: "Kabupaten" },
        { city_id: "115", city_name: "Depok", type: "Kota" },
        { city_id: "455", city_name: "Sukabumi", type: "Kota" },
        { city_id: "456", city_name: "Sukabumi", type: "Kabupaten" },
        { city_id: "482", city_name: "Tasikmalaya", type: "Kota" },
        { city_id: "483", city_name: "Tasikmalaya", type: "Kabupaten" },
    ],
    "10": [ // Jawa Tengah
        { city_id: "398", city_name: "Semarang", type: "Kota" },
        { city_id: "399", city_name: "Semarang", type: "Kabupaten" },
        { city_id: "444", city_name: "Solo (Surakarta)", type: "Kota" },
        { city_id: "119", city_name: "Magelang", type: "Kota" },
        { city_id: "120", city_name: "Magelang", type: "Kabupaten" },
        { city_id: "363", city_name: "Purwokerto", type: "Kota" },
        { city_id: "501", city_name: "Tegal", type: "Kota" },
    ],
    "11": [ // Jawa Timur
        { city_id: "444", city_name: "Surabaya", type: "Kota" },
        { city_id: "255", city_name: "Malang", type: "Kota" },
        { city_id: "256", city_name: "Malang", type: "Kabupaten" },
        { city_id: "180", city_name: "Kediri", type: "Kota" },
        { city_id: "181", city_name: "Kediri", type: "Kabupaten" },
        { city_id: "32", city_name: "Blitar", type: "Kota" },
        { city_id: "33", city_name: "Blitar", type: "Kabupaten" },
        { city_id: "280", city_name: "Mojokerto", type: "Kota" },
        { city_id: "281", city_name: "Mojokerto", type: "Kabupaten" },
        { city_id: "353", city_name: "Probolinggo", type: "Kota" },
    ],
    "1": [ // Bali
        { city_id: "114", city_name: "Denpasar", type: "Kota" },
        { city_id: "17", city_name: "Badung", type: "Kabupaten" },
        { city_id: "128", city_name: "Gianyar", type: "Kabupaten" },
        { city_id: "173", city_name: "Tabanan", type: "Kabupaten" },
    ],
    "34": [ // Sumatera Utara
        { city_id: "275", city_name: "Medan", type: "Kota" },
        { city_id: "56", city_name: "Binjai", type: "Kota" },
        { city_id: "118", city_name: "Deli Serdang", type: "Kabupaten" },
        { city_id: "200", city_name: "Pematang Siantar", type: "Kota" },
    ],
};

// Fungsi helper untuk get cities by province
export const getCitiesByProvince = (provinceId) => {
    return cities[provinceId] || [];
};
