import { useState, useEffect } from "react";
import {
    MapPin,
    Star,
    Heart,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useListRoom } from "@/hooks/useRoomQuery";
import { useListLocation } from "@/hooks/useLocationQuery";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    const { data: roomData, isLoading, error, refetch } = useListRoom(1, 200);
    const roomsWithLocation = roomData?.data || [];

    const { data: locationData } = useListLocation(1, 500);
    const locations = locationData?.data || [];

    const [activeArea, setActiveArea] = useState<string>("popular");
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    const enhancedRooms: EnhancedRoom[] = roomsWithLocation.map((r, idx) => {
        const location = locations.find((loc) => loc.id === r.maViTri);

        return {
            id: r.id || idx + 1,
            image:
                r.hinhAnh ||
                "https://via.placeholder.com/400x300?text=No+Image",
            title: r.tenPhong || `Phòng ${idx + 1}`,
            area: location?.tenViTri || "Không rõ",
            city: location?.tinhThanh || "Không rõ",
            country: location?.quocGia || "Việt Nam",
            price: r.giaTien || 500000,
            rating: +(4 + Math.random()).toFixed(1),
            reviews: Math.floor(Math.random() * 200) + 50,
            features: [
                r.mayGiat && "Máy giặt",
                r.banLa && "Bàn là",
                r.tivi && "TV",
                r.dieuHoa && "Điều hòa",
                r.wifi && "WiFi miễn phí",
                r.bep && "Bếp",
                r.doXe && "Đỗ xe",
                r.hoBoi && "Hồ bơi",
                r.banUi && "Bàn ủi",
            ].filter(Boolean) as string[],
            khach: r.khach,
            phongNgu: r.phongNgu,
            giuong: r.giuong,
            phongTam: r.phongTam,
        };
    });

    // ✅ group theo location
    const transformRoomsToAreas = (): AreaSection[] => {
        const grouped = enhancedRooms.reduce((acc, room) => {
            const key = `${room.country}-${room.city}`;
            if (!acc[key])
                acc[key] = {
                    country: room.country,
                    city: room.city,
                    rooms: [],
                };
            acc[key].rooms.push(room);
            return acc;
        }, {} as Record<string, { country: string; city: string; rooms: EnhancedRoom[] }>);

        return Object.values(grouped).map((loc) => ({
            id: `${loc.country.toLowerCase()}-${loc.city
                .toLowerCase()
                .replace(/\s+/g, "-")}`,
            name: `${loc.city}, ${loc.country}`,
            description: `Khám phá các phòng tuyệt vời tại ${loc.city}`,
            gradient: "from-sky-300 to-blue-300",
            rooms: loc.rooms,
        }));
    };

    const areas = transformRoomsToAreas();
    const currentArea = areas.find((a) => a.id === activeArea) || areas[0];

    useEffect(() => {
        if (areas.length && !areas.find((a) => a.id === activeArea)) {
            setActiveArea(areas[0].id);
        }
    }, [areas, activeArea]);

    const toggleFavorite = (id: number) =>
        setFavorites((prev) =>
            prev.has(id)
                ? new Set([...prev].filter((x) => x !== id))
                : new Set(prev).add(id)
        );

    const RoomCard = ({ room }: { room: EnhancedRoom }) => (
        <Card className="overflow-hidden group h-full">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleFavorite(room.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full hover:bg-white"
                >
                    <Heart
                        className={cn(
                            "w-4 h-4 transition-colors",
                            favorites.has(room.id)
                                ? "text-red-500 fill-current"
                                : "text-gray-600"
                        )}
                    />
                </Button>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Link
                        to={`/room-detail/${room.id}`}
                        className="bg-white/90 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-white"
                    >
                        <Eye className="w-4 h-4" />
                        <span>Xem chi tiết</span>
                    </Link>
                </div>
            </div>
            <CardHeader className="p-5 pb-0">
                <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {room.area} • {room.city}
                </div>
                <h3 className="text-lg font-bold line-clamp-1">{room.title}</h3>
                <p className="text-sm text-gray-600">
                    {room.khach} khách • {room.phongNgu} phòng ngủ •{" "}
                    {room.giuong} giường • {room.phongTam} phòng tắm
                </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                    {room.features.slice(0, 3).map((f, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                            {f}
                        </span>
                    ))}
                    {room.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{room.features.length - 3} khác
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">
                            {room.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-600">
                            ({room.reviews})
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                            ${room.price}
                        </div>
                        <div className="text-xs text-gray-500">/ đêm</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (isLoading)
        return (
            <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                    Đang tải danh sách phòng...
                </p>
            </div>
        );

    if (error)
        return (
            <div className="py-16 text-center">
                <p className="text-red-600">{(error as any)?.message}</p>
                <Button onClick={() => refetch()} className="mt-4">
                    Thử lại
                </Button>
            </div>
        );

    if (!areas.length || !currentArea)
        return (
            <div className="py-16 text-center text-gray-600">
                Không có phòng nào được tìm thấy
            </div>
        );

    return (
        <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Khám Phá Các Khu Vực
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tìm kiếm những chỗ ở tuyệt vời tại các điểm đến hàng đầu
                    </p>
                </div>

                {areas.length > 1 && (
                    <div
                        className="flex flex-wrap justify-center gap-3 mb-8"
                        data-aos="fade-up"
                    >
                        {areas.map((area) => (
                            <Button
                                key={area.id}
                                onClick={() => setActiveArea(area.id)}
                                className={cn(
                                    "px-6 py-3 rounded-full font-medium",
                                    activeArea === area.id
                                        ? `bg-gradient-to-r ${area.gradient} text-white shadow-lg`
                                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                                )}
                            >
                                {area.name}
                            </Button>
                        ))}
                    </div>
                )}

                <div className="text-center mb-8" data-aos="fade-up">
                    <h3 className="text-2xl font-bold mb-2">
                        {currentArea.name}
                    </h3>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        {currentArea.description}
                    </p>
                </div>

                <Carousel className="mb-10">
                    <CarouselContent>
                        {currentArea.rooms.map((room) => (
                            <CarouselItem
                                key={`${currentArea.id}-${room.id}`}
                                className="basis-full md:basis-1/2 lg:basis-1/3 px-2"
                            >
                                <RoomCard room={room} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0">
                        <ChevronLeft className="w-6 h-6" />
                    </CarouselPrevious>
                    <CarouselNext className="right-0">
                        <ChevronRight className="w-6 h-6" />
                    </CarouselNext>
                </Carousel>
            </div>
        </section>
    );
}
