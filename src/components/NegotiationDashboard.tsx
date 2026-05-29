import React, { useState, useEffect } from 'react';
import { Choice, Round } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { fetchAIResponses, AIResponses } from '@/lib/api';
import { MessageSquare } from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full bg-white border-arch overflow-hidden">
      
      {/* Header Panel */}
      <div className="bg-gray-100 border-b border-black p-6">
        <div className="flex justify-between items-center mb-1">
          <span className="anno-label text-[var(--color-brand-coral)] font-bold">協商回合 0{round.id}</span>
          <span className="anno-label text-gray-500 font-semibold">[ 區域：公民協商與空間配置對齊 ]</span>
        </div>
        <h2 className="text-xl font-extrabold mb-3 text-black uppercase">{round.title}</h2>
        <p className="text-gray-900 font-semibold text-sm border-l-2 border-[var(--color-brand-blue)] pl-3 leading-relaxed">
          {round.question}
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
        
        {/* Civic Roundtable Seating Layout Schema */}
        <div className="border border-black p-4 bg-gray-50 flex flex-col items-center">
          <div className="anno-label text-gray-500 mb-3 font-semibold">[ 協商會議室：代表席位示意圖 ]</div>
          <div className="relative w-full max-w-lg h-28 border border-gray-300 bg-white flex items-center justify-center overflow-hidden">
            {/* The Table */}
            <div className="w-3/5 h-1/2 border-arch-thin border-dashed bg-hatch flex items-center justify-center text-[9px] font-mono text-gray-500 font-bold select-none">
              台南綠園道規劃會議桌 (ROUNDTABLE)
            </div>
            
            {/* Stakeholder Seats around the table */}
            {roles.map((r, i) => {
              const isActive = Object.keys(aiResponses).includes(r.id);
              const isPlayer = r.id === playerRole?.id;
              
              // Position styles for 6 roles
              let posStyle = '';
              if (i === 0) posStyle = 'top-1 left-2';
              else if (i === 1) posStyle = 'top-1 left-1/2 -translate-x-1/2';
              else if (i === 2) posStyle = 'top-1 right-2';
              else if (i === 3) posStyle = 'bottom-1 left-2';
              else if (i === 4) posStyle = 'bottom-1 left-1/2 -translate-x-1/2';
              else posStyle = 'bottom-1 right-2';

              return (
                <div key={r.id} className={`absolute ${posStyle} flex flex-col items-center z-10`}>
                  <div className={`px-2 py-0.5 font-mono text-[8px] border transition-colors ${
                    isPlayer 
                      ? 'bg-[var(--color-brand-coral)] text-white border-[var(--color-brand-coral)] font-bold' 
                      : isActive 
                        ? 'bg-[var(--color-brand-blue)] text-white border-[var(--color-brand-blue)] font-medium' 
                        : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                    {r.name} {isPlayer && '(您)'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mock AI Comments Section */}
        <div>
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 flex items-center gap-2 font-mono">
            <MessageSquare size={14} className="text-gray-400" /> [ 利益關係人諮詢輸出 / 各方意見回饋 ]
          </h3>

          {isLoading ? (
            <div className="border border-dashed border-gray-400 bg-gray-50 p-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-t-[var(--color-brand-blue)] border-gray-300 animate-spin" />
              <div className="font-mono text-[9px] text-gray-500 uppercase tracking-widest animate-pulse">
                [ 模擬引擎運行中 / AI 意見模擬中... ]
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(aiResponses).map(([roleId, quote]) => {
                const roleInfo = roles.find(r => r.id === roleId);
                if (!roleInfo) return null;
                
                return (
                  <div key={roleId} className="flex flex-col bg-white p-4 border border-black relative">
                    <div className="absolute top-0 right-0 font-mono text-[8px] bg-gray-100 border-l border-b border-black px-1.5 py-0.5 text-gray-500 uppercase select-none">
                      [ 已登錄 ]
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--color-brand-blue)] mb-2 uppercase">
                      ◆ {roleInfo.name}
                    </span>
                    <span className="text-xs text-gray-800 leading-relaxed font-sans italic">
                      {quote}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Player Choices Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 font-mono">
            [ 提交空間規劃提案 / 您的空間選擇 ]
          </h3>
          <div className="space-y-3">
            {round.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => onChoiceSelected(choice)}
                className="w-full text-left p-4 border-arch hover:border-[var(--color-brand-coral)] hover:bg-orange-50 bg-white transition-all group cursor-pointer"
              >
                <div className="flex items-start">
                  <div className="w-9 h-6 border border-black bg-gray-100 group-hover:bg-[var(--color-brand-coral)] text-gray-700 group-hover:text-white flex items-center justify-center font-mono font-bold text-[10px] mr-3.5 shrink-0 transition-colors">
                    {choice.id.toUpperCase()}
                  </div>
                  <div className="text-gray-900 font-sans text-sm font-semibold leading-relaxed">
                    {choice.text}
                  </div>
                </div>
                
                {/* Visual feedback of effect */}
                <div className="mt-3 ml-12.5 flex gap-4 text-[10px] font-mono text-gray-500 flex-wrap border-t border-dashed border-gray-200 pt-2">
                  {Object.entries(choice.effects).map(([key, val]) => {
                    if (val === 0) return null;
                    return (
                      <span key={key} className={val > 0 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                        {key.toUpperCase()}: {val > 0 ? '+' : ''}{val}
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


