"use client";

export default function SkeletonBlog() {
    return (
        <div className="container mx-auto px-4 py-6 sm:py-8">
            {/* Featured Blog Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {/* Large Featured */}
                <div className="lg:col-span-2 relative rounded-xl overflow-hidden shadow-lg h-64 sm:h-80 md:h-96 bg-gray-200 animate-pulse">
                    <div className="absolute bottom-0 left-0 p-3 xs:p-4 sm:p-6 w-full space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </div>

                {/* Small Featured Items */}
                <div className="space-y-4 sm:space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 sm:gap-4 items-center animate-pulse">
                            <div className="relative w-20 h-16 sm:w-28 sm:h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                    >
                        <div className="relative w-full h-48 bg-gray-200"></div>
                        <div className="p-3 xs:p-4 sm:p-5 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="h-5 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
