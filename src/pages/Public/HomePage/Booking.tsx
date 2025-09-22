import { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, Search } from "lucide-react";
import * as easepick from "@easepick/core";
import { RangePlugin } from "@easepick/range-plugin";
import "@easepick/core/dist/index.css";
import "@easepick/range-plugin/dist/index.css";
import { useLocationStore } from "@/store/location.store";
import { useRoomStore } from "@/store/room.store";
import { useNavigate } from "react-router-dom";

export default function Booking() {
    const dateRef = useRef<HTMLInputElement | null>(null);
    const [location, setLocation] = useState<number | "">("");
    const [guests, setGuests] = useState<number>(1);
    const [isSearching, setIsSearching] = useState(false);
    
    const { locations, fetchLocations, loading: locationLoading } = useLocationStore();
    const { fetchRoomsWithLocation } = useRoomStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (locations.length === 0) {
            fetchLocations();
        }
    }, [locations.length, fetchLocations]);
    
    useEffect(() => {
        if (dateRef.current) {
            const picker = new easepick.create({
                element: dateRef.current,
                css: [
                    "https://cdn.jsdelivr.net/npm/@easepick/core@1.2.1/dist/index.css",
                    "https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css",
                ],
                plugins: [RangePlugin],
                RangePlugin: {
                    tooltip: true,
                    strict: true,
                },
                format: "DD/MM/YYYY",
                lang: "vi-VN",
                autoApply: true,
                zIndex: 9999,
                setup(picker) {
                    picker.on('select', (e) => {
                        const { start, end } = e.detail;
                        if (start && end) {
                            console.log('Dates selected:', { start, end });
                        }
                    });
                },
            });

            return () => {
                if (picker) {
                    picker.destroy();
                }
            };
        }
    }, []);

    const handleSearch = async () => {
        if (!location || !dateRef.current?.value) {
            alert("Vui lòng chọn địa điểm và ngày tháng!");
            return;
        }
        setIsSearching(true);
        try {
            await fetchRoomsWithLocation();
            const dateValue = dateRef.current.value;
            const dates = dateValue.split(' - ');
            let checkIn = '';
            let checkOut = '';
            if (dates.length === 2) {
                checkIn = dates[0].trim();
                checkOut = dates[1].trim();
            } else if (dates.length === 1) {
                checkIn = dates[0].trim();
                const checkInDate = new Date(checkIn.split('/').reverse().join('-'));
                checkInDate.setDate(checkInDate.getDate() + 1);
                checkOut = checkInDate.toLocaleDateString('vi-VN');
            }
            const searchParams = new URLSearchParams({
                location: location.toString(),
                checkIn: checkIn,
                checkOut: checkOut,
                guests: guests.toString()
            });
            navigate(`/rooms?${searchParams.toString()}`);
            
        } catch (error) {
            console.error('Search error:', error);
            alert("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!");
        } finally {
            setIsSearching(false);
        }
    };

    const handleGuestChange = (increment: boolean) => {
        if (increment && guests < 20) {
            setGuests(guests + 1);
        } else if (!increment && guests > 1) {
            setGuests(guests - 1);
        }
    };

    const isSearchDisabled = !location || !dateRef.current?.value || isSearching;

    return (
        <section className="relative z-10 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-6">Đặt Phòng Khách Sạn</h2>
                    <p className="mb-1 text-gray-900">Tìm kiếm khách sạn tốt nhất với giá hấp dẫn</p>
                </div>

                <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl border border-white/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-center">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 text-sky-400" />
                                <label className="text-sm font-semibold">Chọn khách sạn</label>
                            </div>
                            <div className="relative">
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(Number(e.target.value))}
                                    className="w-full p-3 pl-10 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-800 appearance-none cursor-pointer hover:border-blue-300"
                                    disabled={locationLoading}
                                >
                                    <option value="">
                                        {locationLoading ? "Đang tải..." : "Chọn điểm đến"}
                                    </option>
                                    {locations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>
                                            {loc.tenViTri} - {loc.tinhThanh}
                                        </option>
                                    ))}
                                </select>
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                <label className="text-sm font-semibold">Chọn ngày</label>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    ref={dateRef}
                                    placeholder="Nhận phòng - Trả phòng"
                                    className="w-full p-3 pl-10 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 cursor-pointer bg-white text-gray-800 hover:border-green-300"
                                    readOnly
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-700 mb-2">
                                <Users className="w-4 h-4 text-purple-600" />
                                <label className="text-sm font-semibold">Số lượng khách</label>
                            </div>
                            <div className="relative">
                                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all duration-200 hover:border-purple-300">
                                    <Users className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                    <button
                                        type="button"
                                        onClick={() => handleGuestChange(false)}
                                        className="p-2 pl-10 text-gray-500 hover:text-purple-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={guests <= 1}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="flex-1 text-center font-medium text-gray-800 py-3">
                                        {guests} khách
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleGuestChange(true)}
                                        className="p-2 text-gray-500 hover:text-purple-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={guests >= 20}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                            <button
                                onClick={handleSearch}
                                className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 min-h-[48px] ${
                                    isSearchDisabled 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-sky-300 to-blue-300 text-white hover:from-sky-400 hover:to-blue-400'
                                }`}
                                disabled={isSearchDisabled}
                            >
                                {isSearching ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Đang tìm...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        <span>Tìm phòng</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Miễn phí hủy phòng</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                                <span>Xác nhận tức thì</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Giá tốt nhất</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}