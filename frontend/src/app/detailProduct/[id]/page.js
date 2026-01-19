import ProductDetailClient from "./ProductDetailClient";

// Helper to fetch data for SEO
async function getProduct(id) {
    // Use backend URL directly inside container/server context
    // Fallback to localhost:8080 if env not set
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    // Remove /api if present because routes are at /api/user/...
    // Wait, backend routes are /api/user/products/:id.
    // getApiUrl client side appends /api. 
    // Config backend says baseUrl/api.
    // Let's assume URL is http://localhost:8080

    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    try {
        // Note: Backend endpoint is /api/user/products/:id
        const res = await fetch(`${cleanBaseUrl}/api/user/products/${id}`, {
            cache: "no-store"
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("SEO Fetch Error:", error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = params;
    const data = await getProduct(id);
    // Backend returns { product: ... } now (after my fix)
    const product = data?.product;

    if (!product) {
        return {
            title: "Produk Tidak Ditemukan | GadgetPlan",
        };
    }

    const price = product.price ? `Rp ${parseInt(product.price).toLocaleString("id-ID")}` : "Harga Terbaik";
    const desc = product.description ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 160) : `Beli ${product.name} termurah di GadgetPlan.`;

    // Construct Image URL
    let imageUrl = "";
    if (product.ProductImages && product.ProductImages.length > 0) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        imageUrl = `${cleanBaseUrl}/public/products/${product.ProductImages[0].image_url}`;
    }

    return {
        title: `${product.name} - ${price} | GadgetPlan`,
        description: desc,
        openGraph: {
            title: `${product.name} | GadgetPlan`,
            description: desc,
            images: imageUrl ? [imageUrl] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} - ${price}`,
            description: desc,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export default function Page() {
    return <ProductDetailClient />;
}
