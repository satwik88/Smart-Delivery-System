import React, { useState } from 'react';
import { TrendingUp, Users, Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';

const BusinessIntelligenceModule = () => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Mock data for charts
    const revenueData = [
        { name: 'Mon', revenue: 4000, target: 2400 },
        { name: 'Tue', revenue: 3000, target: 1398 },
        { name: 'Wed', revenue: 2000, target: 9800 },
        { name: 'Thu', revenue: 2780, target: 3908 },
        { name: 'Fri', revenue: 1890, target: 4800 },
        { name: 'Sat', revenue: 2390, target: 3800 },
        { name: 'Sun', revenue: 3490, target: 4300 },
    ];

    const demandData = [
        { name: 'North', demand: 4000 },
        { name: 'South', demand: 3000 },
        { name: 'East', demand: 2000 },
        { name: 'West', demand: 2780 },
        { name: 'Central', demand: 1890 },
    ];

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Business Intelligence Report', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        
        autoTable(doc, {
            startY: 40,
            head: [['Metric', 'Value', 'Trend']],
            body: [
                ['Forecasted Revenue', '$124,500', '+14%'],
                ['Driver Productivity', '92%', '+3%'],
                ['On-Time Delivery', '98.2%', '-0.4%'],
                ['Churn Prediction Risk', 'Low', '-2%'],
            ],
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] }
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Region', 'Projected Demand']],
            body: demandData.map(d => [d.name, d.demand.toLocaleString()]),
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] }
        });

        doc.save('bi-report.pdf');
        setShowExportMenu(false);
    };

    const handleExportCSV = () => {
        const headers = ['Metric', 'Value', 'Trend'];
        const rows = [
            ['Forecasted Revenue', '$124,500', '+14%'],
            ['Driver Productivity', '92%', '+3%'],
            ['On-Time Delivery', '98.2%', '-0.4%'],
            ['Churn Prediction Risk', 'Low', '-2%']
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bi-metrics.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExportMenu(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-text-main">Business Intelligence</h2>
                    <p className="text-text-muted mt-1">Advanced analytics, forecasting, and KPI tracking.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-surface-bg border border-border-main px-4 py-2 rounded-xl text-sm font-bold text-text-main focus:outline-none focus:border-brand-blue transition-colors hover:border-gray-300">
                        <option>Last 30 Days</option>
                        <option>This Quarter</option>
                        <option>Year to Date</option>
                    </select>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="bg-brand-blue text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20"
                        >
                            <Download size={16} /> Export Report
                        </button>
                        
                        <AnimatePresence>
                            {showExportMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-48 bg-card-bg rounded-xl shadow-xl border border-border-main overflow-hidden z-10"
                                >
                                    <button 
                                        onClick={handleExportPDF}
                                        className="w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 hover:bg-surface-bg transition-colors border-b border-border-main"
                                    >
                                        <FileText size={16} className="text-red-500" /> Export as PDF
                                    </button>
                                    <button 
                                        onClick={handleExportCSV}
                                        className="w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 hover:bg-surface-bg transition-colors"
                                    >
                                        <FileSpreadsheet size={16} className="text-green-500" /> Export as CSV
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-card-bg border border-border-main p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                    >
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
                    </motion.div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card-bg border border-border-main p-6 rounded-2xl min-h-[300px] flex flex-col"
                >
                    <h3 className="font-bold text-lg mb-4 text-text-main">Revenue vs Target</h3>
                    <div className="flex-1 w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Actual Revenue" />
                                <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} name="Target Revenue" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card-bg border border-border-main p-6 rounded-2xl min-h-[300px] flex flex-col"
                >
                    <h3 className="font-bold text-lg mb-4 text-text-main">AI Demand Forecasting (Next 7 Days)</h3>
                    <div className="flex-1 w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <RechartsTooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="demand" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Projected Demand" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default BusinessIntelligenceModule;
