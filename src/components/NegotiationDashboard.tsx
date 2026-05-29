import React, { useState, useEffect, useRef } from 'react';
import { Choice, Round } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { fetchAIResponses, fetchAIReactions, AIResponses } from '@/lib/api';
import { MessageSquare, ArrowRight, Sparkles, Check, HelpCircle } from 'lucide-react';

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
  const [aiReactions, setAiReactions] = useState<AIResponses>({});
  
  const [stage, setStage] = useState<'discuss' | 'reaction'>('discuss');
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial discussions at the beginning of the round
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setStage('discuss');
    setSelectedChoice(null);
    setAiReactions({});
    
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

  // Scroll chat to bottom when stage changes or reactions load
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stage, isReacting, aiReactions]);

  const handleChoiceClick = (choice: Choice) => {
    setSelectedChoice(choice);
    setStage('reaction');
    setIsReacting(true);
    
    fetchAIReactions(round.id, choice.id)
      .then(reactions => {
        setAiReactions(reactions);
        setIsReacting(false);
      })
      .catch(err => {
        console.error(err);
        setIsReacting(false);
      });
  };

  const handleProceed = () => {
    if (selectedChoice) {
      onChoiceSelected(selectedChoice);
    }
  };

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

  const getAvatarBg = (id: string) => {
    switch (id) {
      case 'resident': return 'bg-rose-100 border-[#eed1cd]';
      case 'shop_owner': return 'bg-orange-100 border-[#eedcbf]';
      case 'commuter': return 'bg-blue-100 border-[#d2e2eb]';
      case 'elderly': return 'bg-rose-100 border-[#eed1cd]';
      case 'environmentalist': return 'bg-emerald-100 border-[#cfe2d7]';
      case 'government': return 'bg-slate-200 border-[#e5dfd5]';
      default: return 'bg-gray-100 border-gray-200';
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
      case 'residential': return 'bg-rose-50 border-rose-100 text-[#c26257]';
      case 'commercial': return 'bg-amber-50 border-amber-100 text-[#b37a3c]';
      case 'mobility': return 'bg-blue-50 border-blue-100 text-[#4d7082]';
      case 'ecological': return 'bg-emerald-50 border-emerald-100 text-[#3e5f4c]';
      case 'cultural': return 'bg-stone-50 border-stone-100 text-stone-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  // Determine who is currently active/highlighted in the conversation
  const getSpeakingRoleId = () => {
    if (stage === 'reaction') {
      if (isReacting) return playerRole.id;
      // In reaction stage, highlight the NPC whose reactions are shown (simulated)
      return undefined; 
    }
    return undefined;
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFDF9] border-2 border-[#e5dfd5] rounded-[24px_28px_20px_26px] overflow-hidden shadow-soft">
      
      {/* Header Panel */}
      <div className="bg-white border-b-2 border-[#e5dfd5] p-5 shrink-0">
        <div className="flex justify-between items-center mb-1">
          <span className="px-3 py-0.5 bg-rose-50 border border-rose-100 text-[var(--color-brand-coral)] text-[9px] font-bold rounded-full font-mono uppercase tracking-wider">
            協商回合 0{round.id} / 3
          </span>
          <span className="text-[10px] text-gray-400 font-mono font-semibold">議題焦點：{round.title}</span>
        </div>
        <h2 className="text-base font-extrabold text-[var(--color-text-dark)] font-serif mb-2">{round.title}</h2>
        <p className="text-xs font-semibold text-[#5c554e] border-l-3 border-[var(--color-brand-blue)] pl-3 leading-relaxed">
          {round.question}
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Roundtable seating block */}
        <div className="bg-[#FAF8F5] border border-[#e8e2d7] p-3 rounded-2xl">
          <div className="text-[9px] font-bold text-gray-400 font-sans uppercase text-center mb-2.5">
            [ 🟢 公民協商圓桌座位圖 / MEETING ROUNDTABLE ]
          </div>
          
          <div className="relative w-full max-w-md mx-auto h-24 bg-[#5a7a68]/5 border-2 border-dashed border-[#5a7a68]/15 rounded-[35px_50px_40px_60px_/_40px_60px_35px_50px] flex items-center justify-center py-2">
            
            {/* Center green grass blob table */}
            <div className="w-1/2 h-3/5 bg-[#5a7a68]/15 border border-[#5a7a68]/20 rounded-[60%_40%_50%_50%_/_50%_60%_40%_55%] shadow-inner-sm flex items-center justify-center text-[10px] font-serif font-bold text-[#3e5f4c] select-none">
              綠園道協商桌
            </div>
            
            {/* Stakeholder Seats positioned organically around */}
            {roles.map((r, i) => {
              const isPlayer = r.id === playerRole?.id;
              const speakerId = getSpeakingRoleId();
              const isSpeaking = speakerId === r.id;
              
              let pos = '';
              if (i === 0) pos = 'top-1.5 left-2 md:left-4';
              else if (i === 1) pos = 'top-0.5 left-1/2 -translate-x-1/2';
              else if (i === 2) pos = 'top-1.5 right-2 md:right-4';
              else if (i === 3) pos = 'bottom-1.5 left-2 md:left-4';
              else if (i === 4) pos = 'bottom-0.5 left-1/2 -translate-x-1/2';
              else pos = 'bottom-1.5 right-2 md:right-4';

              return (
                <div key={r.id} className={`absolute ${pos} z-10`}>
                  <div className={`px-2 py-0.5 text-[8.5px] font-bold rounded-full border transition-all duration-300 shadow-soft-sm flex items-center gap-1 ${
                    isPlayer 
                      ? 'bg-[var(--color-brand-coral)] text-white border-[var(--color-brand-coral)] scale-105 ring-2 ring-[var(--color-brand-coral)]/20' 
                      : isSpeaking 
                        ? 'bg-[var(--color-brand-yellow)] text-[var(--color-text-dark)] border-[var(--color-brand-yellow)] animate-pulse' 
                        : 'bg-white text-gray-500 border-[#e5dfd5]'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                    <span>{r.name} {isPlayer && '(您)'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Stakeholder Dialogue bubbles (Chronological Interactive Thread) */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1.5">
            <MessageSquare size={13} className="text-gray-400" />
            [ 協商對話紀錄 / CONVERSATION HISTORY ]
          </h3>

          {isLoading ? (
            <div className="bg-white border-2 border-dashed border-[#e5dfd5] rounded-2xl p-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-t-[var(--color-brand-blue)] border-[#ede7dc] rounded-full animate-spin" />
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse font-sans">
                正在評估市民提案意見...
              </div>
            </div>
          ) : (
            <div className="space-y-4 font-sans">
              
              {/* STAGE 1: Initial Concerns */}
              {Object.entries(aiResponses).map(([roleId, quote]) => {
                const roleInfo = roles.find(r => r.id === roleId);
                if (!roleInfo) return null;
                const avatar = getRoleAvatar(roleId);
                const bg = getAvatarBg(roleId);
                
                return (
                  <div key={roleId} className="flex gap-3 items-start animate-fade-in">
                    {/* Speaker Avatar */}
                    <div className={`w-9 h-9 rounded-full border-2 overflow-hidden ${bg} shrink-0 shadow-soft-sm`}>
                      <img src={avatar} alt={roleInfo.name} className="w-full h-full object-cover scale-110" />
                    </div>
                    {/* Speech Bubble */}
                    <div className="flex-1 bg-white p-3 border border-[#ebdcc9] shadow-soft-sm relative rounded-[16px_20px_14px_18px_/_18px_14px_20px_16px]
                                    before:content-[''] before:absolute before:left-[-6px] before:top-3.5 before:w-0 before:height-0 before:border-t-[6px] before:border-t-transparent before:border-b-[6px] before:border-b-transparent before:border-r-[6px] before:border-r-[#ebdcc9]
                                    after:content-[''] after:absolute after:left-[-4px] after:top-[15px] after:w-0 after:height-0 after:border-t-[5px] after:border-t-transparent after:border-b-[5px] after:border-b-transparent after:border-r-[5px] after:border-r-white">
                      <div className="text-[9px] font-bold text-[#b37a3c] mb-0.5 flex items-center gap-1.5">
                        <span>{roleInfo.name}</span>
                        <span className="text-[7.5px] font-mono opacity-60 bg-[#FAF3E5] px-1 py-0.2 rounded-full">市民代表觀點</span>
                      </div>
                      <p className="text-[11.5px] text-[#5c554e] leading-relaxed">
                        {quote}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* STAGE 2: Player's Choice Proposal */}
              {selectedChoice && (
                <div className="flex gap-3 items-start justify-end animate-fade-in">
                  {/* Player Speech Bubble */}
                  <div className="flex-1 bg-[#FFFDF0] p-3.5 border-2 border-[var(--color-brand-coral)] shadow-soft-sm relative rounded-[20px_16px_18px_14px_/_14px_18px_16px_20px]
                                  before:content-[''] before:absolute before:right-[-8px] before:top-3.5 before:w-0 before:height-0 before:border-t-[6px] before:border-t-transparent before:border-b-[6px] before:border-b-transparent before:border-l-[8px] before:border-l-[var(--color-brand-coral)]
                                  after:content-[''] after:absolute after:right-[-5px] after:top-[15px] after:w-0 after:height-0 after:border-t-[5px] after:border-t-transparent after:border-b-[5px] after:border-b-transparent after:border-l-[6px] after:border-l-[#FFFDF0]">
                    <div className="text-[9px] font-bold text-[var(--color-brand-coral)] mb-0.5 flex items-center gap-1.5 justify-end">
                      <span className="text-[7.5px] font-mono opacity-60 bg-red-50 border border-red-100 px-1 py-0.2 rounded-full">您的提案決策</span>
                      <span>{playerRole.name} (您)</span>
                    </div>
                    <p className="text-[12px] text-[var(--color-text-dark)] font-bold leading-relaxed text-right">
                      我提案採用策略：『{selectedChoice.text}』
                    </p>
                  </div>
                  {/* Player Avatar */}
                  <div className={`w-9 h-9 rounded-full border-2 overflow-hidden ${getAvatarBg(playerRole.id)} shrink-0 shadow-soft-sm ring-2 ring-[var(--color-brand-coral)]/20`}>
                    <img src={getRoleAvatar(playerRole.id)} alt={playerRole.name} className="w-full h-full object-cover scale-110" />
                  </div>
                </div>
              )}

              {/* STAGE 2: NPC Reactions */}
              {isReacting && (
                <div className="bg-[#FFFDF9] border border-dashed border-[#e5dfd5] rounded-2xl p-4 flex items-center justify-center gap-2 animate-pulse">
                  <div className="w-4 h-4 border-2 border-t-[var(--color-brand-coral)] border-gray-200 rounded-full animate-spin" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-sans">
                    其他代表正在評議您的空間提案...
                  </span>
                </div>
              )}

              {!isReacting && Object.entries(aiReactions).map(([roleId, reaction]) => {
                const roleInfo = roles.find(r => r.id === roleId);
                if (!roleInfo) return null;
                const avatar = getRoleAvatar(roleId);
                const bg = getAvatarBg(roleId);
                
                return (
                  <div key={`react-${roleId}`} className="flex gap-3 items-start animate-fade-in-up">
                    {/* Speaker Avatar */}
                    <div className={`w-9 h-9 rounded-full border-2 overflow-hidden ${bg} shrink-0 shadow-soft-sm`}>
                      <img src={avatar} alt={roleInfo.name} className="w-full h-full object-cover scale-110" />
                    </div>
                    {/* Reaction Bubble */}
                    <div className="flex-1 bg-[#FAFDFB] p-3 border border-[#cbdad0] shadow-soft-sm relative rounded-[16px_20px_14px_18px_/_18px_14px_20px_16px]
                                    before:content-[''] before:absolute before:left-[-6px] before:top-3.5 before:w-0 before:height-0 before:border-t-[6px] before:border-t-transparent before:border-b-[6px] before:border-b-transparent before:border-r-[6px] before:border-r-[#cbdad0]
                                    after:content-[''] after:absolute after:left-[-4px] after:top-[15px] after:w-0 after:height-0 after:border-t-[5px] after:border-t-transparent after:border-b-[5px] after:border-b-transparent after:border-r-[5px] after:border-r-[#FAFDFB]">
                      <div className="text-[9px] font-bold text-[#3e5f4c] mb-0.5 flex items-center gap-1.5">
                        <span>{roleInfo.name}</span>
                        <span className="text-[7.5px] font-mono opacity-70 bg-[#E4EFE8] px-1 py-0.2 rounded-full border border-[#cfe2d7]">提案評語反饋</span>
                      </div>
                      <p className="text-[11.5px] text-[#425046] leading-relaxed">
                        {reaction}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Player Choices / Action Buttons */}
        <div className="border-t-2 border-[#e5dfd5] pt-5">
          {stage === 'discuss' ? (
            <div>
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 font-mono mb-3">
                [ 選擇您欲提交的空間提案 / DECISION OPTIONS ]
              </h3>
              <div className="space-y-3 font-sans">
                {round.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice)}
                    className="w-full text-left p-3.5 border-2 border-[#ded8ce] hover:border-[var(--color-brand-coral)] hover:bg-[#FFFFFA] bg-white rounded-2xl shadow-soft-sm hover:shadow-soft transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-start">
                      <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[var(--color-brand-coral)] text-gray-600 group-hover:text-white flex items-center justify-center font-bold text-xs mr-3 shrink-0 transition-colors">
                        {choice.id.replace(/[0-9]/g, '').toUpperCase()}
                      </div>
                      <div className="text-[12.5px] text-[var(--color-text-dark)] font-bold leading-relaxed">
                        {choice.text}
                      </div>
                    </div>
                    
                    {/* Impact Tags */}
                    <div className="mt-3 ml-10 flex gap-2 text-[9px] font-bold flex-wrap border-t border-dashed border-[#e5dfd5] pt-2">
                      <span className="text-gray-400 mr-1 flex items-center gap-0.5">
                        <HelpCircle size={10} /> 預期衝擊：
                      </span>
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
          ) : (
            <div className="animate-fade-in">
              {!isReacting && (
                <button
                  onClick={handleProceed}
                  className="w-full bg-[var(--color-brand-coral)] hover:bg-[#c06a5f] text-white py-4 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  {round.id === 3 ? '確認最終決策，審定共創成果書' : '確認本輪策略，前往下一區段'} 
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};
