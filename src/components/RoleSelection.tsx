import React, { useState } from 'react';
import { roles } from '@/data/roles';
import { StakeholderCard } from './StakeholderCard';
import { Sparkles, HelpCircle } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (roleId: string) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-8 shadow-flat-pop-lg">
        
        {/* Progress header */}
        <div className="flex justify-between items-center mb-6 border-b-3 border-[#1f1d1b] pb-4">
          <span className="px-3.5 py-1 bg-blob-pink border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 圓桌登記：選擇您的協商身分 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">進度：1 / 2 步</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-[#1f1d1b] font-serif flex items-center gap-2">
          <Sparkles className="text-[var(--color-brand-yellow)]" />
          選擇您的協商身分
        </h1>
        <p className="text-sm text-gray-500 mb-8 max-w-3xl leading-relaxed font-sans">
          請選擇一個您要在公民協商圓桌中代表的利益關係人角色。在接下來的協商中，您的決策與立場將決定台南綠園道的空間樣貌與民意績效！
        </p>

        {/* Stakeholder cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {roles.map((role) => (
            <StakeholderCard 
              key={role.id} 
              role={role} 
              isSelected={selectedRole === role.id}
              onSelect={setSelectedRole}
            />
          ))}
        </div>

        {/* Action area */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t-3 border-[#1f1d1b] pt-6">
          <div className="text-xs font-sans font-semibold text-gray-400 flex items-center gap-1.5">
            <HelpCircle size={14} className="text-[var(--color-brand-blue)] shrink-0" />
            {selectedRole 
              ? `已選定身分：${roles.find(r => r.id === selectedRole)?.name}` 
              : '請選擇一張角色卡牌以解鎖市民協商圓桌。'}
          </div>
          
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
              selectedRole 
                ? 'btn-flat-action bg-[var(--color-brand-green)] text-white hover:bg-[#a6bf4c]' 
                : 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed shadow-none'
            }`}
          >
            確認身分，開始規劃踏查 →
          </button>
        </div>
      </div>
    </div>
  );
};
