import { useState, useMemo, useEffect, Fragment } from "react";
import { MapPin, Star, Heart, Eye, SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight, X } from "lucide-react";
import "./_rooms.scss";
import "../_components/scss/styles.scss";
import { Link, useSearchParams } from "react-router-dom";
import { useListRoom, useLocationOfRoom } from "@/hooks/useRoomQuery";
import { useListLocation } from "@/hooks/useLocationQuery";
import type { RoomItem } from "@/interface/room.interface";

interface Room {
    id: number;
    image: string;
    title: string;
    area: string;
    city: string;
    price: number;
    rating: number;
    reviews: number;
    features: string[];
    isPopular?: boolean;
    description?: string;
}

const sortOptions = [
    { value: "popular", label: "Phổ biến nhất" },
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
    { value: "rating", label: "Đánh giá cao nhất" },
];

const priceRanges = [
    { min: 0, max: Infinity, label: "Tất cả mức giá" },
    { min: 0, max: 700000, label: "Dưới 700k" },
    { min: 700000, max: 1000000, label: "700k - 1M" },
    { min: 1000000, max: 1500000, label: "1M - 1.5M" },
    { min: 1500000, max: Infinity, label: "Trên 1.5M" },
];

const convertApiRoomToUIRoom = (apiRoom: RoomItem, locationData?: any): Room => {
    return {
        id: apiRoom.id,
        image: apiRoom.hinhAnh,
        title: apiRoom.tenPhong,
        area: locationData?.tenViTri || "Không xác định",
        city: locationData?.tinhThanh || "Không xác định",
        price: apiRoom.giaTien,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 200) + 50,
        features: [
            apiRoom.mayGiat ? "Máy giặt" : null,
            apiRoom.banLa ? "Bàn là" : null,
            apiRoom.tivi ? "TV" : null,
            apiRoom.dieuHoa ? "Điều hòa" : null,
            apiRoom.wifi ? "WiFi" : null,
            apiRoom.bep ? "Bếp" : null,
            apiRoom.doXe ? "Chỗ đỗ xe" : null,
            apiRoom.hoBoi ? "Hồ bơi" : null,
        ].filter(Boolean) as string[],
        description: apiRoom.moTa,
    };
};

export default function ListRoomPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const urlLocationId = searchParams.get('location');
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    const urlGuests = searchParams.get('guests');

    const [selectedCity, setSelectedCity] = useState("Tất cả");
    const [sortBy, setSortBy] = useState("popular");
    const [priceRange, setPriceRange] = useState(priceRanges[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(true);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInfo, setSearchInfo] = useState({
        location: "",
        checkIn: "",
        checkOut: "",
        guests: ""
    });
    const roomsPerPage = 12;

    // ✅ Sử dụng React Query hooks
    const { data: roomsData, isLoading: roomsLoading, error: roomsError } = useListRoom(1, 1000);
    const { data: locationsData, isLoading: locationsLoading } = useListLocation(1, 1000);
    
    // Lấy rooms theo location nếu có urlLocationId
    const { data: locationRooms } = useLocationOfRoom(
        urlLocationId ? parseInt(urlLocationId) : 0,
        { enabled: !!urlLocationId }
    );

    const allRooms = roomsData?.data || [];
    const locations = locationsData?.data || [];

    // Map location data to rooms
    const roomsWithLocationData = useMemo(() => {
        return allRooms.map(room => {
            const location = locations.find(loc => loc.id === room.maViTri);
            return convertApiRoomToUIRoom(room, location);
        });
    }, [allRooms, locations]);

    useEffect(() => {
        if (urlLocationId && locations.length > 0) {
            const locationId = parseInt(urlLocationId);
            const location = locations.find(loc => loc.id === locationId);
            if (location) {
                setSelectedCity(location.tinhThanh);
                setSearchInfo(prev => ({
                    ...prev,
                    location: `${location.tenViTri} - ${location.tinhThanh}`
                }));
            }
        }
        
        if (urlCheckIn) {
            setSearchInfo(prev => ({ ...prev, checkIn: urlCheckIn }));
        }
        
        if (urlCheckOut) {
            setSearchInfo(prev => ({ ...prev, checkOut: urlCheckOut }));
        }
        
        if (urlGuests) {
            setSearchInfo(prev => ({ ...prev, guests: `${urlGuests} khách` }));
        }
    }, [urlLocationId, urlCheckIn, urlCheckOut, urlGuests, locations]);

    const cities = useMemo(() => {
        const cityList = locations.map((loc) => loc.tinhThanh);
        return ["Tất cả", ...Array.from(new Set(cityList))];
    }, [locations]);

    const filteredAndSortedRooms = useMemo(() => {
        let filtered = roomsWithLocationData.filter(room => {
            // City filter
            const cityMatch = selectedCity === "Tất cả" || room.city === selectedCity;
            
            // Price filter
            const priceMatch = room.price >= priceRange.min && room.price <= priceRange.max;
            
            // Search filter
            const searchMatch = searchTerm === "" || 
                room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.city.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Guest capacity filter (from URL params)
            let guestMatch = true;
            if (urlGuests) {
                const guestCount = parseInt(urlGuests);
                const roomData = allRooms.find(r => r.id === room.id);
                guestMatch = roomData ? roomData.khach >= guestCount : true;
            }
            
            // Location filter
            let locationMatch = true;
            if (urlLocationId) {
                const locationId = parseInt(urlLocationId);
                const roomData = allRooms.find(r => r.id === room.id);
                locationMatch = roomData ? roomData.maViTri === locationId : false;
            }
            
            return cityMatch && priceMatch && searchMatch && guestMatch && locationMatch;
        });

        // Sorting
        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "popular":
            default:
                filtered.sort((a, b) => {
                    if (a.isPopular && !b.isPopular) return -1;
                    if (!a.isPopular && b.isPopular) return 1;
                    return b.reviews - a.reviews;
                });
                break;
        }

        return filtered;
    }, [roomsWithLocationData, selectedCity, sortBy, priceRange, searchTerm, urlLocationId, urlGuests, allRooms]);

    const totalPages = Math.ceil(filteredAndSortedRooms.length / roomsPerPage);
    const currentRooms = filteredAndSortedRooms.slice(
        (currentPage - 1) * roomsPerPage,
        currentPage * roomsPerPage
    );

    const toggleFavorite = (roomId: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(roomId)) {
            newFavorites.delete(roomId);
        } else {
            newFavorites.add(roomId);
        }
        setFavorites(newFavorites);
    };

    const clearSearchParams = () => {
        setSearchParams({});
        setSearchInfo({
            location: "",
            checkIn: "",
            checkOut: "",
            guests: ""
        });
        setSelectedCity("Tất cả");
        setPriceRange(priceRanges[0]);
        setSearchTerm("");
        setCurrentPage(1);
    };

    const hasSearchParams = urlLocationId || urlCheckIn || urlCheckOut || urlGuests;

    // Loading state
    if (roomsLoading || locationsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (roomsError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
                    <p className="text-gray-600 mb-4">Không thể tải danh sách phòng</p>
                </div>
            </div>
        );
    }

    const RoomCard = ({ room }: { room: Room }) => (
        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group overflow-hidden ${
            viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
        }`}>
            <div className={`relative overflow-hidden ${
                viewMode === 'list' 
                    ? 'w-full sm:w-64 md:w-80 flex-shrink-0 h-48 sm:h-auto' 
                    : 'h-40 sm:h-48'
            }`}>
                <img 
                    src={room.image} 
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://airbnbnew.cybersoft.edu.vn/images/phong1.jpg";
                    }}
                />
                
                {room.isPopular && (
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="hidden xs:inline">Phổ biến</span>
                        <span className="xs:hidden">Hot</span>
                    </div>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(room.id);
                    }}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                    <Heart 
                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200 ${
                            favorites.has(room.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-600'
                        }`} 
                    />
                </button>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center hidden sm:flex">
                    <Link to={`/room-detail/${room.id}`} className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-white transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                        <span>Xem chi tiết</span>
                    </Link>
                </div>
            </div>

            <div className={`p-4 sm:p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
                <div className="flex items-center space-x-1 text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm truncate">{room.area} • {room.city}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {room.title}
                </h3>

                {room.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {room.description}
                    </p>
                )}

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 flex-grow">
                    {room.features.slice(0, viewMode === 'list' ? 6 : 3).map((feature, index) => (
                        <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full truncate max-w-20 sm:max-w-none"
                        >
                            {feature}
                        </span>
                    ))}
                    {room.features.length > (viewMode === 'list' ? 6 : 3) && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{room.features.length - (viewMode === 'list' ? 6 : 3)}
                        </span>
                    )}
                </div>

                <div className={`flex items-center justify-between mt-auto ${viewMode === 'list' ? 'pt-3' : ''}`}>
                    <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base">{room.rating.toFixed(1)}</span>
                        <span className="text-gray-600 text-xs sm:text-sm">({room.reviews})</span>
                    </div>
                    
                    <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                            {room.price.toLocaleString()}đ
                        </div>
                        <div className="text-xs text-gray-500">/ đêm</div>
                    </div>
                </div>

                <Link 
                    to={`/room-detail/${room.id}`}
                    className="sm:hidden mt-3 w-full py-2 bg-gradient-to-r from-sky-300 to-blue-300 text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    <span>Xem chi tiết</span>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="rooms_hero lg:h-[calc(100vh-70px)] text-white py-8 sm:py-12 lg:py-16 flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="hero-content flex items-center flex-col">
                        <div className="hero-text-container">
                            <h1 className="hero-title">
                                <span>Phòng</span>
                                <span>Phòng</span>
                            </h1>
                        </div>
                    </div>
                    <p className="text-base sm:text-lg lg:text-xl text-center mb-6 sm:mb-8 text-blue-100 px-4">
                        Khám phá {roomsWithLocationData.length} phòng tại các điểm đến hấp dẫn nhất Việt Nam
                    </p>

                    {hasSearchParams && (
                        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                            <div className="text-center mb-3">
                                <h3 className="text-lg font-semibold mb-2">Kết quả tìm kiếm</h3>
                                <p className="text-sm text-blue-100">{filteredAndSortedRooms.length} phòng phù hợp với yêu cầu của bạn</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                {searchInfo.location && (
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{searchInfo.location}</span>
                                    </div>
                                )}
                                {(searchInfo.checkIn && searchInfo.checkOut) && (
                                    <div className="flex items-center space-x-2">
                                        <span>📅</span>
                                        <span>{searchInfo.checkIn} - {searchInfo.checkOut}</span>
                                    </div>
                                )}
                                {searchInfo.guests && (
                                    <div className="flex items-center space-x-2">
                                        <span>👥</span>
                                        <span>{searchInfo.guests}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={clearSearchParams}
                                className="mt-3 w-full sm:w-auto mx-auto block px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                            >
                                Xóa bộ lọc tìm kiếm
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-auto px-4 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                            Bộ lọc & Sắp xếp
                        </h2>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                            <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'text-white shadow-sm bg-gradient-to-r from-sky-300 to-blue-300' : 'text-gray-600'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'text-white shadow-sm  bg-gradient-to-r from-sky-300 to-blue-300' : 'text-gray-600'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="sm:hidden text-sm text-gray-600">
                                {filteredAndSortedRooms.length} kết quả
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-3 sm:px-4 py-2  bg-gradient-to-r from-sky-300 to-blue-300 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                            >
                                {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
                                <span className="hidden xs:inline ml-2">{showFilters ? 'Đóng' : 'Bộ lọc'}</span>
                            </button>
                        </div>
                    </div>

                    <div className={`transition-all duration-300 overflow-hidden ${
                        showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                >
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mức giá</label>
                                <select
                                    value={priceRanges.findIndex(p => p.min === priceRange.min && p.max === priceRange.max)}
                                    onChange={(e) => setPriceRange(priceRanges[parseInt(e.target.value)])}
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                >
                                    {priceRanges.map((range, index) => (
                                        <option key={index} value={index}>{range.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm theo tên phòng..."
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Hiển thị <span className="font-semibold">{filteredAndSortedRooms.length}</span> kết quả
                                {hasSearchParams && " phù hợp với tìm kiếm"}
                            </div>
                            
                            <div className="hidden lg:flex items-center space-x-2">
                                <div className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                                    {filteredAndSortedRooms.length}
                                </div>
                                <div className="text-sm text-gray-600">phòng</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`grid gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-7xl mx-auto ${
                    viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                        : 'grid-cols-1'
                }`}>
                    {currentRooms.map(room => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>

                {filteredAndSortedRooms.length === 0 && (
                    <div className="text-center py-12 sm:py-16 max-w-7xl mx-auto">
                        <div className="text-4xl sm:text-6xl mb-4">🏨</div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            Không tìm thấy phòng nào
                        </h3>
                        <p className="text-gray-600 mb-6 px-4">
                            {hasSearchParams 
                                ? "Không có phòng nào phù hợp với tiêu chí tìm kiếm của bạn"
                                : "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {hasSearchParams && (
                                <button
                                    onClick={clearSearchParams}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Xóa tìm kiếm
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setSelectedCity("Tất cả");
                                    setPriceRange(priceRanges[0]);
                                    setSearchTerm("");
                                    setCurrentPage(1);
                                }}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-1 sm:space-x-2 max-w-7xl mx-auto">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                if (typeof window !== 'undefined' && window.innerWidth < 640) {
                                    return Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
                                }
                                return Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages;
                            })
                            .map((page, index, array) => {
                                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                                return (
                                    <Fragment key={page}>
                                        {showEllipsis && <span className="px-2 text-gray-500">...</span>}
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                                                currentPage === page
                                                    ? 'bg-gradient-to-r from-sky-300 to-blue-300 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    </Fragment>
                                );
                            })
                        }
                        
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                )}

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden z-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-600">
                                {filteredAndSortedRooms.length} phòng
                            </div>
                            {totalPages > 1 && (
                                <div className="text-xs text-gray-500">
                                    Trang {currentPage}/{totalPages}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex space-x-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label.replace('nhất', '').replace('đến', '-')}
                                    </option>
                                ))}
                            </select>
                            
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-20 sm:hidden"></div>
            </div>
        </div>
    );
}