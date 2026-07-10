import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, Package, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

const ORDER_DATA = [
  { name: 'Mon', completed: 40, delayed: 4 },
  { name: 'Tue', completed: 30, delayed: 2 },
  { name: 'Wed', completed: 20, delayed: 1 },
  { name: 'Thu', completed: 27, delayed: 5 },
  { name: 'Fri', completed: 18, delayed: 8 },
  { name: 'Sat', completed: 23, delayed: 3 },
  { name: 'Sun', completed: 34, delayed: 4 },
];

const REGION_DATA = [
  { name: 'North', value: 400 },
  { name: 'South', value: 300 },
  { name: 'East', value: 300 },
  { name: 'West', value: 200 },
];
const COLORS = ['#2F44FF', '#10B981', '#F59E0B', '#EF4444'];

const MetricCard = ({ title, value, change, isPositive, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="premium-card p-6 flex flex-col gap-4"
  >
    <div className="flex justify-between items-start">
      <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
        isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(change)}%
      </div>
    </div>
    <div>
      <h3 className="text-text-muted font-bold text-sm uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black text-text-main mt-1">{value}</p>
    </div>
  </motion.div>
);

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-text-main">Analytics</h1>
          <p className="text-text-muted font-medium">Business intelligence and performance metrics.</p>
        </div>
        <div className="flex gap-2 bg-card-bg p-1 rounded-full border border-border-main">
          {['24h', '7d', '30d', '1y'].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                timeRange === range 
                  ? 'bg-brand-blue text-white shadow-md' 
                  : 'text-text-muted hover:text-text-main hover:bg-surface-bg'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Revenue" value="$45,231" change={12.5} isPositive={true} icon={DollarSign} delay={0.1} />
        <MetricCard title="Active Orders" value="1,204" change={5.2} isPositive={true} icon={Package} delay={0.2} />
        <MetricCard title="New Customers" value="842" change={-2.4} isPositive={false} icon={Users} delay={0.3} />
        <MetricCard title="Growth Rate" value="18.2%" change={4.1} isPositive={true} icon={TrendingUp} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-6 lg:col-span-2"
        >
          <div className="mb-6">
            <h3 className="text-lg font-black text-text-main">Revenue Overview</h3>
            <p className="text-sm text-text-muted font-medium">Income vs Expenses over time.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F44FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2F44FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-main)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontWeight: 'bold', color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2F44FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="premium-card p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-black text-text-main">Orders by Region</h3>
            <p className="text-sm text-text-muted font-medium">Distribution of deliveries.</p>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REGION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {REGION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-main)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: 'var(--text-main)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="premium-card p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-black text-text-main">Weekly Performance</h3>
          <p className="text-sm text-text-muted font-medium">Completed vs Delayed orders.</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ORDER_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-main)', borderRadius: '12px', border: '1px solid var(--border-main)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                cursor={{ fill: 'var(--surface-bg)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)' }} />
              <Bar dataKey="completed" fill="#2F44FF" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="delayed" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
