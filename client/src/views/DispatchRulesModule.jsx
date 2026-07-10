import React, { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, Power, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const DispatchRulesModule = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  
  const [newRule, setNewRule] = useState({
      name: '',
      condition_field: 'priority',
      condition_operator: 'EQUALS',
      condition_value: 'EXPRESS',
      action_type: 'ASSIGN_VEHICLE',
      action_value: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const [rulesRes, vehRes] = await Promise.all([
            api.get('/dispatch/rules'),
            api.get('/fleet')
        ]);
        setRules(rulesRes.data);
        setVehicles(vehRes.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleCreateRule = async (e) => {
      e.preventDefault();
      try {
          await api.post('/dispatch/rules', newRule);
          setIsFormOpen(false);
          setNewRule({ ...newRule, name: '' });
          fetchData();
      } catch (err) {
          console.error(err);
          alert('Failed to create rule');
      }
  };

  const handleDelete = async (id) => {
      if(!window.confirm('Delete this rule?')) return;
      try {
          await api.delete(`/dispatch/rules/${id}`);
          fetchData();
      } catch (err) {
          console.error(err);
      }
  };

  const handleToggle = async (id, currentStatus) => {
      try {
          await api.put(`/dispatch/rules/${id}/toggle`, { is_active: !currentStatus });
          fetchData();
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <div className="min-h-screen bg-surface-bg p-6 lg:p-10 font-sans text-text-main h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Zap size={32} className="text-yellow-500 bg-yellow-500/10 p-1.5 rounded-xl" />
              Dispatch Rules Engine
            </h1>
            <p className="text-text-muted font-medium mt-1">Configure automated assignments based on order conditions.</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-5 py-2.5 bg-brand-blue text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/30"
          >
            <Plus size={18} /> New Rule
          </button>
        </div>

        {isFormOpen && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 border-l-4 border-l-brand-blue">
                <h2 className="text-lg font-black mb-4">Create New Dispatch Rule</h2>
                <form onSubmit={handleCreateRule} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">Rule Name</label>
                        <input required type="text" className="w-full bg-surface-bg border border-border-main rounded-lg p-2.5 text-sm font-semibold" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} placeholder="e.g. Auto-Assign Express Orders"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">If (Condition Field)</label>
                        <select className="w-full bg-surface-bg border border-border-main rounded-lg p-2.5 text-sm font-semibold" value={newRule.condition_field} onChange={e => setNewRule({...newRule, condition_field: e.target.value})}>
                            <option value="priority">Priority</option>
                            <option value="budget">Budget</option>
                            <option value="order_type">Order Type</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">Operator</label>
                        <select className="w-full bg-surface-bg border border-border-main rounded-lg p-2.5 text-sm font-semibold" value={newRule.condition_operator} onChange={e => setNewRule({...newRule, condition_operator: e.target.value})}>
                            <option value="EQUALS">Equals</option>
                            <option value="GREATER_THAN">Greater Than</option>
                            <option value="LESS_THAN">Less Than</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">Value</label>
                        <input required type="text" className="w-full bg-surface-bg border border-border-main rounded-lg p-2.5 text-sm font-semibold" value={newRule.condition_value} onChange={e => setNewRule({...newRule, condition_value: e.target.value})} placeholder="e.g. EXPRESS or 500"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">Then (Action)</label>
                        <select className="w-full bg-surface-bg border border-border-main rounded-lg p-2.5 text-sm font-semibold" value={newRule.action_type} onChange={e => setNewRule({...newRule, action_type: e.target.value})}>
                            <option value="ASSIGN_VEHICLE">Assign Vehicle</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">Action Value (Select Vehicle)</label>
                        <select required className="w-full bg-surface-bg border border-border-main rounded-lg p-2.5 text-sm font-semibold" value={newRule.action_value} onChange={e => setNewRule({...newRule, action_value: e.target.value})}>
                            <option value="">-- Select a Vehicle --</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-surface-bg rounded-lg font-bold text-sm">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-lg font-bold text-sm">Save Rule</button>
                    </div>
                </form>
            </motion.div>
        )}

        {loading ? (
            <div className="text-center p-10 font-bold text-text-muted animate-pulse">Loading Rules...</div>
        ) : (
            <div className="grid gap-4">
                {rules.length === 0 && (
                    <div className="bg-card-bg border border-border-main p-10 text-center rounded-2xl flex flex-col items-center justify-center">
                        <AlertCircle className="text-text-muted mb-3" size={40} />
                        <h3 className="font-bold text-text-main">No Dispatch Rules Configured</h3>
                        <p className="text-sm text-text-muted">Orders must be manually assigned by a dispatcher.</p>
                    </div>
                )}
                {rules.map(rule => (
                    <div key={rule.id} className={`premium-card p-6 flex justify-between items-center transition-all ${rule.is_active ? 'border-l-4 border-l-brand-blue' : 'opacity-60 grayscale'}`}>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-black text-lg">{rule.name}</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {rule.is_active ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="bg-surface-bg px-2 py-1 rounded font-bold text-text-muted">IF</span>
                                <span className="font-bold text-brand-blue">{rule.condition_field}</span>
                                <span className="text-text-muted text-xs font-bold uppercase">{rule.condition_operator.replace('_', ' ')}</span>
                                <span className="font-bold text-brand-blue">{rule.condition_value}</span>
                                <span className="bg-surface-bg px-2 py-1 rounded font-bold text-text-muted ml-2">THEN</span>
                                <span className="text-text-muted text-xs font-bold uppercase">{rule.action_type.replace('_', ' ')}</span>
                                <span className="font-bold text-brand-blue">#{rule.action_value}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => handleToggle(rule.id, rule.is_active)}
                                className="p-2 bg-surface-bg hover:bg-gray-200 rounded-lg transition-colors text-text-muted"
                                title={rule.is_active ? 'Disable' : 'Enable'}
                            >
                                <Power size={18} className={rule.is_active ? 'text-green-500' : ''} />
                            </button>
                            <button 
                                onClick={() => handleDelete(rule.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default DispatchRulesModule;
