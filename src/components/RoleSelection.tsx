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
    <div className="flex-1 flex flex-col p-8 bg-dot-grid h-full overflow-y-auto">
      <div className="relative max-w-5xl mx-auto w-full bg-white bg-opacity-95 border-arch p-8">
        {/* Corner Crosshairs */}
        <div className="absolute -top-2.5 -left-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -top-2.5 -right-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -bottom-3 -left-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -bottom-3 -right-2 text-md font-mono text-gray-500 select-none">+</div>

        {/* Header Block */}
        <div className="flex justify-between items-center mb-6 border-b border-black pb-2">
          <span className="anno-label text-gray-500 font-semibold">[ 協商階段：利益關係人身分初始化 ]</span>
          <span className="anno-label text-gray-500 font-semibold">[ 圖紙編號：RS-01 ]</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-black uppercase">選擇您的角色</h1>
        <p className="text-sm text-gray-600 mb-8 max-w-3xl leading-relaxed">
          請選擇您要在協商過程中代表的利益關係人角色。您的觀點與價值取向將直接影響綠園道空間策略的權衡與演變。
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
          <div className="font-mono text-[10px] text-gray-500 uppercase">
            [ 選擇狀態：{selectedRole ? `就緒 (${selectedRole})` : '等待選擇中'} ]
          </div>
          
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-8 py-3 border-arch font-mono text-sm tracking-wider uppercase font-bold transition-all duration-150 cursor-pointer ${
              selectedRole 
                ? 'bg-white hover:bg-[var(--color-brand-blue)] hover:text-white text-black active:translate-y-[1px]' 
                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            確定身分
          </button>
        </div>
      </div>
    </div>
  );
};

