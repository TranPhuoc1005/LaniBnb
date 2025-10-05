import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/firebase';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: any;
    read: boolean;
    senderName?: string;
}

export const useChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const startChat = async (userInfo: { name: string; email: string; phone?: string }) => {
        try {
            const sessionDoc = await addDoc(collection(db, 'chatSessions'), {
                userId: `user_${Date.now()}`,
                userName: userInfo.name,
                userEmail: userInfo.email,
                userPhone: userInfo.phone || '',
                status: 'waiting',
                createdAt: serverTimestamp(),
                unreadCount: 0
            });

            setSessionId(sessionDoc.id);
            setIsConnected(true);

            await addDoc(collection(db, 'messages'), {
                sessionId: sessionDoc.id,
                text: `Xin chào ${userInfo.name}! Cảm ơn bạn đã liên hệ với LaniBnb. Chúng tôi sẽ hỗ trợ bạn ngay.`,
                sender: 'admin',
                senderName: 'Tư vấn viên',
                timestamp: serverTimestamp(),
                read: false
            });

            return sessionDoc.id;
        } catch (error) {
            console.error('Error starting chat:', error);
            throw error;
        }
    };

    const sendMessage = async (text: string) => {
        if (!sessionId || !text.trim()) return;

        try {
            await addDoc(collection(db, 'messages'), {
                sessionId: sessionId,
                text: text.trim(),
                sender: 'user',
                timestamp: serverTimestamp(),
                read: false
            });
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (!sessionId) return;

        const q = query(
            collection(db, 'messages'),
            where('sessionId', '==', sessionId),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ChatMessage[];
            
            setMessages(messagesData);
            
            const unread = messagesData.filter(msg => 
                msg.sender === 'admin' && !msg.read
            ).length;
            setUnreadCount(unread);
        });

        return () => unsubscribe();
    }, [sessionId]);

    return {
        isOpen,
        setIsOpen,
        isConnected,
        messages,
        sessionId,
        unreadCount,
        startChat,
        sendMessage
    };
};