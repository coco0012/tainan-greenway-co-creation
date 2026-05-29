import React from 'react';
import { missionData } from '@/data/missionData';

interface MissionScreenProps {
  onStartNegotiation: () => void;
}

export const MissionScreen: React.FC<MissionScreenProps> = ({ onStartNegotiation }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-dot-grid h-full overflow-y-auto">
      <div className="relative max-w-3xl bg-white border-arch p-10 bg-opacity-95 text-left">
        {/* Corner Crosshairs */}
        <div className="absolute -top-2.5 -left-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -top-2.5 -right-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -bottom-3 -left-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -bottom-3 -right-2 text-md font-mono text-gray-500 select-none">+</div>

        {/* Header Block */}
        <div className="flex justify-between items-center mb-6 border-b border-black pb-2">
          <span className="anno-label text-[var(--color-brand-coral)] font-bold">[ 協商任務：空間策略定位 ]</span>
          <span className="anno-label text-gray-500 font-semibold">[ 圖紙編號：MS-01 ]</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-6 text-black uppercase">{missionData.title}</h1>
        
        <div className="mb-8 p-5 bg-gray-50 border-l-2 border-[var(--color-brand-blue)] text-gray-800 leading-relaxed text-sm font-sans">
          {missionData.introduction}
        </div>

        <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-gray-500 mb-4">[ 綠園道關鍵空間衝突點 ]</h3>
        <ul className="space-y-4 mb-10">
          {missionData.conflicts.map((conflict, index) => (
            <li key={index} className="flex items-center text-sm font-medium">
              <span className="font-mono text-xs text-[var(--color-brand-coral)] bg-orange-50 border-arch-thin border-[var(--color-brand-coral)] px-2.5 py-1 mr-4 shrink-0 font-bold">
                空間衝突 0{index + 1}
              </span>
              <span className="text-gray-900">{conflict}</span>
            </li>
          ))}
        </ul>

        {/* Bottom panel */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col font-mono text-[9px] text-gray-500 space-y-1">
            <div>模擬狀態：引擎初始化中</div>
            <div>協商類型：公民參與圓桌會議</div>
            <div>地圖索引：台南市區綠園道全線</div>
          </div>
          
          <button 
            onClick={onStartNegotiation}
            className="w-full sm:w-auto border-arch hover:bg-[var(--color-brand-blue)] hover:text-white text-black bg-white px-10 py-3 font-mono text-sm tracking-wider uppercase font-bold transition-all duration-150 cursor-pointer active:translate-y-[1px]"
          >
            進入協商圓桌
          </button>
        </div>
      </div>
    </div>
  );
};

