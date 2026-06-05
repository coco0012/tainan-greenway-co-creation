import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface StoryScreenProps {
  onComplete: () => void;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: '台南鐵路地下化與綠色縫合',
      subtitle: '釋出 1.4 公路的綠帶畫卷，迎來百年都市縫合機遇',
      content: '隨著縱貫線鐵路地下化計畫的推進，地表的鐵軌障礙將被徹底消除，在台南市中心釋出了一條長達 1.4 公里、寬度數十公尺的帶狀開放空間。這條騰空的新生綠廊，是台南百年來最大規模的都市縫合與空間重構機會！',
      badge: '🗺️ 空間脈絡背景',
      image: '/landing_cover.png',
      color: 'bg-blob-blue'
    },
    {
      title: '多元價值的空間拉鋸與衝突',
      subtitle: '高架快速自行車道的提案，引發市民群體的價值交鋒',
      content: '最初的規劃方案提出興建一條連續的高架自行車道以確保騎士能高速過境。但這也引起了沿線居民隱私受干擾的擔憂、沿街店家擔心流失地面層人流、長者抱怨缺乏樹蔭與座椅，以及環保團體對於水泥硬質鋪面阻礙都市降溫的抗議。通勤、隱私、商業、生態與文化，該如何取捨？',
      badge: '⚖️ 利益關係人衝突',
      image: '/greenway_watercolor.png',
      color: 'bg-blob-yellow'
    },
    {
      title: '當鐵路進入地下，地面上的綠園道該屬於誰？',
      subtitle: '核心空間主權拷問 ── 綠園道的命運由您共同審議',
      content: '這個長達 1.4 公里的線性公共空間，是應該優先作為騎士的「高速通勤路廊」？還是應該還給沿線居民與店鋪店家的「地面層慢活街區」？又或者是屬於高齡市民與環保人士的「降溫林蔭生態帶」？不同的空間分配，決定了這座城市未來的公共生活面貌。',
      badge: '❓ 公民共創核心詰問',
      image: '/future_city_25d.png',
      color: 'bg-blob-pink'
    },
    {
      title: '您的市民共創協商使命',
      subtitle: '親臨現場踏查，進行市民協商，微調出最佳空間策略',
      content: '這不是一次由上而下的傳統規劃，而是一場參與式的數位雙生公民共創！您將化身為選定的市民代表，點選地圖探索 5 個核心路段，與現場居民 NPC 交談收集公民觀點 💡。接著，進入協商會議做抉擇，並在規劃工作台上微調空間政策，最後生成送審方案！',
      badge: '🎮 玩家規劃使命',
      image: '/future_city_25d.png',
      color: 'bg-blob-green'
    }
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    }
  };

  const current = slides[slide];

  return (
    <div className="flex-1 flex flex-col p-4 bg-[var(--color-bg-warm)] h-full overflow-hidden justify-center items-center">
      <div className="max-w-4xl w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 md:p-10 shadow-flat-pop-lg relative flex flex-col justify-between min-h-[540px] md:min-h-[580px] overflow-hidden">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-4 border-b-3 border-[#1f1d1b] pb-3 shrink-0">
          <span className="px-3 py-1 bg-blob-pink border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 PHASE 0 : 綠園道開場故事簡介 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">故事進度：{slide + 1} / 4 頁</span>
        </div>

        {/* Content Box */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 items-center my-2 overflow-y-auto pr-1">
          {/* Text Info */}
          <div className="w-full md:w-1/2 flex flex-col text-left">
            <span className="self-start px-2 py-0.5 mb-2 bg-white border-2 border-[#1f1d1b] text-[10px] font-bold text-[#1f1d1b] rounded shadow-[1px_1px_0px_0px_#1f1d1b]">
              {current.badge}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1 text-[#1f1d1b] font-serif leading-tight">
              {current.title}
            </h1>
            <h2 className="text-xs md:text-sm font-bold text-[#8ea63d] mb-4">
              {current.subtitle}
            </h2>
            <div className="bg-gray-50 border-2 border-[#1f1d1b] p-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(31,29,27,1)] text-xs md:text-sm leading-relaxed text-[#1f1d1b] font-sans font-medium">
              {current.content}
            </div>
          </div>

          {/* Visual card */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className={`w-full h-48 md:h-64 rounded-xl border-3 border-[#1f1d1b] shadow-flat-pop relative overflow-hidden ${current.color} flex items-center justify-center`}>
              <img 
                src={current.image} 
                alt={current.title} 
                className="w-full h-full object-cover pointer-events-none select-none"
              />
              <div className="absolute top-2 right-2 bg-white border-2 border-[#1f1d1b] px-2 py-0.5 rounded text-[8px] font-bold text-gray-500 shadow-[1px_1px_0px_0px_#1f1d1b]">
                💻 模擬圖
              </div>
            </div>
          </div>
        </div>

        {/* Source Note Label */}
        <div className="text-[8.5px] text-gray-400 font-mono select-none text-left mt-2 border-t border-dashed border-gray-200 pt-2 shrink-0 flex items-center gap-1">
          <span>⚠️ 依官方公開資訊整理之原型資料 / Source-informed prototype data</span>
        </div>

        {/* Navigation panel */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t-3 border-[#1f1d1b] pt-4 mt-2 shrink-0">
          
          {/* Indicator dots */}
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <span 
                key={idx} 
                className={`w-3.5 h-3.5 rounded-full border-2 border-[#1f1d1b] transition-colors ${
                  idx === slide ? 'bg-[#f3ce6b]' : 'bg-white'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
            {slide > 0 && (
              <button 
                onClick={handlePrev}
                className="btn-flat-action px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 bg-white text-[#1f1d1b] border-3 border-[#1f1d1b]"
              >
                <ChevronLeft size={16} /> 上一步 / Previous
              </button>
            )}
            
            <button 
              onClick={handleNext}
              className="flex-1 sm:flex-none btn-flat-action px-7 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 bg-[var(--color-brand-green)] hover:bg-[#a6bf4c] text-white shadow-flat-pop font-bold"
            >
              {slide < slides.length - 1 ? (
                <>下一步 / Next <ChevronRight size={16} /></>
              ) : (
                <>開始登記代表身分 ➔</>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
