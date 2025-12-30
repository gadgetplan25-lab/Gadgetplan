"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ReviewForm({ productId, orderId, onSuccess, onCancel }) {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!review.trim()) {
            alert("Mohon tulis review Anda");
            return;
        }

        setLoading(true);

        try {
            await apiFetch("/user/reviews", {
                method: "POST",
                body: JSON.stringify({
                    product_id: productId,
                    order_id: orderId,
                    rating,
                    review: review.trim()
                })
            });

            alert("✅ Review berhasil ditambahkan!");
            setRating(5);
            setReview("");
            if (onSuccess) onSuccess();
        } catch (error) {
            alert("❌ Gagal menambahkan review: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Beri Review</h3>

            <form onSubmit={handleSubmit}>
                {/* Rating Stars */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Rating:</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-4xl transition-colors ${star <= rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'
                                    }`}
                                aria-label={`Rate ${star} stars`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{rating} dari 5 bintang</p>
                </div>

                {/* Review Text */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Review:</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        placeholder="Tulis pengalaman Anda dengan produk ini..."
                        required
                    />
                    <p className="text-sm text-gray-600 mt-1">{review.length} karakter</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Mengirim..." : "Kirim Review"}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
