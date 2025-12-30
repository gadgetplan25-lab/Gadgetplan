"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { formatTimeAgo } from "@/utils/time";
import LoadingAnimation from "@/components/loadingAnimation";
import Link from "next/link";
import Footer from "@/components/footer";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/blogs/${slug}`);
        const data = await res.json();
        setBlog(data);
        const resAll = await fetch("http://localhost:4000/api/blogs?sort=desc");
        let allBlogs = await resAll.json();
        allBlogs = allBlogs.filter((b) => b.slug !== slug);

        const latest = allBlogs.slice(0, 6);
        const featured = allBlogs.slice(6, 11);

        setLatestBlogs(latest);
        setFeaturedBlogs(featured);
      } catch (err) {
        console.error("Gagal ambil detail blog:", err);
      }
    };

    fetchBlogDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#002B50]">
        <LoadingAnimation />
      </div>
    );
  }

  if (!blog) {
  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        setCartCount={setCartCount}
      />
      <div className="text-center py-20">Belum ada blog tersedia.</div>
    </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Judul + waktu + tombol share */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{formatTimeAgo(blog.createdAt)}</p>
          <div className="mt-2 flex gap-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg"
              onClick={() =>
                navigator.share
                  ? navigator.share({ title: blog.title, url: window.location.href })
                  : alert("Fitur share tidak tersedia di browser ini")
              }
            >
              Bagikan
            </button>
          </div>
        </div>

        {/* Grid dua kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kiri: banner + konten */}
          <div className="lg:col-span-2">
            {/* Banner Image */}
            <img
              src={`http://localhost:4000/public/${blog.banner_image.replace(/^\/+/, "")}`}
              alt={blog.title}
              crossOrigin="anonymous"
              className="w-full h-96 object-cover rounded-lg mb-6"
            />

            {/* Konten dinamis */}
            <div className="prose max-w-none">
              {blog.contents?.map((c, i) =>
                c.type === "text" ? (
                  <p key={i}>{c.content}</p>
                ) : c.type === "image" ? (
                  <img
                    key={i}
                    src={`http://localhost:4000/public/${(c.content || c.image_url).replace(/^\/+/, "")}`}
                    alt={`konten-${i}`}
                    crossOrigin="anonymous"
                    className="my-4 rounded-lg"
                  />
                ) : null
              )}
            </div>
          </div>

          {/* Kanan: Difiturkan + Terbaru */}
          <div className="space-y-8">
            {/* Difiturkan */}
            <div>
              <h3 className="font-bold text-lg mb-4">Difiturkan</h3>
              {featuredBlogs.length > 0 ? (
                featuredBlogs.map((f) => (
                  <Link key={f.id} href={`/blog/${f.slug}`} className="block mb-3">
                    <div className="flex gap-3 items-center">
                      <img
                        src={`http://localhost:4000/public/${f.banner_image.replace(/^\/+/, "")}`}
                        alt={f.title}
                        crossOrigin="anonymous"
                        className="w-20 h-14 object-cover rounded-md"
                      />
                      <p className="text-sm font-medium">{f.title}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada</p>
              )}
            </div>

            {/* Blog Terbaru */}
            <div>
              <h3 className="font-bold text-lg mb-4">Blog Terbaru</h3>
              {latestBlogs.length > 0 ? (
                latestBlogs.map((b) => (
                  <Link key={b.id} href={`/blog/${b.slug}`} className="block mb-3">
                    <div className="flex gap-3 items-center">
                      <img
                        src={`http://localhost:4000/public/${b.banner_image.replace(/^\/+/, "")}`}
                        alt={b.title}
                        crossOrigin="anonymous"
                        className="w-20 h-14 object-cover rounded-md"
                      />
                      <p className="text-sm font-medium">{b.title}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}