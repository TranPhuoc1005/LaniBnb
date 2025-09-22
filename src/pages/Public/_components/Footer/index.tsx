import { 
    MapPin, 
    Phone, 
    Mail, 
    Facebook, 
    Instagram, 
    Twitter, 
    Youtube,
    Star,
    Shield,
    Clock,
    Award
} from "lucide-react";

export default function Footer() {
    const quickLinks = [
        { name: "Trang chủ", href: "#home" },
        { name: "Phòng nghỉ", href: "#rooms" },
        { name: "Bình luận", href: "#comments" },
        { name: "Liên hệ", href: "#contact" }
    ];

    const destinations = [
        "Hồ Chí Minh",
        "Đà Nẵng", 
        "Nha Trang",
        "Đà Lạt",
        "Phú Quốc",
        "Hội An"
    ];

    const achievements = [
        { icon: <Star className="w-5 h-5" />, text: "4.8/5 Đánh giá", subtext: "Từ 2,456 khách hàng" },
        { icon: <Shield className="w-5 h-5" />, text: "Đặt phòng an toàn", subtext: "Bảo mật 100%" },
        { icon: <Clock className="w-5 h-5" />, text: "Hỗ trợ 24/7", subtext: "Luôn sẵn sàng phục vụ" },
        { icon: <Award className="w-5 h-5" />, text: "Chứng nhận chất lượng", subtext: "Tiêu chuẩn quốc tế" }
    ];

    return (
        <footer className="bg-gradient-to-r from-sky-300 to-blue-300 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10">
                {/* Achievements Section */}
                <div className="border-b border-white/10 py-8">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center space-x-4 group">
                                    <div className="bg-white text-sky-300 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                        {achievement.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{achievement.text}</p>
                                        <p className="text-xs">{achievement.subtext}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Brand Section */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="rounded-lg">
                                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-lg">L</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-white">
                                    LaniBnb
                                </h2>
                            </div>
                            <p className="text-white mb-6 leading-relaxed">
                                Mang đến trải nghiệm đặt phòng khách sạn tiện lợi và nhanh chóng, 
                                với nhiều lựa chọn phòng nghỉ chất lượng tại các điểm đến hàng đầu Việt Nam.
                            </p>
                            <div className="flex space-x-4">
                                {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                                    <button 
                                        key={index}
                                        className="bg-white/10 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 p-2 rounded-lg transition-all duration-300 hover:scale-110"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-white">Liên kết nhanh</h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <a 
                                            href={link.href} 
                                            className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Destinations */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-white">Điểm đến phổ biến</h3>
                            <ul className="space-y-3">
                                {destinations.map((destination, index) => (
                                    <li key={index}>
                                        <a 
                                            href="#" 
                                            className="text-white hover:text-purple-400 transition-colors duration-200 flex items-center group"
                                        >
                                            <MapPin className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            {destination}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-white">Thông tin liên hệ</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3 group">
                                    <div className="bg-blue-500/20 p-2 rounded group-hover:bg-blue-500 transition-colors duration-300">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm">155/41/1, đường Phạm Văn Chiêu, phường 14, Quận Gò Vấp, TP.Hồ Chí Minh</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3 group">
                                    <div className="bg-green-500/20 p-2 rounded group-hover:bg-green-500 transition-colors duration-300">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <p className="text-white text-sm">
                                        +84 934 100 597
                                    </p>
                                </div>
                                
                                <div className="flex items-center space-x-3 group">
                                    <div className="bg-purple-500/20 p-2 rounded group-hover:bg-purple-500 transition-colors duration-300">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <p className="text-white text-sm">
                                        tranphuoc1005@gmail.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-white/10">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-white text-sm">
                                © 2025 LaniBnb. Tất cả quyền được bảo lưu.
                            </p>
                            <div className="flex space-x-6 text-sm">
                                <a href="#" className="text-white hover:text-white transition-colors duration-200">
                                    Chính sách bảo mật
                                </a>
                                <a href="#" className="text-white hover:text-white transition-colors duration-200">
                                    Điều khoản sử dụng
                                </a>
                                <a href="#" className="text-white hover:text-white transition-colors duration-200">
                                    Hỗ trợ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}