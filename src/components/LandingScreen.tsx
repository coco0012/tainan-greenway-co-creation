import React from 'react';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-dot-grid text-left h-full">
      <div className="relative max-w-2xl bg-white border-arch p-10 bg-opacity-95">
        {/* Corner Crosshairs */}
        <div className="absolute -top-2.5 -left-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -top-2.5 -right-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -bottom-3 -left-2 text-md font-mono text-gray-500 select-none">+</div>
        <div className="absolute -bottom-3 -right-2 text-md font-mono text-gray-500 select-none">+</div>

        {/* Blueprint Title Block Header */}
        <div className="flex justify-between items-center mb-6 border-b border-black pb-2">
          <span className="anno-label text-gray-500 font-semibold">[ 專案名稱：台南綠園道共創參與式雙生 ]</span>
          <span className="anno-label text-gray-500 font-semibold">[ 圖檔編號：AR-001 ]</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase text-black">
          台南綠園道共創
        </h1>
        <h2 className="text-sm font-semibold tracking-wider uppercase text-gray-600 mb-8 font-mono">
          生成式 AI 公民 RPG 與參與式數位雙生原型系統
        </h2>
        
        <p className="text-gray-800 leading-relaxed mb-10 text-justify text-sm border-l-2 border-black pl-4">
          「鐵路地下化後的台南市區將迎來一條嶄新的綠園道。然而，這片珍貴的都市綠帶究竟該如何規劃？在本系統中，您將扮演關鍵的利益關係人，與多位 AI 模擬市民代表進行空間提案協商，共同摸索出一套兼顧社會、環境與交通效率的都市空間策略。」
        </p>

        {/* Bottom Panel & Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-gray-300">
          <div className="flex flex-col font-mono text-[10px] text-gray-500 space-y-1">
            <div>比例尺：無比例 (N.T.S.)</div>
            <div>協商小組：06 組公民代表</div>
            <div>圖檔版本：概念設計草案 V1.0</div>
          </div>
          
          <button 
            onClick={onStart}
            className="w-full sm:w-auto border-arch hover:bg-[var(--color-brand-blue)] hover:text-white text-black bg-white px-8 py-3 font-mono text-sm tracking-wider uppercase font-bold transition-all duration-150 cursor-pointer active:translate-y-[1px]"
          >
            進入協商桌
          </button>
        </div>
      </div>
    </div>
  );
};

