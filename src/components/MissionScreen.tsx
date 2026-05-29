import React from 'react';
import { missionData } from '@/data/missionData';
import { Bike, Store, Trees, ArrowRight } from 'lucide-react';

interface MissionScreenProps {
  onStartNegotiation: () => void;
}

export const MissionScreen: React.FC<MissionScreenProps> = ({ onStartNegotiation }) => {
  const getConflictIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Bike className="w-5 h-5 text-[var(--color-brand-coral)]" />;
      case 1:
        return <Store className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Trees className="w-5 h-5 text-[var(--color-brand-green)]" />;
      default:
        return <ArrowRight className="w-5 h-5" />;
    }
  };

  const getConflictBg = (index: number) => {
    switch (index) {
      case 0: return 'bg-rose-50 border-rose-100';
      case 1: return 'bg-amber-50 border-amber-100';
      case 2: return 'bg-emerald-50 border-emerald-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-3xl w-full bg-[#FAF8F5] border border-[#e8e5e0] rounded-3xl p-10 shadow-soft text-left">
        
        {/* Progress header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <span className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold rounded-full font-mono uppercase tracking-wider">
            [ 協商小組登記：當前協商議題 ]
          </span>
          <span className="text-xs font-mono text-gray-400">進度：2 / 2 步</span>
        </div>

        <h1 className="text-2xl font-extrabold mb-6 text-gray-900">{missionData.title}</h1>
        
        <div className="mb-8 p-5 bg-white border-l-4 border-[var(--color-brand-blue)] rounded-r-xl shadow-soft-sm text-gray-700 leading-relaxed text-sm font-sans">
          {missionData.introduction}
        </div>

        <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-gray-400 mb-4">[ 協商三大核心爭點 / KEY CONFLICTS ]</h3>
        
        {/* 3 columns of conflict cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {missionData.conflicts.map((conflict, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-2xl border flex flex-col items-start ${getConflictBg(index)} shadow-soft-sm`}
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                {getConflictIcon(index)}
              </div>
              <div className="text-[10px] font-mono text-gray-400 mb-1">爭點 0{index + 1}</div>
              <h4 className="text-xs font-bold text-gray-800 leading-snug">{conflict}</h4>
            </div>
          ))}
        </div>

        {/* Bottom panel */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col font-mono text-[9px] text-gray-400 space-y-0.5">
            <div>狀態：協商委員會已準備就緒</div>
            <div>類型：多方市民利益審議</div>
            <div>地圖引用：台南縱貫鐵路沿線</div>
          </div>
          
          <button 
            onClick={onStartNegotiation}
            className="w-full sm:w-auto bg-[var(--color-brand-blue)] hover:bg-[#5b7a8c] text-white px-10 py-4 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            進入協商圓桌
          </button>
        </div>
      </div>
    </div>
  );
};

