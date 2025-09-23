import { useState } from 'react';
import {
    Phone,
    Mail,
    MessageCircle,
    MapPin,
    Clock,
    Send,
    User,
    MessageSquare,
    Globe,
    Star,
    CheckCircle,
    ArrowRight,
    Facebook,
    Instagram,
    Twitter
} from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const contactInfo = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Hotline 24/7",
            info: "+84 934 100 597",
            subInfo: "Hỗ trợ khách hàng mọi lúc"
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email",
            info: "tranphuoc1005@gmail.com",
            subInfo: "Phản hồi trong 2 giờ"
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Địa chỉ",
            info: "Quận 1, TP.HCM",
            subInfo: "Văn phòng chính"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Giờ làm việc",
            info: "24/7 - Mọi ngày",
            subInfo: "Luôn sẵn sàng phục vụ"
        }
    ];

    const socialLinks = [
        { icon: <Facebook className="w-5 h-5" />, name: "Facebook", color: "hover:bg-blue-600" },
        { icon: <Instagram className="w-5 h-5" />, name: "Instagram", color: "hover:bg-pink-600" },
        { icon: <Twitter className="w-5 h-5" />, name: "Twitter", color: "hover:bg-sky-500" }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                
                <div className="relative max-w-4xl mx-auto text-center z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
                        <MessageCircle className="w-4 h-4" />
                        Liên hệ với chúng tôi
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Hãy Nói Chuyện
                        <br />
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Với Chúng Tôi
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Đội ngũ chuyên gia du lịch sẵn sàng hỗ trợ bạn 24/7 với dịch vụ tận tâm và chuyên nghiệp
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Star className="w-4 h-4 text-yellow-300 fill-current" />
                            <span className="text-sm">4.9/5 Rating</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-300" />
                            <span className="text-sm">Phản hồi nhanh</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Form */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Send className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">Gửi Tin Nhắn</h2>
                                    <p className="">Chúng tôi sẽ phản hồi trong vòng 2 giờ</p>
                                </div>
                            </div>

                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Gửi thành công!</h3>
                                    <p className="">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Họ và tên *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-4 bg-white/10 rounded-xl placeholder-white/60  transition-all border border-2"
                                                placeholder="Nhập họ tên của bạn"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-4 bg-white/10 rounded-xl placeholder-white/60  transition-all border border-2"
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-4 bg-white/10 rounded-xl placeholder-white/60  transition-all border border-2"
                                            placeholder="Nhập email của bạn"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Tiêu đề *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-4 bg-white/10 rounded-xl placeholder-white/60  transition-all border border-2"
                                            placeholder="Tiêu đề tin nhắn"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Nội dung tin nhắn *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-4 bg-white/10 rounded-xl placeholder-white/60  transition-all border border-2 resize-none"
                                            placeholder="Nhập nội dung tin nhắn của bạn..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-blue-600 py-4 rounded-xl font-semibold text-lg hover:bg-white transition-all border border-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                Gửi tin nhắn
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Thông tin liên hệ</h2>
                                <p className=" text-lg mb-8">
                                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong hành trình khám phá Việt Nam
                                </p>
                            </div>

                            <div className="grid gap-6">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 hover:bg-white/15 transition-all border border-2 group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                                <p className="font-medium mb-1">{item.info}</p>
                                                <p className="text-white/70 text-sm">{item.subInfo}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    Theo dõi chúng tôi
                                </h3>
                                <div className="flex gap-3">
                                    {socialLinks.map((social, index) => (
                                        <button
                                            key={index}
                                            className={`w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:text-white transition-all border border-2 transform hover:scale-110 ${social.color}`}
                                        >
                                            {social.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="bg-green-500 hover:bg-green-600 p-4 rounded-xl font-semibold transition-all border border-2 transform hover:scale-105 flex items-center justify-center gap-2 text-white">
                                    <MessageCircle className="w-5 h-5" />
                                    Live Chat
                                </button>
                                <button className="bg-white/20 hover:bg-white/30 p-4 rounded-xl font-semibold transition-all border border-2 transform hover:scale-105 flex items-center justify-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Gọi ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Câu hỏi thường gặp</h2>
                    <p className=" text-lg mb-12">
                        Một số câu hỏi phổ biến từ khách hàng
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                        {[
                            {
                                q: "Thời gian phản hồi là bao lâu?",
                                a: "Chúng tôi cam kết phản hồi trong vòng 2 giờ làm việc, 24/7 qua hotline."
                            },
                            {
                                q: "Có hỗ trợ tư vấn miễn phí không?",
                                a: "Có, chúng tôi cung cấp tư vấn miễn phí về tất cả dịch vụ du lịch."
                            },
                            {
                                q: "Làm thế nào để đặt phòng nhanh nhất?",
                                a: "Gọi hotline hoặc sử dụng live chat để được hỗ trợ đặt phòng tức thì."
                            },
                            {
                                q: "Có chính sách hoàn tiền không?",
                                a: "Có, chúng tôi có chính sách hoàn tiền linh hoạt tùy theo điều kiện đặt phòng."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-xl rounded-xl p-6">
                                <h3 className="font-semibold mb-3 text-lg">{faq.q}</h3>
                                <p className="">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}