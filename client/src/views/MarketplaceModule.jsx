import React, { useState, useEffect } from 'react';
import { DownloadCloud, CheckCircle, Search, Settings, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const MarketplaceModule = () => {
    const [plugins, setPlugins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(null); // plugin_id being toggled

    useEffect(() => {
        api.get('/plugins')
            .then(res => setPlugins(res.data))
            .catch(err => console.error('Failed to load plugins:', err))
            .finally(() => setLoading(false));
    }, []);

    const toggleInstall = async (plugin) => {
        setToggling(plugin.plugin_id);
        try {
            const endpoint = plugin.installed ? 'uninstall' : 'install';
            await api.post(`/plugins/${plugin.plugin_id}/${endpoint}`);
            setPlugins(prev => prev.map(p =>
                p.plugin_id === plugin.plugin_id ? { ...p, installed: !p.installed } : p
            ));
        } catch (err) {
            console.error('Plugin toggle failed:', err);
        } finally {
            setToggling(null);
        }
    };

    if (loading) {
        return <div className="space-y-6 animate-pulse">
            <div className="h-8 w-40 bg-border-main rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="h-56 bg-card-bg rounded-2xl border border-border-main" />)}
            </div>
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-text-main">App Marketplace</h2>
                    <p className="text-text-muted mt-1">Extend your Logistics OS with third-party integrations.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search apps..."
                        className="pl-10 pr-4 py-2 bg-surface-bg border border-border-main rounded-xl focus:outline-none focus:border-brand-blue transition-colors w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plugins.map((plugin, i) => (
                    <motion.div
                        key={plugin.plugin_id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-card-bg border border-border-main rounded-2xl p-6 flex flex-col hover:border-brand-blue/30 transition-all group hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-4xl bg-surface-bg w-14 h-14 rounded-xl flex items-center justify-center border border-border-main group-hover:scale-110 transition-transform">
                                {plugin.icon}
                            </div>
                        </div>
                        <h3 className="font-black text-lg text-text-main mb-2">{plugin.name}</h3>
                        <p className="text-sm font-medium text-text-muted leading-relaxed flex-1 mb-6">
                            {plugin.desc}
                        </p>

                        <div className="mt-auto border-t border-border-main pt-4 flex gap-2">
                            <button
                                onClick={() => toggleInstall(plugin)}
                                disabled={toggling === plugin.plugin_id}
                                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-60 ${
                                    plugin.installed
                                        ? 'bg-surface-bg text-text-main hover:bg-red-50 hover:text-red-600 border border-border-main'
                                        : 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-md shadow-brand-blue/20'
                                }`}
                            >
                                {toggling === plugin.plugin_id
                                    ? <Loader size={16} className="animate-spin" />
                                    : plugin.installed
                                        ? <><CheckCircle size={16} /> Installed</>
                                        : <><DownloadCloud size={16} /> Install</>
                                }
                            </button>
                            {plugin.installed && (
                                <button className="p-2 border border-border-main rounded-xl hover:bg-surface-bg text-text-muted">
                                    <Settings size={18} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MarketplaceModule;
