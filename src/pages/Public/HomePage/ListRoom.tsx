import React, { useState, useEffect } from "react";
import { MapPin, Star, Heart, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useRoomStore } from "@/store/room.store";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from "react-router-dom";

interface EnhancedRoom {
    id: number;
    image: string;
    title: string;
    area: string;
    city: string;
    country: string;
    price: number;
    rating: number;
    reviews: number;
    features: string[];
    isPopular?: boolean;
    khach: number;
    phongNgu: number;
    giuong: number;
    phongTam: number;
}

interface AreaSection {
    id: string;
    name: string;
    description: string;
    rooms: EnhancedRoom[];
    gradient: string;
}

export default function ListRoom() {
    const roomsWithLocation = useRoomStore((state) => state.roomsWithLocation);
    const loading = useRoomStore((state) => state.loading);
    const error = useRoomStore((state) => state.error);
    const fetchRoomsWithLocation = useRoomStore((state) => state.fetchRoomsWithLocation);
    
    const [activeArea, setActiveArea] = useState<string>('popular');
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchRoomsWithLocation();
    }, [fetchRoomsWithLocation]);

    const transformRoomsToAreas = (): AreaSection[] => {
        if (!roomsWithLocation || roomsWithLocation.length === 0) return [];

        const roomsWithValidLocation = roomsWithLocation.filter(room => {
            return room.viTri && 
                   room.viTri.tenViTri && 
                   room.viTri.tinhThanh && 
                   room.viTri.quocGia &&
                   room.viTri.tenViTri.trim() !== '' &&
                   room.viTri.tinhThanh.trim() !== '' &&
                   room.viTri.quocGia.trim() !== '';
        });

        if (roomsWithValidLocation.length === 0) return [];

        const enhancedRooms: EnhancedRoom[] = roomsWithValidLocation.map((room, index) => ({
            id: room.id || index + 1,
            image: room.hinhAnh || 'https://via.placeholder.com/400x300?text=No+Image',
            title: room.tenPhong || `Phòng ${index + 1}`,
            area: room.viTri?.tenViTri || "Trung tâm",
            city: room.viTri?.tinhThanh || "TP. Hồ Chí Minh",
            country: room.viTri?.quocGia || "Việt Nam",
            price: room.giaTien || 500000,
            rating: 4.0 + Math.random() * 1,
            reviews: Math.floor(Math.random() * 200) + 50,
            features: [
                room.mayGiat && "Máy giặt",
                room.banLa && "Bàn là", 
                room.tivi && "TV",
                room.dieuHoa && "Điều hòa",
                room.wifi && "WiFi miễn phí",
                room.bep && "Bếp",
                room.doXe && "Đỗ xe",
                room.hoBoi && "Hồ bơi",
                room.banUi && "Bàn ủi"
            ].filter(Boolean) as string[],
            isPopular: false,
            khach: room.khach || 1,
            phongNgu: room.phongNgu || 1,
            giuong: room.giuong || 1,
            phongTam: room.phongTam || 1
        }));

        // Nhóm phòng theo vị trí
        const roomsByLocation = enhancedRooms.reduce((acc, room) => {
            const key = `${room.country}-${room.city}`;
            if (!acc[key]) {
                acc[key] = {
                    country: room.country,
                    city: room.city,
                    rooms: []
                };
            }
            acc[key].rooms.push(room);
            return acc;
        }, {} as Record<string, { country: string; city: string; rooms: EnhancedRoom[] }>);

        const areas: AreaSection[] = [];

        Object.values(roomsByLocation).forEach(location => {
            if (location.rooms.length > 0) {
                areas.push({
                    id: `${location.country.toLowerCase()}-${location.city.toLowerCase().replace(/\s+/g, '-')}`,
                    name: `${location.city}, ${location.country}`,
                    description: `Khám phá các phòng tuyệt vời tại ${location.city}`,
                    gradient: "from-sky-300 to-blue-300",
                    rooms: location.rooms
                });
            }
        });

        return areas;
    };

    const areas = transformRoomsToAreas();
    const currentArea = areas.find(area => area.id === activeArea) || areas[0];

    useEffect(() => {
        if (areas.length > 0 && !areas.find(area => area.id === activeArea)) {
            setActiveArea(areas[0].id);
        }
    }, [areas, activeArea]);

    const toggleFavorite = (roomId: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(roomId)) {
            newFavorites.delete(roomId);
        } else {
            newFavorites.add(roomId);
        }
        setFavorites(newFavorites);
    };

    const RoomCard = ({ room }: { room: EnhancedRoom }) => (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group overflow-hidden h-full">
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={room.image} 
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <button
                    onClick={() => toggleFavorite(room.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                    <Heart 
                        className={`w-4 h-4 transition-colors duration-200 ${
                            favorites.has(room.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-600'
                        }`} 
                    />
                </button>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link to={`/room-detail/${room.id}`} className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-white transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                        <span>Xem chi tiết</span>
                    </Link>
                </div>
            </div>

            <div className="p-5 flex flex-col h-48">
                <div className="flex items-center space-x-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{room.area} • {room.city}</span>
                </div>

                <h3 className="text-lg min-h-7 font-bold text-gray-900 mb-2 line-clamp-1">
                    {room.title}
                </h3>

                <div className="text-sm text-gray-600 mb-3">
                    {room.khach} khách • {room.phongNgu} phòng ngủ • {room.giuong} giường • {room.phongTam} phòng tắm
                </div>

                <div className="flex flex-wrap gap-2 mb-3 flex-grow">
                    {room.features.slice(0, 3).map((feature, index) => (
                        <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                            {feature}
                        </span>
                    ))}
                    {room.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{room.features.length - 3} khác
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">{room.rating.toFixed(1)}</span>
                        <span className="text-gray-600 text-sm">({room.reviews})</span>
                    </div>
                    
                    <div className="text-right flex items-center gap-2">
                        <div className="text-xl font-bold text-blue-600">
                            ${room.price}
                        </div>
                        <div className="text-xs text-gray-500">/ đêm</div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Hiển thị loading state
    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Đang tải danh sách phòng...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Hiển thị error state
    if (error) {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center">
                        <p className="text-red-600">{error}</p>
                        <button 
                            onClick={fetchRoomsWithLocation}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Hiển thị khi không có areas hợp lệ (không có phòng nào có vị trí đầy đủ)
    if (areas.length === 0) {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center">
                        <p className="text-gray-600">Không có phòng nào với thông tin vị trí đầy đủ</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!currentArea) {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center">
                        <p className="text-gray-600">Không có phòng nào được tìm thấy</p>
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section id="rooms" className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-clip">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Khám Phá Các Khu Vực
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tìm kiếm những chỗ ở tuyệt vời tại các điểm đến hàng đầu
                    </p>
                </div>

                {/* Chỉ hiển thị tabs khi có areas */}
                {areas.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {areas.map((area) => (
                            <button
                                key={area.id}
                                onClick={() => setActiveArea(area.id)}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                                    activeArea === area.id
                                        ? `bg-gradient-to-r ${area.gradient} text-white shadow-lg`
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {area.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentArea.name}
                    </h3>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        {currentArea.description}
                    </p>
                </div>

                <div className="relative list_room_slider mb-5">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                        spaceBetween={32}
                        slidesPerView={1}
                        navigation={{
                            prevEl: `.swiper-button-prev-${currentArea.id}`,
                            nextEl: `.swiper-button-next-${currentArea.id}`,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        loop={currentArea.rooms.length > 3}
                        breakpoints={{
                            640: {
                                slidesPerView: 1.5,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 2.5,
                                spaceBetween: 24,
                            },
                            1280: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                        }}
                        className="rooms-swiper !pb-10"
                    >
                        {currentArea.rooms.map((room) => (
                            <SwiperSlide key={`${currentArea.id}-${room.id}`}>
                                <RoomCard room={room} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button 
                        className={`swiper-button-prev-${currentArea.id} absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 -ml-6 hover:scale-110 group`}
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
                    </button>

                    <button 
                        className={`swiper-button-next-${currentArea.id} absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 -mr-6 hover:scale-110 group`}
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
                    </button>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {currentArea.rooms.length}+
                        </div>
                        <div className="text-gray-600">Phòng có sẵn</div>
                    </div>
                    
                    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {currentArea.rooms.length > 0 ? 
                                Math.round(currentArea.rooms.reduce((acc, room) => acc + room.rating, 0) / currentArea.rooms.length * 10) / 10 
                                : 0
                            }
                        </div>
                        <div className="text-gray-600">Đánh giá trung bình</div>
                    </div>
                    
                    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                            ${currentArea.rooms.length > 0 ? Math.min(...currentArea.rooms.map(room => room.price)) : 0}
                        </div>
                        <div className="text-gray-600">Giá từ / đêm</div>
                    </div>
                </div>
            </div>
        </section>
    );
}