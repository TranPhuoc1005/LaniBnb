import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Phone, Video, Paperclip, Smile, CheckCheck, Check, Move } from 'lucide-react';
import { collection, addDoc, query, onSnapshot, updateDoc, doc, serverTimestamp, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';

interface ChatMessage {
    id: string;
    sessionId: string;
    text: string;
    sender: 'user' | 'admin';
    senderName?: string;
    timestamp: Timestamp | null;
    read: boolean;
    avatar?: string;
}

interface Position {
    x: number;
    y: number;
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 768);
            
            const savedPosition = localStorage.getItem('chat-widget-position');
            if (savedPosition) {
                try {
                    const parsed = JSON.parse(savedPosition);
                    const buttonSize = width <= 768 ? 56 : 64;
                    setPosition({
                        x: Math.min(Math.max(parsed.x, 15), width - buttonSize - 15),
                        y: Math.min(Math.max(parsed.y, 15), window.innerHeight - buttonSize - 15)
                    });
                } catch (error) {
                    const buttonSize = width <= 768 ? 56 : 64;
                    setPosition({ 
                        x: width - buttonSize - 20, 
                        y: window.innerHeight - buttonSize - 20 
                    });
                }
            } else {
                const buttonSize = width <= 768 ? 56 : 64;
                setPosition({ 
                    x: width - buttonSize - 20, 
                    y: window.innerHeight - buttonSize - 20 
                });
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const savePosition = (newPosition: Position) => {
        localStorage.setItem('chat-widget-position', JSON.stringify(newPosition));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y
        });
        
        document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        e.preventDefault();
        
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonSize = isMobile ? 56 : 64;
        
        const constrainedX = Math.max(15, Math.min(newX, viewportWidth - buttonSize - 15));
        const constrainedY = Math.max(15, Math.min(newY, viewportHeight - buttonSize - 15));
        
        setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;
        
        e.preventDefault();
        
        const touch = e.touches[0];
        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonSize = isMobile ? 56 : 64;
        
        const constrainedX = Math.max(15, Math.min(newX, viewportWidth - buttonSize - 15));
        const constrainedY = Math.max(15, Math.min(newY, viewportHeight - buttonSize - 15));
        
        setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        
        setIsDragging(false);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        
        savePosition(position);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        
        setIsDragging(false);
        document.body.style.userSelect = '';
        
        savePosition(position);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [isDragging, dragStart, position, isMobile]);

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        setIsOpen(!isOpen);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startChat = async () => {
        if (!userInfo.name || !userInfo.email) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            const sessionData = {
                userId: `user_${Date.now()}`,
                userName: userInfo.name,
                userEmail: userInfo.email,
                userPhone: userInfo.phone,
                status: 'waiting' as const,
                createdAt: serverTimestamp(),
                unreadCount: 0
            };

            const sessionDoc = await addDoc(collection(db, 'chatSessions'), sessionData);
            setSessionId(sessionDoc.id);
            setIsStarted(true);

            const messageData = {
                sessionId: sessionDoc.id,
                text: `Xin chào ${userInfo.name}! Cảm ơn bạn đã liên hệ với LaniBnb. Chúng tôi sẽ hỗ trợ bạn ngay. Vui lòng chờ trong giây lát...`,
                sender: 'admin' as const,
                senderName: 'Tư vấn viên',
                timestamp: serverTimestamp(),
                read: false
            };

            await addDoc(collection(db, 'messages'), messageData);

        } catch (error) {
            console.error('Error starting chat:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    useEffect(() => {
        if (!sessionId) return;

        const q = query(
            collection(db, 'messages'),
            where('sessionId', '==', sessionId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    sessionId: data.sessionId || '',
                    text: data.text || '',
                    sender: data.sender || 'user',
                    senderName: data.senderName,
                    timestamp: data.timestamp as Timestamp | null,
                    read: data.read || false,
                    avatar: data.avatar
                } as ChatMessage;
            });
            
            messagesData.sort((a, b) => {
                if (!a.timestamp || !b.timestamp) return 0;
                return a.timestamp.toMillis() - b.timestamp.toMillis();
            });
            
            setMessages(messagesData);
            
            const unreadAdminMessages = messagesData.filter(msg => 
                msg.sender === 'admin' && !msg.read
            );
            setUnreadCount(unreadAdminMessages.length);

            unreadAdminMessages.forEach(async (msg) => {
                try {
                    await updateDoc(doc(db, 'messages', msg.id), { read: true });
                } catch (error) {
                    console.error('Error marking message as read:', error);
                }
            });
        });

        return () => unsubscribe();
    }, [sessionId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !sessionId) return;

        try {
            const messageData = {
                sessionId: sessionId,
                text: newMessage.trim(),
                sender: 'user' as const,
                senderName: userInfo.name,
                timestamp: serverTimestamp(),
                read: false
            };

            await addDoc(collection(db, 'messages'), messageData);

            await updateDoc(doc(db, 'chatSessions', sessionId), {
                lastMessage: newMessage.trim(),
                status: 'active'
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Không thể gửi tin nhắn. Vui lòng thử lại!');
        }
    };

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

    const getChatWindowStyle = () => {
        const buttonSize = isMobile ? 56 : 64;
        const chatWidth = isMobile ? Math.min(320, window.innerWidth - 32) : Math.min(384, window.innerWidth - 32);
        const chatHeight = isMobile ? Math.min(480, window.innerHeight - 100) : Math.min(500, window.innerHeight - 32);
        const offset = 8;
        
        let windowX = position.x;
        let windowY = position.y;
        
        if (isMobile) {
            if (position.y > chatHeight + offset + buttonSize) {
                windowY = position.y - chatHeight - offset;
                windowX = Math.max(offset, Math.min(position.x - chatWidth/2 + buttonSize/2, window.innerWidth - chatWidth - offset));
            } else {
                if (position.x > window.innerWidth / 2) {
                    windowX = Math.max(offset, position.x - chatWidth - offset);
                } else {
                    windowX = Math.min(position.x + buttonSize + offset, window.innerWidth - chatWidth - offset);
                }
                windowY = Math.max(offset, Math.min(position.y, window.innerHeight - chatHeight - offset));
            }
        } else {
            if (position.x > window.innerWidth / 2) {
                windowX = position.x - chatWidth - offset;
            } else {
                windowX = position.x + buttonSize + offset;
            }
            
            if (position.y > window.innerHeight - chatHeight - offset) {
                windowY = position.y - chatHeight + buttonSize;
            }
        }
        
        windowX = Math.max(offset, Math.min(windowX, window.innerWidth - chatWidth - offset));
        windowY = Math.max(offset, Math.min(windowY, window.innerHeight - chatHeight - offset));
        
        return {
            left: `${windowX}px`,
            top: `${windowY}px`,
            width: `${chatWidth}px`,
            height: `${chatHeight}px`
        };
    };


    return (
        <>
            <div 
                ref={widgetRef}
                className="fixed z-50"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                data-chat-widget
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="relative group">
                    <button
                        onClick={handleClick}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        className={`relative bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                            isDragging ? 'scale-110 shadow-2xl' : ''
                        } ${
                            isMobile 
                                ? 'p-3 w-14 h-14' 
                                : 'p-4 w-16 h-16'
                        }`}
                        style={{ touchAction: 'none' }}
                    >
                        <MessageCircle className={isMobile ? "w-8 h-8" : "w-8 h-8"} />
                        {unreadCount > 0 && (
                            <span className={`absolute bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse ${
                                isMobile 
                                    ? '-top-1 -right-1 w-5 h-5' 
                                    : '-top-2 -right-2 w-6 h-6'
                            }`}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    
                    {!isMobile && isHovering && !isOpen && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-75 z-10">
                            <Move className="w-3 h-3 inline mr-1" />
                            Kéo để di chuyển
                        </div>
                    )}
                    
                    {isMobile && isHovering && !isOpen && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-75 z-10">
                            <Move className="w-3 h-3 inline mr-1" />
                            Giữ để di chuyển
                        </div>
                    )}
                </div>
            </div>

            {isOpen && (
                <div 
                    className="fixed bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden"
                    style={getChatWindowStyle()}
                >
                    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-white/20 rounded-full flex items-center justify-center flex-shrink-0`}>
                                <User className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className={`font-semibold truncate ${isMobile ? 'text-sm' : 'text-base'}`}>
                                    Tư vấn trực tuyến
                                </h3>
                                <p className="text-xs opacity-90 truncate">
                                    {isStarted ? (
                                        messages.length > 0 ? 'Đang kết nối...' : 'Chờ kết nối...'
                                    ) : 'Hỗ trợ 24/7'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                                <Phone className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                            </button>
                            <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                                <Video className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                            </button>
                        </div>
                    </div>

                    {!isStarted ? (
                        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
                            <div className="text-center mb-4 sm:mb-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-sky-500" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                    Tư vấn miễn phí
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    Nhập thông tin để bắt đầu chat với chuyên gia
                                </p>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <input
                                    type="text"
                                    placeholder="Họ và tên *"
                                    value={userInfo.name}
                                    onChange={(e) => setUserInfo(prev => ({...prev, name: e.target.value}))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Email *"
                                    value={userInfo.email}
                                    onChange={(e) => setUserInfo(prev => ({...prev, email: e.target.value}))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                                <input
                                    type="tel"
                                    placeholder="Số điện thoại"
                                    value={userInfo.phone}
                                    onChange={(e) => setUserInfo(prev => ({...prev, phone: e.target.value}))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                                <button
                                    onClick={startChat}
                                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all text-sm sm:text-base"
                                >
                                    Bắt đầu chat
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div 
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50"
                            >
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div className={`max-w-[85%] sm:max-w-[80%] ${
                                            message.sender === 'user' 
                                                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-l-2xl rounded-tr-sm' 
                                                : 'bg-white text-gray-900 rounded-r-2xl rounded-tl-sm shadow-sm'
                                        } px-3 py-2 sm:px-4`}>
                                            <p className="text-xs sm:text-sm leading-relaxed break-words">{message.text}</p>
                                            <div className={`flex items-center justify-between mt-1 ${
                                                message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                                            }`}>
                                                <span className="text-xs">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                                {message.sender === 'user' && (
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

                            <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
                                <form onSubmit={sendMessage} className="flex items-center space-x-2">
                                    <button 
                                        type="button"
                                        className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                    >
                                        <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 min-w-0 px-3 py-1.5 sm:py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm"
                                    />
                                    <button 
                                        type="button"
                                        className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 hidden sm:block"
                                    >
                                        <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-1.5 sm:p-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                    >
                                        <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default ChatWidget;