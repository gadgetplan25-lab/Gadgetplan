// Get API base URL from environment variable
// Development: http://localhost:8080
// Production: https://api.gadgetplan.id (no port)
export const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
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
    return `${getBaseUrl()}/api`;
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
