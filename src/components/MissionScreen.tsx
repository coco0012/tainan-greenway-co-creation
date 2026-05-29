import React from 'react';
import { missionData } from '@/data/missionData';
import { ArrowRight, HelpCircle } from 'lucide-react';

interface MissionScreenProps {
  onStartNegotiation: () => void;
}

export const MissionScreen: React.FC<MissionScreenProps> = ({ onStartNegotiation }) => {
  
  const getConflictImage = (index: number) => {
    switch (index) {
      case 0: return '/conflict_privacy.png';
      case 1: return '/conflict_commerce.png';
      case 2: return '/conflict_ecology.png';
      default: return '/greenway_watercolor.png';
    }
  };

  const getConflictBg = (index: number) => {
    switch (index) {
      case 0: return 'bg-rose-50/40 border-rose-100/80';
      case 1: return 'bg-amber-50/40 border-amber-100/80';
      case 2: return 'bg-emerald-50/40 border-emerald-100/80';
      default: return 'bg-[#FFFDF9] border-[#e5dfd5]';
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#FFFDF9] border-2 border-[#e5dfd5] rounded-[30px_25px_35px_28px_/_25px_30px_24px_35px] p-8 md:p-10 shadow-soft text-left">
        
        {/* Progress header */}
        <div className="flex justify-between items-center mb-6 border-b border-[#e5dfd5] pb-4">
          <span className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold rounded-full font-mono uppercase tracking-wider">
            【 圓桌登記：解說協商議題與爭點 】
          </span>
          <span className="text-xs font-mono text-gray-400">進度：2 / 2 步</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold mb-5 text-[var(--color-text-dark)] font-serif leading-snug">
          {missionData.title}
        </h1>
        
        {/* Intro box */}
        <div className="mb-8 p-5 bg-[#FAF7F2] border-l-4 border-[var(--color-brand-blue)] rounded-r-2xl shadow-inner-sm text-[#5c554e] leading-relaxed text-sm font-sans">
          {missionData.introduction}
        </div>

        <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-gray-400 mb-4 flex items-center gap-1">
          <HelpCircle size={14} className="text-gray-400" />
          [ 協商三大核心爭點 / KEY CONFLICT VISUALS ]
        </h3>
        
        {/* 3 columns of conflict cards with illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {missionData.conflicts.map((conflict, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-2xl border-2 flex flex-col justify-between ${getConflictBg(index)} hover:shadow-soft-sm transition-all`}
            >
              <div>
                {/* Hand-drawn style illustration */}
                <div className="w-full h-28 rounded-xl overflow-hidden border border-[#ded6c9] mb-3 shadow-inner-sm bg-[#FAF8F5]">
                  <img 
                    src={getConflictImage(index)} 
                    alt={`爭點 0${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[10px] font-mono text-gray-400 mb-1 font-bold">爭點 0{index + 1}</div>
              </div>
              <h4 className="text-xs font-bold text-gray-800 leading-relaxed font-sans">{conflict}</h4>
            </div>
          ))}
        </div>

        {/* Bottom panel */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-[#e5dfd5]">
          <div className="flex flex-col font-sans text-[10px] text-gray-400 space-y-0.5">
            <div>狀態：市民代表團與市府評審已入席</div>
            <div>類型：多方公共利益審議機制 (RPG Roundtable)</div>
            <div>數據源：台南鐵路地下化廊道縫合計畫書</div>
          </div>
          
          <button 
            onClick={onStartNegotiation}
            className="w-full sm:w-auto bg-[var(--color-brand-blue)] hover:bg-[#5b7a8c] text-white px-10 py-4 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            進入協商圓桌 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
