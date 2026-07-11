import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Truck, Package, MapPin, Zap, ChevronRight, BarChart2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg text-text-main font-sans selection:bg-brand-blue selection:text-white transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-card-bg/80 backdrop-blur-md border-b border-border-main">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-black">S</div>
            <span className="font-black text-xl tracking-tight">Smart Delivery</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-text-muted">
            <a href="#features" className="hover:text-brand-blue transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-blue transition-colors">How it works</a>
            <Link to="/track" className="hover:text-brand-blue transition-colors">Track Package</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/track" className="text-sm font-bold text-text-muted hover:text-brand-blue transition-colors">Track</Link>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center bg-surface-bg border border-border-main hover:bg-gray-100 rounded-full text-text-muted hover:text-text-main transition-colors hover:scale-105 transform active:scale-95 duration-200"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>
            <Link to="/admin" className="bg-brand-blue text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-brand-blue/30 transition-all hover:-translate-y-0.5">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <div className="flex justify-center lg:justify-start mb-8">
                <span className="bg-brand-blue/10 text-brand-blue px-4 py-1.5 rounded-full text-sm font-bold border border-brand-blue/20 shadow-sm flex items-center gap-2">
                  <Zap size={14} /> New: Algorithmic Route Optimization
                </span>
              </div>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-text-main">
              Enterprise Logistics, <br/><span className="text-brand-blue">Simplified.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-text-muted mb-10 max-w-2xl mx-auto lg:mx-0 font-medium">
              Scale your delivery network with intelligent routing, real-time tracking, and comprehensive analytics. Built for modern fleets.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/admin" className="bg-brand-blue text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-brand-blue/30 transition-all hover:-translate-y-1 w-full sm:w-auto justify-center">
                Get Started <ChevronRight size={18} />
              </Link>
              <Link to="/track" className="bg-card-bg text-text-main border border-border-main px-8 py-4 rounded-full font-bold hover:border-gray-300 hover:bg-surface-bg transition-all w-full sm:w-auto text-center">
                Track a Package
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Abstract Graphic */}
          <motion.div 
            className="flex-1 relative w-full aspect-square max-w-lg lg:max-w-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-purple-500/10 rounded-[3rem] -rotate-6 transform-gpu"></div>
            <div className="absolute inset-0 bg-card-bg rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 backdrop-blur-xl flex flex-col p-8">
               <div className="flex items-center justify-between border-b border-border-main pb-4 mb-6">
                 <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
               </div>
               {/* Mock Dashboard UI Graphic */}
               <div className="flex-1 bg-surface-bg rounded-2xl p-4 flex gap-4">
                 <div className="w-1/3 bg-card-bg rounded-xl shadow-sm border border-border-main p-4 space-y-4">
                   <div className="h-2 w-1/2 bg-gray-200 rounded-full"></div>
                   <div className="h-8 w-full bg-brand-blue/10 rounded-lg"></div>
                   <div className="h-8 w-full bg-gray-100 rounded-lg"></div>
                   <div className="h-8 w-full bg-gray-100 rounded-lg"></div>
                 </div>
                 <div className="flex-1 flex flex-col gap-4">
                   <div className="flex gap-4">
                     <div className="flex-1 h-20 bg-card-bg rounded-xl shadow-sm border border-border-main p-4">
                        <div className="h-2 w-8 bg-brand-blue rounded-full mb-3"></div>
                        <div className="h-4 w-16 bg-gray-900 rounded-full"></div>
                     </div>
                     <div className="flex-1 h-20 bg-card-bg rounded-xl shadow-sm border border-border-main p-4">
                        <div className="h-2 w-8 bg-green-500 rounded-full mb-3"></div>
                        <div className="h-4 w-16 bg-gray-900 rounded-full"></div>
                     </div>
                   </div>
                   <div className="flex-1 bg-card-bg rounded-xl shadow-sm border border-border-main overflow-hidden relative">
                     <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-brand-blue rounded-full animate-bounce shadow-lg shadow-brand-blue/50"></div>
                     <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-gray-300 rounded-full"></div>
                     <svg className="absolute inset-0 w-full h-full text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M 25 50 Q 50 25 66 33" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" /></svg>
                   </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-card-bg px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Everything you need to deliver</h2>
            <p className="text-text-muted font-medium max-w-2xl mx-auto">A complete suite of tools designed to optimize your supply chain from warehouse to doorstep.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin className="text-brand-blue" size={24}/>, title: "Live Tracking", desc: "Pinpoint accuracy for every vehicle in your fleet with real-time Leaflet maps." },
              { icon: <Zap className="text-yellow-500" size={24}/>, title: "Algorithmic Routing", desc: "Reduce fuel costs by up to 24% with our automated dispatch and routing algorithms." },
              { icon: <BarChart2 className="text-green-500" size={24}/>, title: "Deep Analytics", desc: "Understand your operational bottlenecks with rich, interactive data visualizations." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 rounded-3xl bg-surface-bg border border-border-main hover:border-brand-blue/20 hover:shadow-xl transition-all cursor-default"
              >
                <div className="w-12 h-12 bg-card-bg rounded-2xl flex items-center justify-center mb-6 shadow-sm">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-text-muted font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-border-main">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">How it works</h2>
            <p className="text-text-muted font-medium max-w-2xl mx-auto">From order placement to final delivery, see how our system operates.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center relative">
            {[
              { step: "1", title: "Order Placed", desc: "Customer places order which enters the centralized system." },
              { step: "2", title: "Smart Sorting", desc: "Warehouse assigns the package to the optimal delivery route." },
              { step: "3", title: "Driver Dispatched", desc: "Driver picks up package with AI-optimized turn-by-turn directions." },
              { step: "4", title: "Delivered", desc: "Real-time tracking updates notify the customer of completion." }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative z-10"
              >
                <div className="w-16 h-16 bg-brand-blue text-white rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl font-black shadow-lg shadow-brand-blue/30">{s.step}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-text-muted font-medium text-sm">{s.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border-main -z-10"></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card-bg text-text-muted py-12 px-6 border-t border-border-main transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-blue rounded flex items-center justify-center text-white font-black text-xs">S</div>
            <span className="font-bold text-text-main tracking-tight">Smart Delivery System</span>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Smart Delivery System. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
