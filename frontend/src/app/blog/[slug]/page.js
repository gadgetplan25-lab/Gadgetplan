"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { formatTimeAgo } from "@/utils/time";
import LoadingAnimation from "@/components/loadingAnimation";
import Link from "next/link";
import Footer from "@/components/footer";
import Image from "next/image";
import { getBlogImageUrl, getApiUrl, getBaseUrl } from "@/lib/config";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/blogs/${slug}`);
        const data = await res.json();
        setBlog(data);
        const resAll = await fetch(`${getApiUrl()}/blogs?sort=desc`);
        let allBlogs = await resAll.json();
        allBlogs = allBlogs.filter((b) => b.slug !== slug);

        const latest = allBlogs.slice(0, 5);
        setLatestBlogs(latest);
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
        <Navbar />
        <div className="text-center py-20">Blog tidak ditemukan.</div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Main Content */}
            <article className="lg:col-span-3">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002B50] mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTimeAgo(blog.createdAt)}
                </div>
                <button
                  onClick={() =>
                    navigator.share
                      ? navigator.share({ title: blog.title, url: window.location.href })
                      : alert("Fitur share tidak tersedia")
                  }
                  className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#002B50] bg-white border border-[#002B50] hover:bg-[#002B50] hover:text-white rounded-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Bagikan
                </button>
              </div>

              {/* Featured Image */}
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={getBlogImageUrl(blog.banner_image)}
                  alt={blog.title}
                  className="w-full h-auto"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/default-blog.png"; }}
                />
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {blog.contents?.map((c, i) =>
                  c.type === "text" ? (
                    <p key={i} className="text-gray-700 text-lg leading-relaxed mb-6">
                      {c.content}
                    </p>
                  ) : c.type === "image" ? (
                    <div key={i} className="my-10 rounded-2xl overflow-hidden">
                      <img
                        src={getBlogImageUrl(c.content || c.image_url)}
                        alt={`konten-${i}`}
                        className="w-full h-auto"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/default-blog.png"; }}
                      />
                    </div>
                  ) : null
                )}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              {/* Blog Terbaru */}
              <div>
                <h3 className="text-xl font-bold text-[#002B50] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#002B50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Blog Terbaru
                </h3>
                {latestBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {latestBlogs.map((b) => (
                      <Link key={b.id} href={`/blog/${b.slug}`} className="group block">
                        <div className="flex gap-3">
                          <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={`${getBaseUrl()}/public/${b.banner_image}`}
                              alt={b.title}
                              fill
                              sizes="96px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-[#002B50] line-clamp-2 mb-1">
                              {b.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatTimeAgo(b.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Belum ada blog terbaru</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}