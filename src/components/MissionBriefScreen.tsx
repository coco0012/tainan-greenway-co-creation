import React from 'react';
import { StakeholderRole } from '@/data/roles';
import { Sparkles, ArrowRight, AlertTriangle, Shield, Award, Users } from 'lucide-react';

interface MissionBriefScreenProps {
  playerRole: StakeholderRole;
  onStartNegotiation: () => void;
}

export const MissionBriefScreen: React.FC<MissionBriefScreenProps> = ({ playerRole, onStartNegotiation }) => {
  return (
    <div className="flex-1 flex flex-col p-0 bg-[var(--color-bg-warm)] h-full overflow-hidden justify-center items-center">
      <div className="max-w-4xl w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 md:p-8 shadow-flat-pop-lg relative flex flex-col justify-between min-h-[540px] md:min-h-[580px] overflow-hidden text-left">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-4 border-b-3 border-[#1f1d1b] pb-3 shrink-0">
          <span className="px-3 py-1 bg-blob-yellow border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 PHASE 4 : 規劃協商會議簡報 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">當前登記身份：{playerRole.name}</span>
        </div>

        {/* Introduction */}
        <div className="shrink-0 mb-5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f1d1b] font-serif mb-2 flex items-center gap-2">
            <AlertTriangle className="text-red-500 w-7 h-7" />
            協商任務簡報：高架自行車道變更案
          </h1>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans font-medium bg-gray-50 border border-gray-200 p-4 rounded-xl">
            實地踏查已經結束，市民代表圓桌大會即將召開！本次會議的核心焦點是：**「台南鐵路地下化後的綠園道，是否應規劃連續高架自行車道？」**。
            您將代表 **{playerRole.name}** 出席協商。請特別注意以下三大核心價值拉鋸：
          </p>
        </div>

        {/* 3 Main Conflicts cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch my-2 overflow-y-auto pr-1">
          
          {/* Card 1 */}
          <div className="bg-blob-pink/30 border-3 border-[#1f1d1b] rounded-xl p-4 shadow-flat-pop flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="px-2 py-0.5 bg-white border border-[#1f1d1b] rounded text-[8px] font-mono font-bold text-rose-600">CONFLICT 01</span>
              </div>
              <h3 className="text-sm font-extrabold text-[#1f1d1b] font-serif mb-2">交通通勤 vs 住宅隱私</h3>
              <p className="text-[10.5px] leading-relaxed text-gray-600 font-sans">
                騎士希望能有完全連續的高架自行車道以維持高速騎行；但緊鄰住宅區段二樓露台與民房窗戶過近，恐帶來嚴重的隱私干擾與壓迫感。
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-dashed border-[#1f1d1b]/20 text-[9px] font-mono font-bold text-rose-700">
              ⚖️ 指標權衡：交通效率 ↔ 居住舒適
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-blob-yellow/30 border-3 border-[#1f1d1b] rounded-xl p-4 shadow-flat-pop flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="px-2 py-0.5 bg-white border border-[#1f1d1b] rounded text-[8px] font-mono font-bold text-amber-600">CONFLICT 02</span>
              </div>
              <h3 className="text-sm font-extrabold text-[#1f1d1b] font-serif mb-2">街區商業 vs 快速通過</h3>
              <p className="text-[10.5px] leading-relaxed text-gray-600 font-sans">
                將車道高架化能避免平面人車衝突；但這會使自行車騎士直接飛越過境，導致地面傳統店家與餐飲業流失客源。
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-dashed border-[#1f1d1b]/20 text-[9px] font-mono font-bold text-amber-700">
              ⚖️ 指標權衡：商業活力 ↔ 交通效率
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-blob-green/30 border-3 border-[#1f1d1b] rounded-xl p-4 shadow-flat-pop flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="px-2 py-0.5 bg-white border border-[#1f1d1b] rounded text-[8px] font-mono font-bold text-emerald-600">CONFLICT 03</span>
              </div>
              <h3 className="text-sm font-extrabold text-[#1f1d1b] font-serif mb-2">生態降溫 vs 水泥硬體</h3>
              <p className="text-[10.5px] leading-relaxed text-gray-600 font-sans">
                全線鋪設高強度硬質鋪面有利於集慶活動與快速騎行；但在酷熱的台南，若缺乏大面積造林、綠蔭與雨水花園，熱島效應將令人卻步。
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-dashed border-[#1f1d1b]/20 text-[9px] font-mono font-bold text-emerald-700">
              ⚖️ 指標權衡：生態棲地 ↔ 水泥鋪面
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t-3 border-[#1f1d1b] pt-5 mt-4 shrink-0">
          <div className="text-[10.5px] font-semibold text-gray-500 font-sans flex items-center gap-1">
            <Users size={14} className="text-[var(--color-brand-blue)]" />
            <span>您已收集好踏查資料，做好代表協商的準備。</span>
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
