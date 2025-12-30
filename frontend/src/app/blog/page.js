"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SkeletonBlog from "@/components/SkeletonBlog";
import { formatTimeAgo } from "@/utils/time";
import LoadingAnimation from "@/components/loadingAnimation";
import Link from "next/link";

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true);
        const res = await fetch("http://localhost:4000/api/blogs");
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

  if (blogs.length === 0) {
    return (
      <>
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartCount={cartCount}
          setCartCount={setCartCount}
        />
        <div className="text-center py-12 sm:py-20 px-4 text-sm xs:text-base sm:text-lg">Belum ada blog tersedia.</div>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#002B50]">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        setCartCount={setCartCount}
      />

      {blogsLoading ? (
        <SkeletonBlog />
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 sm:py-20 px-4 text-sm xs:text-base sm:text-lg">Belum ada blog tersedia.</div>
      ) : (
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Blog utama */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link
              href={`/blog/${blogs[0].slug}`}
              className="lg:col-span-2 relative rounded-xl overflow-hidden shadow-lg block h-64 sm:h-80 md:h-96"
            >
              <Image
                src={`http://localhost:4000/public/${blogs[0].banner_image}`}
                alt={blogs[0].title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                loading="eager"
                priority
                quality={90}
              />
              <div className="absolute bottom-0 left-0 p-3 xs:p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent text-white w-full">
                <p className="text-xs sm:text-sm">{formatTimeAgo(blogs[0].createdAt)}</p>
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold leading-tight">{blogs[0].title}</h2>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-2">
                  {blogs[0].contents?.find((c) => c.type === "text")?.content}
                </p>
              </div>
            </Link>

            {/* 3 berita kecil */}
            <div className="space-y-4 sm:space-y-6">
              {blogs.slice(1, 4).map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="flex gap-3 sm:gap-4 items-center"
                >
                  <div className="relative w-20 h-16 sm:w-28 sm:h-20 flex-shrink-0">
                    <Image
                      src={`http://localhost:4000/public/${blog.banner_image}`}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 640px) 80px, 112px"
                      className="object-cover rounded-lg"
                      loading="lazy"
                      quality={80}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formatTimeAgo(blog.createdAt)}
                    </p>
                    <h3 className="font-semibold text-xs xs:text-sm sm:text-base line-clamp-2 leading-tight">{blog.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Grid bawah */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
            {blogs.slice(4).map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={`http://localhost:4000/public/${blog.banner_image}`}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                    quality={85}
                  />
                </div>
                <div className="p-3 xs:p-4 sm:p-5">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">
                    {formatTimeAgo(blog.createdAt)}
                  </p>
                  <h3 className="font-semibold text-sm xs:text-base sm:text-lg leading-tight">{blog.title}</h3>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 line-clamp-2">
                    {blog.contents?.find((c) => c.type === "text")?.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default BlogPage;