import React from 'react';
import { Effect } from '@/data/missionData';
import { StakeholderRole } from '@/data/roles';
import { User, Activity, Award } from 'lucide-react';

interface CivicIndicatorsProps {
  scores: Effect;
  playerRole: StakeholderRole;
}

export const CivicIndicators: React.FC<CivicIndicatorsProps> = ({ scores, playerRole }) => {
  const indicators = [
    { key: 'residential', label: '居住舒適', value: scores.residential, color: 'bg-[var(--color-brand-coral)]' },
    { key: 'commercial', label: '商業活力', value: scores.commercial, color: 'bg-amber-400' },
    { key: 'mobility', label: '交通效率', value: scores.mobility, color: 'bg-[var(--color-brand-blue)]' },
    { key: 'ecological', label: '生態棲地', value: scores.ecological, color: 'bg-[var(--color-brand-green)]' },
    { key: 'cultural', label: '歷史記憶', value: scores.cultural, color: 'bg-stone-400' },
  ];

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
    if (maxVal - minVal <= 10) return '多元平衡';

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
      <div className="bg-[#FAF8F5] border border-[#e8e5e0] rounded-3xl p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-3">
          <Award size={16} className="text-[var(--color-brand-coral)]" />
          <span className="text-xs font-bold text-gray-500 font-sans">我的身分卡</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[var(--color-brand-coral)] font-bold shadow-sm shrink-0">
            {playerRole?.name?.[0]}
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-mono">[ 當前代表代表市民 ]</div>
            <div className="font-extrabold text-sm text-gray-800">{playerRole?.name}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center text-[10px] text-gray-500 font-mono">
          <span>規劃傾向：</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[var(--color-brand-green)] font-bold">
            {getPlanningTendency()}
          </span>
        </div>
      </div>

      {/* Evaluation Indicators Card */}
      <div className="bg-[#FAF8F5] border border-[#e8e5e0] rounded-3xl p-5 shadow-soft flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-5 border-b border-gray-200 pb-3 shrink-0">
          <Activity size={16} className="text-[var(--color-brand-blue)]" />
          <span className="text-xs font-bold text-gray-500 font-sans">綠園道都市指標評估</span>
        </div>
        
        <div className="space-y-5 flex-1 overflow-y-auto pr-1">
          {indicators.map((indicator) => {
            // Calculate change from baseline of 50
            const change = indicator.value - 50;

            return (
              <div key={indicator.key} className="space-y-1">
                {/* Metric Title and Value */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">{indicator.label}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-gray-800">{indicator.value}</span>
                    {change > 0 && (
                      <span className="text-[10px] font-bold text-green-600">
                        (+{change})
                      </span>
                    )}
                    {change < 0 && (
                      <span className="text-[10px] font-bold text-rose-500">
                        ({change})
                      </span>
                    )}
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="h-3 w-full bg-gray-200/50 rounded-full overflow-hidden border border-gray-100/50">
                  <div 
                    className={`h-full ${indicator.color} rounded-full transition-all duration-300`}
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

