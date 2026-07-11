import { useState } from 'react';
import axios from 'axios';

const ResourceAllocation = () => {
  const [capacity, setCapacity] = useState('50');
  const [budget, setBudget] = useState('1500');
  
  const [knapsackResult, setKnapsackResult] = useState(null);
  const [fracResult, setFracResult] = useState(null);
  const [subsetResult, setSubsetResult] = useState(null);

  const runKnapsack01 = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/cargo/optimize`, { vehicleCapacity: capacity });
      setKnapsackResult(res.data);
    } catch (err) { console.error(err); }
  };

  const runFractional = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/resources/allocate`, { resourceCapacity: capacity });
      setFracResult(res.data);
    } catch (err) { console.error(err); }
  };

  const runSubsetSum = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders/combinations`, { budget });
      setSubsetResult(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex flex-col h-full gap-6 relative z-10 overflow-auto pb-8">
      <div className="glass-panel p-6 shrink-0">
        <h2 className="text-xl font-bold text-slate-100">Fleet Management</h2>
        <p className="text-sm text-text-muted">Optimize vehicle loading and bundle orders for maximum efficiency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 0/1 Knapsack */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-neon-blue mb-4 border-b border-slate-700 pb-2">Vehicle Cargo Optimization</h3>
          <div className="flex gap-2 mb-4">
            <input 
              type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="Vehicle Capacity"
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1 w-full text-slate-100"
            />
            <button onClick={runKnapsack01} className="bg-neon-blue text-white px-4 py-2 rounded">Run</button>
          </div>
          {knapsackResult && (
            <div className="bg-slate-900/50 p-4 rounded border border-slate-800 text-sm">
              <div className="mb-2 text-accent-green font-bold">Max Value: ${knapsackResult.result.totalValue}</div>
              <div className="space-y-1">
                {knapsackResult.result.selected.map((item, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span>{item.name}</span>
                    <span className="text-text-muted">W:{item.weight} V:${item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fractional Knapsack */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-purple-400 mb-4 border-b border-slate-700 pb-2">Bulk Resource Distribution</h3>
          <div className="flex gap-2 mb-4">
            <input 
              type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="Resource Capacity"
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1 w-full text-slate-100"
            />
            <button onClick={runFractional} className="bg-purple-600 text-white px-4 py-2 rounded">Run</button>
          </div>
          {fracResult && (
            <div className="bg-slate-900/50 p-4 rounded border border-slate-800 text-sm">
              <div className="mb-2 text-accent-green font-bold">Max Value: ${fracResult.result.totalValue.toFixed(2)}</div>
              <div className="space-y-1">
                {fracResult.result.allocation.map((alloc, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span>{alloc.item.name} <span className="text-xs text-purple-400 ml-1">{(alloc.fraction*100).toFixed(0)}%</span></span>
                    <span className="text-text-muted">Take:{alloc.take} V:${(alloc.item.value * alloc.fraction).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subset Sum */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-accent-orange mb-4 border-b border-slate-700 pb-2">Order Bundling Analysis</h3>
          <div className="flex gap-2 mb-4">
            <input 
              type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Target Budget"
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1 w-full text-slate-100"
            />
            <button onClick={runSubsetSum} className="bg-accent-orange text-white px-4 py-2 rounded">Run</button>
          </div>
          {subsetResult && (
            <div className="bg-slate-900/50 p-4 rounded border border-slate-800 text-sm">
              <div className="mb-2">
                <span className="text-text-muted">Exact Match: </span>
                <span className={subsetResult.result.exactMatch ? "text-accent-green font-bold" : "text-red-400 font-bold"}>
                  {subsetResult.result.exactMatch ? "YES" : "NO"}
                </span>
                <div className="text-xs text-text-muted">Closest Sum: ${subsetResult.result.actualSum}</div>
              </div>
              <div className="text-slate-300 mb-1 font-semibold">{subsetResult.result.subsets.length} Combinations Found</div>
              <div className="h-40 overflow-y-auto space-y-2 pr-2">
                {subsetResult.result.subsetsWithProducts.map((combo, idx) => (
                  <div key={idx} className="bg-slate-800 p-2 rounded text-xs">
                    {combo.map((p, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{p.product_name}</span><span>${p.price}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResourceAllocation;
