/**
 * Manual Shipping Cost Calculator
 * Zona-based pricing untuk Indonesia
 */

// Definisi zona pengiriman
const SHIPPING_ZONES = {
    JAKARTA: ['151', '152', '153', '154', '155'], // Jakarta Barat, Pusat, Selatan, Timur, Utara
    JABODETABEK: ['24', '26', '115'], // Bekasi, Bogor, Depok
    JAWA_BARAT: ['22', '78', '79', '455', '482'], // Bandung, Cimahi, Cirebon, Sukabumi, Tasikmalaya
    JAWA_TENGAH: ['398', '444', '119', '501'], // Semarang, Solo, Magelang, Tegal
    JAWA_TIMUR: ['444', '255', '180', '32', '280'], // Surabaya, Malang, Kediri, Blitar, Mojokerto
    BALI: ['114', '17', '128', '173'], // Denpasar, Badung, Gianyar, Tabanan
    SUMATERA: ['275', '56', '118', '200'], // Medan, Binjai, Deli Serdang, Pematang Siantar
};

// Harga ongkir per zona (dalam Rupiah)
const SHIPPING_RATES = {
    JAKARTA: 10000,
    JABODETABEK: 15000,
    JAWA_BARAT: 20000,
    JAWA_TENGAH: 25000,
    JAWA_TIMUR: 30000,
    BALI: 35000,
    SUMATERA: 40000,
    LUAR_JAWA: 50000, // Default untuk wilayah lain
};

// Estimasi waktu pengiriman (dalam hari)
const DELIVERY_ESTIMATES = {
    JAKARTA: '1-2',
    JABODETABEK: '2-3',
    JAWA_BARAT: '2-4',
    JAWA_TENGAH: '3-5',
    JAWA_TIMUR: '3-5',
    BALI: '4-6',
    SUMATERA: '5-7',
    LUAR_JAWA: '7-14',
};

/**
 * Hitung ongkir berdasarkan city_id tujuan
 * @param {string} destinationCityId - ID kota tujuan
 * @param {number} weight - Berat paket (gram) - opsional untuk future use
 * @returns {Object} - { cost, zone, estimate }
 */
function calculateShippingCost(destinationCityId, weight = 1000) {
    // Cari zona berdasarkan city_id
    let zone = 'LUAR_JAWA';

    for (const [zoneName, cityIds] of Object.entries(SHIPPING_ZONES)) {
        if (cityIds.includes(destinationCityId)) {
            zone = zoneName;
            break;
        }
    }

    const cost = SHIPPING_RATES[zone];
    const estimate = DELIVERY_ESTIMATES[zone];

    return {
        cost,
        zone,
        estimate,
        service: 'Reguler', // Bisa ditambah Express, Same Day, dll
    };
}

/**
 * Get semua opsi pengiriman (untuk future: multiple services)
 * @param {string} destinationCityId 
 * @returns {Array} - Array of shipping options
 */
function getShippingOptions(destinationCityId) {
    const basic = calculateShippingCost(destinationCityId);

    return [
        {
            service: 'Reguler',
            description: `Pengiriman reguler (${basic.estimate} hari)`,
            cost: basic.cost,
            estimate: basic.estimate,
        },
        // Bisa ditambah opsi lain:
        // {
        //   service: 'Express',
        //   description: 'Pengiriman cepat',
        //   cost: basic.cost * 1.5,
        //   estimate: '1-2 hari',
        // }
    ];
}

module.exports = {
    calculateShippingCost,
    getShippingOptions,
    SHIPPING_ZONES,
    SHIPPING_RATES,
};
