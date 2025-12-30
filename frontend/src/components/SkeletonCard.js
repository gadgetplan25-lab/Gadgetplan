"use client";

export default function SkeletonCard({ count = 8 }) {
    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-pulse"
                >
                    {/* Image Skeleton */}
                    <div className="w-full h-[220px] sm:h-[240px] md:h-[260px] bg-gray-200"></div>

                    {/* Content Skeleton */}
                    <div className="p-4 space-y-3">
                        {/* Title and Category */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>

                        {/* Price and Button */}
                        <div className="space-y-3 pt-2">
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-11 bg-gray-200 rounded-xl w-full"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
