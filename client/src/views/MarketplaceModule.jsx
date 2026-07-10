import React, { useState } from 'react';
import { DownloadCloud, CheckCircle, Search, Settings } from 'lucide-react';

const MarketplaceModule = () => {
    const [plugins, setPlugins] = useState([
        { id: 1, name: 'Salesforce Sync', desc: 'Automatically sync orders from Salesforce CRM.', installed: true, icon: '☁️' },
        { id: 2, name: 'Shopify Connector', desc: 'Pull eCommerce orders in real-time.', installed: false, icon: '🛍️' },
        { id: 3, name: 'IoT Temp Sensors', desc: 'Native integration for Bluetooth cold-chain sensors.', installed: false, icon: '🌡️' },
        { id: 4, name: 'SAP ERP', desc: 'Enterprise data push/pull for financial ledgers.', installed: true, icon: '🏢' },
    ]);

    const toggleInstall = (id) => {
        setPlugins(plugins.map(p => p.id === id ? { ...p, installed: !p.installed } : p));
    };

    return (
        <div className="space-y-6 animate-fade-in">
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
                {plugins.map(plugin => (
                    <div key={plugin.id} className="bg-card-bg border border-border-main rounded-2xl p-6 flex flex-col hover:border-brand-blue/30 transition-all group hover:shadow-xl hover:-translate-y-1">
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
                                onClick={() => toggleInstall(plugin.id)}
                                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 ${plugin.installed ? 'bg-surface-bg text-text-main hover:bg-red-50 hover:text-red-600 border border-border-main' : 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-md shadow-brand-blue/20'}`}
                            >
                                {plugin.installed ? <><CheckCircle size={16}/> Installed</> : <><DownloadCloud size={16}/> Install</>}
                            </button>
                            {plugin.installed && (
                                <button className="p-2 border border-border-main rounded-xl hover:bg-surface-bg text-text-muted">
                                    <Settings size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketplaceModule;
