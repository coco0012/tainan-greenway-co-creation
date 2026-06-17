import React from 'react';
import { StakeholderRole } from '@/data/roles';
import { Sparkles, ArrowRight, AlertTriangle, Shield, Award, Users, CheckCircle } from 'lucide-react';

interface MissionBriefScreenProps {
  playerRole: StakeholderRole;
  collectedInsights: string[]; // Pass collected insights cards from Phase 2
  onStartNegotiation: () => void;
}

export const MissionBriefScreen: React.FC<MissionBriefScreenProps> = ({ 
  playerRole, 
  collectedInsights, 
  onStartNegotiation 
}) => {
  // Parse insights from string format "CardName的觀點：Summary"
  const parsedCards = collectedInsights.map(insight => {
    const parts = insight.split('的觀點：');
    return {
      title: parts[0] || '公民觀點卡',
      text: parts[1] || insight
    };
  });

  return (
    <div className="flex-1 flex flex-col p-0 bg-[var(--color-bg-warm)] h-full overflow-hidden justify-center items-center">
      <div className="max-w-4xl w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 md:p-8 shadow-flat-pop-lg relative flex flex-col justify-between min-h-[540px] md:min-h-[580px] overflow-hidden text-left">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-4 border-b-3 border-[#1f1d1b] pb-3 shrink-0">
          <span className="px-3 py-1 bg-blob-yellow border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 PHASE 5 : 協商任務簡報與卡牌審查 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">當前代表身份：{playerRole.name}</span>
        </div>

        {/* Introduction */}
        <div className="shrink-0 mb-4">
          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded text-[9px] font-bold uppercase tracking-wider block w-max mb-1.5">
            MISSION UNLOCKED / 協商任務解鎖
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f1d1b] font-serif mb-2 flex items-center gap-2">
            <AlertTriangle className="text-red-500 w-7 h-7" />
            Mission 01：台南綠園道是否應包含連續高架自行車道？
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed font-sans font-medium bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
            實地踏查任務完成！您已解鎖協商大會。在即將召開的市民圓桌大會中，各方代表將針對高架陸橋、地面慢行與綠牆遮蔽對策展開交鋒。您收集到的公民觀點卡將做為本次協商的關鍵證據！
          </p>
        </div>

        {/* Collected Insights Evidence Section */}
        <div className="shrink-0 mb-4 bg-[#FAF8F5] border-2 border-[#1f1d1b] p-3.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[9.5px] font-mono font-bold text-gray-400 block mb-2 uppercase">
            [ 💡 您收集的公民觀點證據 / UNLOCKED CIVIC EVIDENCE ]
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-36 overflow-y-auto pr-1">
            {parsedCards.map((card, idx) => (
              <div key={idx} className="bg-white border-2 border-[#1f1d1b] p-2 rounded-lg flex gap-2 items-start shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-left">
                  <h5 className="text-[9px] font-extrabold text-[#1f1d1b]">{card.title}</h5>
                  <p className="text-[8.5px] text-gray-500 leading-normal line-clamp-2 mt-0.5">&quot;{card.text}&quot;</p>
                </div>
              </div>
            ))}
            {parsedCards.length === 0 && (
              <div className="text-gray-400 text-[10px] italic p-2 col-span-3 text-center">
                未攜帶任何觀點卡。
              </div>
            )}
          </div>
        </div>

        {/* Three Conflicts cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch my-1 overflow-y-auto pr-1">
          
          {/* Card 1 */}
          <div className="bg-blob-pink/20 border-2 border-[#1f1d1b] rounded-xl p-3.5 shadow-flat-pop flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-2 py-0.5 bg-white border border-[#1f1d1b] rounded text-[7.5px] font-mono font-bold text-rose-600">CONFLICT 01</span>
              </div>
              <h3 className="text-[12.5px] font-extrabold text-[#1f1d1b] font-serif mb-1.5">通勤時效 vs 居住隱私</h3>
              <p className="text-[10px] leading-relaxed text-gray-600 font-sans">
                自行車通勤族追求高架無中斷的高速連續路網；然而高架橋過於貼近住宅二樓陽台，將對沿線住戶的生活私密性與夜間噪音安寧造成直接侵犯。
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-dashed border-[#1f1d1b]/20 text-[8.5px] font-mono font-bold text-rose-700">
              ⚖️ 權衡：交通效率 ↔ 居住舒適
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-blob-yellow/20 border-2 border-[#1f1d1b] rounded-xl p-3.5 shadow-flat-pop flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-2 py-0.5 bg-white border border-[#1f1d1b] rounded text-[7.5px] font-mono font-bold text-amber-600">CONFLICT 02</span>
              </div>
              <h3 className="text-[12.5px] font-extrabold text-[#1f1d1b] font-serif mb-1.5">商業活力 vs 快速通過</h3>
              <p className="text-[10px] leading-relaxed text-gray-600 font-sans">
                高架化設計雖然避開了十字路口的安全交織，但同時會使大量騎行人口以高速「飛越」商業街區，使地面沿線的傳統店面商圈流失人潮。
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-dashed border-[#1f1d1b]/20 text-[8.5px] font-mono font-bold text-amber-700">
              ⚖️ 權衡：商業活力 ↔ 交通效率
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-blob-green/20 border-2 border-[#1f1d1b] rounded-xl p-3.5 shadow-flat-pop flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-2 py-0.5 bg-white border border-[#1f1d1b] rounded text-[7.5px] font-mono font-bold text-emerald-600">CONFLICT 03</span>
              </div>
              <h3 className="text-[12.5px] font-extrabold text-[#1f1d1b] font-serif mb-1.5">生態舒適 vs 水泥硬質基礎設施</h3>
              <p className="text-[10px] leading-relaxed text-gray-600 font-sans">
                鋪設水泥硬路面以求通勤與集散活動便利；但在酷熱的台南，若缺乏連續複層林蔭冠層、透水土壤鋪面與雨水花園，熱島效應將阻礙市民休閒。
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-dashed border-[#1f1d1b]/20 text-[8.5px] font-mono font-bold text-emerald-700">
              ⚖️ 權衡：生態棲地 ↔ 水泥鋪面
            </div>
          </div>

        </div>

        {/* Source Note Label */}
        <div className="text-[8.5px] text-gray-400 font-mono select-none text-left mt-2 border-t border-dashed border-gray-200 pt-2 shrink-0">
          <span>⚠️ 依官方公開資訊整理之原型資料 / Source-informed prototype data</span>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t-3 border-[#1f1d1b] pt-4 mt-2 shrink-0">
          <div className="text-[10.5px] font-semibold text-gray-500 font-sans flex items-center gap-1">
            <Users size={14} className="text-[var(--color-brand-blue)]" />
            <span>您已收集好踏查觀點卡，做好代表協商的準備。</span>
          </div>
          
          <button 
            onClick={onStartNegotiation}
            className="w-full sm:w-auto btn-flat-action px-8 py-3 bg-[var(--color-brand-green)] hover:bg-[#a6bf4c] text-white rounded-xl text-xs flex items-center justify-center gap-2 shadow-flat-pop font-bold"
          >
            開啟市民圓桌協商會議 <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
