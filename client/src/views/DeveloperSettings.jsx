import React, { useState } from 'react';
import { Key, Copy, Plus, RefreshCw, Eye, EyeOff } from 'lucide-react';

const DeveloperSettings = () => {
    const [apiKeys, setApiKeys] = useState([
        { id: 1, name: 'Production App', key: 'sk_live_...94jf', lastUsed: '2 mins ago', created: 'Oct 1' },
        { id: 2, name: 'Testing', key: 'sk_test_...8x2p', lastUsed: 'Never', created: 'Oct 10' }
    ]);

    const handleCreate = () => {
        const newKey = {
            id: Date.now(),
            name: 'New API Key',
            key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
            lastUsed: 'Never',
            created: 'Just now'
        };
        setApiKeys([newKey, ...apiKeys]);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-text-main">Developer API</h2>
                    <p className="text-text-muted mt-1">Manage your API keys for external integrations.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/90 font-bold shadow-lg shadow-brand-blue/20"
                >
                    <Plus size={18} />
                    Generate Key
                </button>
            </div>

            <div className="bg-card-bg border border-border-main rounded-2xl overflow-hidden">
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
                                        <Key size={14} className="text-brand-blue" />
                                        {key.key}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-text-muted">{key.lastUsed}</td>
                                <td className="px-6 py-4 text-sm font-medium text-text-muted">{key.created}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-text-muted hover:text-text-main hover:bg-gray-100 rounded-lg">
                                        <Copy size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Documentation Placeholder */}
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
