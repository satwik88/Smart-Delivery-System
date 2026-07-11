import React, { useState, useEffect } from 'react';
import { Key, Copy, Plus, Trash2, Check, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const DeveloperSettings = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [justCreated, setJustCreated] = useState(null); // full key shown once
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        api.get('/developer/keys')
            .then(res => setApiKeys(res.data))
            .catch(err => console.error('Failed to load API keys:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newKeyName.trim()) return;
        setCreating(true);
        try {
            const res = await api.post('/developer/keys', { name: newKeyName.trim() });
            setJustCreated(res.data); // contains full key
            setApiKeys(prev => [{
                id: res.data.id,
                name: res.data.name,
                key_preview: res.data.key_preview,
                last_used: null,
                created_at: res.data.created_at
            }, ...prev]);
            setNewKeyName('');
        } catch (err) {
            alert('Failed to generate key: ' + (err.response?.data?.error || err.message));
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Revoke this API key? This cannot be undone.')) return;
        try {
            await api.delete(`/developer/keys/${id}`);
            setApiKeys(prev => prev.filter(k => k.id !== id));
            if (justCreated?.id === id) setJustCreated(null);
        } catch (err) {
            alert('Failed to delete key');
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(id);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-text-main">Developer API</h2>
                    <p className="text-text-muted mt-1">Manage your API keys for external integrations.</p>
                </div>
                <form onSubmit={handleCreate} className="flex gap-2">
                    <input
                        type="text"
                        value={newKeyName}
                        onChange={e => setNewKeyName(e.target.value)}
                        placeholder="Key name..."
                        className="px-3 py-2 bg-surface-bg border border-border-main rounded-xl text-sm font-medium focus:outline-none focus:border-brand-blue w-40"
                    />
                    <button
                        type="submit"
                        disabled={creating || !newKeyName.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/90 font-bold shadow-lg shadow-brand-blue/20 disabled:opacity-50"
                    >
                        {creating ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                        Generate Key
                    </button>
                </form>
            </div>

            {/* Show the full key once on creation */}
            {justCreated && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                    <div>
                        <p className="text-green-700 dark:text-green-400 font-bold text-sm mb-1">Key created — copy it now. It won't be shown again.</p>
                        <code className="font-mono text-sm text-text-main break-all">{justCreated.key}</code>
                    </div>
                    <button
                        onClick={() => copyToClipboard(justCreated.key, 'new')}
                        className="shrink-0 p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                        {copied === 'new' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </motion.div>
            )}

            <div className="bg-card-bg border border-border-main rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-text-muted font-bold animate-pulse">Loading keys...</div>
                ) : apiKeys.length === 0 ? (
                    <div className="p-8 text-center text-text-muted font-bold">No API keys yet. Generate one above.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-surface-bg border-b border-border-main">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-text-muted uppercase">Name</th>
                                <th className="px-6 py-4 text-xs font-black text-text-muted uppercase">API Key</th>
                                <th className="px-6 py-4 text-xs font-black text-text-muted uppercase">Last Used</th>
                                <th className="px-6 py-4 text-xs font-black text-text-muted uppercase">Created</th>
                                <th className="px-6 py-4 text-xs font-black text-text-muted uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-main">
                            {apiKeys.map(key => (
                                <tr key={key.id} className="hover:bg-surface-bg transition-colors">
                                    <td className="px-6 py-4 font-bold text-text-main">{key.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 bg-surface-bg px-3 py-1.5 rounded-lg border border-border-main font-mono text-sm">
                                            <Key size={14} className="text-brand-blue shrink-0" />
                                            {key.key_preview}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-text-muted">
                                        {key.last_used ? new Date(key.last_used).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-text-muted">
                                        {new Date(key.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(key.id)}
                                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Revoke key"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Documentation */}
            <div className="bg-card-bg border border-border-main rounded-2xl p-6">
                <h3 className="font-bold mb-4">API Documentation</h3>
                <pre className="bg-surface-bg p-4 rounded-xl text-sm font-mono border border-border-main overflow-x-auto text-text-muted">
{`POST /api/public/orders
Headers:
  x-api-key: your_api_key

Body:
{
  "customer_name": "Acme Corp",
  "budget": 500.00,
  "priority": "EXPRESS"
}`}
                </pre>
            </div>
        </div>
    );
};

export default DeveloperSettings;
