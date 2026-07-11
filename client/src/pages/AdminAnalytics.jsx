import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, Package, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../utils/api';

const COLORS = ['#2F44FF', '#10B981', '#F59E0B', '#EF4444'];

const MetricCard = ({ title, value, icon: Icon, delay }) => (
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
    </div>
    <div>
      <h3 className="text-text-muted font-bold text-sm uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black text-text-main mt-1">{value ?? '—'}</p>
    </div>
  </motion.div>
);

const AdminAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [finSummary, setFinSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mRes, cRes, fRes] = await Promise.all([
          api.get('/dashboard/metrics'),
          api.get('/dashboard/chart-data'),
          api.get('/finance/summary'),
        ]);
        setMetrics(mRes.data);
        setChartData(cRes.data);
        setFinSummary(fRes.data);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);

  // Build pie data from order status counts (real)
  const pieData = metrics ? [
    { name: 'Delivered', value: metrics.deliveredOrders },
    { name: 'In Transit', value: metrics.inTransitOrders },
    { name: 'Pending', value: metrics.pendingOrders },
  ].filter(d => d.value > 0) : [];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 pb-12 animate-pulse">
        <div className="h-8 w-40 bg-border-main rounded-lg" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-card-bg rounded-2xl border border-border-main" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <h1 className="text-3xl font-black text-text-main">Analytics</h1>
        <p className="text-text-muted font-medium">Business intelligence and performance metrics.</p>
      </div>

      {/* Metric Cards — real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Revenue" value={formatCurrency(finSummary?.revenue)} icon={DollarSign} delay={0.1} />
        <MetricCard title="Total Orders" value={metrics?.totalOrders?.toLocaleString()} icon={Package} delay={0.2} />
        <MetricCard title="Active Drivers" value={metrics?.activeDrivers} icon={Users} delay={0.3} />
        <MetricCard title="Net Profit" value={formatCurrency(finSummary?.net_profit)} icon={TrendingUp} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue over time — real data from /dashboard/chart-data */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-6 lg:col-span-2"
        >
          <div className="mb-6">
            <h3 className="text-lg font-black text-text-main">Revenue Overview</h3>
            <p className="text-sm text-text-muted font-medium">Revenue per day (delivered orders).</p>
          </div>
          <div className="h-[300px] w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-muted font-medium">No order data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2F44FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2F44FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-main)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    itemStyle={{ fontWeight: 'bold', color: 'var(--text-main)' }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2F44FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Order status breakdown — real counts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="premium-card p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-black text-text-main">Order Status</h3>
            <p className="text-sm text-text-muted font-medium">Current status breakdown.</p>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-text-muted font-medium text-sm">No orders yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-main)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 'bold', color: 'var(--text-main)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Orders per day bar chart — real data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="premium-card p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-black text-text-main">Orders Per Day</h3>
          <p className="text-sm text-text-muted font-medium">Total orders placed each day.</p>
        </div>
        <div className="h-[300px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-muted font-medium">No order data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-main)', borderRadius: '12px', border: '1px solid var(--border-main)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  cursor={{ fill: 'var(--surface-bg)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)' }} />
                <Bar dataKey="orders" name="Orders" fill="#2F44FF" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
