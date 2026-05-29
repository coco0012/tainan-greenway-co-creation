import React from 'react';
import { Effect } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { strategyResults } from '@/data/strategyResults';
import { calculateStrategy } from '@/lib/gameLogic';
import { CheckCircle, Home, Store, Bike, Heart, Trees, Building2, User, RefreshCw } from 'lucide-react';

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

    if (scoreVal >= 60) return { emoji: '😊', text: '非常滿意', color: 'text-green-600 bg-green-50 border-green-100' };
    if (scoreVal >= 45) return { emoji: '😐', text: '可以接受', color: 'text-amber-600 bg-amber-50 border-amber-100' };
    return { emoji: '😞', text: '有些疑慮', color: 'text-rose-600 bg-rose-50 border-rose-100' };
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'resident': return <Home className="w-4 h-4" />;
      case 'shop_owner': return <Store className="w-4 h-4" />;
      case 'commuter': return <Bike className="w-4 h-4" />;
      case 'elderly': return <Heart className="w-4 h-4" />;
      case 'environmentalist': return <Trees className="w-4 h-4" />;
      case 'government': return <Building2 className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-8 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#FAF8F5] border border-[#e8e5e0] rounded-3xl p-10 shadow-soft text-left">
        
        {/* Memo header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-[var(--color-brand-green)] text-[10px] font-bold rounded-full font-mono uppercase tracking-wider">
            [ 審定空間策略：共創成果書 ]
          </span>
          <span className="text-xs font-mono text-gray-400">專案代號：Tainan Greenway Memo</span>
        </div>

        <div className="uppercase tracking-widest text-[10px] font-mono text-[var(--color-brand-coral)] font-bold mb-1">
          Civic Negotiation Memo / 公民協商空間成果
        </div>
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900">{strategy.title}</h1>
        
        {/* Strategy core description */}
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-soft-sm text-gray-700 leading-relaxed text-sm">
          <span className="font-mono text-[10px] text-gray-400 block mb-2 uppercase font-bold">[ 規劃大綱摘要 ]</span>
          {strategy.summary}
        </div>

        {/* Before / After comparison */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-soft-sm">
          <h3 className="text-xs font-bold font-mono uppercase text-gray-400 mb-4">
            [ 空間策略前後對比 / BEFORE & AFTER COMPARISON ]
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 font-mono block mb-1">最初設計提案</span>
              <h4 className="text-sm font-bold text-gray-700 mb-2">單一高架自行車道 (快速過境)</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                全線鋪設高強度水泥硬質路幅，自行車道全面高架化，阻斷地面店面人流，且自行車高架橋貼近民房二樓，造成居民隱私受干擾，缺乏遮林。
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-100">
              <span className="text-[10px] font-bold text-[var(--color-brand-green)] font-mono block mb-1">公民共創協商提案</span>
              <h4 className="text-sm font-bold text-emerald-800 mb-2">分段式多元縫合空間規劃</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                兼顧通勤效率與地區生活安寧。住宅區導入地面慢速道及防隱私隔板；商業區引導降至地面人行道活絡街區店面；並保留大面積林蔭與雨水花園。
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Spatial Actions Cards list */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-gray-400 mb-4 pb-2 border-b border-gray-200">
              [ 審定執行的空間策略 / APPROVED ACTIONS ]
            </h3>
            <div className="space-y-2.5">
              {spatialActions.map((action, index) => (
                <div key={index} className="bg-white p-3.5 rounded-2xl border border-gray-100 flex items-start gap-3 shadow-soft-sm">
                  <CheckCircle className="w-5 h-5 text-[var(--color-brand-green)] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-gray-700 leading-snug">{action}</span>
                </div>
              ))}
              {spatialActions.length === 0 && (
                <div className="text-gray-400 italic text-xs p-4 bg-white rounded-2xl text-center border border-gray-100 font-mono">
                  無施作變更空間策略。
                </div>
              )}
            </div>
          </div>

          {/* Final Indicators */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-gray-400 mb-4 pb-2 border-b border-gray-200">
              [ 最終綠園道績效指標評估 / FINAL METRICS ]
            </h3>
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-soft-sm">
              {Object.entries(scores).map(([key, value]) => {
                let barColor = 'bg-gray-400';
                let labelZh = key;
                if (key === 'residential') { barColor = 'bg-[var(--color-brand-coral)]'; labelZh = '居住舒適'; }
                else if (key === 'mobility') { barColor = 'bg-[var(--color-brand-blue)]'; labelZh = '交通效率'; }
                else if (key === 'ecological') { barColor = 'bg-[var(--color-brand-green)]'; labelZh = '生態棲地'; }
                else if (key === 'commercial') { barColor = 'bg-amber-400'; labelZh = '商業活力'; }
                else if (key === 'cultural') { barColor = 'bg-stone-400'; labelZh = '歷史記憶'; }

                const change = value - 50;

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="font-bold text-gray-700">{labelZh}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-gray-900">{value}</span>
                        {change > 0 && <span className="text-[10px] text-green-600">(+{change})</span>}
                        {change < 0 && <span className="text-[10px] text-rose-500">({change})</span>}
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="h-2.5 w-full bg-gray-200/50 rounded-full overflow-hidden border border-gray-100/50">
                      <div 
                        className={`h-full ${barColor} rounded-full`}
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
        <div className="border-t border-[#e8e5e0] pt-6 mb-10">
          <h3 className="text-xs font-bold font-mono uppercase text-gray-400 mb-4">[ 市民協商滿意度指標 / REPRESENTATIVE SATISFACTION ]</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
            {roles.map((r) => {
              const satisfy = getRoleSatisfaction(r.id);
              const isPlayer = r.id === playerRole?.id;
              
              return (
                <div 
                  key={r.id} 
                  className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between ${satisfy.color} shadow-soft-sm relative`}
                >
                  {isPlayer && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[var(--color-brand-coral)] text-white text-[7px] px-1.5 py-0.2 rounded-full font-bold uppercase select-none">
                      主角玩家
                    </div>
                  )}
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm text-gray-600">
                    {getRoleIcon(r.id)}
                  </div>
                  <div className="text-[10px] font-bold text-gray-800 leading-tight mb-1 truncate w-full">{r.name}</div>
                  <div className="text-lg mb-0.5">{satisfy.emoji}</div>
                  <div className="text-[9px] font-bold font-sans opacity-85">{satisfy.text}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-black pt-8">
          <div className="text-xs font-mono text-gray-400">
            [ 當前代表角色：{playerRole?.name} // 協商評審委員會核可 ]
          </div>
          
          <button 
            onClick={onRestart}
            className="w-full sm:w-auto bg-[var(--color-brand-blue)] hover:bg-[#5b7a8c] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            重新進行空間規劃協商
          </button>
        </div>
        
      </div>
    </div>
  );
};


