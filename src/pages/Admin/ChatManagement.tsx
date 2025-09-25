import React, { useState, useEffect, useRef } from 'react';
import { 
    MessageCircle, 
    Send, 
    Search, 
    Phone,
    Mail,
    X,
    CheckCheck,
    Check,
    AlertCircle,
} from 'lucide-react';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    updateDoc,
    doc,
    serverTimestamp,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/firebase';

interface ChatSession {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    status: 'waiting' | 'active' | 'closed';
    createdAt: Timestamp | null;
    lastMessage?: string;
    unreadCount: number;
}

interface Message {
    id: string;
    sessionId: string;
    text: string;
    sender: 'user' | 'admin';
    senderName?: string;
    timestamp: Timestamp | null;
    read: boolean;
}

const AdminChatPanel: React.FC = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'active' | 'closed'>('all');
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(
            collection(db, 'chatSessions'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ChatSession[];
            setSessions(sessionsData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!selectedSession) return;

        const q = query(
            collection(db, 'messages'),
            where('sessionId', '==', selectedSession.id),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            
            setMessages(messagesData);

            messagesData.forEach(async (msg) => {
                if (msg.sender === 'user' && !msg.read) {
                    try {
                        await updateDoc(doc(db, 'messages', msg.id), { read: true });
                    } catch (error) {
                        console.error('Error marking message as read:', error);
                    }
                }
            });
        });

        return () => unsubscribe();
    }, [selectedSession]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedSession) return;

        try {
            await addDoc(collection(db, 'messages'), {
                sessionId: selectedSession.id,
                text: newMessage.trim(),
                sender: 'admin',
                senderName: 'Tư vấn viên',
                timestamp: serverTimestamp(),
                read: false
            });

            await updateDoc(doc(db, 'chatSessions', selectedSession.id), {
                lastMessage: newMessage.trim(),
                status: 'active'
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Không thể gửi tin nhắn. Vui lòng thử lại!');
        }
    };

    const closeSession = async (sessionId: string) => {
        try {
            await updateDoc(doc(db, 'chatSessions', sessionId), {
                status: 'closed'
            });
        } catch (error) {
            console.error('Error closing session:', error);
        }
    };

    const filteredSessions = sessions.filter(session => {
        const matchesSearch = session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            session.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatTime = (timestamp: Timestamp | null) => {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate();
            return date.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (error) {
            return '';
        }
    };

    const formatDate = (timestamp: Timestamp | null) => {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate();
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            
            if (isToday) {
                return formatTime(timestamp);
            } else {
                return date.toLocaleDateString('vi-VN', { 
                    day: '2-digit', 
                    month: '2-digit' 
                });
            }
        } catch (error) {
            return '';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'waiting': return 'bg-yellow-100 text-yellow-800';
            case 'active': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'waiting': return 'Chờ';
            case 'active': return 'Đang chat';
            case 'closed': return 'Đã đóng';
            default: return 'Không xác định';
        }
    };

    const waitingSessions = sessions.filter(s => s.status === 'waiting').length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const totalSessions = sessions.length;

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900 mb-4">Quản lý Chat</h1>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-yellow-50 rounded-lg">
                            <div className="text-lg font-bold text-yellow-600">{waitingSessions}</div>
                            <div className="text-xs text-yellow-600">Chờ</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">{activeSessions}</div>
                            <div className="text-xs text-green-600">Đang chat</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{totalSessions}</div>
                            <div className="text-xs text-blue-600">Tổng</div>
                        </div>
                    </div>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm khách hàng..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="all">Tất cả</option>
                        <option value="waiting">Chờ phản hồi</option>
                        <option value="active">Đang chat</option>
                        <option value="closed">Đã đóng</option>
                    </select>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredSessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => setSelectedSession(session)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedSession?.id === session.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                        {session.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 text-sm">{session.userName}</h3>
                                        <p className="text-xs text-gray-500">{session.userEmail}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                        {getStatusText(session.status)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {formatDate(session.createdAt)}
                                    </div>
                                </div>
                            </div>
                            {session.lastMessage && (
                                <p className="text-sm text-gray-600 truncate">
                                    {session.lastMessage}
                                </p>
                            )}
                        </div>
                    ))}

                    {filteredSessions.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Không có cuộc trò chuyện nào</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                {selectedSession ? (
                    <>
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                        {selectedSession.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-gray-900">{selectedSession.userName}</h2>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Mail className="w-3 h-3" />
                                            <span>{selectedSession.userEmail}</span>
                                            {selectedSession.userPhone && (
                                                <>
                                                    <span>•</span>
                                                    <Phone className="w-3 h-3" />
                                                    <span>{selectedSession.userPhone}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSession.status)}`}>
                                        {getStatusText(selectedSession.status)}
                                    </div>
                                    {selectedSession.status !== 'closed' && (
                                        <button
                                            onClick={() => closeSession(selectedSession.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Đóng cuộc trò chuyện"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.sender === 'admin' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className={`max-w-[70%] ${
                                        message.sender === 'admin' 
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-l-2xl rounded-tr-sm' 
                                            : 'bg-white text-gray-900 rounded-r-2xl rounded-tl-sm shadow-sm'
                                    } px-4 py-3`}>
                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                        <div className={`flex items-center justify-between mt-2 ${
                                            message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                            <span className="text-xs">
                                                {message.senderName} • {formatTime(message.timestamp)}
                                            </span>
                                            {message.sender === 'admin' && (
                                                <div className="ml-2">
                                                    {message.read ? (
                                                        <CheckCheck className="w-3 h-3" />
                                                    ) : (
                                                        <Check className="w-3 h-3" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {selectedSession.status !== 'closed' && (
                            <div className="p-4 bg-white border-t border-gray-200">
                                <form onSubmit={sendMessage} className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {[
                                        "Xin chào! Tôi có thể giúp gì cho bạn?",
                                        "Cảm ơn bạn đã liên hệ với chúng tôi",
                                        "Bạn có thể cung cấp thêm thông tin không?",
                                        "Tôi sẽ kiểm tra và phản hồi lại ngay"
                                    ].map((quickResponse, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setNewMessage(quickResponse)}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            {quickResponse}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedSession.status === 'closed' && (
                            <div className="p-4 bg-gray-100 border-t border-gray-200 text-center">
                                <div className="text-gray-500 text-sm">
                                    <AlertCircle className="w-4 h-4 inline mr-2" />
                                    Cuộc trò chuyện đã được đóng
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Chọn cuộc trò chuyện
                            </h3>
                            <p className="text-gray-500">
                                Chọn một cuộc trò chuyện từ danh sách để bắt đầu hỗ trợ khách hàng
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatPanel;