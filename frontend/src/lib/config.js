export const getBaseUrl = () => {
    // Prioritas: gunakan env variable jika ada (untuk ngrok/production)
    // Fallback: gunakan window.location (untuk development lokal)
    const envBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (envBackendUrl) {
        return envBackendUrl;
    }

    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.hostname}:4000`;
    }

    return "http://localhost:4000";
};

// Helper untuk URL gambar produk - SELALU gunakan localhost untuk development
export const getProductImageUrl = (filename) => {
    if (!filename) return "";
    if (filename.startsWith("http")) return filename;

    // Untuk gambar, gunakan localhost langsung (tidak via ngrok)
    // Karena gambar disimpan di server lokal
    const imageBaseUrl = typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.hostname}:4000`
        : "http://localhost:4000";

    return `${imageBaseUrl}/public/products/${filename}`;
};

// Helper untuk URL API - gunakan ngrok jika ada
export const getApiUrl = () => {
    return `${getBaseUrl()}/api`;
};
