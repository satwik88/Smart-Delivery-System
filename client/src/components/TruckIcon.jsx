import React from 'react';
import { Truck } from 'lucide-react';

const TruckIcon = ({ x, y }) => {
  return (
    <div 
      className="absolute z-20 transition-all duration-1000 ease-linear transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <div className="relative">
        <div className="w-8 h-8 bg-white rounded-full shadow-md border-2 border-neon-blue flex items-center justify-center">
          <Truck size={16} className="text-neon-blue" />
        </div>
      </div>
    </div>
  );
};

export default TruckIcon;
