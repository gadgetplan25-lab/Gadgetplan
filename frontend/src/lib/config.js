// Development: http://localhost:8080
// Production: https://api.gadgetplan.id (no port)
export const getBaseUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    // Remove trailing slash and /api if present to get clean base URL
    const cleanUrl = url.replace(/\/api\/?$/, "").replace(/\/+$/, "");

    // Debug log
    if (typeof window !== "undefined") {
        // console.log("🌐 Base URL Config:", { raw: url, clean: cleanUrl });
    }

    return cleanUrl;
};

// Helper untuk URL gambar produk
export const getProductImageUrl = (filename) => {
    if (!filename) return "";
    if (filename.startsWith("http")) return filename;

    const baseUrl = getBaseUrl();
    return `${baseUrl}/public/products/${filename}`;
};

// Helper untuk URL API
export const getApiUrl = () => {
    const apiUrl = `${getBaseUrl()}/api`;

    // Debug log
    if (typeof window !== "undefined") {
        console.log("🔗 API Endpoint:", apiUrl);
    }

    return apiUrl;
};

// Helper untuk URL gambar blog
export const getBlogImageUrl = (filename) => {
    if (!filename) return "";
    if (filename.startsWith("http")) return filename;

    const baseUrl = getBaseUrl();
    // Remove leading slashes
    const cleanFilename = filename.replace(/^\/+/, "");
    return `${baseUrl}/public/${cleanFilename}`;
};
