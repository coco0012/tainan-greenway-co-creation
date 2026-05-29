import React from 'react';
import { StakeholderRole } from '@/data/roles';

interface StakeholderCardProps {
  role: StakeholderRole;
  isSelected?: boolean;
  onSelect?: (roleId: string) => void;
  className?: string;
}

export const StakeholderCard: React.FC<StakeholderCardProps> = ({ role, isSelected, onSelect, className = '' }) => {
  return (
    <div 
      className={`relative p-5 border-arch transition-all flex flex-col justify-between h-full bg-white select-none ${
        isSelected 
          ? 'border-[var(--color-brand-coral)] ring-1 ring-[var(--color-brand-coral)]' 
          : 'border-gray-800 hover:border-black hover:bg-gray-50'
      } ${onSelect ? 'cursor-pointer' : ''} ${className}`}
      onClick={() => onSelect && onSelect(role.id)}
    >
      {/* Selection Dot Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--color-brand-coral)]" />
      )}

      <div>
        <div className="flex justify-between items-center mb-2 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
          <span>[ 角色編碼：{role.id} ]</span>
          {isSelected && <span className="text-[var(--color-brand-coral)] font-bold">[ 已選擇 ]</span>}
        </div>
        
        <h3 className="text-lg font-bold mb-4 text-black tracking-tight">{role.name}</h3>
        
        <div className="space-y-2.5 text-xs text-gray-700 font-sans">
          <div>
            <span className="font-bold text-[10px] font-mono text-gray-900 block mb-0.5 uppercase">[ 核心價值取向 ]</span> 
            <p className="pl-2 border-l border-gray-300">{role.coreValues}</p>
          </div>
          <div>
            <span className="font-bold text-[10px] font-mono text-gray-900 block mb-0.5 uppercase">[ 關鍵關注議題 ]</span> 
            <p className="pl-2 border-l border-gray-300">{role.mainConcerns}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 bg-gray-50 border-arch-thin border-dashed text-xs text-gray-600 font-mono italic leading-relaxed">
        {role.quote}
      </div>
    </div>
  );
};

