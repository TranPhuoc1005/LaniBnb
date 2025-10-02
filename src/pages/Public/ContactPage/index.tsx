import { useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, User, MessageSquare, Globe, Star, CheckCircle, ArrowRight, Facebook, Instagram, Twitter, ChevronDown, Video, Zap } from "lucide-react";

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
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSubmitted(false);

        try {
            const resp = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err.message || "Không gửi được mail");
            }

            setIsSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error: any) {
            console.error("Gửi mail lỗi:", error);
            alert("Gửi thất bại: " + (error.message || "Thử lại sau"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Hotline 24/7",
            info: "0934 100 597",
            subInfo: "Hỗ trợ khách hàng mọi lúc",
            color: "from-green-500 to-emerald-600",
            action: () => window.open('tel:0934100597', '_self')
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email",
            info: "tranphuoc1005@gmail.com",
            subInfo: "Phản hồi trong 2 giờ",
            color: "from-blue-500 to-cyan-600",
            action: () => window.open('mailto:tranphuoc1005@gmail.com', '_blank')
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Địa chỉ",
            info: "155/41/1, đường Phạm Văn Chiêu",
            subInfo: "Phường 14, Quận Gò Vấp, TP.HCM",
            color: "from-purple-500 to-pink-600",
            action: () => window.open('https://maps.google.com/?q=155/41/1+Phạm+Văn+Chiêu+Phường+14+Quận+Gò+Vấp+TP.HCM', '_blank')
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Giờ làm việc",
            info: "24/7 - Mọi ngày",
            subInfo: "Luôn sẵn sàng phục vụ",
            color: "from-orange-500 to-red-600"
        }
    ];

    const socialLinks = [
        { icon: <Facebook className="w-5 h-5" />, name: "Facebook", color: "hover:bg-blue-600" },
        { icon: <Instagram className="w-5 h-5" />, name: "Instagram", color: "hover:bg-pink-600" },
        { icon: <Twitter className="w-5 h-5" />, name: "Twitter", color: "hover:bg-sky-500" }
    ];

    const supportMethods = [
        {
            icon: <MessageCircle className="w-8 h-8" />,
            title: "Live Chat",
            description: "Tư vấn trực tiếp với chuyên gia du lịch",
            features: ["Phản hồi tức thì", "Hỗ trợ 24/7", "Tư vấn miễn phí"],
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            buttonText: "Bắt đầu chat",
            action: () => {
                const chatButton = document.querySelector('[data-chat-widget]') as HTMLElement;
                if (chatButton) {
                    chatButton.click();
                }
            }
        },
        {
            icon: <Phone className="w-8 h-8" />,
            title: "Hotline",
            description: "Gọi trực tiếp để được hỗ trợ nhanh nhất",
            features: ["Hỗ trợ 24/7", "Miễn phí tư vấn", "Đặt phòng nhanh"],
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            buttonText: "Gọi ngay",
            action: () => window.open('tel:0934100597')
        },
        {
            icon: <Video className="w-8 h-8" />,
            title: "Video Call",
            description: "Tư vấn trực tiếp qua video call",
            features: ["Tư vấn trực quan", "Chia sẻ màn hình", "Đặt lịch hẹn"],
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50",
            buttonText: "Đặt lịch",
            action: () => window.open('#', '_blank')
        }
    ];

    const faqs = [
        {
            q: "Thời gian phản hồi là bao lâu?",
            a: "Chúng tôi cam kết phản hồi trong vòng 2 giờ làm việc qua email và tức thì qua hotline 24/7. Đối với live chat, thời gian phản hồi trung bình là dưới 5 phút."
        },
        {
            q: "Có hỗ trợ tư vấn miễn phí không?",
            a: "Có, chúng tôi cung cấp tư vấn miễn phí về tất cả dịch vụ du lịch, lựa chọn khách sạn, và lập kế hoạch hành trình phù hợp với ngân sách của bạn."
        },
        {
            q: "Làm thế nào để đặt phòng nhanh nhất?",
            a: "Bạn có thể sử dụng live chat để được hỗ trợ tức thì, gọi hotline, hoặc đặt trực tiếp qua form booking trên website. Chúng tôi sẽ xác nhận đặt phòng trong vòng 15 phút."
        },
        {
            q: "Có chính sách hoàn tiền không?",
            a: "Có, chúng tôi có chính sách hoàn tiền linh hoạt. Miễn phí hủy trước 24h, hoàn 50% trước 12h, và có thể thỏa thuận trong các trường hợp đặc biệt."
        },
        {
            q: "Tôi có thể thay đổi thông tin đặt phòng không?",
            a: "Có, bạn có thể thay đổi ngày, số khách (tùy theo tình trạng phòng trống) miễn phí trước 24h. Sau thời gian này có thể phát sinh phí thay đổi."
        },
        {
            q: "Live chat có hoạt động 24/7 không?",
            a: "Có, hệ thống live chat của chúng tôi hoạt động 24/7. Trong giờ hành chính, bạn sẽ được hỗ trợ trực tiếp bởi tư vấn viên. Ngoài giờ, hệ thống tự động sẽ ghi nhận và chúng tôi phản hồi sớm nhất có thể."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-purple-50">
            <section className="relative py-20 lg:py-32 px-4 sm:px-6 overflow-hidden text-white">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('../images/contact_image1.avif')`
                    }}
                ></div>
                <div className="absolute inset-0 bg-black/40"></div>
                
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-yellow-300/20 rounded-full blur-lg animate-bounce"></div>
                
                <div className="relative max-w-6xl mx-auto text-center z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/30">
                        <MessageCircle className="w-4 h-4" />
                        Liên hệ với chúng tôi
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                        Hãy Nói Chuyện
                        <br />
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Với Chúng Tôi
                        </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl lg:text-2xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Đội ngũ chuyên gia du lịch sẵn sàng hỗ trợ bạn 24/7 với dịch vụ tận tâm và chuyên nghiệp
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                            <Star className="w-4 h-4 text-yellow-300 fill-current" />
                            <span className="text-sm font-medium">4.9/5 Rating</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                            <CheckCircle className="w-4 h-4 text-green-300" />
                            <span className="text-sm font-medium">Phản hồi nhanh</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                            <MessageCircle className="w-4 h-4 text-blue-300" />
                            <span className="text-sm font-medium">Hỗ trợ 24/7</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-20 px-4 sm:px-6 -mt-10 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Chọn cách liên hệ phù hợp
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Chúng tôi cung cấp nhiều kênh hỗ trợ để bạn có thể liên hệ theo cách thuận tiện nhất
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {supportMethods.map((method, index) => (
                            <div key={index} className={`${method.bgColor} rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group`}>
                                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-200`}>
                                    {method.icon}
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{method.title}</h3>
                                <p className="text-gray-600 mb-6">{method.description}</p>
                                
                                <div className="space-y-2 mb-8">
                                    {method.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-gray-700">
                                            <Zap className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={method.action}
                                    className={`w-full bg-gradient-to-r ${method.color} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                                >
                                    {method.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12 items-start">
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Send className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Gửi Tin Nhắn</h2>
                                        <p className="text-gray-600">Chúng tôi sẽ phản hồi trong vòng 2 giờ</p>
                                    </div>
                                </div>

                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 text-gray-900">Gửi thành công!</h3>
                                        <p className="text-gray-600">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <User className="w-4 h-4 text-sky-500" />
                                                    Họ và tên *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                                    placeholder="Nhập họ tên của bạn"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-green-500" />
                                                    Số điện thoại
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                                    placeholder="Nhập số điện thoại"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-blue-500" />
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                                placeholder="Nhập email của bạn"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-purple-500" />
                                                Tiêu đề *
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                                placeholder="Tiêu đề tin nhắn"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Nội dung tin nhắn *
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                                rows={6}
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 resize-none"
                                                placeholder="Nhập nội dung tin nhắn của bạn..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Đang gửi...
                                                </>
                                            ) : (
                                                <>
                                                    Gửi tin nhắn
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="text-center lg:text-left">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Thông tin liên hệ</h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong hành trình khám phá Việt Nam
                                </p>
                            </div>

                            <div className="grid gap-4">
                                {contactInfo.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className={`bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 group ${
                                            item.action ? 'cursor-pointer hover:scale-105' : ''
                                        }`}
                                        onClick={item.action}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                                                <div className="text-white">
                                                    {item.icon}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.title}</h3>
                                                <p className={`font-medium mb-1 text-gray-800 ${
                                                    item.action ? 'hover:text-sky-600 transition-colors duration-200' : ''
                                                }`}>{item.info}</p>
                                                <p className="text-gray-600 text-sm">{item.subInfo}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
                                    <Globe className="w-5 h-5 text-sky-500" />
                                    Theo dõi chúng tôi
                                </h3>
                                <div className="flex gap-3">
                                    {socialLinks.map((social, index) => (
                                        <button
                                            key={index}
                                            className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:text-white transition-all duration-200 transform hover:scale-110 ${social.color}`}
                                        >
                                            {social.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    onClick={() => window.open('https://wa.me/84934100597', '_blank')}
                                    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp
                                </button>
                                
                                <a 
                                    href="tel:0934100597" 
                                    className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white p-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Phone className="w-5 h-5" />
                                    Gọi ngay
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Một số câu hỏi phổ biến từ khách hàng và câu trả lời chi tiết
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <h3 className="font-semibold text-lg text-gray-900 pr-4">{faq.q}</h3>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 flex-shrink-0 ${
                                        expandedFaq === index ? 'rotate-180' : ''
                                    }`} />
                                </button>
                                {expandedFaq === index && (
                                    <div className="px-6 pb-6">
                                        <div className="border-t border-gray-200 pt-4">
                                            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}