import React from 'react';
import { TrendingUp, Users, Package, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const BusinessIntelligenceModule = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-text-main">Business Intelligence</h2>
                    <p className="text-text-muted mt-1">Advanced analytics, forecasting, and KPI tracking.</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-surface-bg border border-border-main px-4 py-2 rounded-xl text-sm font-bold text-text-main focus:outline-none focus:border-brand-blue">
                        <option>Last 30 Days</option>
                        <option>This Quarter</option>
                        <option>Year to Date</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Forecasted Revenue', value: '$124,500', trend: '+14%', up: true, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
                    { label: 'Driver Productivity', value: '92%', trend: '+3%', up: true, icon: Users, color: 'text-brand-blue', bg: 'bg-blue-100' },
                    { label: 'On-Time Delivery', value: '98.2%', trend: '-0.4%', up: false, icon: Package, color: 'text-purple-500', bg: 'bg-purple-100' },
                    { label: 'Churn Prediction Risk', value: 'Low', trend: '-2%', up: true, icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100' },
                ].map((kpi, i) => (
                    <div key={i} className="bg-card-bg border border-border-main p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${kpi.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {kpi.trend}
                            </div>
                        </div>
                        <p className="text-text-muted text-sm font-bold">{kpi.label}</p>
                        <h3 className="text-2xl font-black text-text-main mt-1">{kpi.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card-bg border border-border-main p-6 rounded-2xl min-h-[300px] flex flex-col">
                    <h3 className="font-bold text-lg mb-4">Revenue Heatmap by Region</h3>
                    <div className="flex-1 border-2 border-dashed border-border-main rounded-xl flex items-center justify-center bg-surface-bg/50 text-text-muted font-medium">
                        [ Map Visualization Rendered Here ]
                    </div>
                </div>
                <div className="bg-card-bg border border-border-main p-6 rounded-2xl min-h-[300px] flex flex-col">
                    <h3 className="font-bold text-lg mb-4">AI Demand Forecasting (Next 7 Days)</h3>
                    <div className="flex-1 border-2 border-dashed border-border-main rounded-xl flex items-center justify-center bg-surface-bg/50 text-text-muted font-medium">
                        [ Line Chart Rendered Here ]
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessIntelligenceModule;
