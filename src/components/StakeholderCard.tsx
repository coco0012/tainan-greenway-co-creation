import React from 'react';
import { StakeholderRole } from '@/data/roles';
import { Home, Store, Bike, Heart, Trees, Building2 } from 'lucide-react';

interface StakeholderCardProps {
  role: StakeholderRole;
  isSelected?: boolean;
  onSelect?: (roleId: string) => void;
  className?: string;
}

export const StakeholderCard: React.FC<StakeholderCardProps> = ({ role, isSelected, onSelect, className = '' }) => {
  const getRoleIconInfo = (id: string) => {
    switch (id) {
      case 'resident': 
        return { icon: <Home className="w-5 h-5" />, bg: 'bg-rose-50 text-[var(--color-brand-coral)]' };
      case 'shop_owner': 
        return { icon: <Store className="w-5 h-5" />, bg: 'bg-orange-50 text-orange-400' };
      case 'commuter': 
        return { icon: <Bike className="w-5 h-5" />, bg: 'bg-blue-50 text-[var(--color-brand-blue)]' };
      case 'elderly': 
        return { icon: <Heart className="w-5 h-5" />, bg: 'bg-rose-50 text-rose-400' };
      case 'environmentalist': 
        return { icon: <Trees className="w-5 h-5" />, bg: 'bg-emerald-50 text-[var(--color-brand-green)]' };
      case 'government': 
        return { icon: <Building2 className="w-5 h-5" />, bg: 'bg-slate-50 text-slate-500' };
      default: 
        return { icon: <Home className="w-5 h-5" />, bg: 'bg-gray-50 text-gray-400' };
    }
  };

  const { icon, bg } = getRoleIconInfo(role.id);
  const valueTags = role.coreValues.split('、');

  return (
    <div 
      className={`relative p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-full bg-white select-none ${
        isSelected 
          ? 'border-[var(--color-brand-coral)] ring-2 ring-[var(--color-brand-coral)]/10 shadow-soft bg-card-active' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-soft-sm hover:bg-gray-50/50'
      } ${onSelect ? 'cursor-pointer' : ''} ${className}`}
      onClick={() => onSelect && onSelect(role.id)}
    >
      {/* Selection Banner */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-[var(--color-brand-coral)] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
          已選擇
        </div>
      )}

      <div>
        {/* Avatar and Info Block */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg} shrink-0`}>
            {icon}
          </div>
          <div>
            <div className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">[ {role.id.toUpperCase()} ]</div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">{role.name}</h3>
          </div>
        </div>
        
        {/* Value Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {valueTags.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-semibold"
            >
              {tag.trim()}
            </span>
          ))}
        </div>

        {/* Short Concerns summary */}
        <div className="text-xs text-gray-500 font-sans mb-4">
          <span className="font-bold text-[10px] text-gray-700 block mb-0.5">關鍵關注：</span>
          <p className="leading-relaxed">{role.mainConcerns}</p>
        </div>
      </div>

      <div className="mt-2 p-3 bg-gray-50/70 border border-gray-100 rounded-xl text-xs text-gray-600 font-sans italic leading-relaxed">
        {role.quote}
      </div>
    </div>
  );
};
