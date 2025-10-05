import type { BookingItem } from "@/interface/booking.interface";
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail } from "lucide-react";

interface BookingConfirmationProps {
    booking: BookingItem;
    onViewBookings: () => void;
    onContinueBrowsing: () => void;
}

export default function BookingConfirmation({ 
    booking, 
    onViewBookings, 
    onContinueBrowsing 
}: BookingConfirmationProps) {
    const calculateDays = () => {
        const checkIn = new Date(booking.ngayDen);
        const checkOut = new Date(booking.ngayDi);
        return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric", 
            month: "long",
            day: "numeric",
        });
    };

    const totalDays = calculateDays();
    const roomPrice = booking.room?.giaTien || 0;
    const subtotal = roomPrice * totalDays;
    const serviceFee = subtotal * 0.1;
    const total = subtotal + serviceFee;

    const getRoomImage = () => {
        if (booking.room?.hinhAnh) {
            return booking.room.hinhAnh;
        }
        return 'https://via.placeholder.com/80x80/e5e7eb/6b7280?text=No+Image';
    };

    const getRoomName = () => {
        if (booking.room?.tenPhong) {
            return booking.room.tenPhong;
        }
        return `Phòng ${booking.maPhong}`;
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Đặt phòng thành công!
                </h1>
                <p className="text-gray-600">
                    Chúc mừng! Bạn đã đặt phòng thành công. Dưới đây là thông tin chi tiết.
                </p>
            </div>

            <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start space-x-4">
                        <img
                            src={getRoomImage()}
                            alt={getRoomName()}
                            className="w-20 h-20 rounded-lg object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/80x80/e5e7eb/6b7280?text=Error';
                            }}
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                                {getRoomName()}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>Mã phòng: {booking.maPhong}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Mã đặt phòng:</span> #{booking.id}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Nhận phòng</div>
                            <div className="font-medium">{formatDate(booking.ngayDen)}</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Trả phòng</div>
                            <div className="font-medium">{formatDate(booking.ngayDi)}</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Số khách</div>
                            <div className="font-medium">{booking.soLuongKhach} người</div>
                        </div>
                    </div>
                </div>

                {roomPrice > 0 ? (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Chi tiết thanh toán</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>{roomPrice.toLocaleString()}₫ x {totalDays} đêm</span>
                                <span>{subtotal.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí dịch vụ</span>
                                <span>{serviceFee.toLocaleString()}₫</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                <span>Tổng cộng</span>
                                <span className="text-blue-600">{total.toLocaleString()}₫</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Chi tiết thanh toán</h3>
                        <div className="text-center py-4 bg-yellow-50 rounded-lg">
                            <p className="text-yellow-700 text-sm">
                                Thông tin giá phòng sẽ được cập nhật sau khi xác nhận
                            </p>
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Thông tin liên hệ</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>Hotline: 1900-xxxx</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>Email: support@airbnb.com</span>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-yellow-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Những điều cần lưu ý</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Vui lòng mang theo CMND/CCCD khi nhận phòng</li>
                        <li>• Thời gian nhận phòng: từ 14:00</li>
                        <li>• Thời gian trả phòng: trước 12:00</li>
                        <li>• Liên hệ chủ nhà trước 24h nếu có thay đổi</li>
                    </ul>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-8">
                <button
                    onClick={onViewBookings}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Xem tất cả đặt phòng
                </button>
                <button
                    onClick={onContinueBrowsing}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                    Tiếp tục khám phá
                </button>
            </div>
        </div>
    );
}