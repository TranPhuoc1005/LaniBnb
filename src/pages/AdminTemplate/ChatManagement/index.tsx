import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Search, Phone, Mail, X, CheckCheck, Check, AlertCircle, Menu, ArrowLeft } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, where, Timestamp } from 'firebase/firestore';
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
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setShowSidebar(!selectedSession);
            } else {
                setShowSidebar(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [selectedSession]);

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

    const handleSessionSelect = (session: ChatSession) => {
        setSelectedSession(session);
        if (isMobile) {
            setShowSidebar(false);
        }
    };

    const handleBackToList = () => {
        if (isMobile) {
            setSelectedSession(null);
            setShowSidebar(true);
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
        <div className="flex h-[calc(100vh-160px)] bg-gray-100 overflow-hidden">
            <div className={`${
                isMobile 
                    ? `fixed inset-y-0 left-0 z-40 w-full transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`
                    : 'w-1/3 lg:w-1/4 xl:w-1/3'
            } bg-white border-r border-gray-200 flex flex-col`}>
                <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Quản lý Chat</h1>
                        {isMobile && selectedSession && (
                            <button
                                onClick={handleBackToList}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
                        <div className="text-center p-1.5 sm:p-2 bg-yellow-50 rounded-lg">
                            <div className="text-sm sm:text-lg font-bold text-yellow-600">{waitingSessions}</div>
                            <div className="text-xs text-yellow-600">Chờ</div>
                        </div>
                        <div className="text-center p-1.5 sm:p-2 bg-green-50 rounded-lg">
                            <div className="text-sm sm:text-lg font-bold text-green-600">{activeSessions}</div>
                            <div className="text-xs text-green-600">Chat</div>
                        </div>
                        <div className="text-center p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                            <div className="text-sm sm:text-lg font-bold text-blue-600">{totalSessions}</div>
                            <div className="text-xs text-blue-600">Tổng</div>
                        </div>
                    </div>

                    <div className="relative mb-3 sm:mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm..."
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
                            onClick={() => handleSessionSelect(session)}
                            className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedSession?.id === session.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-base flex-shrink-0">
                                        {session.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                            {session.userName}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                                            {session.userEmail}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                    <div className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                        {getStatusText(session.status)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {formatDate(session.createdAt)}
                                    </div>
                                </div>
                            </div>
                            {session.lastMessage && (
                                <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
                                    {session.lastMessage}
                                </p>
                            )}
                        </div>
                    ))}

                    {filteredSessions.length === 0 && (
                        <div className="p-6 sm:p-8 text-center text-gray-500">
                            <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                            <p className="text-sm">Không có cuộc trò chuyện</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={`flex-1 flex flex-col ${
                isMobile && showSidebar ? 'hidden' : 'flex'
            }`}>
                {selectedSession ? (
                    <>
                        <div className="p-3 sm:p-4 border-b border-gray-200 bg-white flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                    {isMobile && (
                                        <button
                                            onClick={handleBackToList}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors mr-1 flex-shrink-0"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-base flex-shrink-0">
                                        {selectedSession.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                            {selectedSession.userName}
                                        </h2>
                                        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                                            <Mail className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">{selectedSession.userEmail}</span>
                                            {selectedSession.userPhone && (
                                                <>
                                                    <span>•</span>
                                                    <Phone className="w-3 h-3 flex-shrink-0" />
                                                    <span className="hidden sm:inline">{selectedSession.userPhone}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedSession.status)}`}>
                                        {getStatusText(selectedSession.status)}
                                    </div>
                                    {selectedSession.status !== 'closed' && (
                                        <button
                                            onClick={() => closeSession(selectedSession.id)}
                                            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Đóng cuộc trò chuyện"
                                        >
                                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.sender === 'admin' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className={`max-w-[85%] sm:max-w-[70%] ${
                                        message.sender === 'admin' 
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-l-2xl rounded-tr-sm' 
                                            : 'bg-white text-gray-900 rounded-r-2xl rounded-tl-sm shadow-sm'
                                    } px-3 sm:px-4 py-2 sm:py-3`}>
                                        <p className="text-sm leading-relaxed break-words">
                                            {message.text}
                                        </p>
                                        <div className={`flex items-center justify-between mt-1 sm:mt-2 ${
                                            message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                            <span className="text-xs">
                                                <span className="hidden sm:inline">{message.senderName} • </span>
                                                {formatTime(message.timestamp)}
                                            </span>
                                            {message.sender === 'admin' && (
                                                <div className="ml-2 flex-shrink-0">
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
                            <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
                                <form onSubmit={sendMessage} className="flex items-center space-x-2 sm:space-x-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex-shrink-0"
                                    >
                                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </form>

                                <div className="hidden sm:flex flex-wrap gap-2 mt-3">
                                    {[
                                        "Xin chào! Tôi có thể giúp gì cho bạn?",
                                        "Cảm ơn bạn đã liên hệ",
                                        "Bạn có thể cung cấp thêm thông tin không?",
                                        "Tôi sẽ kiểm tra và phản hồi lại"
                                    ].map((quickResponse, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setNewMessage(quickResponse)}
                                            className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            {quickResponse}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex sm:hidden flex-wrap gap-1 mt-2">
                                    {[
                                        "Xin chào!",
                                        "Cảm ơn bạn",
                                        "Cần thêm thông tin",
                                        "Sẽ phản hồi ngay"
                                    ].map((quickResponse, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setNewMessage([
                                                "Xin chào! Tôi có thể giúp gì cho bạn?",
                                                "Cảm ơn bạn đã liên hệ với chúng tôi",
                                                "Bạn có thể cung cấp thêm thông tin không?",
                                                "Tôi sẽ kiểm tra và phản hồi lại ngay"
                                            ][index])}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            {quickResponse}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedSession.status === 'closed' && (
                            <div className="p-3 sm:p-4 bg-gray-100 border-t border-gray-200 text-center flex-shrink-0">
                                <div className="text-gray-500 text-sm">
                                    <AlertCircle className="w-4 h-4 inline mr-2" />
                                    Cuộc trò chuyện đã được đóng
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
                        <div className="text-center max-w-sm">
                            <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Chọn cuộc trò chuyện
                            </h3>
                            <p className="text-gray-500 text-sm sm:text-base">
                                {isMobile 
                                    ? "Nhấn menu để xem danh sách cuộc trò chuyện"
                                    : "Chọn một cuộc trò chuyện từ danh sách để bắt đầu hỗ trợ khách hàng"
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {isMobile && !showSidebar && (
                <button
                    onClick={() => setShowSidebar(true)}
                    className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default AdminChatPanel;