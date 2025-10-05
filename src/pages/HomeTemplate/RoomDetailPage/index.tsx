import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Heart, Share2, ChevronLeft, ChevronRight, Check, X, Camera, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useDetailRoom } from "@/hooks/useRoomQuery";
import { useDetailLocation } from "@/hooks/useLocationQuery";
import { useCreateBooking } from "@/hooks/useBookingQuery";
import type { BookingItem } from "@/interface/booking.interface";
import RoomDetailComments from "./RoomDetailComments";
import { useQueryClient } from "@tanstack/react-query";

export default function RoomDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { user } = useAuthStore();
    const isAuthenticated = !!user;

    const roomId = id ? parseInt(id) : 0;

    const {
        data: roomDetail,
        isLoading: roomLoading,
        error: roomError,
    } = useDetailRoom(roomId);

    const { data: locationDetail } = useDetailLocation(
        roomDetail?.maViTri || 0,
        { enabled: !!roomDetail?.maViTri }
    );

    const queryClient = useQueryClient();

const createBookingMutation = useCreateBooking({
    onSuccess: () => {
        setShowBookingModal(true);
        setSelectedDate({ checkIn: "", checkOut: "" });
        setGuests(2);
        
        queryClient.invalidateQueries({
            queryKey: ["detail-user-booking", String(user?.user.id)],
        });
    },
    onError: (error: any) => {
        console.error("Booking error:", error);
    },
});

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState({
        checkIn: "",
        checkOut: "",
    });
    const [guests, setGuests] = useState(2);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        if (window.location.hash === "#reviews") {
            setTimeout(() => {
                const reviewsElement = document.getElementById("reviews");
                if (reviewsElement) {
                    const elementPosition =
                        reviewsElement.getBoundingClientRect().top;
                    const offsetPosition =
                        elementPosition + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                    });
                }
            }, 100);
        }
    }, [roomDetail]);

    const calculateTotal = () => {
        if (!selectedDate.checkIn || !selectedDate.checkOut || !roomDetail)
            return 0;
        const checkIn = new Date(selectedDate.checkIn);
        const checkOut = new Date(selectedDate.checkOut);
        const days = Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );
        return days > 0 ? days * roomDetail.giaTien : 0;
    };

    const totalDays = roomDetail
        ? Math.max(1, calculateTotal() / roomDetail.giaTien)
        : 0;

    const handleBooking = async () => {
        if (!isAuthenticated || !user) {
            navigate("/auth/login");
            return;
        }

        if (!roomDetail) {
            console.error("Room detail not available");
            return;
        }

        if (!selectedDate.checkIn || !selectedDate.checkOut) {
            alert("Vui lòng chọn ngày nhận và trả phòng");
            return;
        }

        const checkIn = new Date(selectedDate.checkIn);
        const checkOut = new Date(selectedDate.checkOut);

        if (checkOut <= checkIn) {
            alert("Ngày trả phòng phải sau ngày nhận phòng");
            return;
        }

        const bookingData: BookingItem = {
            id: 0,
            maPhong: roomDetail.id,
            ngayDen: selectedDate.checkIn,
            ngayDi: selectedDate.checkOut,
            soLuongKhach: guests,
            maNguoiDung: user.user.id,
        };

        createBookingMutation.mutate(bookingData);
    };

    const getAmenities = () => {
        if (!roomDetail) return [];

        const amenities = [];
        if (roomDetail.mayGiat) amenities.push("Máy giặt");
        if (roomDetail.banLa) amenities.push("Bàn là");
        if (roomDetail.tivi) amenities.push("TV màn hình phẳng");
        if (roomDetail.dieuHoa) amenities.push("Điều hòa");
        if (roomDetail.wifi) amenities.push("WiFi tốc độ cao");
        if (roomDetail.bep) amenities.push("Bếp");
        if (roomDetail.doXe) amenities.push("Đỗ xe");
        if (roomDetail.hoBoi) amenities.push("Hồ bơi");
        if (roomDetail.banUi) amenities.push("Bàn ủi");

        return amenities;
    };

    const getRoomImages = () => {
        if (!roomDetail?.hinhAnh) return [];
        return Array.isArray(roomDetail.hinhAnh)
            ? roomDetail.hinhAnh
            : [roomDetail.hinhAnh];
    };

    const images = getRoomImages();
    const amenities = getAmenities();
    const today = new Date().toISOString().split("T")[0];

    if (roomLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-600">
                        Đang tải thông tin phòng...
                    </p>
                </div>
            </div>
        );
    }

    if (roomError || !roomDetail) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <X className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-lg font-semibold">
                            Không tìm thấy thông tin phòng
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/rooms")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại danh sách phòng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-gray-50">
            <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] bg-black pointer-events-none">
                <div className="relative h-full overflow-hidden">
                    <img
                        src={images[currentImageIndex] || roomDetail.hinhAnh}
                        alt={roomDetail.tenPhong}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                                "https://airbnbnew.cybersoft.edu.vn/images/phong1.jpg";
                        }}
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() =>
                                    setCurrentImageIndex((prev) =>
                                        prev === 0
                                            ? images.length - 1
                                            : prev - 1
                                    )
                                }
                                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            <button
                                onClick={() =>
                                    setCurrentImageIndex((prev) =>
                                        prev === images.length - 1
                                            ? 0
                                            : prev + 1
                                    )
                                }
                                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setCurrentImageIndex(index)
                                        }
                                        className={`w-2 h-2 rounded-full transition-colors ${
                                            currentImageIndex === index
                                                ? "bg-white"
                                                : "bg-white/50"
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {images.length > 1 && (
                        <button
                            onClick={() => setShowImageViewer(true)}
                            className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-black/80 transition-colors"
                        >
                            <Camera className="w-4 h-4" />
                            <span className="text-sm">
                                Xem tất cả {images.length} ảnh
                            </span>
                        </button>
                    )}

                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <Heart
                                    className={`w-5 h-5 ${
                                        isFavorite
                                            ? "fill-current text-red-500"
                                            : ""
                                    }`}
                                />
                            </button>
                            <button className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">
                                        {locationDetail?.tenViTri} •{" "}
                                        {locationDetail?.tinhThanh ||
                                            locationDetail?.quocGia}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                {roomDetail.tenPhong}
                            </h1>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm text-gray-600">
                                        {roomDetail.khach} khách •{" "}
                                        {roomDetail.phongNgu} phòng ngủ •{" "}
                                        {roomDetail.giuong} giường •{" "}
                                        {roomDetail.phongTam} phòng tắm
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                                        {roomDetail.giaTien.toLocaleString()}đ
                                        <span className="text-base text-gray-500 font-normal">
                                            {" "}
                                            / đêm
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="flex border-b border-gray-200 overflow-x-auto">
                                {[
                                    { id: "overview", label: "Tổng quan" },
                                    { id: "amenities", label: "Tiện nghi" },
                                    { id: "location", label: "Vị trí" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-shrink-0 px-6 py-4 font-medium transition-colors border-b-2 ${
                                            activeTab === tab.id
                                                ? "border-sky-300 text-sky-300 bg-blue-50"
                                                : "border-transparent text-gray-600 hover:text-gray-800"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === "overview" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-3">
                                                Mô tả
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                {roomDetail.moTa ||
                                                    "Phòng với đầy đủ tiện nghi, thoải mái và ấm cúng."}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-3">
                                                Điểm nổi bật
                                            </h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {amenities
                                                    .slice(0, 6)
                                                    .map((amenity, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-2 text-gray-700"
                                                        >
                                                            <Check className="w-4 h-4 text-green-500" />
                                                            <span className="text-sm">
                                                                {amenity}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-3">
                                                Thông tin phòng
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm">
                                                    <span className="text-gray-600">
                                                        Số khách:
                                                    </span>
                                                    <span className="ml-2 font-medium">
                                                        {roomDetail.khach} người
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">
                                                        Phòng ngủ:
                                                    </span>
                                                    <span className="ml-2 font-medium">
                                                        {roomDetail.phongNgu}{" "}
                                                        phòng
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">
                                                        Giường:
                                                    </span>
                                                    <span className="ml-2 font-medium">
                                                        {roomDetail.giuong}{" "}
                                                        giường
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">
                                                        Phòng tắm:
                                                    </span>
                                                    <span className="ml-2 font-medium">
                                                        {roomDetail.phongTam}{" "}
                                                        phòng
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "amenities" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold mb-3">
                                                Tiện nghi có sẵn
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {amenities.length > 0 ? (
                                                    amenities
                                                        .slice(
                                                            0,
                                                            showAllAmenities
                                                                ? amenities.length
                                                                : 6
                                                        )
                                                        .map(
                                                            (
                                                                amenity,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center space-x-3 text-gray-700"
                                                                >
                                                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                                    <span>
                                                                        {
                                                                            amenity
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )
                                                        )
                                                ) : (
                                                    <p className="text-gray-600">
                                                        Thông tin tiện nghi sẽ
                                                        được cập nhật sớm.
                                                    </p>
                                                )}
                                            </div>
                                            {!showAllAmenities &&
                                                amenities.length > 6 && (
                                                    <button
                                                        onClick={() =>
                                                            setShowAllAmenities(
                                                                true
                                                            )
                                                        }
                                                        className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        Xem thêm{" "}
                                                        {amenities.length - 6}{" "}
                                                        tiện nghi
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "location" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold mb-3">
                                                Vị trí
                                            </h3>
                                            <p className="text-gray-700">
                                                {locationDetail?.tenViTri},{" "}
                                                {locationDetail?.tinhThanh},{" "}
                                                {locationDetail?.quocGia}
                                            </p>
                                        </div>

                                        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                                            <p className="text-gray-600">
                                                Bản đồ sẽ hiển thị ở đây
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="sticky top-20 bg-white rounded-2xl p-6 shadow-lg">
                            <div className="mb-6">
                                <div className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent mb-1">
                                    {roomDetail.giaTien.toLocaleString()}đ
                                    <span className="text-base text-gray-500 font-normal">
                                        {" "}
                                        / đêm
                                    </span>
                                </div>
                            </div>

                            {createBookingMutation.isError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">
                                        {(createBookingMutation.error as any)
                                            ?.response?.data?.content ||
                                            "Đặt phòng thất bại"}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nhận phòng
                                        </label>
                                        <input
                                            type="date"
                                            value={selectedDate.checkIn}
                                            min={today}
                                            onChange={(e) =>
                                                setSelectedDate((prev) => ({
                                                    ...prev,
                                                    checkIn: e.target.value,
                                                }))
                                            }
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trả phòng
                                        </label>
                                        <input
                                            type="date"
                                            value={selectedDate.checkOut}
                                            min={selectedDate.checkIn || today}
                                            onChange={(e) =>
                                                setSelectedDate((prev) => ({
                                                    ...prev,
                                                    checkOut: e.target.value,
                                                }))
                                            }
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số khách
                                    </label>
                                    <select
                                        value={guests}
                                        onChange={(e) =>
                                            setGuests(parseInt(e.target.value))
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {Array.from(
                                            { length: roomDetail.khach },
                                            (_, i) => i + 1
                                        ).map((num) => (
                                            <option key={num} value={num}>
                                                {num} khách
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {calculateTotal() > 0 && (
                                <div className="border-t pt-4 mb-6">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>
                                                {roomDetail.giaTien.toLocaleString()}
                                                đ x {totalDays} đêm
                                            </span>
                                            <span>
                                                {calculateTotal().toLocaleString()}
                                                đ
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phí dịch vụ</span>
                                            <span>
                                                {(
                                                    calculateTotal() * 0.1
                                                ).toLocaleString()}
                                                đ
                                            </span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                            <span>Tổng cộng</span>
                                            <span className="text-blue-600">
                                                {(
                                                    calculateTotal() * 1.1
                                                ).toLocaleString()}
                                                đ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleBooking}
                                disabled={
                                    !selectedDate.checkIn ||
                                    !selectedDate.checkOut ||
                                    createBookingMutation.isPending
                                }
                                className="w-full bg-gradient-to-r from-sky-300 to-blue-300 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {createBookingMutation.isPending ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Đang đặt phòng...</span>
                                    </div>
                                ) : calculateTotal() > 0 ? (
                                    "Đặt phòng ngay"
                                ) : (
                                    "Chọn ngày để đặt phòng"
                                )}
                            </button>

                            {!isAuthenticated && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Cần đăng nhập để đặt phòng
                                    </p>
                                    <button
                                        onClick={() => navigate("/auth/signin")}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                    >
                                        Đăng nhập ngay
                                    </button>
                                </div>
                            )}

                            {isAuthenticated && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600">
                                        Bạn chưa bị trừ tiền
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <RoomDetailComments maPhong={roomDetail.id} />
            </div>

            {showBookingModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Đặt phòng thành công!
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Cảm ơn bạn đã đặt phòng. Bạn có thể xem chi tiết đặt
                            phòng trong trang quản lý của mình.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/bookings")}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Xem đặt phòng của tôi
                            </button>

                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Tiếp tục xem phòng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showImageViewer && images.length > 1 && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setShowImageViewer(false)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="relative">
                            <img
                                src={images[currentImageIndex]}
                                alt={roomDetail.tenPhong}
                                className="w-full h-auto max-h-[80vh] object-contain"
                            />

                            <button
                                onClick={() =>
                                    setCurrentImageIndex((prev) =>
                                        prev === 0
                                            ? images.length - 1
                                            : prev - 1
                                    )
                                }
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>

                            <button
                                onClick={() =>
                                    setCurrentImageIndex((prev) =>
                                        prev === images.length - 1
                                            ? 0
                                            : prev + 1
                                    )
                                }
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>

                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        </div>

                        <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                        currentImageIndex === index
                                            ? "border-blue-500"
                                            : "border-transparent"
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xl font-bold text-blue-600">
                            {roomDetail.giaTien.toLocaleString()}đ
                        </div>
                        <div className="text-sm text-gray-600">/ đêm</div>
                    </div>
                    <button
                        onClick={handleBooking}
                        disabled={
                            !selectedDate.checkIn ||
                            !selectedDate.checkOut ||
                            createBookingMutation.isPending
                        }
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createBookingMutation.isPending ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Đặt...</span>
                            </div>
                        ) : calculateTotal() > 0 ? (
                            "Đặt ngay"
                        ) : (
                            "Chọn ngày"
                        )}
                    </button>
                </div>
            </div>

            <div className="h-20 lg:hidden"></div>
        </div>
    );
}
