import { TrendingUp, TrendingDown, Package, Clock, Truck, ShieldAlert } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const DashboardCards = ({ metrics }) => {
  // Dummy line data
  const lineData = [ { val: 4 }, { val: 6 }, { val: 5 }, { val: 8 }, { val: 7 }, { val: 10 }, { val: 12 } ];
  // Dummy bar data
  const barData = [ { val: 2 }, { val: 4 }, { val: 3 }, { val: 6 }, { val: 5 }, { val: 8 }, { val: 6 }, { val: 9 } ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Card 1: Today's Orders */}
      <div className="premium-card p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
        <div className="flex justify-between items-center relative z-10">
          <span className="text-text-muted font-bold text-sm">Today's Orders</span>
          <span className="bg-surface-bg border border-border-main text-text-muted text-[11px] px-3 py-1 rounded-full font-bold cursor-pointer hover:opacity-80 transition-colors">View Details</span>
        </div>
        <div className="mt-4 flex items-end gap-3 relative z-10">
          <span className="text-[2.75rem] leading-none font-black text-text-main">
            {metrics?.totalOrders || 0}
          </span>
          <span className="text-xs font-bold text-success mb-1.5 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md dark:bg-green-900/30">
            <TrendingUp size={14} /> 18% <span className="text-text-muted font-semibold ml-1">vs yesterday</span>
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <Line type="monotone" dataKey="val" stroke="#2F44FF" strokeWidth={3} dot={false} isAnimationActive={true} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card 2: Active Deliveries (Solid Blue) */}
      <div className="premium-card p-6 flex flex-col justify-between h-48 bg-brand-blue border-transparent text-white relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-card-bg/10 rounded-full blur-2xl group-hover:bg-card-bg/20 transition-all duration-700"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <span className="text-blue-100 font-bold text-sm">Active Deliveries</span>
          <span className="bg-card-bg/10 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full font-bold cursor-pointer hover:bg-card-bg/20 transition-colors">Currently In Transit</span>
        </div>
        <div className="mt-4 flex items-end gap-3 relative z-10">
          <span className="text-[2.75rem] leading-none font-black">{metrics?.activeDrivers || 0}</span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 px-6 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{bottom: 0, left:0, right: 0, top: 10}}>
              <Bar dataKey="val" radius={[4, 4, 4, 4]} isAnimationActive={true} animationDuration={1500}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === barData.length - 1 ? '#FACC15' : 'rgba(255,255,255,0.2)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card 3: Completed Deliveries */}
      <div className="premium-card p-6 flex flex-col justify-between h-48 group">
        <div className="flex justify-between items-center">
          <span className="text-text-muted font-bold text-sm">Completed Deliveries</span>
          <span className="bg-surface-bg border border-border-main text-text-muted text-[11px] px-3 py-1 rounded-full font-bold cursor-pointer hover:opacity-80 transition-colors">Success Rate</span>
        </div>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-[2.75rem] leading-none font-black text-text-main">
            ${metrics?.revenue ? metrics.revenue.toLocaleString() : '0'}
          </span>
          <span className="text-sm font-black text-text-main mb-1.5 bg-surface-bg border border-border-main px-2 py-0.5 rounded-md">
            {metrics?.totalOrders ? Math.round((metrics.deliveredOrders / metrics.totalOrders) * 100) : 0}%
          </span>
        </div>
        <div className="mt-6 flex h-14 rounded-2xl overflow-hidden border border-border-main group-hover:shadow-md transition-shadow">
            <div className="w-[98%] flex items-center justify-center text-xs font-bold text-brand-blue transition-all duration-1000 ease-out" 
                 style={{ background: 'repeating-linear-gradient(45deg, #F4F5FF, #F4F5FF 6px, #FFFFFF 6px, #FFFFFF 12px)' }}>
            </div>
            <div className="w-[2%] bg-surface-bg border-l border-border-main"></div>
        </div>
      </div>
      
    </div>
  );
};

export default DashboardCards;
