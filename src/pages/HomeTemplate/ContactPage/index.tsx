import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, User, MessageSquare, Globe, Star, CheckCircle, ArrowRight, Facebook, Instagram, Twitter, ChevronDown, Video, Zap } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
    name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }).max(50, { message: "Họ tên không được quá 50 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phone: z.string().regex(/^[0-9]{10,11}$/, { message: "Số điện thoại phải có 10-11 chữ số" }).optional().or(z.literal('')),
    subject: z.string().min(5, { message: "Tiêu đề phải có ít nhất 5 ký tự" }).max(100, { message: "Tiêu đề không được quá 100 ký tự" }),
    message: z.string().min(10, { message: "Nội dung phải có ít nhất 10 ký tự" }).max(1000, { message: "Nội dung không được quá 1000 ký tự" })
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', email: '', phone: '', subject: '', message: '' }
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const resp = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err.message || "Không gửi được mail");
            }
            setIsSubmitted(true);
            form.reset();
        } catch (error: any) {
            console.error("Gửi mail lỗi:", error);
            alert("Gửi thất bại: " + (error.message || "Thử lại sau"));
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
            action: () => window.open('https://maps.google.com/?q=155/41/1+Phạm+Văn+Chiêu+Phường+14+Quận+Gò+Vấp+TP.HCM', '_blank') },
        { 
            icon: <Clock className="w-6 h-6" />, 
            title: "Giờ làm việc", 
            info: "24/7 - Mọi ngày", 
            subInfo: "Luôn sẵn sàng phục vụ", 
            color: "from-orange-500 to-red-600" 
        }
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
            action: () => { const btn = document.querySelector('[data-chat-widget]') as HTMLElement; if (btn) btn.click(); } 
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
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('../images/contact_image1.avif')` }}></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-yellow-300/20 rounded-full blur-lg animate-bounce"></div>
                <div className="relative max-w-6xl mx-auto text-center z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/30">
                        <MessageCircle className="w-4 h-4" />
                        Liên hệ với chúng tôi
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                        Hãy Nói Chuyện<br />
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Với Chúng Tôi</span>
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">Đội ngũ chuyên gia du lịch sẵn sàng hỗ trợ bạn 24/7 với dịch vụ tận tâm và chuyên nghiệp</p>
                    <div className="flex flex-wrap justify-center gap-4">
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
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Chọn cách liên hệ phù hợp</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Chúng tôi cung cấp nhiều kênh hỗ trợ để bạn có thể liên hệ theo cách thuận tiện nhất</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {supportMethods.map((method, idx) => (
                            <Card key={idx} className={`${method.bgColor} border-gray-100 hover:shadow-xl transition-all duration-300 group`}>
                                <CardContent className="p-8">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>{method.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{method.title}</h3>
                                    <p className="text-gray-600 mb-6">{method.description}</p>
                                    <div className="space-y-2 mb-8">
                                        {method.features.map((feature, i) => (
                                            <div key={i} className="flex items-center text-sm text-gray-700">
                                                <Zap className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                    <Button onClick={method.action} className={`w-full bg-gradient-to-r ${method.color} hover:shadow-lg`}>{method.buttonText}</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12 items-start">
                        <div className="lg:col-span-3">
                            <Card className="shadow-xl border-gray-100">
                                <CardContent className="p-6 sm:p-8 lg:p-10">
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
                                            <p className="text-gray-600 mb-4">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.</p>
                                            <Button onClick={() => setIsSubmitted(false)} variant="outline">Gửi tin nhắn khác</Button>
                                        </div>
                                    ) : (
                                        <Form {...form}>
                                            <div className="space-y-6">
                                                <div className="grid sm:grid-cols-2 gap-6">
                                                    <FormField control={form.control} name="name" render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                                <User className="w-4 h-4 text-sky-500" />
                                                                Họ và tên *
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Nhập họ tên của bạn" className="bg-gray-50 h-12" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                                <Phone className="w-4 h-4 text-green-500" />
                                                                Số điện thoại
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Nhập số điện thoại" className="bg-gray-50 h-12" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                </div>
                                                <FormField control={form.control} name="email" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-blue-500" />
                                                            Email *
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type="email" placeholder="Nhập email của bạn" className="bg-gray-50 h-12" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="subject" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <MessageSquare className="w-4 h-4 text-purple-500" />
                                                            Tiêu đề *
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Tiêu đề tin nhắn" className="bg-gray-50 h-12" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="message" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold text-gray-700">Nội dung tin nhắn *</FormLabel>
                                                        <FormControl>
                                                            <Textarea rows={6} placeholder="Nhập nội dung tin nhắn của bạn..." className="bg-gray-50 resize-none" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 h-12 text-lg shadow-lg hover:shadow-xl">
                                                    {form.formState.isSubmitting ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                            Đang gửi...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Gửi tin nhắn
                                                            <ArrowRight className="w-5 h-5 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="text-center lg:text-left">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Thông tin liên hệ</h2>
                                <p className="text-gray-600 text-lg leading-relaxed">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong hành trình khám phá Việt Nam</p>
                            </div>
                            <div className="grid gap-4">
                                {contactInfo.map((item, idx) => (
                                    <Card key={idx} className={`hover:shadow-lg transition-all duration-200 border-gray-100 group ${item.action ? 'cursor-pointer hover:scale-105' : ''}`} onClick={item.action}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg text-white`}>{item.icon}</div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.title}</h3>
                                                    <p className={`font-medium mb-1 text-gray-800 ${item.action ? 'hover:text-sky-600 transition-colors' : ''}`}>{item.info}</p>
                                                    <p className="text-gray-600 text-sm">{item.subInfo}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Card className="border-gray-100">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
                                        <Globe className="w-5 h-5 text-sky-500" />
                                        Theo dõi chúng tôi
                                    </h3>
                                    <div className="flex gap-3">
                                        {[{ icon: <Facebook className="w-5 h-5" />, color: "hover:bg-blue-600" }, { icon: <Instagram className="w-5 h-5" />, color: "hover:bg-pink-600" }, { icon: <Twitter className="w-5 h-5" />, color: "hover:bg-sky-500" }].map((social, idx) => (
                                            <Button key={idx} variant="ghost" size="icon" className={`bg-gray-100 rounded-xl hover:text-white ${social.color}`}>{social.icon}</Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="grid gap-3">
                                <Button onClick={() => window.open('https://wa.me/84934100597', '_blank')} className="bg-green-500 hover:bg-green-600 h-12 shadow-lg hover:shadow-xl">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    WhatsApp
                                </Button>
                                <Button asChild className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 h-12 shadow-lg hover:shadow-xl">
                                    <a href="tel:0934100597">
                                        <Phone className="w-5 h-5 mr-2" />
                                        Gọi ngay
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Một số câu hỏi phổ biến từ khách hàng và câu trả lời chi tiết</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <Card key={idx} className="p-0 gap-0 bg-gray-50 border-gray-100 overflow-hidden">
                                <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors">
                                    <h3 className="font-semibold text-lg text-gray-900 pr-4">{faq.q}</h3>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform flex-shrink-0 ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedFaq === idx && (
                                    <div className="px-6 pb-6">
                                        <div className="border-t border-gray-200 pt-4">
                                            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}