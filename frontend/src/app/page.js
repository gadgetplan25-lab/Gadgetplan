import Link from "next/link";
import { FaShoppingCart, FaWrench, FaWhatsapp } from "react-icons/fa";

// Server Components - NO client-side JavaScript
import Navbar from "@/components/navbar";
import ProductCard from "@/components/productCard";
import PopularServices from "@/components/PopularServices";
import Footer from "@/components/footer";

// Server-side data fetching with build-time fallback
async function getProducts() {
  // Skip API call during build if API is not available
  if (process.env.SKIP_API_FETCH === 'true') {
    console.log('⚠️ Skipping API fetch during build');
    return [];
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    // Add timeout to prevent hanging during build
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(`${apiUrl}/api/user/products`, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
      cache: 'force-cache',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`⚠️ API returned ${res.status}, using empty products`);
      return [];
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    // Suppress error during build, just log warning
    if (error.name === 'AbortError') {
      console.warn('⚠️ API fetch timeout, using empty products');
    } else {
      console.warn('⚠️ Failed to fetch products:', error.message);
    }
    return [];
  }
}

export default async function HomePage() {
  // Fetch products on server - NO client-side loading
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-12 sm:gap-16 md:gap-24 pb-12 sm:pb-16 pt-4 sm:pt-6 md:pt-12" role="main">

        {/* Hero Section */}
        <section className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-[#002B50] mb-3 sm:mb-4 md:mb-6">
              Toko & Service iPhone Premium
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
              Aksesori original & layanan perbaikan cepat bergaransi.
            </p>
            <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#002B50] text-white px-6 sm:px-8 py-3 sm:py-3.5 min-h-[48px] rounded-xl font-bold text-sm sm:text-base hover:bg-[#003b6e] transition-all shadow-lg hover:-translate-y-0.5"
                aria-label="Browse products"
              >
                <FaShoppingCart className="mr-2 h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" />
                Belanja Sekarang
              </Link>
              <Link
                href="/serviceGo"
                className="w-full sm:w-auto inline-flex items-center justify-center text-[#002B50] bg-white border-2 border-slate-200 hover:border-[#002B50] px-6 sm:px-8 py-3 sm:py-3.5 min-h-[48px] rounded-xl font-bold text-sm sm:text-base transition-all hover:bg-slate-50 shadow-sm hover:-translate-y-0.5"
                aria-label="View repair services"
              >
                <FaWrench className="mr-2 h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" />
                Layanan Service
              </Link>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section className="container mx-auto px-4">
          <div className="flex flex-row justify-between items-center mb-6 sm:mb-8 gap-2 sm:gap-4">
            <div className="flex-1">
              <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-[#002B50] mb-1 sm:mb-2">Produk Terbaru</h2>
              <p className="hidden sm:block text-slate-500 text-xs sm:text-sm">Pilihan gadget terbaik untukmu</p>
            </div>
            <Link
              href="/products"
              className="text-[#002B50] font-semibold hover:text-[#004a8f] transition-colors flex items-center gap-1 sm:gap-2 group text-xs xs:text-sm md:text-base whitespace-nowrap flex-shrink-0"
            >
              Lihat Semua
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Products - Server-rendered, no loading state needed */}
          <div className="w-full">
            <ProductCard products={products.slice(0, 12)} />
          </div>
        </section>

        {/* Services Section */}
        <div className="-my-4 sm:-my-8">
          <PopularServices />
        </div>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <div className="bg-[#002B50] text-white rounded-2xl sm:rounded-[24px] md:rounded-[40px] relative overflow-hidden shadow-2xl px-4 sm:px-6 py-8 sm:py-12 md:py-20 md:px-12 text-center">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
                Punya Kendala dengan Device Anda?
              </h2>
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-blue-100/90 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
                Konsultasi gratis dengan teknisi ahli kami.
              </p>

              <Link
                href="/konsultasi"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] rounded-full text-sm sm:text-base md:text-lg shadow-lg hover:shadow-[#25D366]/40 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                aria-label="Start free consultation via WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                <span>Konsultasi Gratis</span>
              </Link>
            </div>
          </div>
        </section>

      </main >
      <Footer />
    </>
  );
}

// Enable ISR
export const revalidate = 60; // Revalidate every 60 seconds