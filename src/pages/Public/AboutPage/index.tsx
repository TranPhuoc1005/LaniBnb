"use client";

import { Link } from "react-router-dom";
import {
    MapPin,
    Award,
    Zap,
    Shield,
    Gift,
    Phone,
    Mail,
    MessageCircle,
    ArrowRight,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const services = [
    {
        icon: <Award className="w-8 h-8" />,
        title: "Khách Sạn 5 Sao",
        description:
            "Hệ thống khách sạn cao cấp với tiêu chuẩn quốc tế, phục vụ chuyên nghiệp 24/7",
        features: ["Pool & Spa", "Fine Dining", "Concierge", "Valet Parking"],
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Đặt Phòng An Toàn",
        description:
            "Hệ thống bảo mật SSL 256-bit, thanh toán an toàn, chính sách hủy linh hoạt",
        features: [
            "SSL Security",
            "Flexible Cancel",
            "24h Support",
            "Price Match",
        ],
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Booking Nhanh Chóng",
        description:
            "Đặt phòng chỉ trong 60 giây, xác nhận tức thì qua email và SMS",
        features: [
            "1-Click Booking",
            "Instant Confirm",
            "Mobile App",
            "QR Check-in",
        ],
    },
    {
        icon: <Gift className="w-8 h-8" />,
        title: "Ưu Đãi Độc Quyền",
        description:
            "Giá tốt nhất thị trường, tích điểm thành viên, ưu đãi sinh nhật đặc biệt",
        features: [
            "Best Price",
            "Loyalty Points",
            "Birthday Deal",
            "Group Discount",
        ],
    },
];

const experiences = [
    {
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&w=500&h=300&fit=crop",
        title: "Saigon Luxury Stay",
        location: "Quận 1, TP.HCM",
        rating: 4.9,
        price: "2,500,000",
        tip: "Book trước 30 ngày để được giảm 20%. Phòng view sông Sài Gòn tuyệt đẹp!",
        tags: ["City View", "Rooftop Pool", "Free Breakfast"],
    },
    {
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&w=500&h=300&fit=crop",
        title: "Hanoi Heritage Hotel",
        location: "Hoàn Kiếm, Hà Nội",
        rating: 4.8,
        price: "1,800,000",
        tip: "Gần phố cổ, đi bộ 5 phút đến hồ Hoàn Kiếm. Nên thử phở bò ở quán đối diện!",
        tags: ["Old Quarter", "Cultural", "Walking Tour"],
    },
    {
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&w=500&h=300&fit=crop",
        title: "Danang Beach Resort",
        location: "Mỹ Khê, Đà Nẵng",
        rating: 4.9,
        price: "3,200,000",
        tip: "Sunset view tuyệt vời! Book spa combo để có giá tốt nhất. Beach access private.",
        tags: ["Beach Front", "Spa & Wellness", "Water Sports"],
    },
];

const events = [
    {
        date: "15-30 DEC",
        title: "Christmas & New Year Special",
        description: "Ưu đãi đến 40% cho kỳ nghỉ Giáng Sinh và Tết Dương lịch",
        image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
        discount: "40%",
        code: "XMAS2024",
    },
    {
        date: "20-25 JAN",
        title: "Tet Holiday Package",
        description: "Gói nghỉ dưỡng Tết đặc biệt với nhiều hoạt động văn hóa",
        image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
        discount: "35%",
        code: "TET2025",
    },
    {
        date: "14 FEB",
        title: "Valentine Romance",
        description: "Gói lãng mạn cho các cặp đôi với dinner và spa couple",
        image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
        discount: "25%",
        code: "LOVE2025",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-300 to-blue-300">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop')] bg-cover bg-center mix-blend-multiply"></div>
                </div>
                <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Khám Phá Việt Nam <br />
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Cùng Chúng Tôi
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                        Trải nghiệm dịch vụ khách sạn đẳng cấp quốc tế tại những
                        điểm đến tuyệt vời nhất Việt Nam.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-white text-blue-600 rounded-2xl shadow-2xl hover:shadow-3xl"
                    >
                        <Link to="/rooms/">
                            Đặt Phòng Ngay{" "}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
                    <ChevronDown className="w-8 h-8" />
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                        Dịch Vụ Đẳng Cấp
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Trải nghiệm hoàn hảo với các dịch vụ chuyên nghiệp
                    </p>
                    <div className="grid lg:grid-cols-2 gap-8">
                        {services.map((s, i) => (
                            <Card
                                key={i}
                                className="group p-8 hover:-translate-y-2 transition-all duration-500"
                            >
                                <CardHeader className="flex flex-row gap-6 items-start">
                                    <div className="w-16 h-16 bg-gradient-to-r from-sky-300 to-blue-300 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                        {s.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600">
                                            {s.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {s.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {s.features.map((f, j) => (
                                                <span
                                                    key={j}
                                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                                >
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-gradient-to-r from-sky-300 to-blue-300">
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">
                        Chia Sẻ Kinh Nghiệm
                    </h2>
                    <p className="text-xl opacity-90 mb-12">
                        Khám phá bí quyết và kinh nghiệm du lịch từ cộng đồng
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experiences.map((exp, i) => (
                            <Card key={i} className="overflow-hidden group p-0 gap-0">
                                <img
                                    src={exp.image}
                                    alt={exp.title}
                                    className="h-48 w-full object-cover"
                                />
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2">
                                        {exp.title}
                                    </h3>
                                    <p className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="w-4 h-4 mr-1" />{" "}
                                        {exp.location}
                                    </p>
                                    <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg text-sm">
                                        💡 {exp.tip}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {exp.tags.map((t, j) => (
                                            <span
                                                key={j}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                        Sự Kiện & Ưu Đãi
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Đừng bỏ lỡ những ưu đãi hấp dẫn
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((e, i) => (
                            <Card key={i} className="group overflow-hidden p-0 gap-0">
                                <img
                                    src={e.image}
                                    alt={e.title}
                                    className="h-48 w-full object-cover group-hover:scale-105 transition mb-0"
                                />
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600">
                                        {e.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {e.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="px-4 py-2 rounded-lg bg-sky-100 text-gray-600 font-medium">
                                            Code: {e.code}
                                        </span>
                                        <Button
                                            variant="link"
                                            className="text-blue-600"
                                        >
                                            Xem thêm{" "}
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                        Liên Hệ Với Chúng Tôi
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Đội ngũ chuyên gia du lịch sẵn sàng hỗ trợ 24/7
                    </p>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 p-8">
                            <CardHeader>
                                <h3 className="text-2xl font-bold mb-6">
                                    Gửi Tin Nhắn
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <Input placeholder="Họ và tên" className="w-full !h-15" />
                                    <Input placeholder="Email" type="email" className="w-full !h-15" />
                                </div>
                                <Input placeholder="Tiêu đề" className="mb-6 w-full !h-15" />
                                <Textarea
                                    placeholder="Nội dung tin nhắn..."
                                    rows={6}
                                    className="mb-6 w-full !h-50"
                                />
                                <Button className="w-full h-14 bg-gradient-to-r from-sky-300 to-blue-300 text-white text-xl">
                                    Gửi Tin Nhắn
                                </Button>
                            </CardContent>
                        </Card>
                        <div className="space-y-8">
                            <Card className="p-8">
                                <Phone className="w-6 h-6 text-blue-600 mx-auto" />
                                <h3 className="text-xl font-bold">
                                    Hotline 24/7
                                </h3>
                                <p className="text-gray-600">+84 934 100 597</p>
                            </Card>
                            <Card className="p-8">
                                <Mail className="w-6 h-6 text-blue-600 mx-auto" />
                                <h3 className="text-xl font-bold">Email</h3>
                                <p className="text-gray-600">
                                    tranphuoc1005@gmail.com
                                </p>
                            </Card>
                            <Card className="p-8">
                                <MessageCircle className="w-6 h-6 text-blue-600 mx-auto" />
                                <h3 className="text-xl font-bold">
                                    Live Chat
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Trò chuyện trực tiếp với chuyên gia
                                </p>
                                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                                    Bắt đầu chat
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
