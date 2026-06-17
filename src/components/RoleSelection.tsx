import React, { useState } from 'react';
import { roles, StakeholderRole } from '@/data/roles';
import { Sparkles, HelpCircle, Check, ShieldAlert } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (roleId: string) => void;
}

interface FocusStat {
  label: string;
  value: number;
  color: string;
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
      case 'resident': return 'bg-[#fbc4c6] text-[#b2574e] border-[#b2574e]';
      case 'shop_owner': return 'bg-[#faf0d8] text-[#b37a3c] border-[#b37a3c]';
      case 'commuter': return 'bg-[#c7dce7] text-[#4a6b82] border-[#4a6b82]';
      case 'elderly': return 'bg-[#ffe4e6] text-[#c26257] border-[#c26257]';
      case 'environmentalist': return 'bg-[#acd0a2] text-[#3e5f4c] border-[#3e5f4c]';
      case 'government': return 'bg-gray-200 text-gray-700 border-gray-400';
      default: return 'bg-gray-200 text-gray-700 border-gray-400';
    }
  };

  const getSelectedBorder = (id: string) => {
    if (selectedRoleId !== id) return 'border-3 border-[#1f1d1b]';
    switch (id) {
      case 'resident': return 'border-4 border-rose-500 ring-4 ring-rose-200 scale-[1.02]';
      case 'shop_owner': return 'border-4 border-amber-500 ring-4 ring-amber-200 scale-[1.02]';
      case 'commuter': return 'border-4 border-blue-500 ring-4 ring-blue-200 scale-[1.02]';
      case 'elderly': return 'border-4 border-pink-400 ring-4 ring-pink-100 scale-[1.02]';
      case 'environmentalist': return 'border-4 border-emerald-500 ring-4 ring-emerald-200 scale-[1.02]';
      case 'government': return 'border-4 border-slate-600 ring-4 ring-slate-200 scale-[1.02]';
      default: return 'border-4 border-black';
    }
  };

  // Get focus statistics for each role to render progress bars
  const getRoleFocusStats = (id: string): FocusStat[] => {
    switch (id) {
      case 'resident':
        return [
          { label: '🔇 寧靜生活', value: 90, color: 'bg-rose-400' },
          { label: '🚦 安全防護', value: 70, color: 'bg-blue-400' },
          { label: '🌳 大樹遮蔭', value: 40, color: 'bg-emerald-400' }
        ];
      case 'shop_owner':
        return [
          { label: '🛍️ 商業活動', value: 85, color: 'bg-amber-400' },
          { label: '🚶 停留人流', value: 90, color: 'bg-orange-400' },
          { label: '🔇 寧靜生活', value: 20, color: 'bg-rose-300' }
        ];
      case 'commuter':
        return [
          { label: '🚲 通行效率', value: 95, color: 'bg-sky-400' },
          { label: '🚦 安全騎行', value: 80, color: 'bg-blue-400' },
          { label: '🌳 大樹遮蔭', value: 30, color: 'bg-emerald-300' }
        ];
      case 'elderly':
        return [
          { label: '🌳 散步遮蔭', value: 95, color: 'bg-emerald-500' },
          { label: '🛋️ 充足座椅', value: 90, color: 'bg-amber-400' },
          { label: '🚦 無障礙安全', value: 85, color: 'bg-blue-400' }
        ];
      case 'environmentalist':
        return [
          { label: '🌿 生態降溫', value: 95, color: 'bg-emerald-500' },
          { label: '🌧️ 海綿保水', value: 90, color: 'bg-teal-400' },
          { label: '🔇 降低熱島', value: 80, color: 'bg-green-400' }
        ];
      case 'government':
        return [
          { label: '🏗️ 都市縫合', value: 80, color: 'bg-slate-500' },
          { label: '💵 財政預算', value: 75, color: 'bg-amber-500' },
          { label: '⚖️ 利益均衡', value: 85, color: 'bg-purple-400' }
        ];
      default:
        return [];
    }
  };

  const getStartingStatModifiers = (id: string) => {
    switch (id) {
      case 'resident':
        return '居民滿意度 +20, 安全感 +10, 活動活力 -10, 衝突值 +5';
      case 'shop_owner':
        return '商家滿意度 +20, 活動活力 +15, 居民滿意度 -10, 衝突值 +5';
      case 'commuter':
        return '通勤效率 +20, 安全感 +10, 生態分數 -10';
      case 'elderly':
        return '安全感 +15, 居民滿意度 +10, 通勤效率 -10';
      case 'environmentalist':
        return '生態分數 +25, 居民滿意度 +5, 商家滿意度 -10, 衝突值 +10';
      case 'government':
        return '各滿意度/指標 +10, 衝突值 -15 (平衡加成)';
      default:
        return '';
    }
  };

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const handleConfirm = () => {
    if (selectedRoleId) {
      onRoleSelect(selectedRoleId);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[var(--color-bg-warm)] h-full overflow-hidden justify-center items-center font-sans">
      <div className="w-full h-full max-w-7xl bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 md:p-8 shadow-flat-pop-lg relative flex flex-col justify-between overflow-hidden text-left">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-3 border-b-3 border-[#1f1d1b] pb-2.5 shrink-0">
          <span className="px-3 py-0.5 bg-red-100 border-2 border-[#1f1d1b] text-red-800 text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono tracking-wider">
            【 PHASE 1 : 登記市民協商代表身分 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">進度：選擇代表角色</span>
        </div>

        {/* Title Block */}
        <div className="shrink-0 mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-[#1f1d1b] font-serif flex items-center gap-2">
            <Sparkles className="text-[var(--color-brand-yellow)]" />
            選擇您的協商代表角色
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed font-semibold">
            不同的協商代表具有不同的關注焦點（Focus Stats）與起始數值偏置。這將影響您的初始指標配置與溝通優勢。
          </p>
        </div>

        {/* Grid of Six Character Cards */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 my-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pb-4">
            {roles.map(r => {
              const isSelected = selectedRoleId === r.id;
              const focusStats = getRoleFocusStats(r.id);
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`bg-[#FCFAF2] rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[380px] relative hover:scale-[1.03] shadow-flat-pop overflow-hidden ${getSelectedBorder(r.id)}`}
                >
                  {/* Selected Indicator Checkmark Bubble */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1 border-2 border-[#1f1d1b] z-20 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  {/* Character Illustration Header */}
                  <div className={`h-32 flex items-center justify-center border-b-2 border-[#1f1d1b] p-2 relative overflow-hidden ${getBlobBgClass(r.id)}`}>
                    <img
                      src={r.id === 'shop_owner' ? '/char_shopowner.png' : `/char_${r.id}.png`}
                      alt={r.name}
                      className="h-[90%] object-contain drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)] pointer-events-none select-none"
                    />
                  </div>

                  {/* Character Meta Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`px-2 py-0.5 border-2 rounded text-[9px] font-extrabold uppercase tracking-wider ${getRoleBadgeStyle(r.id)}`}>
                          {r.name}
                        </span>
                      </div>
                      
                      {/* Quote */}
                      <p className="text-[9.5px] font-semibold text-gray-700 italic leading-relaxed font-serif mb-3 border-l-2 border-gray-400 pl-2">
                        {r.quote}
                      </p>
                    </div>

                    {/* Core Focus Stats Progress Bars */}
                    <div className="space-y-2 border-t border-dashed border-gray-300 pt-2">
                      <span className="text-[8px] font-bold text-gray-400 block tracking-wider">📊 核心關注權重 // FOCUS WEIGHTS</span>
                      <div className="space-y-1.5">
                        {focusStats.map((stat, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex justify-between text-[8px] font-bold text-gray-600">
                              <span>{stat.label}</span>
                              <span>{stat.value}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 border border-black rounded-sm overflow-hidden">
                              <div className={`h-full ${stat.color}`} style={{ width: `${stat.value}%` }} />
                            </div>
                          </div>
                        ))}
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
                <div className={`w-10 h-10 rounded-full border-2 border-[#1f1d1b] flex items-center justify-center overflow-hidden shrink-0 ${
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
                  <h4 className="text-xs font-bold text-[#1f1d1b] flex items-center gap-1">
                    您已選定協調角色身分：【{selectedRole.name}】
                    <span className="text-[9px] font-normal text-rose-500 bg-rose-50 border border-rose-200 px-1 py-0.2 rounded font-sans">
                      {selectedRole.mainConcerns}
                    </span>
                  </h4>
                  <p className="text-[10px] font-semibold text-gray-500 leading-normal font-sans flex items-center gap-1">
                    <ShieldAlert size={11} className="text-red-500" />
                    起始數值加成影響：{getStartingStatModifiers(selectedRole.id)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs font-sans text-gray-400 flex items-center gap-1.5 py-2 font-semibold">
                <HelpCircle size={14} />
                <span>請點選上方市民卡片登記您的協商代表身分。</span>
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
            確認登記，進入綠園道地圖 ➔
          </button>
        </div>

      </div>
    </div>
  );
};
