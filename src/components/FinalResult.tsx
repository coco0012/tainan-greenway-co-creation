import React from 'react';
import { Effect } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { strategyResults } from '@/data/strategyResults';
import { calculateStrategy } from '@/lib/gameLogic';
import { CheckCircle, RefreshCw } from 'lucide-react';

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

  // Calculate average score for government
  const allScores = Object.values(scores);
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

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

  const getBlobBgClass = (id: string) => {
    switch (id) {
      case 'resident': return 'bg-blob-pink';
      case 'shop_owner': return 'bg-blob-yellow';
      case 'commuter': return 'bg-blob-blue';
      case 'elderly': return 'bg-blob-pink';
      case 'environmentalist': return 'bg-blob-green';
      case 'government': return 'bg-gray-200';
      default: return 'bg-gray-150';
    }
  };

  const getRoleSatisfaction = (roleId: string) => {
    let scoreVal = 50;
    switch (roleId) {
      case 'resident': scoreVal = scores.residential; break;
      case 'shop_owner': scoreVal = scores.commercial; break;
      case 'commuter': scoreVal = scores.mobility; break;
      case 'elderly': scoreVal = (scores.residential + scores.ecological) / 2; break;
      case 'environmentalist': scoreVal = scores.ecological; break;
      case 'government': scoreVal = avgScore; break;
    }

    if (scoreVal >= 60) return { emoji: '😊', text: '非常滿意', color: 'text-[#3e5f4c] bg-blob-green border-2 border-[#1f1d1b] shadow-[2px_2px_0px_0px_#1f1d1b]' };
    if (scoreVal >= 45) return { emoji: '😐', text: '可以接受', color: 'text-[#b37a3c] bg-blob-yellow border-2 border-[#1f1d1b] shadow-[2px_2px_0px_0px_#1f1d1b]' };
    return { emoji: '😞', text: '有些疑慮', color: 'text-[#c26257] bg-blob-pink border-2 border-[#1f1d1b] shadow-[2px_2px_0px_0px_#1f1d1b]' };
  };

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-8 md:p-10 shadow-flat-pop-lg text-left">
        
        {/* Memo header */}
        <div className="flex justify-between items-center mb-6 border-b-3 border-[#1f1d1b] pb-4">
          <span className="px-3.5 py-1 bg-blob-green border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] font-mono uppercase tracking-wider">
            【 審定空間策略：共創成果書 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">專案代號：Tainan Greenway Memo</span>
        </div>

        <div className="uppercase tracking-widest text-[10px] font-mono text-[var(--color-brand-coral)] font-bold mb-1.5">
          Civic Co-Creation Memo / 公民協商空間規劃成果
        </div>
        <h1 className="text-3xl font-extrabold mb-6 text-[#1f1d1b] title-memphis leading-tight">{strategy.title}</h1>
        
        {/* 2.5D Future City Vision Image */}
        <div className="w-full h-56 md:h-72 rounded-xl overflow-hidden border-3 border-[#1f1d1b] mb-8 shadow-flat-pop relative bg-blob-green">
          <img 
            src="/future_city_25d.png" 
            alt="未來台南綠園道2.5D想像圖" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 right-3 bg-white border-2 border-[#1f1d1b] px-3 py-1 rounded text-[10px] font-bold text-[#1f1d1b] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            🌿 未來綠園道 2.5D 規劃模擬想像圖
          </div>
        </div>

        {/* Strategy core description */}
        <div className="mb-8 p-6 bg-gray-50 border-3 border-[#1f1d1b] rounded-xl shadow-flat-pop text-[#1f1d1b] leading-relaxed text-sm">
          <span className="font-mono text-[10.5px] text-gray-400 block mb-2 font-bold uppercase">[ 規劃大綱與願景摘要 ]</span>
          {strategy.summary}
        </div>

        {/* Before / After comparison */}
        <div className="bg-white border-3 border-[#1f1d1b] rounded-xl p-5 mb-8 shadow-flat-pop">
          <h3 className="text-xs font-bold font-mono uppercase text-gray-400 mb-4">
            [ 空間策略前後對比 / BEFORE & AFTER COMPARISON ]
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-gray-150 border-2 border-gray-300">
              <span className="text-[10px] font-bold text-gray-400 font-mono block mb-1">最初設計提案 (Original Plan)</span>
              <h4 className="text-sm font-bold text-gray-700 mb-2 font-serif">單一高架自行車道 (快速過境)</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                全線鋪設高強度水泥硬質路幅，自行車道全面高架化，阻斷地面店鋪人潮客源，且高架橋過於貼近住宅二樓，造成居民隱私嚴重干擾，缺乏大樹遮陰。
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blob-green/20 border-2 border-[#1f1d1b]">
              <span className="text-[10px] font-bold text-[#5a7a68] font-mono block mb-1">公民共創協商提案 (Co-Created Plan)</span>
              <h4 className="text-sm font-bold text-[#3e5f4c] mb-2 font-serif">分段式多元縫合空間規劃</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                兼顧通勤效率與地區生活安寧。住宅區導入地面慢速道及防隱私隔板；商業區引導降至地面人行道活絡街區店面；並保留大面積林蔭與雨水花園。
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Spatial Actions Cards list */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-gray-400 mb-4 pb-2 border-b-2 border-[#1f1d1b]">
              [ 審定執行的空間策略 / APPROVED ACTIONS ]
            </h3>
            <div className="space-y-3">
              {spatialActions.map((action, index) => (
                <div key={index} className="bg-white p-3.5 rounded-xl border-2 border-[#1f1d1b] flex items-start gap-3 shadow-flat-pop">
                  <CheckCircle className="w-5 h-5 text-[var(--color-brand-green)] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-[#1f1d1b] leading-snug">{action}</span>
                </div>
              ))}
              {spatialActions.length === 0 && (
                <div className="text-gray-400 italic text-xs p-4 bg-white rounded-xl text-center border-2 border-dashed border-[#1f1d1b]">
                  無施作變更空間策略。
                </div>
              )}
            </div>
          </div>

          {/* Final Indicators */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-gray-400 mb-4 pb-2 border-b-2 border-[#1f1d1b]">
              [ 最終綠園道績效指標評估 / FINAL METRICS ]
            </h3>
            <div className="space-y-4 bg-white p-5 rounded-xl border-2 border-[#1f1d1b] shadow-flat-pop">
              {Object.entries(scores).map(([key, value]) => {
                let barColor = 'bg-gray-400';
                let labelZh = key;
                if (key === 'residential') { barColor = 'bg-[#d37b70]'; labelZh = '居住舒適'; }
                else if (key === 'commercial') { barColor = 'bg-[#e2a968]'; labelZh = '商業活力'; }
                else if (key === 'mobility') { barColor = 'bg-[#6b8b9b]'; labelZh = '交通效率'; }
                else if (key === 'ecological') { barColor = 'bg-[#5a7a68]'; labelZh = '生態棲地'; }
                else if (key === 'cultural') { barColor = 'bg-stone-400'; labelZh = '歷史記憶'; }

                const change = value - 50;

                return (
                  <div key={key} className="space-y-1 font-sans text-xs">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="font-bold text-[#1f1d1b]">{labelZh}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-[#1f1d1b]">{value}</span>
                        {change > 0 && <span className="text-[9.5px] font-bold text-green-600 px-1 bg-green-50 border border-green-100 rounded">+{change}</span>}
                        {change < 0 && <span className="text-[9.5px] font-bold text-rose-500 px-1 bg-rose-50 border border-rose-100 rounded">{change}</span>}
                      </div>
                    </div>
                    {/* Memphis progress bar track */}
                    <div className="memphis-progress-track h-2.5 w-full bg-gray-100">
                      <div 
                        className={`memphis-progress-fill h-full ${barColor}`}
                        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Stakeholders satisfaction matrix */}
        <div className="border-t-3 border-[#1f1d1b] pt-6 mb-10">
          <h3 className="text-xs font-bold font-mono uppercase text-gray-400 mb-4">[ 市民協商代表滿意度指標 / CO-SIGNATURE MATRIX ]</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {roles.map((r) => {
              const satisfy = getRoleSatisfaction(r.id);
              const isPlayer = r.id === playerRole?.id;
              
              return (
                <div 
                  key={r.id} 
                  className={`p-3.5 rounded-xl border-3 border-[#1f1d1b] text-center flex flex-col items-center justify-between shadow-[3px_3px_0px_0px_rgba(31,29,27,1)] ${
                    isPlayer ? 'bg-[#fffdfe] ring-2 ring-[var(--color-brand-coral)]/30' : 'bg-white'
                  } relative`}
                >
                  {isPlayer && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[var(--color-brand-coral)] text-white text-[7.5px] px-1.5 py-0.2 rounded font-bold uppercase border border-[#1f1d1b] select-none">
                      主角玩家
                    </div>
                  )}
                  {/* Stakeholder avatar */}
                  <div className={`w-10 h-10 rounded-full border-2 border-[#1f1d1b] ${getBlobBgClass(r.id)} flex items-center justify-center mb-2.5 overflow-hidden bg-white shadow-[1.5px_1.5px_0px_0px_#1f1d1b]`}>
                    <img src={getRoleAvatar(r.id)} alt={r.name} className="w-full h-full object-cover scale-110" />
                  </div>
                  <div className="text-[10px] font-bold text-[#1f1d1b] leading-tight mb-2.5 truncate w-full font-serif">{r.name}</div>
                  
                  {/* Satisfaction stamp */}
                  <div className={`px-2 py-1 rounded text-[9px] font-bold ${satisfy.color} w-full text-center flex items-center justify-center gap-1`}>
                    <span>{satisfy.emoji}</span>
                    <span>{satisfy.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t-3 border-[#1f1d1b] pt-8">
          <div className="text-xs font-sans font-semibold text-gray-400">
            [ 當前代表協商身分：{playerRole?.name} // 台南市民景觀審議會核備 ]
          </div>
          
          <button 
            onClick={onRestart}
            className="btn-flat-action w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-flat-pop bg-[var(--color-brand-blue)] hover:bg-[#8bbddf] text-white"
          >
            <RefreshCw size={14} className="animate-spin-slow" />
            重新進行空間規劃協商
          </button>
        </div>
        
      </div>
    </div>
  );
};
