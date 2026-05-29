import React from 'react';
import { Users, MapPin, BarChart3 } from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--color-bg-warm)] h-full">
      <div className="max-w-2xl w-full bg-[#FAF8F5] border border-[#e8e5e0] rounded-3xl p-10 shadow-soft text-center relative overflow-hidden">
        
        {/* Subtle background decoration representing urban layers */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[var(--color-brand-green)] opacity-10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[var(--color-brand-blue)] opacity-10 pointer-events-none" />
        
        {/* Subtle tag */}
        <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 text-[var(--color-brand-blue)] text-[10px] font-bold rounded-full mb-6 font-mono tracking-wider">
          參與式數位雙生原型 // CIVIC GAME PROTOTYPE
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          台南綠園道共創
        </h1>
        <h2 className="text-sm font-semibold tracking-wider text-gray-400 mb-8 font-mono uppercase">
          Tainan Greenway Co-Creation
        </h2>

        {/* Small Game Concept illustration cards */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center shadow-soft-sm">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-[var(--color-brand-coral)] flex items-center justify-center mb-2">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-gray-800">角色扮演</span>
            <span className="text-[9px] text-gray-400 mt-1">模擬市民協商</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center shadow-soft-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-[var(--color-brand-green)] flex items-center justify-center mb-2">
              <MapPin size={20} />
            </div>
            <span className="text-xs font-bold text-gray-800">空間提案</span>
            <span className="text-[9px] text-gray-400 mt-1">動態規劃配置</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center shadow-soft-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center mb-2">
              <BarChart3 size={20} />
            </div>
            <span className="text-xs font-bold text-gray-800">績效指標</span>
            <span className="text-[9px] text-gray-400 mt-1">綜合影響分析</span>
          </div>
        </div>
        
        <p className="text-gray-600 leading-relaxed mb-10 text-sm max-w-lg mx-auto bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/50">
          鐵路地下化後的台南市區將迎來一條嶄新的綠園道。這片寶貴的綠帶該如何定位？您將扮演市民代表，與多位 AI 模擬市民進行空間提案協商，共同權衡並規劃出最平衡的未來城市願景。
        </p>

        <button 
          onClick={onStart}
          className="bg-[var(--color-brand-blue)] hover:bg-[#5b7a8c] text-white px-10 py-4 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
        >
          開始協商 / Start Civic Negotiation
        </button>
        
        <div className="mt-8 text-[10px] text-gray-400 font-mono">
          DRAFT PLAN V2.0 (CIVIC DASHBOARD VERSION)
        </div>
      </div>
    </div>
  );
};

