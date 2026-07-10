import React from 'react';
import { Check, Truck, Flag, Package } from 'lucide-react';

const StatusTimeline = ({ currentStatus }) => {
  const steps = [
    { id: 'received', label: 'Received', icon: Check },
    { id: 'packed', label: 'Packed', icon: Package },
    { id: 'in_transit', label: 'In transit', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Flag }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'placed':
      case 'verified': return 0;
      case 'packed':
      case 'dispatched': return 1;
      case 'in_transit': return 2;
      case 'delivered': return 3;
      default: return -1;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full">
      <div className="flex justify-between items-start relative w-full px-4">
        {/* Lines Container (starts at center of first icon and ends at center of last icon) */}
        <div className="absolute left-12 right-12 top-5 -translate-y-1/2 h-1 z-0 rounded-full">
          {/* Background Line */}
          <div className="absolute inset-0 bg-surface-bg w-full h-full rounded-full border border-border-main"></div>
          
          {/* Progress Line */}
          <div 
            className="absolute left-0 top-0 h-full bg-neon-blue rounded-full transition-all duration-1000"
            style={{ width: currentIndex >= 0 ? `${(currentIndex / (steps.length - 1)) * 100}%` : '0%' }} 
          ></div>
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group w-16">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                ${isCompleted ? 'bg-accent-green text-white' : ''}
                ${isCurrent ? 'bg-neon-blue text-white ring-4 ring-neon-blue/20' : ''}
                ${isFuture ? 'bg-card-bg border-2 border-border-main text-text-muted' : ''}
              `}>
                <Icon size={18} strokeWidth={isCompleted || isCurrent ? 3 : 2} />
              </div>
              <div className="mt-3 text-center">
                <p className={`text-xs font-semibold tracking-wide uppercase ${
                  isCurrent ? 'text-text-main font-bold' : isCompleted ? 'text-text-main opacity-80' : 'text-text-muted'
                }`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;
