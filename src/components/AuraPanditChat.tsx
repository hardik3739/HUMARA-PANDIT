import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Sparkles, X, MessageSquare, Loader2 } from "lucide-react";
import { ChatMessage } from "../types";
import { MOCK_REMARKS } from "../data";

export default function AuraPanditChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      content: "Namaste, beta! I am Aura AI Pandit Ji. Speak of your birth, your blockages or the worries casting shadows on your soul. Which planetary transit is clouding your peace today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/consultation-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) })
      });

      if (!response.ok) {
        throw new Error("Cosmic link disconnected");
      }

      const data = await response.json();
      const divineReply: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, divineReply]);
    } catch (err: any) {
      console.warn("Express endpoint failed, falling back to ancient scrolls:", err);
      // fallback
      const randomRemark = MOCK_REMARKS[Math.floor(Math.random() * MOCK_REMARKS.length)];
      const fallbackReply: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: `I hear your vibrations, beta. The cosmic grid is processing your request. ${randomRemark} Remember, 'Om Shanti Shanti Shanti' clears heavy clouds of doubt. Let me know if you would like me to cast your full Kundali chart.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Small floating speech button with animated text bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Animated Speech bubble */}
        {!isOpen && (
          <div className="bg-[#141414] text-[#E0D8D0] border border-soft p-3 rounded-2xl rounded-br-none shadow-2xl max-w-[200px] pointer-events-auto animate-float relative cursor-pointer"
               onClick={() => setIsOpen(true)}>
            <p className="font-sans text-xs italic font-medium">
              &ldquo;Breathe deeply, beta. Which energy center feels blocked today?&rdquo;
            </p>
            <div className="absolute -bottom-2.5 right-4 w-4 h-4 bg-[#141414] border-r border-b border-soft transform rotate-45"></div>
          </div>
        )}

        {/* Floating Pandit Button */}
        <button
          id="pandit-floating-btn"
          onClick={() => setIsOpen(prev => !prev)}
          className="pointer-events-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#1A1A1A] to-[#141414] border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-[0_4px_24px_rgba(197,160,89,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 relative group"
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#8CA685] rounded-full border border-white animate-pulse"></div>
            </div>
          )}
          <span className="sr-only">Consult Aura AI Pandit</span>
        </button>
      </div>

      {/* Actual Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[550px] bg-[#0F0F0F] rounded-2xl border-2 border-[#C5A059]/40 shadow-[0_12px_40px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-50 animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A1A1A] to-[#141414] p-4 border-b border-soft flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Skeuomorphic glowing visual dot */}
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-b from-[#E0D8D0] to-[#C5A059] border-2 border-[#8E2E1A] flex items-center justify-center text-[#0F0F0F] font-bold text-sm">
                ॐ
              </div>
              <div>
                <h3 className="font-accent text-sm tracking-widest text-[#C5A059]">Aura AI Pandit</h3>
                <span className="text-[10px] text-[#8CA685] flex items-center gap-1 font-sans">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8CA685] animate-ping"></div>
                  Channelling cosmic knowledge...
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0F0F0F] to-[#141414]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm font-sans ${
                    msg.role === "user"
                      ? "bg-[#8E2E1A] text-[#E0D8D0] rounded-tr-none border border-[#C5A059]/30"
                      : "bg-[#141414] text-[#E0D8D0] rounded-tl-none border border-soft shadow-md"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.role === "user" ? "text-slate-300" : "text-[#E0D8D0]/60"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center gap-2 text-[#C5A059] text-xs font-sans italic bg-[#141414] p-3 rounded-xl border border-soft animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Swamiji is meditating on your alignment...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form 
            onSubmit={handleSend}
            className="p-3 bg-[#141414] border-t border-soft flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about gemstones, career, marriage or doshas..."
              className="flex-1 bg-[#0F0F0F] text-[#E0D8D0] placeholder-slate-500 border border-soft rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#8E2E1A] text-[#E0D8D0] p-2 rounded-xl hover:bg-rose-950 disabled:opacity-50 disabled:hover:bg-[#8E2E1A] transition-all border border-soft hover:shadow-lg flex items-center justify-center aspect-square"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
