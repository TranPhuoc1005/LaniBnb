import React, { useState, useEffect } from 'react';
import { 
    Star, 
    MapPin, 
    Calendar, 
    Users, 
    Award,
    Heart,
    Zap,
    CheckCircle,
    Shield,
    Clock,
    Camera,
    TrendingUp,
    Gift,
    Phone,
    Mail,
    MessageCircle,
    ArrowRight,
    Play,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('services');
    const [visibleSection, setVisibleSection] = useState('hero');

    // Simulate scroll effect
    useEffect(() => {
        const sections = ['hero', 'services', 'experience', 'events', 'contact'];
        let currentIndex = 0;
        
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % sections.length;
            setVisibleSection(sections[currentIndex]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const services = [
        {
            icon: <Award className="w-8 h-8" />,
            title: "Khách Sạn 5 Sao",
            description: "Hệ thống khách sạn cao cấp với tiêu chuẩn quốc tế, phục vụ chuyên nghiệp 24/7",
            features: ["Pool & Spa", "Fine Dining", "Concierge", "Valet Parking"]
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Đặt Phòng An Toàn",
            description: "Hệ thống bảo mật SSL 256-bit, thanh toán an toàn, chính sách hủy linh hoạt",
            features: ["SSL Security", "Flexible Cancel", "24h Support", "Price Match"]
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Booking Nhanh Chóng",
            description: "Đặt phòng chỉ trong 60 giây, xác nhận tức thì qua email và SMS",
            features: ["1-Click Booking", "Instant Confirm", "Mobile App", "QR Check-in"]
        },
        {
            icon: <Gift className="w-8 h-8" />,
            title: "Ưu Đãi Độc Quyền",
            description: "Giá tốt nhất thị trường, tích điểm thành viên, ưu đãi sinh nhật đặc biệt",
            features: ["Best Price", "Loyalty Points", "Birthday Deal", "Group Discount"]
        }
    ];

    const experiences = [
        {
            image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&w=500&h=300&fit=crop",
            title: "Saigon Luxury Stay",
            location: "Quận 1, TP.HCM",
            rating: 4.9,
            price: "2,500,000",
            tip: "Book trước 30 ngày để được giảm 20%. Phòng view sông Sài Gòn tuyệt đẹp!",
            tags: ["City View", "Rooftop Pool", "Free Breakfast"]
        },
        {
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&w=500&h=300&fit=crop",
            title: "Hanoi Heritage Hotel",
            location: "Hoàn Kiếm, Hà Nội",
            rating: 4.8,
            price: "1,800,000",
            tip: "Gần phố cổ, đi bộ 5 phút đến hồ Hoàn Kiếm. Nên thử phở bò ở quán đối diện!",
            tags: ["Old Quarter", "Cultural", "Walking Tour"]
        },
        {
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&w=500&h=300&fit=crop",
            title: "Danang Beach Resort",
            location: "Mỹ Khê, Đà Nẵng",
            rating: 4.9,
            price: "3,200,000",
            tip: "Sunset view tuyệt vời! Book spa combo để có giá tốt nhất. Beach access private.",
            tags: ["Beach Front", "Spa & Wellness", "Water Sports"]
        }
    ];

    const events = [
        {
            date: "15-30 DEC",
            title: "Christmas & New Year Special",
            description: "Ưu đãi đến 40% cho kỳ nghỉ Giáng Sinh và Tết Dương lịch",
            image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
            discount: "40%",
            code: "XMAS2024"
        },
        {
            date: "20-25 JAN",
            title: "Tet Holiday Package",
            description: "Gói nghỉ dưỡng Tết đặc biệt với nhiều hoạt động văn hóa",
            image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
            discount: "35%",
            code: "TET2025"
        },
        {
            date: "14 FEB",
            title: "Valentine Romance",
            description: "Gói lãng mạn cho các cặp đôi với dinner và spa couple",
            image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
            discount: "25%",
            code: "LOVE2025"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-300 to-blue-300">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop')] bg-cover bg-center mix-blend-multify"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>

                {/* Content */}
                <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Khám Phá Việt Nam
                        <br />
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Cùng Chúng Tôi
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
                        Trải nghiệm dịch vụ khách sạn đẳng cấp quốc tế tại những điểm đến tuyệt vời nhất Việt Nam. 
                        Từ phòng deluxe sang trọng đến villa riêng tư bên bãi biển.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <Link to={"/rooms/"} className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center">
                            Đặt Phòng Ngay
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
                    <ChevronDown className="w-8 h-8" />
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                                Dịch Vụ Đẳng Cấp
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Chúng tôi mang đến trải nghiệm hoàn hảo với các dịch vụ chuyên nghiệp và tiện ích hiện đại
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2">
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-sky-300 to-blue-300 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        {service.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {service.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {service.features.map((feature, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-sky-300 to-blue-300">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Chia Sẻ Kinh Nghiệm
                        </h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Khám phá những bí quyết và kinh nghiệm du lịch từ cộng đồng khách hàng của chúng tôi
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experiences.map((exp, index) => (
                            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative">
                                    <img 
                                        src={exp.image} 
                                        alt={exp.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-semibold">{exp.rating}</span>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {exp.price}₫/đêm
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                                    <p className="text-gray-600 mb-4 flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {exp.location}
                                    </p>
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
                                        <p className="text-sm text-gray-700 font-medium">💡 Tip: {exp.tip}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {exp.tags.map((tag, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                                Sự Kiện & Ưu Đãi
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Đừng bỏ lỡ những ưu đãi hấp dẫn và sự kiện đặc biệt trong năm
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <div key={index} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative">
                                    <img 
                                        src={event.image} 
                                        alt={event.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm animate-pulse">
                                        -{event.discount} OFF
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                                        {event.date}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="bg-gradient-to-r from-sky-100 to-blue-100 px-4 py-2 rounded-lg">
                                            <span className="text-sm font-medium text-gray-600">Code: </span>
                                            <span className="font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                                                {event.code}
                                            </span>
                                        </div>
                                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center group">
                                            Xem thêm
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-sky-300 to-blue-300">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready for Your Next Adventure?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 leading-relaxed">
                            Hàng nghìn khách sạn đang chờ đón bạn. Đặt phòng ngay hôm nay và nhận ưu đãi độc quyền!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                                <Calendar className="mr-2 w-5 h-5" />
                                Đặt Phòng Ngay
                            </button>
                            <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center">
                                <Phone className="mr-2 w-5 h-5" />
                                Hotline: 1900 1234
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                                Liên Hệ Với Chúng Tôi
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Đội ngũ chuyên gia du lịch của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gửi Tin Nhắn</h3>
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <input 
                                    type="text" 
                                    placeholder="Họ và tên" 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Tiêu đề" 
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mb-6"
                            />
                            <textarea 
                                placeholder="Nội dung tin nhắn..." 
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mb-6 resize-none"
                            ></textarea>
                            <button className="w-full bg-gradient-to-r from-sky-300 to-blue-300 text-white py-4 rounded-xl font-semibold text-lg hover:from-sky-400 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Gửi Tin Nhắn
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-3xl p-8 shadow-lg">
                                <div className="w-12 h-12 bg-gradient-to-r from-sky-300 to-blue-300 rounded-xl flex items-center justify-center text-white mb-4">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Hotline 24/7</h3>
                                <p className="text-gray-600">+84 934 100 597</p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-lg">
                                <div className="w-12 h-12 bg-gradient-to-r from-sky-300 to-blue-300 rounded-xl flex items-center justify-center text-white mb-4">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                                <p className="text-gray-600 mb-2">tranphuoc1005@gmail.com</p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-lg">
                                <div className="w-12 h-12 bg-gradient-to-r from-sky-300 to-blue-300 rounded-xl flex items-center justify-center text-white mb-4">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
                                <p className="text-gray-600 mb-4">Trò chuyện trực tiếp với chuyên gia</p>
                                <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                                    Bắt đầu chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}