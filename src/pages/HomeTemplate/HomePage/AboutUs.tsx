import { MapPin, Shield, Clock, Star, Users, Award, Heart, Zap, CheckCircle, Smartphone, CreditCard, Headphones } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserApi } from "@/services/user.api";
import { listRoomApi } from "@/services/room.api";
import { getCommentsApi } from "@/services/comment.api";

export default function AboutUsSection() {
    const { data: users } = useQuery({
        queryKey: ['stats-users'],
        queryFn: () => getUserApi(),
        staleTime: 1000 * 60 * 5,
    });

    const { data: rooms } = useQuery({
        queryKey: ['stats-rooms'],
        queryFn: () => listRoomApi(1, 10000),
        staleTime: 1000 * 60 * 5,
    });

    const { data: comments } = useQuery({
        queryKey: ['stats-comments'],
        queryFn: () => getCommentsApi(),
        staleTime: 1000 * 60 * 5,
    });

    const totalCustomers = users?.length || 0;
    const totalRooms = rooms?.data?.length || 0;
    
    const averageRating = (() => {
        if (!comments || comments.length === 0) return "5.0";
        const totalRating = comments.reduce((sum, comment) => sum + (comment.saoBinhLuan || 0), 0);
        return (totalRating / comments.length).toFixed(1);
    })();

    const features = [
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Đa dạng địa điểm",
            description:"Hơn 10,000+ khách sạn tại các điểm đến hot nhất Việt Nam",
            color: "from-sky-300 to-blue-300",
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Đặt phòng an toàn",
            description:"Hệ thống bảo mật SSL 256-bit, đảm bảo thông tin 100% an toàn",
            color: "from-sky-300 to-blue-300",
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Xác nhận tức thì",
            description: "Xác nhận đặt phòng ngay lập tức qua email và SMS",
            color: "from-sky-300 to-blue-300",
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "Giá tốt nhất",
            description:"Cam kết giá tốt nhất thị trường, hoàn tiền nếu tìm được giá rẻ hơn",
            color: "from-sky-300 to-blue-300",
        },
    ];

    const stats = [
        {
            number: totalCustomers > 0 ? `${totalCustomers.toLocaleString('vi-VN')}+` : "...",
            label: "Khách hàng tin tưởng",
            icon: <Users className="w-5 h-5" />,
        },
        {
            number: totalRooms > 0 ? `${totalRooms.toLocaleString('vi-VN')}+` : "...",
            label: "Khách sạn đối tác",
            icon: <Award className="w-5 h-5" />,
        },
        {
            number: `${averageRating}/5`,
            label: "Đánh giá trung bình",
            icon: <Star className="w-5 h-5" />,
        },
        {
            number: "24/7",
            label: "Hỗ trợ khách hàng",
            icon: <Headphones className="w-5 h-5" />,
        },
    ];

    const services = [
        {
            icon: <Smartphone className="w-5 h-5" />,
            title: "Đặt phòng dễ dàng",
            description:
                "Giao diện thân thiện, đặt phòng chỉ trong 3 bước đơn giản",
        },
        {
            icon: <CreditCard className="w-5 h-5" />,
            title: "Thanh toán linh hoạt",
            description:
                "Hỗ trợ nhiều hình thức thanh toán: thẻ, ví điện tử, chuyển khoản",
        },
        {
            icon: <CheckCircle className="w-5 h-5" />,
            title: "Hủy phòng miễn phí",
            description:
                "Chính sách hủy phòng linh hoạt, hoàn tiền 100% trong 24h",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16" data-aos="fade-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full mb-6 shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Về{" "}
                        <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                            LaniBnb
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Chúng tôi là nền tảng đặt phòng khách sạn hàng đầu Việt
                        Nam, mang đến trải nghiệm du lịch hoàn hảo với dịch vụ
                        tận tâm và công nghệ hiện đại.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat, index) => (
                        <Card
                            key={index} 
                            className="text-center bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay={index * 200}
                        >
                            <CardHeader>
                                <div className="flex text-white items-center justify-center w-12 h-12 mx-auto bg-gradient-to-r from-sky-300 to-blue-300 rounded-full mb-2 text-center">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <div data-aos="fade-right">
                        <Badge className="bg-gradient-to-r from-sky-300 to-blue-300 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border-0">
                            <Zap className="w-4 h-4 mr-2" />
                            Đặt phòng thông minh
                        </Badge>
                        <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                            Khám phá Việt Nam với
                            <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                                {" "}
                                LaniBnb
                            </span>
                        </h3>
                        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            Từ những khách sạn boutique sang trọng tại trung tâm
                            thành phố đến những resort nghỉ dưỡng bên bờ biển
                            tuyệt đẹp, chúng tôi kết nối bạn với những trải
                            nghiệm lưu trú đáng nhớ nhất.
                        </p>

                        <div className="space-y-6">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-4 group"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-sky-300 to-blue-300 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-white">
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {service.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative" data-aos="fade-left">
                        <Card className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                            <img
                                src="../images/aboutus_image1.png"
                                alt="Luxury Hotel Room"
                                className="w-full h-80 object-cover rounded-2xl shadow-lg"
                            />
                            <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full flex items-center justify-center shadow-xl">
                                <Award className="w-12 h-12 text-white" />
                            </div>
                        </Card>

                        <Card className="absolute -bottom-6 -right-2 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        Đặt phòng thành công!
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Xác nhận trong 30 giây
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6-3 shadow-lg hover:shadow-xl transition-all duration-300 group gap-2" data-aos="fade-up" data-aos-delay={index * 200}
                        >
                            <CardHeader>
                                <div
                                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg text-white`}
                                >
                                    {feature.icon}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-16" data-aos="fade-up">
                    <Card className="bg-gradient-to-r from-sky-300 to-blue-300 rounded-2xl p-8 shadow-2xl border-0">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                            Sẵn sàng cho chuyến du lịch tiếp theo?
                        </h3>
                        <p className="text-blue-100 max-w-2xl mx-auto">
                            Hàng ngàn khách sạn đang chờ đón bạn. Đặt phòng ngay
                            hôm nay và nhận ưu đãi đặc biệt!
                        </p>
                        <Link
                            to={"/rooms/"}
                            className="inline-block mt-4 w-full max-w-[300px] mx-auto bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            Khám phá ngay
                        </Link>
                    </Card>
                </div>
            </div>
        </section>
    );
}