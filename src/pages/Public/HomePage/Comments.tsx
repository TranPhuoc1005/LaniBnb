import React, { useEffect, useState } from "react";
import {
    Star,
    Heart,
    MessageCircle,
    User,
    Send,
    Filter,
    Award,
    Calendar,
    Loader2,
} from "lucide-react";
import { useCommentStore } from "@/store/comment.store";
import { userAuthStore } from "@/store/auth.store";
import type { User as UserType } from "@/interfaces/users.interface";
import type { Comments } from "@/interfaces/comments.interface";
import { Link } from "react-router-dom";

interface ReviewsSectionProps {
    // Có thể thêm maPhong nếu cần filter theo phòng cụ thể
    maPhong?: number;
    // Kiểm tra user đã thuê phòng này chưa
    hasBookedThisRoom?: boolean;
}

export default function Comments({ maPhong, hasBookedThisRoom = false }: ReviewsSectionProps) {
    const { user, isAuthenticated } = userAuthStore();
    
    const { 
        comments, 
        users, 
        loading, 
        usersLoading, 
        error, 
        usersError, 
        fetchAll,
        submitComment 
    } = useCommentStore();

    // Form state for new comment
    const [commentForm, setCommentForm] = useState({
        noiDung: "",
        saoBinhLuan: 5,
        maPhong: maPhong || 1, // Default hoặc từ props
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchAll();
    }, []);

    const reviewsList: Comments[] = comments.map((comment) => {
        const user = users.find(u => u.id === comment.maNguoiBinhLuan);
        return {
            ...comment,
            tenNguoiBinhLuan: user?.name || "Người dùng",
            avatar: user?.avatar || "",
        };
    });

    const [allReviews, setAllReviews] = useState<Comments[]>([]);
    const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set());
    const [filterRating, setFilterRating] = useState<number | null>(null);

    useEffect(() => {
        if (comments.length > 0 && users.length > 0) {
            const displayReviews = comments
                .map((comment) => {
                    const user = users.find(u => u.id === comment.maNguoiBinhLuan);
                    return {
                        ...comment,
                        tenNguoiBinhLuan: user?.name || "Người dùng",
                        avatar: user?.avatar || "",
                    };
                })
                .sort((a, b) => new Date(b.ngayBinhLuan).getTime() - new Date(a.ngayBinhLuan).getTime())
                .slice(0, isAuthenticated ? 10 : 3); // Hiển thị nhiều hơn nếu đã login

            setAllReviews(displayReviews);
        }
    }, [comments, users, isAuthenticated]);

    const handleLike = (id: number) => {
        setLikedReviews((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Handle submit comment
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !commentForm.noiDung.trim()) return;

        setIsSubmitting(true);
        const newComment: Comments = {
            id: Date.now(), // fake id local
            maPhong: commentForm.maPhong,
            maNguoiBinhLuan: user.id,
            ngayBinhLuan: new Date().toISOString(),
            noiDung: commentForm.noiDung.trim(),
            saoBinhLuan: commentForm.saoBinhLuan,
            tenNguoiBinhLuan: user.name,
            avatar: user.avatar || "",
        };

        const success = await submitComment(newComment);
        if (success) {
            setAllReviews(prev => [newComment, ...prev]); // update local ngay
            setCommentForm({ noiDung: "", saoBinhLuan: 5, maPhong: commentForm.maPhong });
        }
        setIsSubmitting(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderStars = (
        rating: number,
        interactive = false,
        onRate?: (rating: number) => void
    ) => {
        return Array.from({ length: 5 }, (_, i) => {
            if (interactive) {
                return (
                    <button
                        key={i}
                        onClick={() => onRate?.(i + 1)}
                        className={`${
                            i < rating ? "text-yellow-400" : "text-gray-300"
                        } hover:text-yellow-400 transition-colors cursor-pointer text-lg`}
                    >
                        ★
                    </button>
                );
            } else {
                return (
                    <span
                        key={i}
                        className={`${
                            i < rating ? "text-yellow-400" : "text-gray-300"
                        } text-lg`}
                    >
                        ★
                    </span>
                );
            }
        });
    };

    const filteredReviews = filterRating
        ? allReviews.filter((review) => review.saoBinhLuan === filterRating)
        : allReviews;

    const averageRating = reviewsList.length > 0
        ? reviewsList.reduce((sum, review) => sum + review.saoBinhLuan, 0) / reviewsList.length
        : 0;
        
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviewsList.filter((r) => r.saoBinhLuan === rating).length,
        percentage: reviewsList.length > 0
            ? (reviewsList.filter((r) => r.saoBinhLuan === rating).length / reviewsList.length) * 100
            : 0,
    }));

    // Loading state
    if (loading || usersLoading) {
        return (
            <section id="comments" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full mb-6 shadow-lg">
                            <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Đánh giá từ khách hàng
                        </h2>
                    </div>
                    <div className="flex justify-center items-center space-x-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <span className="text-lg text-gray-600">Đang tải đánh giá...</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="comments" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full mb-6 shadow-lg">
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Đánh giá từ khách hàng
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Khám phá trải nghiệm thực tế từ những khách hàng đã sử dụng dịch vụ của chúng tôi
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
                            <div className="text-center mb-6">
                                <div className="text-5xl font-bold text-gray-900 mb-2">
                                    {averageRating.toFixed(1)}
                                </div>
                                <div className="flex justify-center mb-2">
                                    {renderStars(Math.round(averageRating))}
                                </div>
                                <p className="text-gray-600">
                                    Dựa trên {reviewsList.length} đánh giá
                                    {!isAuthenticated && reviewsList.length > 3 && (
                                        <span className="text-sm block mt-1 text-blue-600">
                                            (Hiển thị 3 đánh giá mới nhất)
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {ratingDistribution.map((item) => (
                                    <div
                                        key={item.rating}
                                        className="flex items-center space-x-3"
                                    >
                                        <span className="text-sm font-medium w-6">
                                            {item.rating}
                                        </span>
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${item.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <Filter className="w-5 h-5 mr-2" />
                                Lọc đánh giá
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setFilterRating(null)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                        filterRating === null
                                            ? "bg-blue-100 text-blue-700"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    Tất cả
                                </button>
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => setFilterRating(rating)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                                            filterRating === rating
                                                ? "bg-blue-100 text-blue-700"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {renderStars(rating)}{" "}
                                        <span className="ml-2">
                                            (
                                            {ratingDistribution.find(
                                                (r) => r.rating === rating
                                            )?.count || 0}
                                            )
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 max-h-[752px] overflow-auto">
                        <div className="space-y-4">
                            {filteredReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 md:p-6"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="md:w-12 md:h-12 w-9 h-9 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                                            {review.avatar ? (
                                                <img
                                                    src={review.avatar}
                                                    alt=""
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                (review.tenNguoiBinhLuan || "User")
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3 md:flex-row flex-col">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {review.tenNguoiBinhLuan || "Người dùng"}
                                                        </h4>
                                                        <Award className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>
                                                                {formatDate(review.ngayBinhLuan)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {renderStars(review.saoBinhLuan)}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-4 leading-relaxed">
                                                "{review.noiDung}"
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={() => handleLike(review.id)}
                                                    className={`flex items-center space-x-2 text-sm transition-colors ${
                                                        likedReviews.has(review.id)
                                                            ? "text-red-500"
                                                            : "text-gray-600 hover:text-red-500"
                                                    }`}
                                                >
                                                    <Heart
                                                        className={`w-4 h-4 ${
                                                            likedReviews.has(review.id)
                                                                ? "fill-current"
                                                                : ""
                                                        }`}
                                                    />
                                                    <span>Hữu ích</span>
                                                </button>

                                                <div className="text-sm text-gray-500">
                                                    Phòng #{review.maPhong}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}