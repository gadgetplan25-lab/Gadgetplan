"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ProductCard from "@/components/productCard";
import SkeletonCard from "@/components/SkeletonCard";
import { apiFetch } from "@/lib/api";
import ShiningText from "@/components/shiningText";
import LoadingAnimation from "@/components/loadingAnimation";
import FilterContent from "@/components/FilterContent";

// Dynamic imports for better performance
const Navbar = dynamic(() => import("@/components/navbar"), {
  loading: () => <div className="h-16 bg-white animate-pulse" />,
});

const Footer = dynamic(() => import("@/components/footer"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
});

export default function ProductPage() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);
  const [storages, setStorages] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedStorages, setSelectedStorages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        const [catRes, tagRes, colorRes, storageRes, prodRes] = await Promise.all([
          apiFetch("/user/categories"),
          apiFetch("/tags"),
          apiFetch("/colors"),
          apiFetch("/storages"),
          apiFetch("/user/products"),
        ]);
        setCategories(catRes.categories || []);
        setTags(tagRes.tags || []);
        setColors(colorRes.colors || []);
        setStorages(storageRes.storages || []);
        setProducts(prodRes.products || []);
        setProductsLoading(false);
      } catch (err) {
        console.error("Gagal fetch data:", err);
        setProductsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.name?.toLowerCase().includes(searchQuery?.toLowerCase() || "") ?? true;
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.Category?.id);
    const matchTags =
      selectedTags.length === 0 || product.tags?.some((tag) => selectedTags.includes(tag.id));
    const matchColors =
      selectedColors.length === 0 || product.colors?.some((c) => selectedColors.includes(c.name));
    const matchStorages =
      selectedStorages.length === 0 ||
      product.storages?.some((s) => selectedStorages.includes(s.name));
    return matchSearch && matchCategory && matchTags && matchColors && matchStorages;
  });

  // Reset halaman saat search atau filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedTags, selectedColors, selectedStorages]);

  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = startIdx + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#002B50]">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <ShiningText
          text="Produk Kami"
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 py-2 sm:py-4 flex justify-center"
          duration={6}
        />
        <p className="text-xs sm:text-sm md:text-base text-[#002B50]/70 mt-1 flex justify-center text-center px-4">
          Temukan berbagai produk yang tersedia
        </p>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Sidebar Filter (desktop) */}
        <div className="hidden lg:block lg:w-[20%] sticky top-24">
          <FilterContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            colors={colors}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            storages={storages}
            selectedStorages={selectedStorages}
            setSelectedStorages={setSelectedStorages}
          />
        </div>

        {/* Product Area */}
        <div className="w-full">
          {/* Mobile search + filter button */}
          <div className="flex items-center gap-2 mb-4 lg:hidden">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#002B50] focus:ring-1 focus:ring-[#002B50]"
            />
            <button
              onClick={() => setShowFilter(true)}
              className="px-4 py-2.5 min-h-[44px] bg-[#002B50] text-white rounded-lg text-sm font-medium whitespace-nowrap"
            >
              Filter
            </button>
          </div>

          {/* Product Cards */}
          <div className="overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
            <div className="flex gap-4 min-w-full" style={{ scrollSnapAlign: "start" }}>
              {productsLoading ? (
                <SkeletonCard count={12} />
              ) : (
                <ProductCard products={paginatedProducts} />
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 min-h-[44px] rounded bg-gray-200 text-[#002B50] disabled:opacity-50 text-xs sm:text-sm font-medium"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 sm:px-4 py-2 min-h-[44px] rounded text-xs sm:text-sm font-medium ${currentPage === i + 1 ? "bg-[#002B50] text-white" : "bg-gray-100 text-[#002B50]"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 min-h-[44px] rounded bg-gray-200 text-[#002B50] disabled:opacity-50 text-xs sm:text-sm font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold text-[#002B50]">Filter Produk</h2>
              <button onClick={() => setShowFilter(false)} className="text-red-500 font-bold text-2xl w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-full">
                ×
              </button>
            </div>
            <FilterContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              tags={tags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              colors={colors}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              storages={storages}
              selectedStorages={selectedStorages}
              setSelectedStorages={setSelectedStorages}
            />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
