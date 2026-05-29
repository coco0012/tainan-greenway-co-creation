import React from 'react';
import { Effect } from '@/data/missionData';
import { StakeholderRole } from '@/data/roles';
import { strategyResults } from '@/data/strategyResults';
import { calculateStrategy } from '@/lib/gameLogic';

interface FinalResultProps {
  scores: Effect;
  playerRole: StakeholderRole;
  spatialActions: string[];
  onRestart: () => void;
}

export const FinalResult: React.FC<FinalResultProps> = ({ 
  scores, 
  playerRole, 
  spatialActions, 
  onRestart 
}) => {
  const strategyKey = calculateStrategy(scores) as keyof typeof strategyResults;
  const strategy = strategyResults[strategyKey] || strategyResults.balanced;

  return (
    <div className="flex-1 flex flex-col items-center p-8 bg-dot-grid h-full overflow-y-auto">
      <div className="relative max-w-4xl w-full bg-white border-arch p-10 bg-opacity-95 text-left">
        {/* Corner Crosshairs */}
        <div className="absolute -top-2.5 -left-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -top-2.5 -right-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -bottom-3 -left-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -bottom-3 -right-2 text-md font-mono text-gray-500 select-none">+</div>

        {/* Blueprint Stamp Effect in Corner */}
        <div className="absolute top-8 right-8 border-2 border-dashed border-[var(--color-brand-coral)] p-2 text-[var(--color-brand-coral)] font-mono text-[9px] font-bold uppercase select-none tracking-widest rotate-6">
          [ 草案備忘錄 // 審查核可 ]
        </div>

        {/* Header Block */}
        <div className="flex justify-between items-center mb-6 border-b border-black pb-2">
          <span className="anno-label text-gray-500 font-semibold">[ 公文編號：TN-GW-2026-FINAL ]</span>
          <span className="anno-label text-gray-500 font-semibold">[ 審定日期：2026-05-29 ]</span>
        </div>

        <div className="uppercase tracking-widest text-[10px] font-mono text-[var(--color-brand-coral)] font-bold mb-2">
          台南綠園道公民協商備忘錄
        </div>
        <h1 className="text-3xl font-extrabold mb-6 uppercase text-black">{strategy.title}</h1>
        
        <div className="mb-10 p-6 bg-gray-50 border border-black text-gray-800 leading-relaxed text-sm font-medium">
          <span className="font-mono text-xs text-gray-500 block mb-1 uppercase">[ 空間規劃大綱 ]</span>
          {strategy.summary}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          
          {/* Spatial Actions List */}
          <div>
            <h3 className="text-sm font-bold font-mono uppercase text-gray-500 mb-4 pb-1.5 border-b border-gray-300">
              [ 審定空間變更項目 ]
            </h3>
            <ul className="space-y-3 font-sans text-xs">
              {spatialActions.map((action, index) => (
                <li key={index} className="flex items-start text-gray-800 font-medium">
                  <span className="font-mono text-[var(--color-brand-blue)] mr-3 shrink-0 select-none font-bold">
                    [✓]
                  </span>
                  <span>{action}</span>
                </li>
              ))}
              {spatialActions.length === 0 && (
                <li className="text-gray-500 italic font-mono">[ 無變更策略項目 ]</li>
              )}
            </ul>
          </div>

          {/* Final Indicators */}
          <div>
            <h3 className="text-sm font-bold font-mono uppercase text-gray-500 mb-4 pb-1.5 border-b border-gray-300">
              [ 最終空間績效指標評估 ]
            </h3>
            <div className="space-y-4">
              {Object.entries(scores).map(([key, value]) => {
                let barColor = 'bg-gray-400';
                let labelZh = key;
                if (key === 'residential') { barColor = 'bg-[var(--color-brand-coral)]'; labelZh = '居住舒適'; }
                else if (key === 'mobility') { barColor = 'bg-[var(--color-brand-blue)]'; labelZh = '交通效率'; }
                else if (key === 'ecological') { barColor = 'bg-[var(--color-brand-green)]'; labelZh = '生態棲地'; }
                else if (key === 'commercial') { barColor = 'bg-[#e59d85]'; labelZh = '商業活力'; }
                else if (key === 'cultural') { barColor = 'bg-[#a39485]'; labelZh = '歷史記憶'; }

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="capitalize font-mono text-[10px] text-gray-700">{labelZh}</span>
                      <span className="font-mono font-bold bg-gray-100 border border-gray-300 px-1">{value}</span>
                    </div>
                    {/* Progress Track */}
                    <div className="relative h-3 w-full bg-gray-50 border border-black">
                      <div 
                        className={`h-full ${barColor} border-r border-black`}
                        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                      />
                      <div className="absolute inset-0 flex justify-between px-1 text-[7px] font-mono text-gray-400 pointer-events-none select-none items-center mix-blend-difference">
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Civic Panels Signatures Block */}
        <div className="border-t border-dashed border-gray-300 pt-6 mb-10">
          <div className="anno-label text-gray-500 mb-4 font-semibold">[ 協商小組代表聯署 ]</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-[10px] text-gray-600">
            <div>
              <p className="mb-4">公民共創代表簽署 (玩家)：</p>
              <div className="border-b border-black w-3/4 pb-1 italic font-sans font-semibold text-black">
                {playerRole?.name} (您)
              </div>
            </div>
            <div>
              <p className="mb-4">AI 模擬規劃師代表簽署：</p>
              <div className="border-b border-dashed border-gray-400 w-3/4 pb-1 text-gray-400 italic">
                AI 代理人已聯署
              </div>
            </div>
            <div>
              <p className="mb-4">市府景觀委員會代表簽署：</p>
              <div className="border-b border-dashed border-gray-400 w-3/4 pb-1 text-gray-400 italic">
                景觀審查委員會
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-black pt-8">
          <div className="font-mono text-[9px] text-gray-500 uppercase">
            [ 狀態：協商完成，已將空間配置傳送至都市計畫委員會 ]
          </div>
          
          <button 
            onClick={onRestart}
            className="border-arch hover:bg-[var(--color-brand-blue)] hover:text-white text-black bg-white px-8 py-3 font-mono text-sm tracking-wider uppercase font-bold transition-all duration-150 cursor-pointer active:translate-y-[1px]"
          >
            開始新的空間協商
          </button>
        </div>
        
      </div>
    </div>
  );
};

