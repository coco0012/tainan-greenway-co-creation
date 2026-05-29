import React from 'react';
import { Effect } from '@/data/missionData';
import { StakeholderRole } from '@/data/roles';
import { User, Users } from 'lucide-react';

interface CivicIndicatorsProps {
  scores: Effect;
  playerRole: StakeholderRole;
}

export const CivicIndicators: React.FC<CivicIndicatorsProps> = ({ scores, playerRole }) => {
  const indicators = [
    { key: 'residential', label: 'Residential Comfort (居住舒適)', value: scores.residential, color: 'bg-[var(--color-brand-coral)]' },
    { key: 'commercial', label: 'Commercial Vitality (商業活力)', value: scores.commercial, color: 'bg-[#e59d85]' },
    { key: 'mobility', label: 'Mobility Efficiency (交通效率)', value: scores.mobility, color: 'bg-[var(--color-brand-blue)]' },
    { key: 'ecological', label: 'Ecological Comfort (生態棲地)', value: scores.ecological, color: 'bg-[var(--color-brand-green)]' },
    { key: 'cultural', label: 'Cultural Memory (歷史記憶)', value: scores.cultural, color: 'bg-[#a39485]' },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Stakeholder Status Card - Styled as a Planning Permit / Pass */}
      <div className="bg-white border-arch p-5 bg-opacity-95 relative">
        <div className="absolute top-0 right-0 font-mono text-[8px] bg-black text-white px-2 py-0.5 uppercase tracking-wider">
          規劃許可已核准
        </div>
        
        <h3 className="anno-label text-gray-500 mb-4 border-b border-black pb-1.5 font-bold">
          [ 協商小組登記：關係人身分憑證 ]
        </h3>
        
        <div className="mb-4">
          <div className="text-[10px] font-mono text-gray-500 mb-1 flex items-center gap-1.5 uppercase">
            <User size={12} className="text-black" /> 主角扮演身分
          </div>
          <div className="font-extrabold text-md text-black tracking-tight flex items-center gap-2">
            <span>{playerRole.name}</span>
            <span className="text-[9px] font-mono border border-black px-1 py-0.5 bg-gray-50">[已啟用]</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 pt-3">
          <div className="text-[10px] font-mono text-gray-500 mb-1 flex items-center gap-1.5 uppercase">
            <Users size={12} className="text-black" /> 模擬諮詢評審
          </div>
          <div className="text-xs text-gray-600 leading-relaxed font-mono">
            其餘利益關係人身分與言論均由 AI 規劃引擎模擬生成。
          </div>
        </div>
      </div>

      {/* Indicators Card - Styled as a Structural Evaluation Sheet */}
      <div className="bg-white border-arch p-5 flex-1 bg-opacity-95">
        <h3 className="anno-label text-gray-500 mb-6 border-b border-black pb-1.5 font-bold">
          [ 綠園道空間衝擊與民意指標評估 ]
        </h3>
        
        <div className="space-y-6">
          {indicators.map((indicator) => {
            const isDeficit = indicator.value < 35;
            const isOptimal = indicator.value > 70;

            return (
              <div key={indicator.key} className="space-y-1.5">
                {/* Metric Header */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-900 tracking-tight">{indicator.label}</span>
                  <div className="flex items-center gap-2">
                    {isDeficit && (
                      <span className="font-mono text-[8px] text-red-600 border border-red-600 px-1 py-0.2 bg-red-50 font-bold tracking-widest animate-pulse">
                        [指標偏低]
                      </span>
                    )}
                    {isOptimal && (
                      <span className="font-mono text-[8px] text-green-700 border border-green-700 px-1 py-0.2 bg-green-50 font-bold tracking-widest">
                        [最佳配置]
                      </span>
                    )}
                    <span className="font-mono font-bold text-sm bg-gray-100 border border-gray-300 px-1 text-black">{indicator.value}</span>
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="relative h-4 w-full bg-gray-50 border border-black">
                  <div 
                    className={`h-full ${indicator.color} border-r border-black transition-all duration-300`}
                    style={{ width: `${Math.max(0, Math.min(100, indicator.value))}%` }}
                  />
                  {/* Tick marker references */}
                  <div className="absolute inset-0 flex justify-between px-1 text-[8px] font-mono text-gray-400 pointer-events-none select-none items-center mix-blend-difference">
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                  </div>
                </div>

                {/* Meter Scale Label */}
                <div className="flex justify-between font-mono text-[8px] text-gray-400 select-none px-1">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

