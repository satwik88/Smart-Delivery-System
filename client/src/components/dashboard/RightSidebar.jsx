import React from 'react';
import { ChevronRight, Edit2, Box, Navigation, User, Truck, AlertCircle, Zap } from 'lucide-react';

const RightSidebar = () => {
  return (
    <div className="flex flex-col gap-8">
      
      {/* Pending Tasks */}
      <div className="premium-card p-6 relative">
        <div className="absolute top-2 left-4 bg-gray-100 text-gray-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Mocked</div>
        <div className="flex justify-between items-center mb-6 mt-2">
          <h3 className="font-bold text-text-main text-lg">Pending Tasks</h3>
          <span className="bg-brand-blue/10 text-brand-blue text-[11px] px-3 py-1 rounded-full font-bold">4 Tasks</span>
        </div>

        <div className="space-y-4">
          <div className="bg-surface-bg p-4 rounded-2xl flex justify-between items-center border border-border-main/50 hover:border-brand-blue/30 transition-colors group cursor-pointer">
            <div>
              <p className="text-brand-blue text-[10px] uppercase font-bold tracking-wider mb-1">Order #A238</p>
              <h4 className="font-bold text-text-main text-sm">Assign Rider</h4>
              <p className="text-text-muted text-[11px] mt-1 font-semibold flex items-center gap-1">
                <AlertCircle size={12} className="text-warning" /> High Priority
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="text-[10px] font-bold text-text-muted">10:30 AM</span>
              <div className="bg-white shadow-sm border border-border-main p-1.5 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-colors">
                <ChevronRight size={14} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-border-main p-4 rounded-2xl flex justify-between items-center hover:border-brand-blue/30 transition-colors group cursor-pointer">
            <div>
              <p className="text-brand-blue text-[10px] uppercase font-bold tracking-wider mb-1">Order #A240</p>
              <h4 className="font-bold text-text-main text-sm">Verify Payment</h4>
              <p className="text-text-muted text-[11px] mt-1 font-semibold">Standard</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="text-[10px] font-bold text-text-muted">11:00 AM</span>
              <div className="bg-gray-50 border border-border-main p-1.5 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-colors">
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Delivery Premium Card */}
      <div className="premium-card p-6">
        <h3 className="font-bold text-text-main text-lg mb-6">Current Delivery</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <User size={24} />
          </div>
          <div>
            <h4 className="font-bold text-text-main text-base">Rahul Sharma</h4>
            <span className="inline-block mt-1 bg-green-50 text-success text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Out for Delivery</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-bg p-3 rounded-xl border border-border-main/50 text-center">
            <p className="text-text-muted text-[10px] uppercase font-bold mb-1">Order</p>
            <p className="font-black text-brand-blue text-sm">#A5821</p>
          </div>
          <div className="bg-surface-bg p-3 rounded-xl border border-border-main/50 text-center">
            <p className="text-text-muted text-[10px] uppercase font-bold mb-1">Driver</p>
            <p className="font-black text-text-main text-sm">Aman</p>
          </div>
        </div>

        <div className="space-y-4 px-2">
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-xs font-semibold flex items-center gap-2"><Navigation size={14}/> Distance</span>
            <span className="font-bold text-text-main text-sm">2.3 km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-xs font-semibold flex items-center gap-2"><Truck size={14}/> ETA</span>
            <span className="font-black text-brand-blue text-sm">14 mins</span>
          </div>
        </div>
      </div>

      {/* Driver Performance */}
      <div className="premium-card p-6 relative">
        <div className="absolute top-2 left-4 bg-gray-100 text-gray-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Mocked</div>
        <div className="flex justify-between items-center mb-6 mt-2">
          <h3 className="font-bold text-text-main text-lg">Top Drivers</h3>
        </div>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-bold text-sm">Aman</span>
              <span className="font-bold text-sm text-brand-blue">98%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
              <div className="bg-brand-blue h-2 rounded-full" style={{ width: '98%' }}></div>
            </div>
            <span className="text-[10px] font-bold text-text-muted uppercase">245 Deliveries</span>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-bold text-sm">Riya</span>
              <span className="font-bold text-sm text-brand-blue">96%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
              <div className="bg-brand-blue h-2 rounded-full opacity-80" style={{ width: '96%' }}></div>
            </div>
            <span className="text-[10px] font-bold text-text-muted uppercase">221 Deliveries</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="premium-card p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-transparent">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={18} className="text-warning" />
          <h3 className="font-bold text-lg">AI Insights</h3>
        </div>
        <ul className="space-y-4">
          <li className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 bg-success rounded-full mt-1.5 shrink-0"></div>
            <p className="text-sm font-medium text-gray-300">Delivery time improved <strong className="text-white">11%</strong> this week.</p>
          </li>
          <li className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 bg-warning rounded-full mt-1.5 shrink-0"></div>
            <p className="text-sm font-medium text-gray-300">Heavy traffic expected at <strong className="text-white">6 PM</strong>.</p>
          </li>
          <li className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full mt-1.5 shrink-0"></div>
            <p className="text-sm font-medium text-gray-300"><strong className="text-white">Deploy 4 more riders</strong> in Sector 62.</p>
          </li>
        </ul>
      </div>

      {/* Promo Banner */}
      <div className="premium-card p-6 bg-brand-blue border-transparent text-white relative overflow-hidden h-40 flex flex-col justify-between group cursor-pointer">
        <div className="absolute -right-10 -top-10 w-40 h-40 border-[4px] border-white/10 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute right-4 top-12 w-20 h-20 border-[4px] border-white/5 rounded-full group-hover:-translate-x-2 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold backdrop-blur-md uppercase tracking-wider">
            AI Optimization
          </span>
        </div>
        <div className="relative z-10 flex justify-between items-end">
          <h4 className="font-black text-lg leading-tight w-3/4">Reduce delivery time by 24%</h4>
          <div className="w-8 h-8 rounded-full bg-white/20 flex justify-center items-center backdrop-blur-md group-hover:bg-white transition-colors group-hover:text-brand-blue">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default RightSidebar;
