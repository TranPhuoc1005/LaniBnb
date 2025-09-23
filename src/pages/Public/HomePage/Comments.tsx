import { useEffect, useState } from "react";
import { Star, Heart, MessageCircle, Filter, Award, Calendar, Loader2 } from "lucide-react";
import { useCommentStore } from "@/store/comment.store";
import { userAuthStore } from "@/store/auth.store";
import type { Comments } from "@/interfaces/comments.interface";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function Comments() {
    const { isAuthenticated } = userAuthStore();
    
    const { comments, users, loading, usersLoading, fetchAll } = useCommentStore();

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
                .slice(0, isAuthenticated ? 10 : 3);

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {year: "numeric", month: "long", day: "numeric"});
    };

    const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
        return Array.from({ length: 5 }, (_, i) => {
            if (interactive) {
                return (
                    <Button
                        key={i}
                        variant="ghost"
                        size="sm"
                        onClick={() => onRate?.(i + 1)}
                        className={`p-0 h-auto ${
                            i < rating ? "text-yellow-400" : "text-gray-300"
                        } hover:text-yellow-400 text-lg`}
                    >
                        ★
                    </Button>
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

    const filteredReviews = filterRating ? allReviews.filter((review) => review.saoBinhLuan === filterRating) : allReviews;

    const averageRating = reviewsList.length > 0 ? reviewsList.reduce((sum, review) => sum + review.saoBinhLuan, 0) / reviewsList.length : 0;
        
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviewsList.filter((r) => r.saoBinhLuan === rating).length,
        percentage: reviewsList.length > 0 ? (reviewsList.filter((r) => r.saoBinhLuan === rating).length / reviewsList.length) * 100 : 0,
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
                <div className="text-center mb-16" data-aos="fade-up">
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
                    <div className="lg:col-span-1" data-aos="fade-right">
                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-white/20 mb-6">
                            <CardContent className="p-6">
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
                                            <Progress 
                                                value={item.percentage} 
                                                className="flex-1 h-2"
                                            />
                                            <span className="text-sm text-gray-600 w-8">
                                                {item.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-white/20">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Filter className="w-5 h-5 mr-2" />
                                    Lọc đánh giá
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                            <Button
                                variant={filterRating === null ? "default" : "ghost"}
                                onClick={() => setFilterRating(null)}
                                className={cn(
                                "w-full justify-start",
                                filterRating === null &&
                                    "bg-gradient-to-r from-sky-300 to-blue-300 text-white"
                                )}
                            >
                                Tất cả
                            </Button>

                            {/* Các nút rating */}
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <Button
                                key={rating}
                                variant={filterRating === rating ? "default" : "ghost"}
                                onClick={() => setFilterRating(rating)}
                                className={cn(
                                    "w-full justify-start",
                                    filterRating === rating &&
                                    "bg-gradient-to-r from-sky-300 to-blue-300 text-white"
                                )}
                                >
                                <div className="flex items-center">
                                    {renderStars(rating)}
                                    <span className="ml-2">
                                    ({ratingDistribution.find((r) => r.rating === rating)?.count || 0})
                                    </span>
                                </div>
                                </Button>
                            ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 max-h-[752px] overflow-auto" data-aos="fade-left">
                        <div className="space-y-4">
                            {filteredReviews.map((review) => (
                                <Card
                                    key={review.id}
                                    className="bg-white/70 backdrop-blur-sm shadow-lg border-white/20 hover:shadow-xl transition-all duration-300 p-0"
                                >
                                    <CardContent className="p-3 md:p-6">
                                        <div className="flex items-start space-x-4">
                                            <Avatar className="w-9 h-9 md:w-12 md:h-12 flex-shrink-0">
                                                <AvatarImage src={review.avatar} alt={review.tenNguoiBinhLuan || "User"} />
                                                <AvatarFallback className="bg-gradient-to-r from-sky-300 to-blue-300 text-white font-semibold">
                                                    {(review.tenNguoiBinhLuan || "User").charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

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
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleLike(review.id)}
                                                        className={`flex items-center space-x-2 text-sm ${
                                                            likedReviews.has(review.id) ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
                                                    >
                                                        <Heart className={`w-4 h-4 ${likedReviews.has(review.id) ? "fill-current" : ""}`}/>
                                                        <span>Hữu ích</span>
                                                    </Button>

                                                    <Badge variant="secondary" className="text-sm">
                                                        Phòng #{review.maPhong}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}