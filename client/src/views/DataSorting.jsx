import { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DataSorting = () => {
  const [datasetType, setDatasetType] = useState('deliveries');
  const [sortResult, setSortResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [nSize, setNSize] = useState(8);
  const [nQueensResult, setNQueensResult] = useState(null);
  const [loadingQueens, setLoadingQueens] = useState(false);

  const runSorting = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/sorting/benchmark`, { datasetType, sortKey: 'distance' });
      setSortResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runNQueens = async () => {
    setLoadingQueens(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/placement/place`, { n: nSize });
      setNQueensResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQueens(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 relative z-10 overflow-auto pb-8">
      <div className="glass-panel p-6 shrink-0">
        <h2 className="text-xl font-bold text-slate-100">Order Analytics & Placement</h2>
        <p className="text-sm text-slate-400">Analyze delivery metrics and determine strategic facility placements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sorting Benchmark */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-neon-blue mb-4 border-b border-slate-700 pb-2">Performance Analytics</h3>
          <div className="flex gap-2 mb-6">
            <select 
              value={datasetType} onChange={e => setDatasetType(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1 text-slate-100 focus:outline-none focus:border-neon-blue"
            >
              <option value="deliveries">Deliveries (Mock Data)</option>
              <option value="packages">Packages (DB)</option>
              <option value="warehouses">Warehouses (DB)</option>
            </select>
            <button onClick={runSorting} disabled={loading} className="bg-neon-blue text-white px-4 py-2 rounded font-medium disabled:opacity-50">Benchmark</button>
          </div>
          
          {sortResult && (
            <div className="space-y-4">
              <div className="h-64 w-full bg-slate-900/50 p-4 rounded border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Selection', time: sortResult.selection.metrics.time, ops: sortResult.selection.metrics.comparisons },
                    { name: 'Quick', time: sortResult.quick.metrics.time, ops: sortResult.quick.metrics.comparisons },
                    { name: 'Merge', time: sortResult.merge.metrics.time, ops: sortResult.merge.metrics.comparisons }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                    <Bar dataKey="ops" fill="#3b82f6" name="Comparisons" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-slate-400">Note: For small datasets, time differences may be negligible.</div>
            </div>
          )}
        </div>

        {/* N-Queens Backtracking */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="font-semibold text-purple-400 mb-4 border-b border-slate-700 pb-2">Strategic Facility Placement</h3>
          <div className="flex gap-2 mb-6">
            <input 
              type="number" value={nSize} onChange={e => setNSize(parseInt(e.target.value))} min="4" max="12"
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1 text-slate-100"
            />
            <button onClick={runNQueens} disabled={loadingQueens} className="bg-purple-600 text-white px-4 py-2 rounded font-medium disabled:opacity-50">Solve</button>
          </div>

          {nQueensResult && (
            <div className="flex-1 bg-slate-900/50 p-4 rounded border border-slate-800 flex flex-col">
              <div className="mb-4 text-sm text-slate-300">
                <span className="text-accent-green font-bold mr-4">{nQueensResult.result.count} Solutions</span>
                <span className="text-slate-400">Ops: {nQueensResult.metrics.comparisons}</span>
              </div>
              
              {nQueensResult.result.solutions.length > 0 && (
                <div className="flex-1 overflow-auto">
                  <p className="text-xs text-slate-500 mb-2">Displaying Solution #1</p>
                  <div 
                    className="grid gap-1 max-w-sm mx-auto" 
                    style={{ gridTemplateColumns: `repeat(${nSize}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: nSize * nSize }).map((_, i) => {
                      const row = Math.floor(i / nSize);
                      const col = i % nSize;
                      const isQueen = nQueensResult.result.solutions[0][row] === col;
                      const isDark = (row + col) % 2 === 1;
                      
                      return (
                        <div 
                          key={i} 
                          className={`aspect-square flex items-center justify-center rounded-sm ${isDark ? 'bg-slate-800' : 'bg-slate-700'} ${isQueen ? 'ring-2 ring-purple-500 ring-inset' : ''}`}
                        >
                          {isQueen && <div className="w-2/3 h-2/3 rounded-full bg-purple-400 shadow-[0_0_10px_theme('colors.purple.500')]" />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DataSorting;
