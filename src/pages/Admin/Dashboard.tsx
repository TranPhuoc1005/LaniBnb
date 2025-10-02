import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Clock, TrendingUp, MoreVertical, RefreshCw } from 'lucide-react';
import { collection, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Link } from 'react-router-dom';

interface ChatStats {
    totalChats: number;
    activeChats: number;
    waitingChats: number;
    todayChats: number;
}

interface ChatSession {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    status: 'waiting' | 'active' | 'closed';
    createdAt: Timestamp | null;
    lastMessage?: string;
    unreadCount?: number;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<ChatStats>({
        totalChats: 0,
        activeChats: 0,
        waitingChats: 0,
        todayChats: 0
    });
    const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllSessions, setShowAllSessions] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'chatSessions'), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ChatSession));

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todaySessions = sessions.filter(session => {
                if (!session.createdAt) return false;
                const sessionDate = session.createdAt.toDate();
                return sessionDate >= today;
            });

            setStats({
                totalChats: sessions.length,
                activeChats: sessions.filter(s => s.status === 'active').length,
                waitingChats: sessions.filter(s => s.status === 'waiting').length,
                todayChats: todaySessions.length
            });

            setRecentSessions(sessions.slice(0, showAllSessions ? sessions.length : 5));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [showAllSessions]);

    const formatTime = (timestamp: Timestamp | null) => {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate();
            const now = new Date();
            const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
            
            if (diffInHours < 1) {
                const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
                return `${diffInMinutes} phút trước`;
            } else if (diffInHours < 24) {
                return `${Math.floor(diffInHours)} giờ trước`;
            } else {
                return date.toLocaleDateString('vi-VN', { 
                    day: '2-digit', 
                    month: '2-digit',
                    year: '2-digit'
                });
            }
        } catch (error) {
            return '';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'waiting': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Đang chat';
            case 'waiting': return 'Chờ';
            case 'closed': return 'Đã đóng';
            default: return 'Không xác định';
        }
    };

    const statCards = [
        {
            title: "Tổng cuộc trò chuyện",
            shortTitle: "Tổng",
            value: stats.totalChats,
            icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            title: "Đang hoạt động",
            shortTitle: "Hoạt động",
            value: stats.activeChats,
            icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-600"
        },
        {
            title: "Đang chờ",
            shortTitle: "Chờ",
            value: stats.waitingChats,
            icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-600"
        },
        {
            title: "Hôm nay",
            shortTitle: "Hôm nay",
            value: stats.todayChats,
            icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Dashboard Chat
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Tổng quan hệ thống tư vấn trực tuyến
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    {statCards.map((card, index) => (
                        <div 
                            key={index} 
                            className={`${card.bgColor} rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className={`${card.textColor} text-xs sm:text-sm font-medium mb-1 leading-tight`}>
                                        <span className="hidden sm:inline">{card.title}</span>
                                        <span className="sm:hidden">{card.shortTitle}</span>
                                    </p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`${card.color} text-white p-2 sm:p-2.5 lg:p-3 rounded-lg flex-shrink-0 ml-2`}>
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Sessions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Cuộc trò chuyện gần đây
                            </h2>
                            <div className="flex items-center space-x-2">
                                {recentSessions.length > 5 && (
                                    <button
                                        onClick={() => setShowAllSessions(!showAllSessions)}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        {showAllSessions ? 'Ẩn bớt' : `Xem tất cả (${recentSessions.length})`}
                                    </button>
                                )}
                                <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sessions List */}
                    <div className="divide-y divide-gray-200">
                        {recentSessions.length > 0 ? (
                            recentSessions.map((session, index) => (
                                <div 
                                    key={session.id || index} 
                                    className="p-3 sm:p-4 lg:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                                        {/* Avatar */}
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-base flex-shrink-0">
                                            {(session.userName?.charAt(0)?.toUpperCase()) || 'U'}
                                        </div>
                                        
                                        {/* User Info */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                                {session.userName || 'Người dùng'}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                                                {session.userEmail}
                                            </p>
                                            
                                            {/* Last Message - Hidden on very small screens */}
                                            {session.lastMessage && (
                                                <p className="hidden sm:block text-xs text-gray-400 truncate mt-1 max-w-xs lg:max-w-sm">
                                                    {session.lastMessage}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Status and Time */}
                                    <div className="text-right flex-shrink-0 ml-3 sm:ml-4">
                                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)} mb-1`}>
                                            {getStatusText(session.status)}
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            {formatTime(session.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 sm:p-12 text-center">
                                <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                                    Chưa có cuộc trò chuyện
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Các cuộc trò chuyện sẽ hiển thị ở đây khi có khách hàng liên hệ
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions - Only show on larger screens */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Chat Management</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Quản lý và phản hồi các cuộc trò chuyện từ khách hàng
                        </p>
                        <Link to={"/chat-manager"} className="block text-center w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Đi tới Chat
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Khách hàng</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Xem thông tin và lịch sử tương tác với khách hàng
                        </p>
                        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            Xem khách hàng
                        </button>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Báo cáo</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Xem báo cáo chi tiết về hiệu suất hỗ trợ khách hàng
                        </p>
                        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                            Xem báo cáo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;