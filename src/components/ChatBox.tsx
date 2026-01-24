import { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import { useNavigate } from "react-router-dom";
import { Send, Bot, User, X, Loader2 } from "lucide-react";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

const tools = [
    {
        type: "function" as const,
        function: {
            name: "navigate_to_page",
            description: "Navigate to a specific page on the Haramaya LandTax website based on user request.",
            parameters: {
                type: "object",
                properties: {
                    page: {
                        type: "string",
                        enum: [
                            "/", "/about", "/history", "/services", "/news", "/contact",
                            "/contact-info", "/feedback", "/verify", "/faq", "/library",
                            "/zoning", "/transparency", "/auth", "/dashboard",
                            "/land-registration", "/valuation", "/tax", "/payments",
                            "/disputes", "/users", "/citizen-portal", "/my-properties",
                            "/my-payments", "/my-disputes", "/my-documents", "/reports",
                            "/property-sales", "/house-sales", "/manage-inquiries",
                            "/land-sales", "/house-sale", "/inquirie", "/structure-registry",
                            "/sale-validation", "/settings"
                        ],
                        description: "The path of the page to navigate to. Use the most relevant one.",
                    },
                },
                required: ["page"],
            },
        },
    },
];

export default function ChatBox() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Array<{ role: "user" | "assistant" | "system"; content: string }>>([
        {
            role: "system",
            content: `You are a helpful assistant for the Haramaya LandTax system, a legal and property management platform in Ethiopia. 
      You have the ability to navigate users to different parts of the website using the 'navigate_to_page' tool.
      
      Site Map and Capabilities:
      - '/' (Home): Overview of services.
      - '/about', '/history': Information about Haramaya Wereda and the Land Bureau.
      - '/services': List of available government services.
      - '/news': Updates and announcements.
      - '/contact', '/contact-info', '/feedback': Reach out to the bureau or provide suggestions.
      - '/verify': Document and land title verification.
      - '/faq': Frequently asked questions.
      - '/library': Document library.
      - '/zoning': Zoning map for land use.
      - '/transparency': Government data and reports.
      - '/auth': Login or Register for the system.
      - '/dashboard': User and staff management area.
      - '/land-registration': Official land registration portal (Staff).
      - '/valuation': Property valuation services (Staff).
      - '/tax', '/payments': Tax management and payment portal.
      - '/disputes': Land dispute resolution system.
      - '/users': Admin user management.
      - '/citizen-portal', '/my-properties', '/my-payments', '/my-disputes', '/my-documents': Citizen self-service tools.
      - '/reports': Analytical reports (Staff).
      - '/property-sales', '/house-sales', '/land-sales': Marketplaces for listing and buying property.
      - '/settings': User profile and system settings.

      When a user asks to see a page, go to a section, or do something like 'pay taxes' or 'register land', use the 'navigate_to_page' tool to take them there and explain what that page is for. Keep responses concise and professional.`
        }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: "user" as const, content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                tools: tools,
            });

            const message = response.choices[0].message;

            if (message.tool_calls) {
                for (const toolCall of message.tool_calls) {
                    if (toolCall.function.name === "navigate_to_page") {
                        const { page } = JSON.parse(toolCall.function.arguments);
                        navigate(page);
                        const assistantMsg = {
                            role: "assistant" as const,
                            content: `Sure! I'm taking you to the ${page.replace('/', ' ').trim() || 'home'} page now.`
                        };
                        setMessages((prev) => [...prev, assistantMsg]);
                    }
                }
            } else {
                const assistantMsg = {
                    role: "assistant" as const,
                    content: message.content || "I'm sorry, I couldn't process that."
                };
                setMessages((prev) => [...prev, assistantMsg]);
            }
        } catch (error) {
            console.error("AI Error:", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to AI service. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Floating button */}
            <button
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close chat" : "Open AI assistant"}
            >
                {open ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
                {!open && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-secondary"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {open && (
                <div className="absolute bottom-16 right-0 flex h-[500px] w-80 flex-col overflow-hidden rounded-2xl border border-white/20 bg-background/80 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 sm:w-96">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-primary p-4 text-white">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">Haramaya AI Guide</h3>
                                <p className="text-[10px] text-white/70">Navigation Enabled</p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white/10">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20"
                    >
                        {messages.filter(m => m.role !== 'system').map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`flex max-w-[85%] gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm ${msg.role === "user" ? "bg-secondary/10 border-secondary/20" : "bg-primary/10 border-primary/20"}`}>
                                        {msg.role === "user" ? <User className="h-4 w-4 text-secondary" /> : <Bot className="h-4 w-4 text-primary" />}
                                    </div>
                                    <div className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === "user"
                                            ? "bg-secondary text-secondary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none border border-white/10"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex max-w-[85%] gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-sm">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-2 rounded-tl-none border border-white/10 shadow-sm">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        <span className="text-xs text-muted-foreground italic">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-muted/30 border-t border-white/10">
                        <div className="flex gap-2 relative">
                            <input
                                className="flex-1 rounded-xl border border-white/10 bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                                value={input}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Where would you like to go?"
                                disabled={loading}
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-primary hover:bg-primary/10 disabled:opacity-50 transition-colors"
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="mt-2 text-[8px] text-center text-muted-foreground/50">
                            Powered by Haramaya Tech • Navigation Enabled
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
