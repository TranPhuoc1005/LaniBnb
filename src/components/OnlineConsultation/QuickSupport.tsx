import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Headphones } from 'lucide-react';

const QuickSupport: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const supportOptions = [
        {
            icon: <MessageCircle className="w-5 h-5" />,
            title: "Live Chat",
            description: "Tư vấn trực tiếp với chuyên gia",
            action: () => {
                const event = new CustomEvent('openChat');
                window.dispatchEvent(event);
            },
            color: "bg-blue-500 hover:bg-blue-600"
        },
        {
            icon: <Phone className="w-5 h-5" />,
            title: "Hotline",
            description: "0934 100 597 (24/7)",
            action: () => window.open('tel:0934100597'),
            color: "bg-green-500 hover:bg-green-600"
        },
        {
            icon: <Mail className="w-5 h-5" />,
            title: "Email",
            description: "tranphuoc1005@gmail.com",
            action: () => window.open('mailto:tranphuoc1005@gmail.com'),
            color: "bg-purple-500 hover:bg-purple-600"
        }
    ];

    return (
        <div className="fixed left-6 bottom-6 z-50 hidden md:block">
            {isExpanded && (
                <div className="mb-4 space-y-3">
                    {supportOptions.map((option, index) => (
                        <div
                            key={index}
                            onClick={option.action}
                            className={`${option.color} text-white p-3 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 min-w-[250px]`}
                        >
                            {option.icon}
                            <div>
                                <div className="font-semibold text-sm">{option.title}</div>
                                <div className="text-xs opacity-90">{option.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
                <Headphones className="w-6 h-6" />
            </button>
        </div>
    );
};

export default QuickSupport;