import React, { useState } from 'react';
import { roles } from '@/data/roles';
import { StakeholderCard } from './StakeholderCard';

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
    <div className="flex-1 flex flex-col p-8 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full bg-[#FAF8F5] border border-[#e8e5e0] rounded-3xl p-8 shadow-soft">
        
        {/* Progress header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <span className="px-3 py-1 bg-rose-50 border border-rose-100 text-[var(--color-brand-coral)] text-[10px] font-bold rounded-full font-mono uppercase tracking-wider">
            [ 協商小組登記：身分初始化 ]
          </span>
          <span className="text-xs font-mono text-gray-400">進度：1 / 2 步</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-gray-900">選擇您的協商身分</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-3xl leading-relaxed font-sans">
          請選擇一個您要在協商圓桌中代表的利益關係人角色。您的觀點與核心利益將引導後續綠園道的空間分配與策略權衡。
        </p>

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

        <div className="flex justify-between items-center border-t border-gray-200 pt-6">
          <div className="text-xs font-mono text-gray-400">
            {selectedRole ? `已選定角色：${roles.find(r => r.id === selectedRole)?.name}` : '請選擇一個卡片以繼續'}
          </div>
          
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-8 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
              selectedRole 
                ? 'bg-[var(--color-brand-blue)] hover:bg-[#5b7a8c] text-white hover:-translate-y-0.5 active:translate-y-0' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            確定身分，進入簡報
          </button>
        </div>
      </div>
    </div>
  );
};

