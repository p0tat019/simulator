import React from 'react';
import { MoraleIcon, ProductivityIcon, CooperationIcon } from './icons';

interface StatBarProps {
  label: 'Morale' | 'Productivity' | 'Cooperation';
  value: number;
}

const StatBar: React.FC<StatBarProps> = ({ label, value }) => {
  const Icon = label === 'Morale' ? MoraleIcon : label === 'Productivity' ? ProductivityIcon : CooperationIcon;
  const color = value > 60 ? 'bg-green-500' : value > 30 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1 text-sm font-medium text-slate-300">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </div>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${color}`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatBar;
