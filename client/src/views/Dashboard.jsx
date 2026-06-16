import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Cpu, Database } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel p-6 flex items-start gap-4 hover:border-slate-500 transition-colors">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-slate-100" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <h3 className="text-2xl font-bold text-slate-100 mt-1">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/dashboard/summary`);
        setSummary(response.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="text-neon-blue flex justify-center mt-20">Loading Dashboard...</div>;
  if (!summary) return <div className="text-red-400">Failed to load dashboard data. Ensure backend is running.</div>;

  return (
    <div className="space-y-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Warehouses" value={summary.warehouses} icon={Database} color="bg-neon-blue" />
        <StatCard title="Network Connections" value={summary.roads} icon={Activity} color="bg-accent-green" />
        <StatCard title="Total Network Cost" value={summary.totalRoadCost} icon={Activity} color="bg-accent-orange" />
        <StatCard title="Pending Tasks" value={summary.tasks} icon={Clock} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Cpu size={20} className="text-neon-blue"/> Algorithm Benchmarks (Recent)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.recentBenchmarks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="algorithm_name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="time_ms" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Execution Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-100">Recent Operations</h3>
          <div className="space-y-4">
            {summary.recentBenchmarks.slice(0, 6).map((bm, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded bg-slate-800/50 border border-slate-700 hover:border-neon-blue/50 transition-colors">
                <div>
                  <p className="font-medium text-sm text-slate-200">{bm.algorithm_name}</p>
                  <p className="text-xs text-slate-400">{bm.comparisons} ops</p>
                </div>
                <span className="text-neon-blue font-mono text-sm">{bm.time_ms.toFixed(2)}ms</span>
              </div>
            ))}
            {summary.recentBenchmarks.length === 0 && (
              <div className="text-slate-400 text-sm">No algorithms have been run yet. Use the navigation to run algorithms and generate benchmark data.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
