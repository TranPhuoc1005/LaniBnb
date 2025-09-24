import type { Timestamp } from "firebase/firestore";

export interface ChatSession {
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

export interface ChatMessage {
    id: string;
    sessionId: string;
    text: string;
    sender: 'user' | 'admin';
    senderName?: string;
    timestamp: Timestamp | null;
    read: boolean;
    avatar?: string;
}