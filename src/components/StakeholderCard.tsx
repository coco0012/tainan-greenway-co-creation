import React from 'react';
import { StakeholderRole } from '@/data/roles';

interface StakeholderCardProps {
  role: StakeholderRole;
  isSelected?: boolean;
  onSelect?: (roleId: string) => void;
  className?: string;
}

export const StakeholderCard: React.FC<StakeholderCardProps> = ({ role, isSelected, onSelect, className = '' }) => {
  
  const getRoleAvatar = (id: string) => {
    switch (id) {
      case 'resident': return '/avatar_resident.png';
      case 'shop_owner': return '/avatar_shopowner.png';
      case 'commuter': return '/avatar_commuter.png';
      case 'elderly': return '/avatar_elderly.png';
      case 'environmentalist': return '/avatar_environmentalist.png';
      case 'government': return '/avatar_government.png';
      default: return '/avatar_resident.png';
    }
  };

  const getBlobClass = (id: string) => {
    switch (id) {
      case 'resident': case 'elderly': return 'blob-avatar-1';
      case 'shop_owner': case 'environmentalist': return 'blob-avatar-2';
      default: return 'blob-avatar-3';
    }
  };

  const getAvatarBgColor = (id: string) => {
    switch (id) {
      case 'resident': return 'bg-rose-100';
      case 'shop_owner': return 'bg-orange-100';
      case 'commuter': return 'bg-blue-100';
      case 'elderly': return 'bg-rose-100';
      case 'environmentalist': return 'bg-emerald-100';
      case 'government': return 'bg-slate-200';
      default: return 'bg-gray-100';
    }
  };

  const valueTags = role.coreValues.split('、');

  return (
    <div 
      className={`relative p-5 transition-all duration-200 flex flex-col justify-between h-full select-none cursor-pointer ${
        isSelected 
          ? 'card-watercolor card-watercolor-active bg-[#FFFFFC]' 
          : 'card-watercolor hover:border-gray-400 hover:shadow-soft bg-[#FFFDF9]'
      } ${className}`}
      onClick={() => onSelect && onSelect(role.id)}
    >
      {/* Selected Indicator Banner */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-[var(--color-brand-coral)] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
          已選擇 / SELECTED
        </div>
      )}

      <div>
        {/* Avatar and Info Block */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 ${getBlobClass(role.id)} ${getAvatarBgColor(role.id)} flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#eee6db] shadow-soft-sm`}>
            <img 
              src={getRoleAvatar(role.id)} 
              alt={role.name}
              className="w-full h-full object-cover scale-110" 
            />
          </div>
          <div>
            <div className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">[ {role.id.toUpperCase()} ]</div>
            <h3 className="text-lg font-bold text-[var(--color-text-dark)] font-serif leading-tight">{role.name}</h3>
          </div>
        </div>
        
        {/* Dialogue Bubble displaying identity contents */}
        <div className="relative bg-[#FAF7F2] border border-[#e5dfd5] p-4 rounded-2xl mb-4 text-[#5c554e] text-xs font-sans shadow-inner-sm
                        before:content-[''] before:absolute before:top-[-8px] before:left-7 before:w-0 before:height-0 before:border-l-[8px] before:border-l-transparent before:border-r-[8px] before:border-r-transparent before:border-b-[8px] before:border-b-[#e5dfd5]
                        after:content-[''] after:absolute after:top-[-6px] after:left-[29px] after:w-0 after:height-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-b-[6px] after:border-b-[#FAF7F2]">
          
          {/* Core Values */}
          <div className="mb-2">
            <span className="font-bold text-[10px] text-[var(--color-brand-green)] block mb-1">【 核心價值 】</span>
            <div className="flex flex-wrap gap-1.5">
              {valueTags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 bg-[#FAF3E5] border border-[#e6dcce] text-gray-700 rounded-full text-[9px] font-semibold"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Key Concerns */}
          <div>
            <span className="font-bold text-[10px] text-[var(--color-brand-blue)] block mb-0.5">【 關注點 】</span>
            <p className="text-[11px] leading-relaxed">{role.mainConcerns}</p>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-2 p-3 bg-[#fdfaf5] border border-[#f3ede3] rounded-xl text-[11px] text-gray-500 font-sans italic leading-relaxed text-center">
        “ {role.quote} ”
      </div>
    </div>
  );
};
