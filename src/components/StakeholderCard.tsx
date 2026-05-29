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

  const getBlobBgClass = (id: string) => {
    switch (id) {
      case 'resident': return 'bg-blob-pink';
      case 'shop_owner': return 'bg-blob-yellow';
      case 'commuter': return 'bg-blob-blue';
      case 'elderly': return 'bg-blob-pink';
      case 'environmentalist': return 'bg-blob-green';
      case 'government': return 'bg-gray-200';
      default: return 'bg-gray-150';
    }
  };

  const valueTags = role.coreValues.split('、');

  return (
    <div 
      className={`relative p-5 border-3 border-[#1f1d1b] rounded-2xl transition-all duration-200 flex flex-col justify-between h-full select-none cursor-pointer ${
        isSelected 
          ? 'bg-[#FFFFFC] shadow-[6px_6px_0px_0px_#f3ce6b]' 
          : 'bg-[#FFFDF9] hover:bg-white shadow-flat-pop hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(31,29,27,1)]'
      } ${className}`}
      onClick={() => onSelect && onSelect(role.id)}
    >
      {/* Selected Indicator Banner */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-[var(--color-brand-coral)] text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-md border-2 border-[#1f1d1b] shadow-[1.5px_1.5px_0px_0px_#1f1d1b] select-none">
          已選擇 / READY
        </div>
      )}

      <div>
        {/* Avatar and Info Block */}
        <div className="flex items-center gap-4 mb-4 border-b-2 border-dashed border-[#1f1d1b]/10 pb-3.5">
          <div className={`w-14 h-14 rounded-full blob-avatar-memphis ${getBlobBgClass(role.id)} flex items-center justify-center shrink-0 overflow-hidden`}>
            <img 
              src={getRoleAvatar(role.id)} 
              alt={role.name}
              className="w-full h-full object-cover scale-110" 
            />
          </div>
          <div>
            <div className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">[ {role.id.toUpperCase()} ]</div>
            <h3 className="text-lg font-bold text-[#1f1d1b] font-serif leading-tight">{role.name}</h3>
          </div>
        </div>
        
        {/* Dialogue Bubble displaying identity contents */}
        <div className="relative bg-[#FFFFFF] border-2 border-[#1f1d1b] p-4 rounded-xl mb-4 text-[#1f1d1b] text-xs font-sans shadow-flat-pop
                        before:content-[''] before:absolute before:top-[-8px] before:left-7 before:w-0 before:height-0 before:border-l-[8px] before:border-l-transparent before:border-r-[8px] before:border-r-transparent before:border-b-[8px] before:border-b-[#1f1d1b]
                        after:content-[''] after:absolute after:top-[-5px] after:left-[29px] after:w-0 after:height-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-b-[6px] after:border-b-white">
          
          {/* Core Values */}
          <div className="mb-2">
            <span className="font-bold text-[10px] text-[#8ea63d] block mb-1">【 核心價值 】</span>
            <div className="flex flex-wrap gap-1.5">
              {valueTags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 bg-[#FAF7F2] border-2 border-[#1f1d1b] text-[#1f1d1b] rounded text-[9px] font-semibold"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Key Concerns */}
          <div>
            <span className="font-bold text-[10px] text-[#79afd3] block mb-0.5">【 關注焦點 】</span>
            <p className="text-[11px] leading-relaxed text-gray-600">{role.mainConcerns}</p>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-2 p-3 bg-gray-50 border-2 border-[#1f1d1b] rounded-xl text-[11px] text-[#1f1d1b] font-sans italic leading-relaxed text-center">
        “ {role.quote} ”
      </div>
    </div>
  );
};
