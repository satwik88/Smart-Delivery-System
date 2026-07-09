import React from 'react';
import { Truck } from 'lucide-react';

const MapCanvas = ({ warehouses, roads, route, progressPct, sourceId, destId }) => {
  // Use a fixed viewBox that covers the coordinates of the warehouses with padding
  const viewBox = "0 0 300 250";

  // Helper to get coordinates
  const getNode = (id) => warehouses.find(w => w.id === id);

  // Compute if a road is part of the route
  const isRoadInRoute = (from, to) => {
    if (!route || route.length < 2) return false;
    for (let i = 0; i < route.length - 1; i++) {
      if ((route[i].id === from && route[i+1].id === to) || 
          (route[i].id === to && route[i+1].id === from)) {
        return true;
      }
    }
    return false;
  };

  // Calculate truck position
  const getTruckPos = () => {
    if (!route || route.length < 2) return null;
    
    const segDistances = [];
    for (let i = 0; i < route.length - 1; i++) {
      const a = route[i], b = route[i+1];
      segDistances.push(Math.hypot(b.pos_x - a.pos_x, b.pos_y - a.pos_y));
    }
    const total = segDistances.reduce((s, d) => s + d, 0);
    let target = (progressPct / 100) * total;

    for (let i = 0; i < segDistances.length; i++) {
      if (target <= segDistances[i]) {
        const a = route[i], b = route[i+1];
        const t = segDistances[i] === 0 ? 0 : target / segDistances[i];
        return {
          x: a.pos_x + (b.pos_x - a.pos_x) * t,
          y: a.pos_y + (b.pos_y - a.pos_y) * t
        };
      }
      target -= segDistances[i];
    }
    return { x: route[route.length-1].pos_x, y: route[route.length-1].pos_y };
  };

  const truckPos = getTruckPos();

  return (
    <div className="w-full h-full relative bg-surface-bg/50 rounded-xl border border-border-main overflow-hidden">
      <svg viewBox={viewBox} className="w-full h-full drop-shadow-sm">
        
        {/* Draw City Blocks Background */}
        <g id="city-blocks">
          <rect x="10" y="10" width="70" height="60" rx="6" fill="#e2e8f0" opacity="0.4" />
          <rect x="110" y="10" width="100" height="50" rx="6" fill="#dcfce3" opacity="0.4" /> {/* Park */}
          <rect x="230" y="20" width="50" height="70" rx="6" fill="#e2e8f0" opacity="0.4" />
          <rect x="20" y="90" width="60" height="120" rx="6" fill="#e2e8f0" opacity="0.4" />
          <rect x="100" y="80" width="100" height="130" rx="6" fill="#e2e8f0" opacity="0.4" />
          <rect x="220" y="110" width="70" height="100" rx="6" fill="#e2e8f0" opacity="0.4" />
        </g>

        {/* Draw Unused Roads first (background) */}
        {roads.map((road, idx) => {
          if (isRoadInRoute(road.from_id, road.to_id)) return null;
          const fromNode = getNode(road.from_id);
          const toNode = getNode(road.to_id);
          if (!fromNode || !toNode) return null;
          
          return (
            <g key={`unused-${idx}`}>
              <line 
                x1={fromNode.pos_x} y1={fromNode.pos_y} 
                x2={toNode.pos_x} y2={toNode.pos_y}
                stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" opacity="0.6"
              />
              <line 
                x1={fromNode.pos_x} y1={fromNode.pos_y} 
                x2={toNode.pos_x} y2={toNode.pos_y}
                stroke="#f8fafc" strokeWidth="1" strokeDasharray="4 4"
              />
            </g>
          );
        })}

        {/* Draw Planned Route */}
        {route && route.length > 1 && route.map((node, i) => {
          if (i === route.length - 1) return null;
          const nextNode = route[i+1];
          return (
            <g key={`route-${i}`}>
              <line 
                x1={node.pos_x} y1={node.pos_y} 
                x2={nextNode.pos_x} y2={nextNode.pos_y}
                stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" className="drop-shadow-sm transition-all" opacity="0.9"
              />
              <line 
                x1={node.pos_x} y1={node.pos_y} 
                x2={nextNode.pos_x} y2={nextNode.pos_y}
                stroke="#bfdbfe" strokeWidth="2" strokeDasharray="6 6"
              />
            </g>
          );
        })}

        {/* Draw Warehouses / Buildings */}
        {warehouses.map(w => {
          const isSource = w.id === sourceId;
          const isDest = w.id === destId;
          const inRoute = route && route.some(r => r.id === w.id);
          
          let fillColor = "#f8fafc";
          let strokeColor = "#94a3b8";
          let scale = 1;
          
          if (isSource) { fillColor = "#f59e0b"; strokeColor = "#d97706"; scale = 1.3; }
          else if (isDest) { fillColor = "#10b981"; strokeColor = "#059669"; scale = 1.3; }
          else if (inRoute) { fillColor = "#bfdbfe"; strokeColor = "#3b82f6"; }

          return (
            <g key={`node-${w.id}`} transform={`translate(${w.pos_x}, ${w.pos_y}) scale(${scale})`}>
              {/* Building Shape (House/Warehouse) */}
              <polygon 
                points="-8,6 8,6 8,-2 0,-8 -8,-2"
                fill={fillColor} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round"
              />
              {/* Door */}
              <rect x="-2" y="2" width="4" height="4" fill={strokeColor} opacity="0.5" />
              
              <text 
                x="0" y="-12" 
                textAnchor="middle" fontSize="8" fill="#475569" fontWeight="bold"
              >
                {w.name.split(' - ')[0]}
              </text>
            </g>
          );
        })}

        {/* Draw Truck */}
        {truckPos && (
          <g 
            transform={`translate(${truckPos.x}, ${truckPos.y})`} 
            style={{ transition: 'transform 1s linear' }}
          >
            <rect x="-10" y="-8" width="20" height="16" rx="4" fill="white" stroke="#3b82f6" strokeWidth="2" className="drop-shadow-md" />
            <foreignObject x="-7" y="-7" width="14" height="14">
              <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center justify-center w-full h-full text-neon-blue">
                <Truck size={10} />
              </div>
            </foreignObject>
            {/* Label */}
            <rect x="-15" y="12" width="30" height="10" rx="3" fill="#1e293b" opacity="0.8" />
            <text x="0" y="20" textAnchor="middle" fontSize="6" fill="#f8fafc" fontWeight="bold">
              {progressPct.toFixed(0)}%
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default MapCanvas;
