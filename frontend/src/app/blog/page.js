"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { formatTimeAgo } from "@/utils/time";
import LoadingAnimation from "@/components/loadingAnimation";
import Link from "next/link";
import { getApiUrl, getBaseUrl } from "@/lib/config";

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true);
        const res = await fetch(`${getApiUrl()}/blogs`);
        const data = await res.json();
        setBlogs(data);
        setBlogsLoading(false);
      } catch (err) {
        console.error("Gagal ambil blogs:", err);
        setBlogsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#002B50]">
        <LoadingAnimation />
      </div>
    );
  }

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBlog = filteredBlogs[0];
  const recentBlogs = filteredBlogs.slice(1);
  const displayedBlogs = showAll ? recentBlogs : recentBlogs.slice(0, 5);

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        setCartCount={setCartCount}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari artikel atau HP..."
                className="w-full px-4 py-3 pl-12 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002B50] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {blogsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#002B50] border-t-transparent"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Belum ada blog tersedia.</div>
          ) : (
            <>
              {/* Featured Blog */}
              {featuredBlog && (
                <Link href={`/blog/${featuredBlog.slug}`} className="block mb-8">
                  <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden group">
                    <Image
                      src={`${getBaseUrl()}/public/${featuredBlog.banner_image}`}
                      alt={featuredBlog.title}
                      fill
                      sizes="100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                      quality={90}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-medium">
                          Review
                        </span>
                        <span className="text-sm text-white/80">10 Min Read</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 line-clamp-2">
                        {featuredBlog.title}
                      </h2>
                      <p className="text-sm sm:text-base text-white/90 line-clamp-2">
                        {featuredBlog.contents?.find((c) => c.type === "text")?.content}
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              {/* Artikel Terbaru Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#002B50]">Artikel Terbaru</h3>
                  {recentBlogs.length > 0 && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-sm text-[#002B50] hover:underline flex items-center gap-1"
                    >
                      {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua"}
                      <svg
                        className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Blog List */}
                <div className="space-y-4">
                  {displayedBlogs.map((blog, index) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="flex gap-4 bg-white p-4 rounded-xl hover:shadow-md transition group"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={`${getBaseUrl()}/public/${blog.banner_image}`}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 640px) 96px, 112px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          quality={80}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#002B50] mb-1 line-clamp-2 text-sm sm:text-base">
                          {blog.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{formatTimeAgo(blog.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPage;