import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';
import { Play } from 'lucide-react';

const NetworkTopography = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [roads, setRoads] = useState([]);
  const [mstResult, setMstResult] = useState(null);
  const [algorithm, setAlgorithm] = useState('kruskal');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wRes, rRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/network/warehouses`),
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/network/roads`)
        ]);
        setWarehouses(wRes.data);
        setRoads(rRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (containerRef.current && warehouses.length > 0) {
      const nodes = warehouses.map(w => ({
        id: w.id,
        label: w.name,
        x: w.pos_x,
        y: w.pos_y,
        color: '#1e293b',
        font: { color: '#f8fafc' },
        shape: 'box'
      }));

      // Find MST edges if computed
      const mstEdgeIds = new Set();
      if (mstResult && mstResult.result.mstEdges) {
        mstResult.result.mstEdges.forEach(e => {
          // Identify edge from the raw roads (using 'id' or just from-to matching)
          mstEdgeIds.add(`${e.from}-${e.to}`);
          mstEdgeIds.add(`${e.to}-${e.from}`);
        });
      }

      const edges = roads.map(r => {
        const isMst = mstEdgeIds.has(`${r.from_id}-${r.to_id}`);
        return {
          from: r.from_id,
          to: r.to_id,
          label: r.distance.toString(),
          color: isMst ? '#10b981' : '#334155',
          width: isMst ? 3 : 1,
          font: { color: isMst ? '#10b981' : '#94a3b8', background: '#0f172a' }
        };
      });

      const data = { nodes, edges };
      const options = {
        physics: false, // Use hardcoded pos_x and pos_y
        interaction: { hover: true, zoomView: true, dragView: true },
      };

      if (!networkRef.current) {
        networkRef.current = new Network(containerRef.current, data, options);
      } else {
        networkRef.current.setData(data);
      }
    }
  }, [warehouses, roads, mstResult]);

  const runMst = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/network/mst`, { algorithm });
      setMstResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 relative z-10">
      <div className="glass-panel p-6 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Logistics Network</h2>
          <p className="text-sm text-text-muted">Visualize facilities and optimize the core distribution network.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-neon-blue"
          >
            <option value="kruskal">Cost-Optimized Network (Kruskal)</option>
            <option value="prim">Distance-Optimized Network (Prim)</option>
          </select>
          <button 
            onClick={runMst} 
            disabled={loading}
            className="bg-neon-blue hover:bg-neon-blue-dark text-white px-6 py-2 rounded font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Play size={16} /> Optimize Network
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="glass-panel flex-1 flex flex-col p-4 relative">
          <div className="absolute top-4 left-4 z-10 text-xs text-text-muted font-mono">
            {mstResult ? `Cost: ${mstResult.result.totalCost} | Time: ${mstResult.metrics.time.toFixed(2)}ms | Comparisons: ${mstResult.metrics.comparisons}` : 'Awaiting Calculation...'}
          </div>
          <div ref={containerRef} className="flex-1 w-full bg-slate-900/50 rounded" />
        </div>

        <div className="w-80 glass-panel p-6 flex flex-col overflow-hidden">
          <h3 className="font-semibold text-slate-100 mb-4 border-b border-slate-700 pb-2">Execution Steps</h3>
          <div className="overflow-y-auto flex-1 space-y-2 pr-2">
            {mstResult ? mstResult.steps.map((step, i) => (
              <div key={i} className="text-xs text-slate-300 font-mono bg-slate-900/50 p-2 rounded border border-slate-800">
                <span className="text-neon-blue mr-2">[{i+1}]</span>{step}
              </div>
            )) : (
              <p className="text-sm text-text-muted italic">Run an algorithm to see step-by-step execution details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTopography;
