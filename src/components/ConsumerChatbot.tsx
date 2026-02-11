import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, ThumbsUp, HelpCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    actions?: { label: string; value: string }[];
};

export default function ConsumerChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! 👋 I'm your AgroVia Assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
            actions: [
                { label: 'Report Quality Issue', value: 'report_issue' },
                { label: 'Product Information', value: 'product_info' },
                { label: 'Contact Support', value: 'contact_support' }
            ]
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botResponse = generateBotResponse(text);
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const generateBotResponse = (input: string): Message => {
        const lowerInput = input.toLowerCase();
        let text = "I'm sorry, I didn't quite catch that. Could you please rephrase?";
        let actions: { label: string; value: string }[] | undefined;

        if (lowerInput.includes('report') || lowerInput === 'report_issue') {
            text = "I'm sorry to hear that. What seems to be the issue with your product?";
            actions = [
                { label: 'Spoiled / Rotten', value: 'issue_spoiled' },
                { label: 'Damaged Packaging', value: 'issue_damaged' },
                { label: 'Wrong Item', value: 'issue_wrong' }
            ];
        } else if (lowerInput.includes('spoiled') || lowerInput.includes('damaged') || lowerInput.includes('wrong') || lowerInput.startsWith('issue_')) {
            const ticketId = 'TKT-' + Math.floor(Math.random() * 10000);
            text = `I've logged your complaint. Your Support Ticket ID is **${ticketId}**. Our team will review it and contact you within 24 hours.`;
        } else if (lowerInput.includes('product') || lowerInput === 'product_info') {
            text = "You can view detailed product information by scanning the QR code on the packaging. On the scan page, you'll see the farm origin, harvest date, and quality grades.";
        } else if (lowerInput.includes('contact') || lowerInput === 'contact_support') {
            text = "You can reach our support team at support@agrovia.com or call us at 1-800-AGROVIA.";
        } else if (lowerInput.includes('thank')) {
            text = "You're welcome! Let me know if you need anything else.";
        }

        return {
            id: (Date.now() + 1).toString(),
            text,
            sender: 'bot',
            timestamp: new Date(),
            actions
        };
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] sm:w-[380px] shadow-2xl rounded-2xl overflow-hidden glass-card border-primary/20"
                    >
                        <Card className="border-0 bg-transparent shadow-none">
                            <CardHeader className="bg-primary p-4 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-base">AgroVia Support</CardTitle>
                                        <p className="text-blue-100 text-xs">Always here to help</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full h-8 w-8">
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>

                            <CardContent className="p-0 bg-white/50 dark:bg-black/50 backdrop-blur-md h-[400px] flex flex-col">
                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={cn(
                                                    "flex w-full",
                                                    msg.sender === 'user' ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                <div className={cn(
                                                    "flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-2 text-sm shadow-sm",
                                                    msg.sender === 'user'
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-white dark:bg-slate-800 text-foreground rounded-tl-none border border-border"
                                                )}>
                                                    {/* Render text with basic markdown support (for bolding Ticket ID) */}
                                                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

                                                    {/* Quick Actions */}
                                                    {msg.actions && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {msg.actions.map(action => (
                                                                <button
                                                                    key={action.value}
                                                                    onClick={() => handleSendMessage(action.label)}
                                                                    className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-full transition-colors font-medium"
                                                                >
                                                                    {action.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <span className="text-[10px] opacity-50 mt-1 self-end block">
                                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}

                                        {isTyping && (
                                            <div className="flex justify-start w-full">
                                                <div className="bg-white dark:bg-slate-800 border border-border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                                                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={scrollRef} />
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            <CardFooter className="p-3 bg-white dark:bg-slate-900 border-t border-border">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                                    className="flex w-full items-center gap-2"
                                >
                                    <Input
                                        placeholder="Type your message..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="rounded-full bg-secondary/50 border-transparent focus:bg-background focus:border-border transition-all"
                                    />
                                    <Button type="submit" size="icon" disabled={!inputValue.trim()} className="rounded-full h-10 w-10 shrink-0 shadow-md">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-colors duration-300",
                    isOpen ? "bg-destructive text-white rotate-90" : "bg-primary text-white"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
            </motion.button>
        </div>
    );
}
