import React, { useState, useCallback, useMemo } from "react";
import {
    Star,
    Heart,
    MessageCircle,
    Send,
    Filter,
    Award,
    Calendar,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import type { CommentItem } from "@/interface/comment.interface";
import { Link } from "react-router-dom";
import { useSubmitComment } from "@/hooks/useCommentQuery";
import { useListUsers } from "@/hooks/useUserQuery";
import { useDetailUserBooking } from "@/hooks/useBookingQuery";
import { useListOfRoomComment } from "@/hooks/useCommentQuery";
import { useQueryClient } from "@tanstack/react-query";

interface RoomDetailCommentsProps {
    maPhong: number;
    canComment?: boolean;
}

export default function RoomDetailComments({
    maPhong,
    canComment = true,
}: RoomDetailCommentsProps) {
    const { user } = useAuthStore();
    const isAuthenticated = !!user;

    const { data: comments = [] } = useListOfRoomComment(maPhong);

    const { data: users = [] } = useListUsers();

    const { data: bookings = [] } = useDetailUserBooking(
        isAuthenticated && user ? String(user.user.id) : "",
        { enabled: isAuthenticated && !!user }
    );

    const queryClient = useQueryClient();
    const createCommentMutation = useSubmitComment({
        onSuccess: () => {
            setCommentForm({
                noiDung: "",
                saoBinhLuan: 5,
                maPhong: maPhong,
            });
            queryClient.invalidateQueries({
                queryKey: ["list-of-room-comment", maPhong],
            });
        },
    });

    const [commentForm, setCommentForm] = useState({
        noiDung: "",
        saoBinhLuan: 5,
        maPhong: maPhong,
    });

    const [likedReviews, setLikedReviews] = useState<Set<number | string>>(
        new Set()
    );
    const [filterRating, setFilterRating] = useState<number | null>(null);

    const roomComments: CommentItem[] = comments.map((comment) => {
        const userInfo = users.find((u) => u.name === comment.tenNguoiBinhLuan);
        return {
            ...comment,
            maNguoiBinhLuan: userInfo?.id ??0,
            tenNguoiBinhLuan: comment.tenNguoiBinhLuan || "Người dùng",
            avatar: comment?.avatar || "",
        };
    });

    const hasBookedThisRoom = useMemo(() => {
        return isAuthenticated && user
            ? bookings.some(
                  (booking) =>
                      booking.maPhong === maPhong &&
                      booking.maNguoiDung === user.user.id
              )
            : false;
    }, [isAuthenticated, user, bookings, maPhong]);

    const hasAlreadyCommented = useMemo(() => {
        return isAuthenticated && user.user
            ? roomComments.some(
                  (comment) => comment.maNguoiBinhLuan === user.user.id
              )
            : false;
    }, [isAuthenticated, user, roomComments]);

    console.log(roomComments);

    const handleLike = useCallback((id: number | string) => {
        setLikedReviews((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const handleSubmitComment = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!user || !commentForm.noiDung.trim()) return;

            const newComment: CommentItem = {
                id: Date.now(),
                maPhong: commentForm.maPhong,
                maNguoiBinhLuan: user.user.id,
                ngayBinhLuan: new Date().toISOString(),
                noiDung: commentForm.noiDung.trim(),
                saoBinhLuan: commentForm.saoBinhLuan,
                tenNguoiBinhLuan: user.user.name,
                avatar: user.user.avatar || "",
            };

            createCommentMutation.mutate(newComment);
        },
        [user, commentForm, createCommentMutation]
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleRatingChange = useCallback((rating: number) => {
        setCommentForm((prev) => ({ ...prev, saoBinhLuan: rating }));
    }, []);

    const renderStars = useCallback(
        (
            rating: number,
            interactive = false,
            onRate?: (rating: number) => void
        ) => {
            return Array.from({ length: 5 }, (_, i) => {
                if (interactive) {
                    return (
                        <button
                            key={i}
                            type="button"
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
        },
        []
    );

    const filteredReviews = filterRating
        ? roomComments.filter((review) => review.saoBinhLuan === filterRating)
        : roomComments;

    const averageRating =
        roomComments.length > 0
            ? roomComments.reduce(
                  (sum, review) => sum + review.saoBinhLuan,
                  0
              ) / roomComments.length
            : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: roomComments.filter((r) => r.saoBinhLuan === rating).length,
        percentage:
            roomComments.length > 0
                ? (roomComments.filter((r) => r.saoBinhLuan === rating).length /
                      roomComments.length) *
                  100
                : 0,
    }));

    console.log(window.getComputedStyle(document.body).overflow)

    return (
        <div
            id="reviews"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Đánh giá từ khách hàng
                            </h3>
                            <p className="text-sm text-gray-600">
                                {roomComments.length} đánh giá cho phòng này
                            </p>
                        </div>
                    </div>
                </div>

                {!canComment && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <p className="text-red-700 text-sm">
                                Tính năng bình luận đã bị vô hiệu hóa cho phòng
                                này.
                            </p>
                        </div>
                    </div>
                )}
                {isAuthenticated && !hasBookedThisRoom && canComment && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <p className="text-amber-700 text-sm">
                                Bạn cần thuê phòng này để có thể viết đánh giá.
                            </p>
                        </div>
                    </div>
                )}

                {isAuthenticated &&
                    hasBookedThisRoom &&
                    hasAlreadyCommented && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="w-5 h-5 text-green-600" />
                                <p className="text-green-700 text-sm">
                                    Cảm ơn bạn đã chia sẻ đánh giá về phòng này!
                                </p>
                            </div>
                        </div>
                    )}

                {!isAuthenticated && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-blue-700 text-sm">
                                Đăng nhập để xem đầy đủ đánh giá và có thể viết
                                đánh giá sau khi thuê phòng.
                            </p>
                            <Link
                                to="/auth/login"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                )}

                {isAuthenticated &&
                    hasBookedThisRoom &&
                    !hasAlreadyCommented &&
                    canComment && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                            <h4 className="font-semibold text-gray-900 mb-4">
                                Chia sẻ trải nghiệm của bạn
                            </h4>

                            {createCommentMutation.isError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">
                                        {(createCommentMutation.error as any)
                                            ?.response?.data?.content ||
                                            "Gửi đánh giá thất bại"}
                                    </p>
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmitComment}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Đánh giá sao
                                    </label>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(
                                            commentForm.saoBinhLuan,
                                            true,
                                            handleRatingChange
                                        )}
                                        <span className="ml-2 text-sm text-gray-600">
                                            ({commentForm.saoBinhLuan}/5)
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung đánh giá
                                    </label>
                                    <textarea
                                        value={commentForm.noiDung}
                                        onChange={(e) =>
                                            setCommentForm((prev) => ({
                                                ...prev,
                                                noiDung: e.target.value,
                                            }))
                                        }
                                        placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            !commentForm.noiDung.trim() ||
                                            createCommentMutation.isPending
                                        }
                                        className="px-6 py-2 bg-gradient-to-r from-sky-300 to-blue-300 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        {createCommentMutation.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Đang gửi...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Gửi đánh giá</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                {roomComments.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Rating Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <div className="text-center mb-6">
                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                        {averageRating.toFixed(1)}
                                    </div>
                                    <div className="flex justify-center mb-2">
                                        {renderStars(Math.round(averageRating))}
                                    </div>
                                    <p className="text-gray-600">
                                        Dựa trên {roomComments.length} đánh giá
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

                            <div className="bg-gray-50 rounded-xl p-6">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                    <Filter className="w-5 h-5 mr-2" />
                                    Lọc đánh giá
                                </h4>
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
                                            onClick={() =>
                                                setFilterRating(rating)
                                            }
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

                        <div className="lg:col-span-2 max-h-[735px] overflow-y-auto overscroll-y-auto">
                            <div className="space-y-4">
                                {filteredReviews
                                    .sort(
                                        (a, b) =>
                                            new Date(b.ngayBinhLuan).getTime() -
                                            new Date(a.ngayBinhLuan).getTime()
                                    )
                                    .map((review, index) => (
                                        <div
                                            key={review.id ?? `review-${index}`}
                                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className="w-10 h-10 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                    {review.avatar ? (
                                                        <img
                                                            src={review.avatar}
                                                            alt=""
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        (
                                                            review.tenNguoiBinhLuan ||
                                                            "User"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    )}
                                                </div>

                                                <div className="flex-1 overflow-hidden">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <h5 className="font-semibold text-gray-900">
                                                                    {review.tenNguoiBinhLuan ||
                                                                        "Người dùng"}
                                                                </h5>
                                                                <Award className="w-4 h-4 text-blue-500" />
                                                            </div>
                                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                <div className="flex items-center space-x-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>
                                                                        {formatDate(
                                                                            review.ngayBinhLuan
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            {renderStars(
                                                                review.saoBinhLuan
                                                            )}
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-700 mb-3 leading-relaxed">
                                                        "{review.noiDung}"
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <button
                                                            onClick={() =>
                                                                handleLike(
                                                                    review.id ??
                                                                        `review-${index}`
                                                                )
                                                            }
                                                            className={`flex items-center space-x-2 text-sm transition-colors ${
                                                                likedReviews.has(
                                                                    review.id ??
                                                                        `review-${index}`
                                                                )
                                                                    ? "text-red-500"
                                                                    : "text-gray-600 hover:text-red-500"
                                                            }`}
                                                        >
                                                            <Heart
                                                                className={`w-4 h-4 ${
                                                                    likedReviews.has(
                                                                        review.id ??
                                                                            `review-${index}`
                                                                    )
                                                                        ? "fill-current"
                                                                        : ""
                                                                }`}
                                                            />
                                                            <span>Hữu ích</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Chưa có đánh giá nào
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Hãy là người đầu tiên chia sẻ trải nghiệm về phòng
                            này!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
