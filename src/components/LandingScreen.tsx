import React, { useState } from 'react';
import { BookOpen, HelpCircle, Sparkles, Lock, X } from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-3xl w-full bg-[#FFFDF9] border-2 border-[#e5dfd5] rounded-[30px_25px_35px_28px_/_25px_30px_24px_35px] p-8 md:p-12 shadow-soft relative overflow-hidden">
        
        {/* Watercolor decorative background shapes */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--color-brand-green)] opacity-[0.06] pointer-events-none blur-xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[var(--color-brand-blue)] opacity-[0.06] pointer-events-none blur-xl" />

        {/* Title Block with hand-drawn feeling */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-50 border border-emerald-100 text-[var(--color-brand-green)] text-[11px] font-bold rounded-full mb-4 font-mono tracking-wider">
            <Sparkles size={12} className="animate-pulse" />
            台南都市再生系列：市民參與遊戲 // CIVIC RPG QUEST
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-dark)] tracking-tight font-serif mb-2">
            台南綠園道共創
          </h1>
          <h2 className="text-sm font-semibold tracking-widest text-gray-400 font-mono uppercase">
            Tainan Greenway Co-Creation Quest
          </h2>
        </div>

        {/* Watercolor Illustration Preview */}
        <div className="w-full h-48 md:h-64 rounded-[20px_24px_18px_22px] overflow-hidden border-2 border-[#e5dfd5] mb-8 shadow-soft-sm relative">
          <img 
            src="/greenway_watercolor.png" 
            alt="台南綠園道水彩插畫" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#e5dfd5] text-[10px] font-mono text-gray-500">
            [ 台南綠帶景觀規劃想像圖 ]
          </div>
        </div>

        {/* Introduction text */}
        <p className="text-[#5c554e] leading-relaxed text-center mb-10 text-sm max-w-xl mx-auto bg-[#faf8f4] border border-[#eee9df] p-5 rounded-[16px_20px_15px_18px] font-sans">
          鐵路地下化後的台南市區將迎來一條嶄新的綠色廊道。這片都市縫合的綠帶該如何定位？您將扮演市民代表，與多位 AI 模擬市民在協商圓桌上激盪觀點、權衡指標，共同規劃出屬於台南的未來綠色生活圈！
        </p>

        {/* RPG Start Menu */}
        <div className="max-w-xs mx-auto flex flex-col gap-3.5">
          <button 
            onClick={onStart}
            className="w-full bg-[var(--color-brand-green)] hover:bg-[#4b6a58] text-white px-8 py-3.5 rounded-full text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5"
          >
            <BookOpen size={18} />
            開始新遊戲 / New Game
          </button>

          <button 
            disabled
            className="w-full bg-[#f4eff3] border-2 border-dashed border-[#dcd6ca] text-gray-400 px-8 py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed select-none"
          >
            <Lock size={15} />
            載入舊存檔 (市民檔案庫暫存中)
          </button>

          <button 
            onClick={() => setShowTutorial(true)}
            className="w-full bg-white hover:bg-[#faf6ee] text-[var(--color-brand-blue)] border-2 border-[var(--color-brand-blue)] px-8 py-3.5 rounded-full text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <HelpCircle size={16} />
            遊戲說明 / Tutorial Guide
          </button>
        </div>

        {/* Bottom Credits */}
        <div className="mt-10 text-center text-[10px] text-gray-400 font-mono uppercase tracking-wider">
          v2.5 Watercolor RPG Version // Tainan City Planning
        </div>

        {/* Tutorial Overlay Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#FFFDF9] max-w-md w-full border-2 border-[#e5dfd5] rounded-[24px_28px_20px_26px] p-6 shadow-2xl relative">
              <button 
                onClick={() => setShowTutorial(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-2 mb-4 border-b border-[#e5dfd5] pb-2">
                <BookOpen className="text-[var(--color-brand-blue)] w-5 h-5" />
                <h3 className="text-lg font-bold text-[var(--color-text-dark)] font-serif">台南綠園道：規劃指南</h3>
              </div>

              <div className="space-y-4 text-xs text-[#5c554e] leading-relaxed font-sans">
                <div className="bg-[#faf8f4] p-3 rounded-lg border border-[#eee9df]">
                  <span className="font-bold text-[var(--color-brand-green)] block mb-1">🎭 角色扮演與訴求</span>
                  玩家將代表其中一個市民群體，每個角色都有其特殊立場。您的抉擇將直接引導綠帶配置。
                </div>
                
                <div className="bg-[#faf8f4] p-3 rounded-lg border border-[#eee9df]">
                  <span className="font-bold text-[var(--color-brand-blue)] block mb-1">💬 三回合圓桌協商</span>
                  共分三回合，分別處理不同路段的空間規劃。點選選項後，NPC 將發表他們的意見，且對話會記錄於圓桌記錄中。
                </div>

                <div className="bg-[#faf8f4] p-3 rounded-lg border border-[#eee9df]">
                  <span className="font-bold text-[var(--color-brand-coral)] block mb-1">⚖️ 衝擊指標與民意滿意度</span>
                  協商時必須兼顧生態、交通、居住、商業等指標。請避免任何指標過低（&lt;35），並在成果頁面爭取最多的「😊 非常滿意」代表！
                </div>
              </div>

              <button 
                onClick={() => setShowTutorial(false)}
                className="mt-6 w-full bg-[var(--color-brand-blue)] hover:bg-[#577585] text-white py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                理解了，關閉說明
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
