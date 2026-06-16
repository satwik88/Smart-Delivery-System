import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, MapPin } from 'lucide-react';

const DeliveryRouting = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [sourceId, setSourceId] = useState('');
  const [destId, setDestId] = useState('');
  const [dijkstraResult, setDijkstraResult] = useState(null);
  const [apspResult, setApspResult] = useState(null);
  const [loading, setLoading] = useState({ dijkstra: false, floyd: false });

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/network/warehouses');
        setWarehouses(res.data);
        if (res.data.length > 1) {
          setSourceId(res.data[0].id.toString());
          setDestId(res.data[1].id.toString());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWarehouses();
  }, []);

  const runDijkstra = async () => {
    if (!sourceId || !destId) return;
    setLoading(prev => ({ ...prev, dijkstra: true }));
    try {
      const res = await axios.post('http://localhost:5000/api/routing/shortest-path', { sourceId, destId });
      setDijkstraResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, dijkstra: false }));
    }
  };

  const runFloydWarshall = async () => {
    setLoading(prev => ({ ...prev, floyd: true }));
    try {
      const res = await axios.get('http://localhost:5000/api/routing/apsp');
      setApspResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, floyd: false }));
    }
  };

  const getWarehouseName = (id) => warehouses.find(w => w.id === parseInt(id))?.name || id;

  return (
    <div className="flex flex-col h-full gap-6 relative z-10">
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold text-slate-100">Active Routes</h2>
        <p className="text-sm text-slate-400">Compute optimal delivery paths and view network-wide routing metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Dijkstra Section */}
        <div className="glass-panel p-6 flex flex-col min-w-0">
          <h3 className="font-semibold text-neon-blue mb-4 border-b border-slate-700 pb-2 truncate">Optimal Route Finder</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <select 
              value={sourceId} onChange={e => setSourceId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1 text-slate-100 focus:outline-none focus:border-neon-blue"
            >
              {warehouses.map(w => <option key={w.id} value={w.id}>From: {w.name}</option>)}
            </select>
            <select 
              value={destId} onChange={e => setDestId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1 text-slate-100 focus:outline-none focus:border-neon-blue"
            >
              {warehouses.map(w => <option key={w.id} value={w.id}>To: {w.name}</option>)}
            </select>
            <button 
              onClick={runDijkstra} disabled={loading.dijkstra}
              className="bg-neon-blue hover:bg-neon-blue-dark text-white px-4 py-2 rounded font-medium flex items-center gap-2"
            >
              <Play size={16} /> Route
            </button>
          </div>

          <div className="flex-1 bg-slate-900/50 rounded border border-slate-800 p-4 overflow-y-auto">
            {dijkstraResult ? (
              <div>
                <div className="mb-4">
                  <span className="text-slate-400">Total Distance: </span>
                  <span className="text-xl font-bold text-accent-green">{dijkstraResult.result.distance} km</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300 mb-6">
                  {dijkstraResult.result.path.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="bg-slate-800 px-2 py-1 rounded">{getWarehouseName(node)}</span>
                      {i < dijkstraResult.result.path.length - 1 && <span className="text-neon-blue">→</span>}
                    </React.Fragment>
                  ))}
                </div>
                <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Execution Log</h4>
                <div className="space-y-1">
                  {dijkstraResult.steps.map((s, i) => (
                    <div key={i} className="text-xs font-mono text-slate-400"><span className="text-neon-blue/50">[{i}]</span> {s}</div>
                  ))}
                </div>
              </div>
            ) : <p className="text-slate-500 italic text-sm">Select locations and click Route.</p>}
          </div>
        </div>

        {/* Floyd-Warshall Section */}
        <div className="glass-panel p-6 flex flex-col min-w-0">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4 border-b border-slate-700 pb-2">
            <h3 className="font-semibold text-purple-400 truncate">Network Distance Matrix</h3>
            <button 
              onClick={runFloydWarshall} disabled={loading.floyd}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2 text-sm"
            >
              <Play size={14} /> Compute Matrix
            </button>
          </div>

          <div className="flex-1 bg-slate-900/50 rounded border border-slate-800 p-4 overflow-auto min-w-0">
            {apspResult ? (
              <div className="min-w-max">
                <div className="mb-4 text-xs font-mono text-slate-400">
                  <span className="text-slate-300">Execution Time:</span> {apspResult.metrics.time.toFixed(2)}ms | 
                  <span className="text-slate-300 ml-2">Ops:</span> {apspResult.metrics.comparisons}
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b border-slate-700 text-slate-500 text-xs">Node \ Node</th>
                      {apspResult.result.nodeIds.map((id) => (
                        <th key={id} className="p-2 border-b border-slate-700 text-slate-300 text-xs font-mono">W{id}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {apspResult.result.distMatrix.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/30">
                        <td className="p-2 border-b border-slate-800 text-slate-300 text-xs font-mono font-bold">W{apspResult.result.nodeIds[i]}</td>
                        {row.map((dist, j) => (
                          <td key={j} className={`p-2 border-b border-slate-800 text-xs font-mono ${dist === Infinity ? 'text-slate-600' : dist === 0 ? 'text-slate-500' : 'text-accent-green'}`}>
                            {dist === Infinity ? '∞' : dist}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-slate-500 italic text-sm">Click Compute Matrix to generate all-pairs distances.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeliveryRouting;
