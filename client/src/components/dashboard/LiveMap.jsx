import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  
  // Simulate driver movement (Mocked for future integration)
  const [driverPos, setDriverPos] = useState([28.59, 77.25]);

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

    // Mock driver movement
    const interval = setInterval(() => {
      setDriverPos(prev => [
        prev[0] - 0.0005 + (Math.random() * 0.0002),
        prev[1] + 0.001 + (Math.random() * 0.0002)
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="premium-card p-4 overflow-hidden flex flex-col h-[400px]">
      <div className="flex justify-between items-center px-4 pt-2 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-text-main">Live Map</h2>
          {/* Note to show some data is mocked */}
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full" title="Driver is simulated. Warehouses are real DB data.">Partial Mock</span>
        </div>
        <span className="bg-brand-blue/10 text-brand-blue text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Active</span>
      </div>
      <div className="flex-1 rounded-2xl overflow-hidden relative">
        <MapContainer center={[28.58, 77.30]} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {warehouses.map(w => (
            w.lat && w.lng ? (
              <Marker key={w.id} position={[w.lat, w.lng]} icon={warehouseIcon}>
                <Popup>{w.name}</Popup>
              </Marker>
            ) : null
          ))}

          {/* Mocked Driver */}
          <Marker position={driverPos} icon={driverIcon}>
            <Popup>Aman (Out for Delivery - Mocked)</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveMap;
