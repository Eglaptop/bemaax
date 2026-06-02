import React, { useState, useRef, useEffect } from 'react';
import { askJasmin } from '../lib/gemini';
import { Send, Bot, User, Sparkles, Terminal, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Jasmin() {
  const [messages, setMessages] = useState<{ role: 'user' | 'jasmin', text: string }[]>([
    { role: 'jasmin', text: "Hello, I am Jasmin. How can I assist you with Eglaptop Technology today? I can help with CMS updates, POS reports, or technical queries." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await askJasmin(userMsg);
      setMessages(prev => [...prev, { role: 'jasmin', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'jasmin', text: "I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border border-gray-100 shadow-2xl overflow-hidden rounded-3xl">
      {/* AI Header */}
      <div className="p-8 border-b border-gray-100 bg-eglaptop-blue text-white flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-eglaptop-blue relative shadow-lg shadow-black/20">
            <Bot size={32} />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-4 border-eglaptop-blue rounded-full"></span>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Jasmin AI</h2>
            <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mt-1">
              <Sparkles size={12} className="mr-2 text-eglaptop-sky" />
              Advanced Neural Assistant
            </div>
          </div>
        </div>
        <div className="hidden md:flex space-x-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Status</span>
            <span className="text-xs font-mono text-green-400">OPTIMIZED</span>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Latency</span>
            <span className="text-xs font-mono text-eglaptop-sky">14ms</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-50/30" ref={scrollRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Terminal, label: 'System Query', color: 'text-eglaptop-orange' },
            { icon: Shield, label: 'Security Audit', color: 'text-eglaptop-blue' },
            { icon: Zap, label: 'Auto-Optimize', color: 'text-eglaptop-sky' }
          ].map((item, i) => (
            <div key={i} className="p-6 border border-gray-100 rounded-2xl bg-white flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all group">
              <item.icon size={24} className={`mb-3 ${item.color} group-hover:scale-110 transition-transform`} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-white text-eglaptop-blue ml-4' : 'bg-eglaptop-blue text-white mr-4'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-6 rounded-2xl shadow-sm border ${
                  msg.role === 'user' 
                  ? 'bg-white border-gray-100 text-eglaptop-dark' 
                  : 'bg-eglaptop-blue border-eglaptop-blue text-white'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-xl animate-pulse text-[10px] font-bold uppercase tracking-widest text-eglaptop-blue flex items-center">
              <div className="flex space-x-1 mr-3">
                <div className="w-1.5 h-1.5 bg-eglaptop-blue rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-eglaptop-blue rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-eglaptop-blue rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              Jasmin is processing...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-8 border-t border-gray-100 bg-white">
        <div className="flex items-center space-x-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Jasmin anything about the system..."
            className="flex-1 p-5 border border-gray-100 rounded-2xl focus:outline-none focus:border-eglaptop-orange bg-gray-50/50 transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={isTyping}
            className="bg-eglaptop-orange text-white p-5 rounded-2xl hover:bg-opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-eglaptop-orange/20"
          >
            <Send size={24} />
          </button>
        </div>
        <div className="mt-6 flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-gray-300">
          <span className="flex items-center"><Zap size={12} className="mr-2 text-eglaptop-sky" /> Neural Engine: v3.1-Flash</span>
          <span>•</span>
          <span>Knowledge Base: Eglaptop-Central</span>
          <span>•</span>
          <span>Encrypted Session</span>
        </div>
      </form>
    </div>
  );
}
