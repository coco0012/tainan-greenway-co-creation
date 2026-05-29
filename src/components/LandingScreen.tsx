import React, { useState } from 'react';
import { BookOpen, HelpCircle, Sparkles, Lock, X } from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-8 md:p-12 shadow-flat-pop-lg relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
        
        {/* Left Side: Illustration and Tag */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border-3 border-[#1f1d1b] shadow-flat-pop relative bg-blob-blue mb-4">
            <img 
              src="/landing_cover.png" 
              alt="台南綠園道共創扁平插畫" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-blob-yellow border-2 border-[#1f1d1b] p-3 rounded-lg text-[11px] font-bold text-[#1f1d1b] leading-normal font-sans">
            📌 【市民小叮嚀】：鐵路地下化後的綠意縫合，不只關乎生態，更關乎您我的生活日常。本平台結合生成式 AI 與市民代表踏查，讓大家共創共創理想的綠色廊道。
          </div>
        </div>

        {/* Right Side: Title and Controls */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-full py-2">
          <div>
            {/* Project Proposal Tag */}
            <div className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 justify-center md:justify-start">
              <span>Project Proposal // 專案企劃案</span>
            </div>

            {/* Memphis Styled Large Title */}
            <div className="text-center md:text-left mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 title-memphis leading-tight">
                Tainan <br className="hidden md:block" /> Greenway <br className="hidden md:block" /> Co-Creation
              </h1>
              <p className="text-xs md:text-sm font-bold text-[#1f1d1b] font-sans mt-2">
                基於生成式 AI 的參與式數位雙生綠園道共創平台
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs text-[#5c554e] leading-relaxed mb-8 text-center md:text-left bg-gray-50 border border-gray-200 p-4 rounded-xl">
              您將化身為所選定的市民代表，沿著 1.4 公里的綠帶畫卷進行「實地踏查移動」，與沿途的居民、商家、長者以及設計師 NPC 展開深度對話，並提交空間策略提案。
            </p>
          </div>

          {/* RPG Style Start Menu Buttons */}
          <div className="flex flex-col gap-3.5 max-w-sm w-full mx-auto md:mx-0">
            <button 
              onClick={onStart}
              className="btn-flat-action w-full bg-[var(--color-brand-green)] hover:bg-[#a6bf4c] text-white py-3.5 rounded-xl text-base flex items-center justify-center gap-2 cursor-pointer shadow-flat-pop"
            >
              <BookOpen size={18} />
              開始新遊戲 / Start Quest
            </button>

            <button 
              disabled
              className="w-full bg-[#f4eff3] border-3 border-dashed border-[#ded8ce] text-gray-400 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed select-none"
            >
              <Lock size={15} />
              讀取舊存檔 (市民檔案庫暫存中)
            </button>

            <button 
              onClick={() => setShowTutorial(true)}
              className="btn-flat-action w-full bg-white hover:bg-[#fffdf2] text-[#1f1d1b] py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle size={16} className="text-[var(--color-brand-blue)]" />
              遊戲說明 / Tutorial Guide
            </button>
          </div>
        </div>

        {/* Tutorial Overlay Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#FFFFFF] max-w-md w-full border-3 border-[#1f1d1b] rounded-2xl p-6 shadow-flat-pop-lg relative">
              <button 
                onClick={() => setShowTutorial(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1f1d1b] pb-2">
                <BookOpen className="text-[var(--color-brand-blue)] w-5 h-5" />
                <h3 className="text-lg font-bold text-[#1f1d1b] font-serif">台南綠園道：踏查指南</h3>
              </div>

              <div className="space-y-4 text-xs text-[#1f1d1b] leading-relaxed font-sans">
                <div className="bg-blob-green/30 border-2 border-[#1f1d1b] p-3.5 rounded-xl">
                  <span className="font-bold text-[#3e5f4c] block mb-1">🕹️ 鍵盤左右鍵 / AD 鍵移動</span>
                  您可以使用鍵盤的方向鍵（←、→）或 A、D 鍵，控制您的角色在頂部的綠帶畫卷地圖上左右自由行走。
                </div>
                
                <div className="bg-blob-blue/30 border-2 border-[#1f1d1b] p-3.5 rounded-xl">
                  <span className="font-bold text-[#4d7082] block mb-1">💬 與沿途的 NPC 市民代表交談</span>
                  當您走到地圖上 NPC 頭像附近時，按下 **【 空白鍵 (SPACE) 】** 或點擊提示，即可開啟對話並進行該路段的規劃協商。
                </div>

                <div className="bg-blob-pink/30 border-2 border-[#1f1d1b] p-3.5 rounded-xl">
                  <span className="font-bold text-[#c26257] block mb-1">⚖️ 協商策略與指標平衡</span>
                  做出每個決定後，NPC 會給予相應的意見反饋，並改變綠園道的居住、商業、生態等都市指標。請隨時點選右上角的「規劃筆記本 (📖)」確認指標！
                </div>
              </div>

              <button 
                onClick={() => setShowTutorial(false)}
                className="btn-flat-action mt-6 w-full bg-[var(--color-brand-blue)] hover:bg-[#8bbddf] text-white py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
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
