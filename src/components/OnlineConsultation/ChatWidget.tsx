import React, { useState, useEffect, useRef } from 'react';
import { 
    MessageCircle, 
    X, 
    Send, 
    User, 
    Phone,
    Video,
    Paperclip,
    Smile,
    CheckCheck,
    Check,
    Move
} from 'lucide-react';
import { 
    collection, 
    addDoc, 
    query, 
    onSnapshot, 
    updateDoc,
    doc,
    serverTimestamp,
    where,
    Timestamp
} from 'firebase/firestore';
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
    
    // Drag & Drop states
    const [position, setPosition] = useState<Position>({ x: 24, y: 24 }); // Default: bottom-right
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<HTMLDivElement>(null);

    // Load saved position from localStorage
    useEffect(() => {
        const savedPosition = localStorage.getItem('chat-widget-position');
        if (savedPosition) {
            try {
                const parsed = JSON.parse(savedPosition);
                setPosition(parsed);
            } catch (error) {
                console.error('Error parsing saved position:', error);
            }
        }
    }, []);

    // Save position to localStorage
    const savePosition = (newPosition: Position) => {
        localStorage.setItem('chat-widget-position', JSON.stringify(newPosition));
    };

    // Handle mouse down for dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only left click
        
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

    // Handle mouse move for dragging
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        e.preventDefault();
        
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonSize = 64; // Approximate button size
        
        // Constrain to viewport
        const constrainedX = Math.max(8, Math.min(newX, viewportWidth - buttonSize - 8));
        const constrainedY = Math.max(8, Math.min(newY, viewportHeight - buttonSize - 8));
        
        setPosition({ x: constrainedX, y: constrainedY });
    };

    // Handle mouse up for dragging
    const handleMouseUp = () => {
        if (!isDragging) return;
        
        setIsDragging(false);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        
        // Save position
        savePosition(position);
    };

    // Setup global mouse events for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragStart, position]);

    // Prevent click when dragging
    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        setIsOpen(!isOpen);
    };

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Start chat session
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

            // Send welcome message from admin
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

    // Listen to messages
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
            
            // Sort manually by timestamp
            messagesData.sort((a, b) => {
                if (!a.timestamp || !b.timestamp) return 0;
                return a.timestamp.toMillis() - b.timestamp.toMillis();
            });
            
            setMessages(messagesData);
            
            // Count unread admin messages
            const unreadAdminMessages = messagesData.filter(msg => 
                msg.sender === 'admin' && !msg.read
            );
            setUnreadCount(unreadAdminMessages.length);

            // Mark admin messages as read when user sees them
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

    // Send message
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

            // Update session last message and status
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

    // Format time
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

    // Calculate chat window position based on button position
    const getChatWindowStyle = () => {
        const buttonSize = 64;
        const chatWidth = 384; // w-96 = 24rem = 384px
        const chatHeight = 500;
        const offset = 8;
        
        let windowX = position.x;
        let windowY = position.y;
        
        // Adjust horizontal position
        if (position.x > window.innerWidth / 2) {
            // Button on right side, show chat on left
            windowX = position.x - chatWidth - offset;
        } else {
            // Button on left side, show chat on right
            windowX = position.x + buttonSize + offset;
        }
        
        // Adjust vertical position
        if (position.y > window.innerHeight - chatHeight - offset) {
            // Not enough space below, show above
            windowY = position.y - chatHeight + buttonSize;
        }
        
        // Ensure chat doesn't go off screen
        windowX = Math.max(offset, Math.min(windowX, window.innerWidth - chatWidth - offset));
        windowY = Math.max(offset, Math.min(windowY, window.innerHeight - chatHeight - offset));
        
        return {
            left: `${windowX}px`,
            top: `${windowY}px`,
            right: 'auto',
            bottom: 'auto'
        };
    };

    return (
        <>
            {/* Draggable Chat Bubble */}
            <div 
                ref={widgetRef}
                className="fixed z-200 bottom-3 right-3 w-[56px] h-[56px]"
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
                        className={`relative bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                            isDragging ? 'scale-110 shadow-2xl' : ''
                        }`}
                        style={{ touchAction: 'none' }} // Prevent touch scrolling on mobile
                    >
                        <MessageCircle className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    
                    {/* Drag indicator - shows on hover */}
                    {isHovering && !isOpen && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-75">
                            <Move className="w-3 h-3 inline mr-1" />
                            Kéo để di chuyển
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div 
                    className="fixed w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden"
                    style={getChatWindowStyle()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Tư vấn trực tuyến</h3>
                                <p className="text-xs opacity-90">
                                    {isStarted ? (
                                        messages.length > 0 ? 'Đang kết nối...' : 'Chờ kết nối...'
                                    ) : 'Hỗ trợ 24/7'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                                <Phone className="w-4 h-4" />
                            </button>
                            <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                                <Video className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {!isStarted ? (
                        <div className="p-6 flex-1 flex flex-col justify-center">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-8 h-8 text-sky-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Tư vấn miễn phí
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Nhập thông tin để bắt đầu chat với chuyên gia
                                </p>
                            </div>

                            <div className="space-y-4">
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
                                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all"
                                >
                                    Bắt đầu chat
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Messages */}
                            <div 
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
                            >
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div className={`max-w-[80%] ${
                                            message.sender === 'user' 
                                                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-l-2xl rounded-tr-sm' 
                                                : 'bg-white text-gray-900 rounded-r-2xl rounded-tl-sm shadow-sm'
                                        } px-4 py-2`}>
                                            <p className="text-sm">{message.text}</p>
                                            <div className={`flex items-center justify-between mt-1 ${
                                                message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                                            }`}>
                                                <span className="text-xs">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                                {message.sender === 'user' && (
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

                            {/* Input */}
                            <div className="p-4 bg-white border-t border-gray-200">
                                <form onSubmit={sendMessage} className="flex items-center space-x-2">
                                    <button 
                                        type="button"
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                    />
                                    <button 
                                        type="button"
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <Smile className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
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