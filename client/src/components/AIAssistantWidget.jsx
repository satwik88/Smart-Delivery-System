import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hello! I'm your Rules Engine Dispatch Assistant. Ask me about your active orders, drivers, or potential delays." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chat', { message: userMessage.text });
      const aiMessage = { id: Date.now() + 1, role: 'ai', text: res.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = { id: Date.now() + 1, role: 'ai', text: 'Sorry, I am having trouble connecting to the network right now.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
            className="absolute bottom-16 right-0 w-80 md:w-96 bg-card-bg border border-border-main rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-brand-blue p-4 flex justify-between items-center text-white shrink-0 shadow-md z-10 relative">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Rules Engine Dispatcher</h3>
                  <p className="text-[10px] font-medium text-blue-100 uppercase tracking-wider flex items-center gap-1"><Sparkles size={10}/> SLRROS Intelligence</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-bg/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-blue text-white rounded-br-none shadow-sm' 
                      : 'bg-white dark:bg-gray-800 border border-border-main text-text-main rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-border-main text-text-muted rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-xs font-semibold">Analyzing fleet data...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-card-bg border-t border-border-main shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about orders, drivers..."
                  className="w-full bg-surface-bg border border-border-main rounded-xl pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all text-text-main placeholder:text-text-muted"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-1.5 bg-brand-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-brand-blue transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-blue text-white rounded-full shadow-xl shadow-brand-blue/30 flex items-center justify-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
        {isOpen ? <X size={24} className="relative z-10" /> : <Bot size={24} className="relative z-10" />}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-surface-bg animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
};

export default AIAssistantWidget;
