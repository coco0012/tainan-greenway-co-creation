import React from 'react';
import { Effect } from '@/data/missionData';
import { StakeholderRole } from '@/data/roles';
import { Activity, Award } from 'lucide-react';

interface CivicIndicatorsProps {
  scores: Effect;
  playerRole: StakeholderRole;
}

export const CivicIndicators: React.FC<CivicIndicatorsProps> = ({ scores, playerRole }) => {
  const indicators = [
    { key: 'residential', label: '居住舒適', value: scores.residential, color: 'bg-[#d37b70]' },
    { key: 'commercial', label: '商業活力', value: scores.commercial, color: 'bg-[#e2a968]' },
    { key: 'mobility', label: '交通效率', value: scores.mobility, color: 'bg-[#6b8b9b]' },
    { key: 'ecological', label: '生態棲地', value: scores.ecological, color: 'bg-[#5a7a68]' },
    { key: 'cultural', label: '歷史記憶', value: scores.cultural, color: 'bg-stone-400' },
  ];

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

  // Helper to determine active planning tendency
  const getPlanningTendency = () => {
    const scoreEntries = Object.entries(scores);
    let maxVal = -Infinity;
    let maxKey = '';
    
    for (const [key, val] of scoreEntries) {
      if (val > maxVal) {
        maxVal = val;
        maxKey = key;
      }
    }
    
    const minVal = Math.min(...Object.values(scores));
    if (maxVal - minVal <= 10) return '多元均衡';

    switch (maxKey) {
      case 'residential': return '社區安寧優先';
      case 'commercial': return '街區經濟優先';
      case 'mobility': return '交通效率優先';
      case 'ecological': return '生態棲地優先';
      case 'cultural': return '歷史記憶優先';
      default: return '多元平衡';
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Player Status Card */}
      <div className="card-watercolor p-4 bg-[#FFFDF9] shadow-soft">
        <div className="flex items-center gap-2 mb-3.5 border-b border-[#e5dfd5] pb-2.5">
          <Award size={15} className="text-[var(--color-brand-coral)]" />
          <span className="text-[11px] font-bold text-gray-400 font-sans">我的身分認證</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 ${getBlobClass(playerRole.id)} ${getAvatarBgColor(playerRole.id)} flex items-center justify-center shrink-0 overflow-hidden border border-[#eee6db] shadow-soft-sm`}>
            <img 
              src={getRoleAvatar(playerRole.id)} 
              alt={playerRole.name}
              className="w-full h-full object-cover scale-110" 
            />
          </div>
          <div>
            <div className="text-[9px] text-gray-400 font-mono">[ 圓桌代表成員 ]</div>
            <div className="font-extrabold text-sm text-[var(--color-text-dark)] font-serif">{playerRole?.name}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-2.5 border-t border-dashed border-[#e5dfd5] flex justify-between items-center text-[10px] text-gray-500 font-sans">
          <span>規劃取向傾向：</span>
          <span className="px-2 py-0.5 rounded-md bg-[#e4efe8] border border-[#cfe2d7] text-[#3e5f4c] font-bold">
            {getPlanningTendency()}
          </span>
        </div>
      </div>

      {/* Evaluation Indicators Card */}
      <div className="card-watercolor p-4 bg-[#FFFDF9] shadow-soft flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b border-[#e5dfd5] pb-2.5 shrink-0">
          <Activity size={15} className="text-[var(--color-brand-blue)]" />
          <span className="text-[11px] font-bold text-gray-400 font-sans">綠園道各項衝擊指標評估</span>
        </div>
        
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {indicators.map((indicator) => {
            // Calculate change from baseline of 50
            const change = indicator.value - 50;

            return (
              <div key={indicator.key} className="space-y-1 font-sans">
                {/* Metric Title and Value */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">{indicator.label}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-[var(--color-text-dark)]">{indicator.value}</span>
                    {change > 0 && (
                      <span className="text-[9.5px] font-bold text-green-600 px-1 bg-green-50 border border-green-100 rounded">
                        +{change}
                      </span>
                    )}
                    {change < 0 && (
                      <span className="text-[9.5px] font-bold text-rose-500 px-1 bg-rose-50 border border-rose-100 rounded">
                        {change}
                      </span>
                    )}
                  </div>
                </div>

                {/* Brush-stroke-like progress track */}
                <div className="brush-progress-track h-3 w-full bg-[#f3ede3]/60">
                  <div 
                    className={`brush-progress-fill h-full ${indicator.color}`}
                    style={{ width: `${Math.max(0, Math.min(100, indicator.value))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
