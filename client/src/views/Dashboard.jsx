import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import DashboardCards from '../components/dashboard/DashboardCards';
import DeliveryAnalytics from '../components/dashboard/DeliveryAnalytics';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import LiveMap from '../components/dashboard/LiveMap';
import RightSidebar from '../components/dashboard/RightSidebar';

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
        setSummary({
          warehouses: 92,
          totalRoadCost: 156,
          tasks: 63,
          recentBenchmarks: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="text-text-muted flex justify-center mt-20 font-bold animate-pulse">Loading Premium Dashboard...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-up">
      {/* Main Content Column */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-[2.75rem] leading-tight font-black text-text-main tracking-tight">Welcome back, Satwik 👋</h1>
            <p className="text-text-muted mt-1 text-base font-medium">Here's today's logistics overview and delivery performance.</p>
          </div>
          <button className="bg-brand-blue hover:bg-blue-700 text-white px-7 py-3.5 rounded-full text-[15px] font-bold shadow-[0_8px_16px_rgba(47,68,255,0.25)] hover:shadow-[0_12px_24px_rgba(47,68,255,0.35)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
            <Plus size={20} strokeWidth={2.5} /> Create Delivery
          </button>
        </div>

        {/* KPI Cards */}
        <DashboardCards summary={summary} />

        {/* Delivery Analytics Chart */}
        <DeliveryAnalytics />

        {/* Recent Orders & Map Grid */}
        <div className="grid xl:grid-cols-2 gap-8">
          <RecentOrdersTable />
          <LiveMap />
        </div>
        
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[380px] shrink-0">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
