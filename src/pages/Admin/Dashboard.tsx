import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Clock, TrendingUp } from 'lucide-react';
import { collection, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';

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

const ChatDashboard: React.FC = () => {
    const [stats, setStats] = useState<ChatStats>({
        totalChats: 0,
        activeChats: 0,
        waitingChats: 0,
        todayChats: 0
    });
    const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);

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

            setRecentSessions(sessions.slice(0, 5));
        });

        return () => unsubscribe();
    }, []);

    const statCards = [
        {
            title: "Tổng cuộc trò chuyện",
            value: stats.totalChats,
            icon: <MessageCircle className="w-6 h-6" />,
            color: "bg-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            title: "Đang hoạt động",
            value: stats.activeChats,
            icon: <Users className="w-6 h-6" />,
            color: "bg-green-500",
            bgColor: "bg-green-50"
        },
        {
            title: "Đang chờ",
            value: stats.waitingChats,
            icon: <Clock className="w-6 h-6" />,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50"
        },
        {
            title: "Hôm nay",
            value: stats.todayChats,
            icon: <TrendingUp className="w-6 h-6" />,
            color: "bg-purple-500",
            bgColor: "bg-purple-50"
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Chat</h1>
                <p className="text-gray-600">Tổng quan hệ thống tư vấn trực tuyến</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div key={index} className={`${card.bgColor} rounded-xl p-6 border border-gray-100`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                            <div className={`${card.color} text-white p-3 rounded-lg`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Cuộc trò chuyện gần đây</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentSessions.map((session, index) => (
                        <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                    {session.userName?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{session.userName || 'Người dùng'}</h3>
                                    <p className="text-sm text-gray-500">{session.userEmail}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    session.status === 'active' ? 'bg-green-100 text-green-800' :
                                    session.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {session.status === 'active' ? 'Đang chat' :
                                     session.status === 'waiting' ? 'Chờ' : 'Đã đóng'}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                    {session.createdAt?.toDate().toLocaleString('vi-VN') || ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatDashboard;