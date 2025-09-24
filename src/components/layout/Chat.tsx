import { useEffect, useState } from "react";
import {
    addDoc,
    collection,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

interface Message {
    id: string;
    text: string;
    createdAt: any;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Message[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Message, "id">),
            }));
            setMessages(data);
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = async () => {
        if (input.trim() === "") return;
        await addDoc(collection(db, "messages"), {
            text: input,
            createdAt: serverTimestamp(),
        });
        setInput("");
    };

    return (
        <div className="p-4 border rounded max-w-md mx-auto">
            <div className="h-64 overflow-y-auto border-b mb-2">
                {messages.map((msg) => (
                    <div key={msg.id} className="p-1">
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    className="border flex-1 p-2 rounded"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                />
                <button
                    className="bg-blue-500 text-white px-4 rounded"
                    onClick={sendMessage}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}
