import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../api';
import { useToast } from '../utils/useToast';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Pulse AI. How can I help you regarding your health today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { showToast } = window.useToast ? window.useToast() : { showToast: () => { } };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const SUGGESTIONS = [
        "What are symptoms of the flu?",
        "Tips for better sleep",
        "How much water should I drink?"
    ];

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
    };

    const executeSend = async (messageText) => {
        if (!messageText.trim()) return;

        const userMessage = { id: Date.now(), text: messageText.trim(), isBot: false };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const aiResponseText = await sendChatMessage(newMessages);

            const botMessage = {
                id: Date.now() + 1,
                text: aiResponseText,
                isBot: true
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            if (showToast) showToast('Failed to connect to AI assistant', 'error');

            const botMessage = {
                id: Date.now() + 1,
                text: "I'm having trouble connecting to my network right now. Please try again later.",
                isBot: true
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        executeSend(input);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ height: '500px', maxHeight: '80vh' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shrink-0 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <Bot className="w-8 h-8 bg-white/10 p-1.5 rounded-xl shadow-inner border border-white/20" />
                            <div>
                                <h3 className="text-sm font-bold tracking-tight">Pulse AI Assistant</h3>
                                <p className="text-[10px] text-white/70 font-medium tracking-wide uppercase mt-0.5">Virtual Healthcare Support</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors hover:bg-white/10 p-1.5 rounded-lg active:scale-95">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isBot ? 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 shadow-sm border border-blue-200/50' : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600 shadow-sm border border-slate-300/50'}`}>
                                    {msg.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed ${msg.isBot ? 'bg-white border border-slate-100 rounded-tl-sm text-slate-700 shadow-sm shadow-slate-200/50' : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md shadow-blue-500/20'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-3 max-w-[85%] mr-auto">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 shadow-sm border border-blue-200/50 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="px-4 py-3 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center h-[42px]">
                                    <span className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions */}
                    {!isTyping && messages.length < 3 && (
                        <div className="flex gap-2 overflow-x-auto p-3 bg-white border-t border-slate-100 shrink-0 no-scrollbar hide-scroll-bar">
                            {SUGGESTIONS.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200/50 transition-colors flex items-center gap-1.5 snap-center"
                                >
                                    <Sparkles className="w-3 h-3 text-blue-500" />
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 shrink-0">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 pr-1.5 shadow-sm focus-within:ring-2 ring-blue-500/20 focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent px-3 py-2 text-[13px] focus:outline-none text-slate-700 placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 group relative active:scale-95"
                >
                    <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-slate-50 rounded-full" />
                </button>
            )}
        </div>
    );
}
