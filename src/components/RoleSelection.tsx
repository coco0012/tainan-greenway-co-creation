import React, { useState } from 'react';
import { roles, StakeholderRole } from '@/data/roles';
import { Sparkles, HelpCircle, Check } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (roleId: string) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const getBlobBgClass = (id: string) => {
    switch (id) {
      case 'resident': return 'bg-blob-pink/20 hover:bg-blob-pink/35 border-[#fbc4c6]';
      case 'shop_owner': return 'bg-blob-yellow/20 hover:bg-blob-yellow/35 border-[#faf0d8]';
      case 'commuter': return 'bg-blob-blue/20 hover:bg-blob-blue/35 border-[#c7dce7]';
      case 'elderly': return 'bg-[#ffe4e6]/30 hover:bg-[#ffe4e6]/45 border-[#ffe4e6]';
      case 'environmentalist': return 'bg-blob-green/20 hover:bg-blob-green/35 border-[#acd0a2]';
      case 'government': return 'bg-gray-50 hover:bg-gray-100 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getRoleBadgeStyle = (id: string) => {
    switch (id) {
      case 'resident': return 'bg-[#fbc4c6] text-[#b2574e]';
      case 'shop_owner': return 'bg-[#faf0d8] text-[#b37a3c]';
      case 'commuter': return 'bg-[#c7dce7] text-[#4a6b82]';
      case 'elderly': return 'bg-[#ffe4e6] text-[#c26257]';
      case 'environmentalist': return 'bg-[#acd0a2] text-[#3e5f4c]';
      case 'government': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getSelectedBorder = (id: string) => {
    if (selectedRoleId !== id) return 'border-2 border-[#1f1d1b]';
    switch (id) {
      case 'resident': return 'border-4 border-rose-500 ring-4 ring-rose-200';
      case 'shop_owner': return 'border-4 border-amber-500 ring-4 ring-amber-200';
      case 'commuter': return 'border-4 border-blue-500 ring-4 ring-blue-200';
      case 'elderly': return 'border-4 border-pink-400 ring-4 ring-pink-100';
      case 'environmentalist': return 'border-4 border-emerald-500 ring-4 ring-emerald-200';
      case 'government': return 'border-4 border-slate-600 ring-4 ring-slate-200';
      default: return 'border-4 border-black';
    }
  };

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const handleConfirm = () => {
    if (selectedRoleId) {
      onRoleSelect(selectedRoleId);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[var(--color-bg-warm)] h-full overflow-hidden justify-center items-center">
      <div className="w-full h-full max-w-7xl bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 md:p-8 shadow-flat-pop-lg relative flex flex-col justify-between overflow-hidden text-left">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-3 border-b-3 border-[#1f1d1b] pb-2.5 shrink-0">
          <span className="px-3.5 py-1 bg-blob-pink border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 PHASE 1 : 登記市民協商代表 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">登記步聚：1 / 2 頁</span>
        </div>

        {/* Title Block */}
        <div className="shrink-0 mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-[#1f1d1b] font-serif flex items-center gap-2">
            <Sparkles className="text-[var(--color-brand-yellow)]" />
            選擇您的協商代表角色
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed font-sans">
            請選擇一個市民代表身分。您將進入綠園道收集與該代表利益相關的市民觀點，並在大會中展開對話與策略修訂。
          </p>
        </div>

        {/* Grid of Six Character Cards */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 my-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pb-4">
            {roles.map(r => {
              const isSelected = selectedRoleId === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`bg-white rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[360px] relative hover:scale-[1.03] shadow-flat-pop overflow-hidden ${getSelectedBorder(r.id)}`}
                >
                  {/* Selected Indicator Checkmark Bubble */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1 border-2 border-[#1f1d1b] z-20 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}

                  {/* Character Illustration Header */}
                  <div className={`h-40 flex items-center justify-center border-b-2 border-[#1f1d1b] p-3 relative overflow-hidden ${getBlobBgClass(r.id)}`}>
                    <img
                      src={r.id === 'shop_owner' ? '/char_shopowner.png' : `/char_${r.id}.png`}
                      alt={r.name}
                      className="h-full object-contain drop-shadow-[2.5px_2.5px_0px_rgba(0,0,0,0.15)] pointer-events-none select-none"
                    />
                  </div>

                  {/* Character Meta Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getRoleBadgeStyle(r.id)}`}>
                          {r.name}
                        </span>
                      </div>
                      
                      {/* Quote */}
                      <p className="text-[10px] font-semibold text-gray-700 italic leading-relaxed font-serif mb-3 border-l-2 border-gray-300 pl-2">
                        {r.quote}
                      </p>
                    </div>

                    {/* Core Values and Concerns */}
                    <div className="space-y-2 border-t border-dashed border-gray-200 pt-2.5">
                      <div>
                        <span className="text-[8px] font-bold text-gray-400 block mb-0.5">🌿 核心價值 / VALUES</span>
                        <div className="flex flex-wrap gap-1">
                          {r.coreValues.split('、').map((val, idx) => (
                            <span key={idx} className="bg-gray-100 px-1 py-0.2 rounded text-[7.5px] font-bold text-gray-600 border border-gray-200">
                              {val.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Role Description Banner & Confirmation Button */}
        <div className="shrink-0 border-t-3 border-[#1f1d1b] pt-4 mt-2 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1 text-left min-h-[44px]">
            {selectedRole ? (
              <div className="animate-fade-in flex gap-3 items-center">
                <div className={`w-9 h-9 rounded-full border-2 border-[#1f1d1b] flex items-center justify-center overflow-hidden shrink-0 ${
                  selectedRole.id === 'resident' ? 'bg-blob-pink' :
                  selectedRole.id === 'shop_owner' ? 'bg-blob-yellow' :
                  selectedRole.id === 'commuter' ? 'bg-blob-blue' :
                  selectedRole.id === 'elderly' ? 'bg-blob-pink' :
                  selectedRole.id === 'environmentalist' ? 'bg-blob-green' : 'bg-gray-200'
                }`}>
                  <img
                    src={
                      selectedRole.id === 'resident' ? '/avatar_resident.png' :
                      selectedRole.id === 'shop_owner' ? '/avatar_shopowner.png' :
                      selectedRole.id === 'commuter' ? '/avatar_commuter.png' :
                      selectedRole.id === 'elderly' ? '/avatar_elderly.png' :
                      selectedRole.id === 'environmentalist' ? '/avatar_environmentalist.png' :
                      '/avatar_government.png'
                    }
                    alt={selectedRole.name}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1f1d1b]">您已選定代表身份：【{selectedRole.name}】</h4>
                  <p className="text-[10px] text-gray-500 leading-normal font-sans">
                    關注焦點：{selectedRole.mainConcerns}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs font-sans text-gray-400 flex items-center gap-1.5 py-2">
                <HelpCircle size={14} />
                <span>請點選上方卡片登記代表身分。</span>
              </div>
            )}
          </div>
          
          <button
            disabled={!selectedRoleId}
            onClick={handleConfirm}
            className={`w-full md:w-auto btn-flat-action px-8 py-3 bg-[var(--color-brand-green)] text-white rounded-xl text-xs flex items-center justify-center gap-2 font-bold shadow-flat-pop ${
              selectedRoleId 
                ? 'cursor-pointer hover:bg-[#a6bf4c]' 
                : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed shadow-none hover:transform-none'
            }`}
          >
            登記身分，進入綠園道 ➔
          </button>
        </div>

      </div>
    </div>
  );
};
