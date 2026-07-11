import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, Building2, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminRegisterPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [ownerUsername, setOwnerUsername] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!companyName || !ownerUsername || !ownerPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (ownerPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register the company
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register-company`, {
        companyName,
        ownerUsername,
        ownerPassword
      });

      // 2. Auto-login
      const loginRes = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`, { 
        username: ownerUsername, 
        password: ownerPassword 
      });

      if (loginRes.data.token) {
        if (loginRes.data.user.role === 'super_admin') {
            localStorage.setItem('superAdminToken', loginRes.data.token);
            navigate('/superadmin/dashboard');
        } else {
            localStorage.setItem('adminToken', loginRes.data.token);
            navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6 relative overflow-hidden text-text-main font-sans selection:bg-brand-blue selection:text-white transition-colors duration-300">
      
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-blue/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[150px]"></div>
      </div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-text-muted hover:text-brand-blue transition-colors">
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
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-surface-bg rounded-2xl flex items-center justify-center mb-6 border border-border-main shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-brand-blue/20 transition-colors"></div>
              <Building2 className="text-brand-blue relative z-10" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Create Workspace</h2>
            <p className="text-text-muted text-sm font-medium">Register your company to access the logistics platform.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <Building2 size={18} />
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-surface-bg border border-border-main focus:border-brand-blue focus:ring-brand-blue/20 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-text-main focus:outline-none focus:ring-4 transition-all placeholder:text-text-muted/50"
                  placeholder="e.g. Acme Logistics"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Owner Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={ownerUsername}
                  onChange={(e) => setOwnerUsername(e.target.value)}
                  className="w-full bg-surface-bg border border-border-main focus:border-brand-blue focus:ring-brand-blue/20 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-text-main focus:outline-none focus:ring-4 transition-all placeholder:text-text-muted/50"
                  placeholder="e.g. admin_acme"
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
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  className="w-full bg-surface-bg border border-border-main focus:border-brand-blue focus:ring-brand-blue/20 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-text-main focus:outline-none focus:ring-4 transition-all placeholder:text-text-muted/50"
                  placeholder="Create a secure password"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-bg border border-border-main focus:border-brand-blue focus:ring-brand-blue/20 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-text-main focus:outline-none focus:ring-4 transition-all placeholder:text-text-muted/50"
                  placeholder="Repeat your password"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="text-red-500 text-xs font-bold"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || !companyName || !ownerUsername || !ownerPassword || !confirmPassword}
              className="w-full bg-brand-blue text-white py-3.5 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/25 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating Workspace...
                </>
              ) : (
                'Register Company'
              )}
            </button>
          </form>

          <p className="text-center text-sm font-semibold text-text-muted mt-6">
            Already have an account? <Link to="/admin" className="text-brand-blue hover:underline">Log in</Link>
          </p>

        </motion.div>
        
        <p className="text-center text-xs font-bold text-text-muted mt-8">
          Secured by SLRROS Enterprise
        </p>
      </motion.div>
    </div>
  );
};

export default AdminRegisterPage;
