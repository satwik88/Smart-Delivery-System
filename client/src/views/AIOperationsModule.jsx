import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, AlertTriangle, TrendingUp, RefreshCw, Send, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const AIOperationsModule = () => {
  const [insights, setInsights] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your Automated Operations Assistant. I'm connected to your live fleet, inventory, and order data. How can I help you optimize today?" }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await api.get('/ai/insights');
      if (res.data.insights) setInsights(res.data.insights);
      if (res.data.metrics) setMetrics(res.data.metrics);
    } catch (err) {
      console.error(err);
      setInsights([{ title: "Analysis Failed", description: "Could not reach the Insights Engine. Please try again later.", type: "WARNING" }]);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setSending(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error connecting to the intelligence server.' }]);
    } finally {
      setSending(false);
    }
  };

  const getTypeColor = (type) => {
    if (type === 'WARNING') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (type === 'SUCCESS') return 'text-green-500 bg-green-500/10 border-green-500/20';
    return 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';
  };

  const getIcon = (type) => {
    if (type === 'WARNING') return <AlertTriangle size={20} />;
    if (type === 'SUCCESS') return <CheckCircle size={20} />;
    return <Sparkles size={20} />;
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-text-main flex items-center gap-3">
            <Brain size={32} className="text-brand-blue" />
            Automated Operations Center
          </h1>
          <p className="text-text-muted font-medium">Proactive insights and conversational intelligence powered by live system data.</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loadingInsights}
          className="bg-surface-bg border border-border-main text-text-main rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loadingInsights ? "animate-spin" : ""} />
          Refresh Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
        {/* Left Column: Insights & Metrics */}
        <div className="flex flex-col gap-6">
          {/* System Vitals */}
          <div className="bg-card-bg border border-border-main rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-4">Live System Vitals</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-bg p-4 rounded-xl border border-border-main">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Active Orders</p>
                <p className="mt-1 font-black text-2xl text-text-main">{metrics ? metrics.activeOrders : '-'}</p>
              </div>
              <div className="bg-surface-bg p-4 rounded-xl border border-border-main">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Active Fleet</p>
                <p className="mt-1 font-black text-2xl text-text-main">{metrics ? metrics.activeVehicles : '-'}</p>
              </div>
              <div className="bg-surface-bg p-4 rounded-xl border border-border-main">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Low Stock SKUs</p>
                <p className="mt-1 font-black text-2xl text-text-main">{metrics ? metrics.lowStockCount : '-'}</p>
              </div>
              <div className="bg-surface-bg p-4 rounded-xl border border-border-main">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Delayed</p>
                <p className="mt-1 font-black text-2xl text-red-500">{metrics ? metrics.delayedOrders : '-'}</p>
              </div>
            </div>
          </div>

          {/* Strategic Insights */}
          <div className="bg-card-bg border border-border-main rounded-2xl p-6 shadow-sm flex-1 overflow-hidden flex flex-col">
            <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={16} /> Strategic Recommendations
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {loadingInsights ? (
                <div className="flex flex-col items-center justify-center h-full text-text-muted">
                  <Brain size={40} className="animate-pulse text-brand-blue mb-4" />
                  <p className="font-bold">Analyzing Live Data Streams...</p>
                </div>
              ) : (
                <AnimatePresence>
                  {insights.map((insight, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border ${getTypeColor(insight.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getIcon(insight.type)}</div>
                        <div>
                          <h3 className="font-black text-sm mb-1">{insight.title}</h3>
                          <p className="text-xs font-medium opacity-90 leading-relaxed">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat */}
        <div className="lg:col-span-2 bg-card-bg border border-border-main rounded-2xl flex flex-col shadow-sm overflow-hidden relative">
          {/* Mock Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="p-4 border-b border-border-main bg-surface-bg/50 backdrop-blur-md z-10">
            <h2 className="font-black text-text-main flex items-center gap-2">
              <Brain size={20} className="text-brand-blue" />
              Operations Assistant
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 relative">
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-text-main text-surface-bg' : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'}`}>
                  {m.role === 'user' ? <span className="font-bold text-xs">You</span> : <Brain size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-brand-blue text-white rounded-tr-sm shadow-md' : 'bg-surface-bg border border-border-main text-text-main rounded-tl-sm'}`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
            {sending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%]">
                 <div className="w-8 h-8 rounded-full bg-brand-blue text-white shadow-lg flex items-center justify-center shrink-0">
                  <Brain size={16} className="animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-bg border border-border-main text-text-muted rounded-tl-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-surface-bg border-t border-border-main z-10">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about optimizing routes, prioritizing orders, or checking stock..."
                className="w-full bg-card-bg border border-border-main rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none"
              />
              <button 
                type="submit"
                disabled={sending || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-gray-400"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOperationsModule;
