import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle } from 'lucide-react';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Markers
const warehouseIcon = new L.DivIcon({
  html: '<div class="w-8 h-8 bg-brand-blue rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">W</div>',
  className: 'bg-transparent'
});

const driverIcon = new L.DivIcon({
  html: '<div class="w-6 h-6 bg-warning rounded-full border-2 border-white shadow-md animate-bounce"></div>',
  className: 'bg-transparent'
});

const LiveMap = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/network/warehouses`);
        setWarehouses(response.data);
      } catch (err) {
        console.error("Error fetching warehouses for map:", err);
      }
    };
    fetchWarehouses();

    // Setup Socket.io
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: {
        token: token
      }
    });

    socket.on('connect', () => {
      console.log('Connected to Live Operations Engine');
    });

    socket.on('driver_locations', (data) => {
      setDrivers(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="premium-card p-4 overflow-hidden flex flex-col h-[400px]">
      <div className="flex justify-between items-center px-4 pt-2 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-text-main">Live Map</h2>
          <span className="text-[10px] bg-warning/10 border border-warning/20 text-warning px-2 py-0.5 rounded-full" title="This is a mock simulation.">Demo Simulation</span>
        </div>
        <span className="bg-brand-blue/10 text-brand-blue text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Active</span>
      </div>
      <div className="flex-1 rounded-2xl overflow-hidden relative">
        <MapContainer center={[28.58, 77.30]} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {warehouses.map(w => {
            const lat = w.lat || w.pos_x;
            const lng = w.lng || w.pos_y;
            return lat && lng ? (
              <Marker key={w.id} position={[lat, lng]} icon={warehouseIcon}>
                <Popup>{w.name}</Popup>
              </Marker>
            ) : null;
          })}

          {/* Live Drivers */}
          {drivers.map(d => (
            d.pos && d.pos[0] && d.pos[1] ? (
              <Marker key={d.id} position={d.pos} icon={driverIcon}>
                <Popup>{d.name} ({d.status})</Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>

        {drivers.length === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white z-[1000] p-4 text-center">
            <AlertCircle className="text-yellow-500 mb-2 animate-bounce" size={32} />
            <p className="font-black text-sm">No Active Deliveries</p>
            <p className="text-[10px] text-gray-300 max-w-xs mt-1 font-semibold">
              There are no orders currently in transit. The map will display active drivers once an order status is updated to 'In Transit'.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMap;
