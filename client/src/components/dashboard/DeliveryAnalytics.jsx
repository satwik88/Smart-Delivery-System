import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl">
        <p className="text-slate-300 text-xs font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-text-muted">{entry.name}:</span>
            <span className="text-white font-bold">{entry.name === 'revenue' ? '$' : ''}{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DeliveryAnalytics = () => {
  const [timeRange] = useState('Week');

  // Dummy analytics data (Mocked for future integration)
  const data = [
    { name: 'Mon', orders: 120, revenue: 1400 },
    { name: 'Tue', orders: 150, revenue: 1800 },
    { name: 'Wed', orders: 180, revenue: 2200 },
    { name: 'Thu', orders: 140, revenue: 1600 },
    { name: 'Fri', orders: 200, revenue: 2500 },
    { name: 'Sat', orders: 250, revenue: 3200 },
    { name: 'Sun', orders: 210, revenue: 2800 },
  ];

  const metrics = [
    { label: 'Total Orders', value: '1,250' },
    { label: 'Revenue', value: '$15.5K' },
    { label: 'Avg Delivery Time', value: '24 mins' },
    { label: 'Cancelled', value: '12' },
    { label: 'Success Rate', value: '98.5%' },
  ];

  return (
    <div className="premium-card p-8 flex flex-col gap-8 relative">
      
      {/* Mocked indicator for future DB integration */}
      <div className="absolute top-4 left-4 bg-surface-bg border border-border-main text-text-muted text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">
        Mocked Data (Pending DB)
      </div>

      <div className="flex justify-between items-start sm:items-center mt-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Delivery Analytics</h2>
          <p className="text-text-muted text-sm font-medium mt-1">Performance overview across the network.</p>
        </div>
        
        {/* Dropdown */}
        <div className="relative group cursor-pointer">
          <div className="bg-surface-bg border border-border-main rounded-full px-5 py-2 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-sm font-bold text-text-main">{timeRange}</span>
            <ChevronDown size={16} className="text-text-muted group-hover:text-text-main" />
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-4 border-y border-border-main">
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{m.label}</span>
            <span className="text-xl font-black text-text-main">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
              dy={15}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} 
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} 
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#F4F5FF'}} />
            <Bar yAxisId="left" dataKey="orders" fill="#2F44FF" radius={[6, 6, 0, 0]} barSize={32} isAnimationActive={true} animationDuration={1500} />
            <Bar yAxisId="right" dataKey="revenue" fill="#93C5FD" radius={[6, 6, 0, 0]} barSize={32} isAnimationActive={true} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeliveryAnalytics;
