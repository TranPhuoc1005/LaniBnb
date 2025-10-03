import { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, Search } from "lucide-react";
import * as easepick from "@easepick/core";
import { RangePlugin } from "@easepick/range-plugin";
import "@easepick/core/dist/index.css";
import "@easepick/range-plugin/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useListLocation } from "@/hooks/useLocationQuery";
import { useLocationOfRoom } from "@/hooks/useRoomQuery";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Booking() {
    const dateRef = useRef<HTMLInputElement | null>(null);
    const [location, setLocation] = useState<string>("");
    const [guests, setGuests] = useState<number>(1);
    const [isSearching, setIsSearching] = useState(false);
    
    const navigate = useNavigate();

    const { data: locationData, isLoading: locationLoading } = useListLocation(1, 100, undefined, {});
    
    const locations = locationData?.data || [];

    const { refetch: refetchRoomsByLocation } = useLocationOfRoom(
        location ? parseInt(location) : 0, 
        { enabled: false }
    );
    
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
            // Fetch rooms theo location trước khi navigate
            await refetchRoomsByLocation();
            
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
                location: location,
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

    const isSearchDisabled = !location || !dateRef.current?.value || isSearching || locationLoading;

    return (
        <section className="relative z-10 pb-16" data-aos="fade-up">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-6">Đặt Phòng Khách Sạn</h2>
                    <p className="mb-1 text-gray-900">Tìm kiếm khách sạn tốt nhất với giá hấp dẫn</p>
                </div>

                <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-white/20">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-center">
                            
                            <div className="space-y-2">
                                <Label className="flex items-center space-x-2 text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 text-sky-400" />
                                    <span className="text-sm font-semibold">Chọn khách sạn</span>
                                </Label>
                                <Select value={location} onValueChange={setLocation} disabled={locationLoading}>
                                    <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 hover:border-blue-300">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <SelectValue placeholder={locationLoading ? "Đang tải..." : "Chọn điểm đến"} />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((loc) => (
                                            <SelectItem key={loc.id} value={loc.id.toString()}>
                                                {loc.tenViTri} - {loc.tinhThanh}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Input */}
                            <div className="space-y-2">
                                <Label className="flex items-center space-x-2 text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-semibold">Chọn ngày</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        ref={dateRef}
                                        placeholder="Nhận phòng - Trả phòng"
                                        className="w-full h-12 pl-10 border-2 border-gray-200 focus:border-green-500 hover:border-green-300 cursor-pointer"
                                        readOnly
                                    />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center space-x-2 text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-semibold">Số lượng khách</span>
                                </Label>
                                <div className="flex items-center bg-white border-2 border-gray-200 rounded-md focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 hover:border-purple-300 h-12">
                                    <Users className="ml-3 w-4 h-4 text-gray-400" />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleGuestChange(false)}
                                        disabled={guests <= 1}
                                        className="p-2 text-gray-500 hover:text-purple-600 disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </Button>
                                    <span className="flex-1 text-center font-medium text-gray-800">
                                        {guests} khách
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleGuestChange(true)}
                                        disabled={guests >= 20}
                                        className="p-2 text-gray-500 hover:text-purple-600 disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                <Button
                                    onClick={handleSearch}
                                    disabled={isSearchDisabled}
                                    className={`w-full font-bold py-3 px-6 h-12 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 min-h-[48px] ${
                                        isSearchDisabled 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' 
                                            : 'bg-gradient-to-r from-sky-300 to-blue-300 text-white hover:from-sky-400 hover:to-blue-400'
                                    }`}
                                >
                                    {isSearching ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Đang tìm...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Search className="w-5 h-5" />
                                            <span>Tìm phòng</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Badge variant="outline" className="flex items-center space-x-1 text-xs sm:text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Miễn phí hủy phòng</span>
                                </Badge>
                                <Badge variant="outline" className="flex items-center space-x-1 text-xs sm:text-sm">
                                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                                    <span>Xác nhận tức thì</span>
                                </Badge>
                                <Badge variant="outline" className="flex items-center space-x-1 text-xs sm:text-sm">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Giá tốt nhất</span>
                                </Badge>
                            </div>  
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}