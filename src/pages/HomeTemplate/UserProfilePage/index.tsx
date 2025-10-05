import React, { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Users, CheckCircle, XCircle, AlertCircle, Eye, Star, Trash2, RefreshCw, User, Edit3, Camera, Save, X, Mail, Phone, Cake, UserCheck, Shield } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { useDetailUserBooking, useRemoveBooking } from "@/hooks/useBookingQuery";
import { useDetailUser, useUpdateUser, useUpdateUserImage } from "@/hooks/useUserQuery";
import { useBookingsWithRoomDetails } from "@/hooks/useRoomQuery";
import type { ListUser, UserPutResponse } from "@/interface/user.interface";

export default function UserProfilePage() {
    const navigate = useNavigate();
    const { user: authUser } = useAuthStore();
    const userId = authUser?.user?.id;

    // Queries
    const { data: rawBookings = [], isLoading: bookingLoading, error: bookingError, refetch: refetchBookings } = useDetailUserBooking(userId?.toString() || "", { enabled: !!userId });
    const { data: bookings } = useBookingsWithRoomDetails(rawBookings);
    const { data: currentUser, isLoading: userLoading, error: userError } = useDetailUser(userId || 0, { enabled: !!userId });

    // Mutations
    const updateUserMutation = useUpdateUser({
        onSuccess: () => {
            setIsEditing(false);
            setAvatarFile(null);
            setAvatarPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    });
    const updateUserImageMutation = useUpdateUserImage();
    const removeBookingMutation = useRemoveBooking({
        onSuccess: () => {
            setShowDeleteModal(null);
            refetchBookings();
        }
    });

    // State
    const [activeTab, setActiveTab] = useState<"profile" | "bookings">("profile");
    const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
    const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<ListUser>>({});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentUser) setEditingUser(currentUser);
    }, [currentUser]);

    // Handlers
    const handleEditToggle = () => {
        if (isEditing) {
            setEditingUser(currentUser || {});
            setAvatarFile(null);
            setAvatarPreview(null);
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field: keyof ListUser, value: any) => {
        setEditingUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            alert(`Định dạng file không được hỗ trợ. Vui lòng chọn file: ${allowedExtensions.join(", ").toUpperCase()}`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleSaveChanges = async () => {
        if (!currentUser || !userId) return;

        try {
            let avatarUrl = currentUser.avatar;
            if (avatarFile) {
                const formData = new FormData();
                formData.append("formFile", avatarFile);
                const uploadResult = await updateUserImageMutation.mutateAsync(formData);
                if (uploadResult?.avatar) avatarUrl = uploadResult.avatar;
            }

            const updateData: UserPutResponse = {
                name: editingUser.name || currentUser.name,
                email: editingUser.email || currentUser.email,
                phone: editingUser.phone || currentUser.phone || "",
                birthday: editingUser.birthday || currentUser.birthday,
                gender: editingUser.gender !== undefined ? editingUser.gender : currentUser.gender,
                role: currentUser.role,
            };

            await updateUserMutation.mutateAsync({ id: userId, data: updateData });
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const handleDeleteBooking = async (bookingId: number) => {
        await removeBookingMutation.mutateAsync(bookingId.toString());
    };

    const getStatusConfig = (status?: string) => {
        const configs = {
            confirmed: { color: "text-green-600 bg-green-100", icon: CheckCircle, text: "Đã xác nhận" },
            pending: { color: "text-yellow-600 bg-yellow-100", icon: AlertCircle, text: "Chờ xác nhận" },
            cancelled: { color: "text-red-600 bg-red-100", icon: XCircle, text: "Đã hủy" },
        };
        return configs[status as keyof typeof configs] || { color: "text-gray-600 bg-gray-100", icon: AlertCircle, text: "Không xác định" };
    };

    const calculateDays = (checkin: string, checkout: string) => {
        return Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000 * 3600 * 24));
    };

    const calculateTotal = (booking: any) => {
        const days = calculateDays(booking.ngayDen, booking.ngayDi);
        return booking.room?.giaTien ? booking.room.giaTien * days : 0;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const filteredBookings = bookings.filter((booking: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkinDate = new Date(booking.ngayDen);
        checkinDate.setHours(0, 0, 0, 0);
        if (filter === "upcoming") return checkinDate >= today;
        if (filter === "past") return checkinDate < today;
        return true;
    });

    // Auth check
    if (!authUser) {
        return (
            <div className="min-h-screen pt-20 bg-gray-50">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Cần đăng nhập</h3>
                        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem thông tin cá nhân</p>
                        <button onClick={() => navigate("/auth/signin")} className="bg-sky-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-600 transition-colors">
                            Đăng nhập ngay
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if ((userLoading || bookingLoading) && !currentUser) {
        return (
            <div className="min-h-screen pt-20 bg-gray-50">
                <div className="max-w-6xl mx-auto p-6 animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
                    {[1, 2, 3].map((i) => <div key={i} className="bg-gray-300 rounded-xl h-48 mb-6"></div>)}
                </div>
            </div>
        );
    }

    const isUpdating = updateUserMutation.isPending || updateUserImageMutation.isPending;

    return (
        <div className="min-h-screen pt-20 bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
                        <p className="text-gray-600">Quản lý thông tin tài khoản và lịch sử đặt phòng</p>
                    </div>
                    <div className="flex bg-white rounded-lg p-1 shadow-sm mt-4 md:mt-0">
                        {[
                            { key: "profile", label: "Thông tin", icon: User },
                            { key: "bookings", label: `Đặt phòng (${bookings.length})`, icon: Calendar },
                        ].map((tab) => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === tab.key ? "bg-sky-500 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === "profile" && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-6">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <img src={avatarPreview || currentUser?.avatar || "https://via.placeholder.com/120x120?text=Avatar"} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/120x120?text=Avatar"; }} />
                                    {isEditing && (
                                        <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors" disabled={isUpdating}>
                                            {isUpdating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div> : <Camera className="w-4 h-4 text-gray-600" />}
                                        </button>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={handleAvatarChange} className="hidden" />
                                </div>
                                <div className="text-white">
                                    <h2 className="text-2xl font-bold mb-1">{currentUser?.name}</h2>
                                    <p className="text-sky-100 mb-2">{currentUser?.email}</p>
                                    <span className={`${currentUser?.role === "ADMIN" ? "bg-red-500" : "bg-green-500"} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit`}>
                                        {currentUser?.role === "ADMIN" ? <><Shield className="w-3 h-3" /><span>Quản trị viên</span></> : <><UserCheck className="w-3 h-3" /><span>Người dùng</span></>}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {userError && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <span className="text-red-800">{userError instanceof Error ? userError.message : "Có lỗi xảy ra"}</span>
                                </div>
                            )}
                            {updateUserMutation.isSuccess && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-green-800">Cập nhật thông tin thành công!</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
                                <div className="flex space-x-3">
                                    {isEditing ? (
                                        <>
                                            <button onClick={handleEditToggle} disabled={isUpdating} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                                                <X className="w-4 h-4" /><span>Hủy</span>
                                            </button>
                                            <button onClick={handleSaveChanges} disabled={isUpdating} className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50">
                                                {isUpdating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <Save className="w-4 h-4" />}
                                                <span>{isUpdating ? "Đang lưu..." : "Lưu thay đổi"}</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={handleEditToggle} className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                                            <Edit3 className="w-4 h-4" /><span>Chỉnh sửa</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                                    {isEditing ? (
                                        <input type="text" value={editingUser.name || ""} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="Nhập họ và tên" />
                                    ) : (
                                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <span>{currentUser?.name || "Chưa cập nhật"}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    {isEditing ? (
                                        <input type="email" value={editingUser.email || ""} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="Nhập email" />
                                    ) : (
                                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <span>{currentUser?.email || "Chưa cập nhật"}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                    {isEditing ? (
                                        <input type="tel" value={editingUser.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="Nhập số điện thoại" />
                                    ) : (
                                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <span>{currentUser?.phone || "Chưa cập nhật"}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                                    {isEditing ? (
                                        <input type="date" value={editingUser.birthday || ""} onChange={(e) => handleInputChange("birthday", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
                                    ) : (
                                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <Cake className="w-5 h-5 text-gray-400" />
                                            <span>{currentUser?.birthday ? new Date(currentUser.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                                    {isEditing ? (
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input type="radio" name="gender" checked={editingUser.gender === true} onChange={() => handleInputChange("gender", true)} className="mr-2 text-sky-500 focus:ring-sky-500" />
                                                Nam
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="gender" checked={editingUser.gender === false} onChange={() => handleInputChange("gender", false)} className="mr-2 text-sky-500 focus:ring-sky-500" />
                                                Nữ
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <UserCheck className="w-5 h-5 text-gray-400" />
                                            <span>{currentUser?.gender === true ? "Nam" : currentUser?.gender === false ? "Nữ" : "Chưa cập nhật"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "bookings" && (
                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-0">Lịch sử đặt phòng ({filteredBookings.length} đặt phòng)</h3>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    {[
                                        { key: "all", label: "Tất cả", count: bookings.length },
                                        { key: "upcoming", label: "Sắp tới", count: bookings.filter((b: any) => new Date(b.ngayDen) >= new Date()).length },
                                        { key: "past", label: "Đã qua", count: bookings.filter((b: any) => new Date(b.ngayDen) < new Date()).length },
                                    ].map((tab) => (
                                        <button key={tab.key} onClick={() => setFilter(tab.key as any)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === tab.key ? "bg-white text-sky-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                                            {tab.label} ({tab.count})
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {bookingError && (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
                                <p className="text-gray-600 mb-6">{bookingError instanceof Error ? bookingError.message : "Không thể tải dữ liệu"}</p>
                                <button onClick={() => refetchBookings} className="bg-sky-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-600 transition-colors flex items-center space-x-2 mx-auto" disabled={bookingLoading}>
                                    <RefreshCw className="w-4 h-4" />
                                    <span>{bookingLoading ? "Đang tải..." : "Tải lại"}</span>
                                </button>
                            </div>
                        )}

                        {!bookingError && filteredBookings.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {filter === "all" ? "Chưa có đặt phòng nào" : filter === "upcoming" ? "Không có chuyến đi sắp tới" : "Không có chuyến đi nào trong quá khứ"}
                                </h3>
                                <p className="text-gray-600 mb-6">{filter === "all" ? "Hãy khám phá những phòng tuyệt vời và tạo chuyến đi đầu tiên" : "Hãy đặt chuyến đi tiếp theo của bạn"}</p>
                                <button onClick={() => navigate("/rooms")} className="bg-sky-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-600 transition-colors">Tìm phòng ngay</button>
                            </div>
                        )}

                        {!bookingError && filteredBookings.length > 0 && (
                            <div className="grid gap-6">
                                {filteredBookings.map((booking: any) => {
                                    const statusConfig = getStatusConfig(booking.status);
                                    const StatusIcon = statusConfig.icon;
                                    return (
                                        <div key={booking.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                            <div className="md:flex">
                                                <div className="md:w-1/3">
                                                    <img src={booking.room?.hinhAnh || "https://via.placeholder.com/400x300?text=No+Image"} alt={booking.room?.tenPhong || `Phòng ${booking.maPhong}`} className="w-full h-48 md:h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate(`/room-detail/${booking.maPhong}`)} onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=No+Image"; }} />
                                                </div>
                                                <div className="md:w-2/3 p-6">
                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                                    <StatusIcon className="w-4 h-4" />
                                                                    <span>{statusConfig.text}</span>
                                                                </span>
                                                                <span className="text-sm text-gray-500">#{booking.id}</span>
                                                            </div>
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/room-detail/${booking.maPhong}`)}>
                                                                {booking.room?.tenPhong || `Phòng ${booking.maPhong}`}
                                                            </h3>
                                                            <div className="flex items-center text-gray-600 text-sm">
                                                                <MapPin className="w-4 h-4 mr-1" />
                                                                <span>Mã phòng: {booking.maPhong}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right mt-4 md:mt-0">
                                                            <div className="text-2xl font-bold text-gray-900">{booking.room?.giaTien ? formatPrice(calculateTotal(booking)) : "Đang cập nhật"}</div>
                                                            <div className="text-sm text-gray-500">{calculateDays(booking.ngayDen, booking.ngayDi)} đêm</div>
                                                            {booking.room?.giaTien && <div className="text-xs text-gray-400 mt-1">{formatPrice(booking.room.giaTien)}/đêm</div>}
                                                        </div>
                                                    </div>
                                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-5 h-5 text-gray-400" />
                                                            <div>
                                                                <div className="text-sm text-gray-500">Nhận phòng</div>
                                                                <div className="font-medium">{formatDate(booking.ngayDen)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-5 h-5 text-gray-400" />
                                                            <div>
                                                                <div className="text-sm text-gray-500">Trả phòng</div>
                                                                <div className="font-medium">{formatDate(booking.ngayDi)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Users className="w-5 h-5 text-gray-400" />
                                                            <div>
                                                                <div className="text-sm text-gray-500">Số khách</div>
                                                                <div className="font-medium">{booking.soLuongKhach} người</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {booking.room && (
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {booking.room.wifi && <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">WiFi</span>}
                                                            {booking.room.dieuHoa && <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">Điều hòa</span>}
                                                            {booking.room.bep && <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">Bếp</span>}
                                                            {booking.room.hoBoi && <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full">Hồ bơi</span>}
                                                            {booking.room.mayGiat && <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">Máy giặt</span>}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-wrap gap-3">
                                                        <button onClick={() => navigate(`/room-detail/${booking.maPhong}`)} className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-sky-300 to-blue-300 text-white rounded-lg hover:opacity-80 transition-colors text-sm">
                                                            <Eye className="w-4 h-4" />
                                                            <span>Xem chi tiết</span>
                                                        </button>
                                                        <button onClick={() => navigate(`/room-detail/${booking.maPhong}#reviews`)} className="flex items-center space-x-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                                            <Star className="w-4 h-4" />
                                                            <span>Đánh giá</span>
                                                        </button>
                                                        <button onClick={() => setShowDeleteModal(booking.id)} className="flex items-center space-x-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm">
                                                            <Trash2 className="w-4 h-4" />
                                                            <span>Hủy đặt</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận hủy đặt phòng</h3>
                            <p className="text-gray-600">
                                Bạn có chắc chắn muốn hủy đặt phòng #{showDeleteModal}?
                                <br />
                                <span className="text-sm text-red-600 font-medium">Hành động này không thể hoàn tác.</span>
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => setShowDeleteModal(null)} disabled={removeBookingMutation.isPending} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium">
                                Hủy bỏ
                            </button>
                            <button onClick={() => handleDeleteBooking(showDeleteModal)} disabled={removeBookingMutation.isPending} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center font-medium">
                                {removeBookingMutation.isPending ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Đang hủy...</span>
                                    </div>
                                ) : "Xác nhận hủy"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}