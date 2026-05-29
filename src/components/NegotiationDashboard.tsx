import React, { useState, useEffect } from 'react';
import { Choice, Round } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { fetchAIResponses, AIResponses } from '@/lib/api';
import { MessageSquare, Home, Store, Bike, Heart, Trees, Building2, User } from 'lucide-react';

interface NegotiationDashboardProps {
  round: Round;
  playerRole: StakeholderRole;
  onChoiceSelected: (choice: Choice) => void;
}

export const NegotiationDashboard: React.FC<NegotiationDashboardProps> = ({ 
  round, 
  playerRole, 
  onChoiceSelected 
}) => {
  const [aiResponses, setAiResponses] = useState<AIResponses>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    
    fetchAIResponses(round.id, playerRole.id)
      .then(responses => {
        if (active) {
          setAiResponses(responses);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [round.id, playerRole.id]);

  const getRoleIconInfo = (id: string) => {
    switch (id) {
      case 'resident': 
        return { icon: <Home className="w-4 h-4" />, bg: 'bg-rose-50 text-[var(--color-brand-coral)]' };
      case 'shop_owner': 
        return { icon: <Store className="w-4 h-4" />, bg: 'bg-orange-50 text-orange-400' };
      case 'commuter': 
        return { icon: <Bike className="w-4 h-4" />, bg: 'bg-blue-50 text-[var(--color-brand-blue)]' };
      case 'elderly': 
        return { icon: <Heart className="w-4 h-4" />, bg: 'bg-rose-50 text-rose-400' };
      case 'environmentalist': 
        return { icon: <Trees className="w-4 h-4" />, bg: 'bg-emerald-50 text-[var(--color-brand-green)]' };
      case 'government': 
        return { icon: <Building2 className="w-4 h-4" />, bg: 'bg-slate-50 text-slate-500' };
      default: 
        return { icon: <User className="w-4 h-4" />, bg: 'bg-gray-50 text-gray-400' };
    }
  };

  const getMetricLabel = (key: string) => {
    switch (key) {
      case 'residential': return '居住舒適';
      case 'commercial': return '商業活力';
      case 'mobility': return '交通效率';
      case 'ecological': return '生態棲地';
      case 'cultural': return '歷史記憶';
      default: return key;
    }
  };

  const getMetricColor = (key: string) => {
    switch (key) {
      case 'residential': return 'bg-rose-50 border-rose-100 text-rose-600';
      case 'commercial': return 'bg-amber-50 border-amber-100 text-amber-600';
      case 'mobility': return 'bg-blue-50 border-blue-100 text-blue-600';
      case 'ecological': return 'bg-emerald-50 border-emerald-100 text-emerald-600';
      case 'cultural': return 'bg-stone-50 border-stone-100 text-stone-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] border border-[#e8e5e0] rounded-3xl overflow-hidden shadow-soft">
      
      {/* Header Panel */}
      <div className="bg-white border-b border-[#e8e5e0] p-6 shrink-0">
        <div className="flex justify-between items-center mb-1">
          <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-100 text-[var(--color-brand-coral)] text-[9px] font-bold rounded-full font-mono uppercase tracking-wider">
            協商回合 0{round.id} / 3
          </span>
          <span className="text-[10px] text-gray-400 font-mono font-semibold">協商桌主題：{round.title}</span>
        </div>
        <h2 className="text-lg font-extrabold text-gray-900 mb-2">{round.title}</h2>
        <p className="text-sm font-semibold text-gray-700 border-l-3 border-[var(--color-brand-blue)] pl-3 leading-relaxed">
          {round.question}
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Roundtable seating block */}
        <div className="bg-white border border-[#e8e5e0] p-4 rounded-2xl shadow-soft-sm">
          <div className="text-[10px] font-bold text-gray-400 font-mono uppercase text-center mb-3">
            [ 協商會議室：市民代表座位配置 ]
          </div>
          <div className="relative w-full max-w-md mx-auto h-20 border border-gray-100 bg-gray-50/50 rounded-full flex items-center justify-center">
            {/* Round Table representation */}
            <div className="w-1/2 h-2/3 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center text-[9px] font-bold text-gray-400 select-none">
              圓桌協商
            </div>
            
            {/* Stakeholder Seats */}
            {roles.map((r, i) => {
              const isActive = Object.keys(aiResponses).includes(r.id);
              const isPlayer = r.id === playerRole?.id;
              
              // Angle-based positioning on the oval ring
              const angles = [0, 60, 120, 180, 240, 300];
              const angle = angles[i] * (Math.PI / 180);
              const rx = 100; // x radius
              const ry = 28;  // y radius
              const cx = 200; // x center offset (relative to max-w-md / roughly)
              const cy = 36;  // y center
              
              // Simple positions instead of trig to ensure CSS portability
              let pos = '';
              if (i === 0) pos = 'top-1 left-2';
              else if (i === 1) pos = 'top-1 left-1/2 -translate-x-1/2';
              else if (i === 2) pos = 'top-1 right-2';
              else if (i === 3) pos = 'bottom-1 left-2';
              else if (i === 4) pos = 'bottom-1 left-1/2 -translate-x-1/2';
              else pos = 'bottom-1 right-2';

              return (
                <div key={r.id} className={`absolute ${pos} z-10`}>
                  <div className={`px-2 py-0.5 text-[8px] font-bold rounded-full border transition-all duration-150 shadow-sm ${
                    isPlayer 
                      ? 'bg-[var(--color-brand-coral)] text-white border-[var(--color-brand-coral)] scale-105' 
                      : isActive 
                        ? 'bg-[var(--color-brand-blue)] text-white border-[var(--color-brand-blue)]' 
                        : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                    {r.name} {isPlayer && '(您)'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Stakeholder Dialogue bubbles */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 font-mono mb-2 flex items-center gap-1.5">
            <MessageSquare size={13} className="text-gray-400" /> 各方代表意見發言：
          </h3>

          {isLoading ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-5 h-5 border-2 border-t-[var(--color-brand-blue)] border-gray-200 rounded-full animate-spin" />
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse font-sans">
                正在評估市民提案意見...
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {Object.entries(aiResponses).map(([roleId, quote]) => {
                const roleInfo = roles.find(r => r.id === roleId);
                if (!roleInfo) return null;
                const { icon, bg } = getRoleIconInfo(roleId);
                
                return (
                  <div key={roleId} className="flex gap-3 items-start">
                    {/* Speaker Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bg} shrink-0 shadow-sm`}>
                      {icon}
                    </div>
                    {/* Speech Bubble */}
                    <div className="flex-1 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-soft-sm chat-bubble-left">
                      <div className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1">
                        <span>{roleInfo.name}</span>
                        <span className="text-[8px] font-mono opacity-50 bg-gray-150 px-1.5 py-0.2 rounded-full">[AI 模擬市民代表]</span>
                      </div>
                      <p className="text-xs text-gray-700 italic leading-relaxed font-medium">
                        「{quote.replace(/「|」/g, '')}」
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Player Choices Section */}
        <div className="border-t border-[#e8e5e0] pt-6">
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 font-mono mb-4">
            [ 提交空間規劃提案 / 您的空間決策 ]
          </h3>
          <div className="space-y-3">
            {round.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => onChoiceSelected(choice)}
                className="w-full text-left p-4 rounded-2xl border border-gray-200 hover:border-[var(--color-brand-coral)] hover:bg-[#FFFDFB] bg-white shadow-soft-sm hover:shadow-soft transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[var(--color-brand-coral)] text-gray-700 group-hover:text-white flex items-center justify-center font-bold text-xs mr-3 shrink-0 transition-colors">
                    {choice.id.replace(/[0-9]/g, '').toUpperCase()}
                  </div>
                  <div className="text-gray-800 font-sans text-sm font-semibold leading-relaxed">
                    {choice.text}
                  </div>
                </div>
                
                {/* Visual feedback of effects in pastel pills */}
                <div className="mt-3.5 ml-11 flex gap-2 text-[9px] font-bold flex-wrap border-t border-dashed border-gray-100 pt-2.5">
                  {Object.entries(choice.effects).map(([key, val]) => {
                    if (val === 0) return null;
                    return (
                      <span 
                        key={key} 
                        className={`px-2 py-0.5 rounded-full border ${getMetricColor(key)}`}
                      >
                        {getMetricLabel(key)}: {val > 0 ? '+' : ''}{val}
                      </span>
                    );
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};



