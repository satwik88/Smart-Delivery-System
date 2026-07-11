import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, ArrowLeft, Loader2, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerLoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password || (isRegister && (!email || !companyId))) return;
    
    setLoading(true);
    setError(false);
    
    try {
      if (isRegister) {
        await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register-customer`, { username, password, email, companyId });
        setIsRegister(false);
        setPassword('');
        alert("Registration successful. Please log in.");
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`, { username, password });
        if (res.data.token) {
          if (res.data.user.role === 'customer') {
              localStorage.setItem('customerToken', res.data.token);
              navigate('/customer/portal');
          } else {
              setError(true);
          }
        }
      }
    } catch (error) {
      setError(true);
      setTimeout(() => setError(false), 3000); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6 relative overflow-hidden text-text-main font-sans selection:bg-brand-blue selection:text-white transition-colors duration-300">
      
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] bg-green-500/5 rounded-full blur-[150px]"></div>
      </div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-text-muted hover:text-brand-blue transition-colors z-20">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div 
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="premium-card p-10 shadow-2xl shadow-brand-blue/5 border border-border-main bg-card-bg/80 backdrop-blur-xl"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-surface-bg rounded-2xl flex items-center justify-center mb-6 border border-border-main shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-brand-blue/20 transition-colors"></div>
              <Package className="text-brand-blue relative z-10" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Customer Portal</h2>
            <p className="text-text-muted text-sm font-medium">{isRegister ? "Create an account to track your orders." : "Log in to track your deliveries and order history."}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-bg border border-border-main focus:border-brand-blue focus:ring-brand-blue/20 rounded-xl px-4 py-3.5 text-sm font-semibold text-text-main focus:outline-none focus:ring-4 transition-all"
                    placeholder="Enter your email..."
                    required={isRegister}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Company ID Code</label>
                  <input
                    type="text"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full bg-surface-bg border border-border-main focus:border-brand-blue focus:ring-brand-blue/20 rounded-xl px-4 py-3.5 text-sm font-semibold text-text-main focus:outline-none focus:ring-4 transition-all"
                    placeholder="Enter delivery company code..."
                    required={isRegister}
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-surface-bg border ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border-main focus:border-brand-blue focus:ring-brand-blue/20'} rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold text-text-main focus:outline-none focus:ring-4 transition-all placeholder:text-text-muted/50`}
                  placeholder="Enter your username..."
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-surface-bg border ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border-main focus:border-brand-blue focus:ring-brand-blue/20'} rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold text-text-main focus:outline-none focus:ring-4 transition-all placeholder:text-text-muted/50`}
                  placeholder="Enter your password..."
                />
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="text-red-500 text-xs font-bold"
                  >
                    Authentication failed. Please verify credentials.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={loading || !password || !username}
              className="w-full bg-brand-blue text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/25 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Authenticating...
                </>
              ) : (
                'Access Portal'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-bold text-text-muted hover:text-brand-blue transition-colors"
            >
              {isRegister ? "Already have an account? Log in" : "Need an account? Register"}
            </button>
          </div>
        </motion.div>
        
        <p className="text-center text-xs font-bold text-text-muted mt-8">
          Powered by Smart Delivery System
        </p>
      </motion.div>
    </div>
  );
};

export default CustomerLoginPage;
