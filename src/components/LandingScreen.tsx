import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Sparkles, Lock, X, ChevronRight, ChevronLeft, Volume2, ShieldAlert } from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isIntroStarted, setIsIntroStarted] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    // Trigger fade in on mount
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const slides = [
    {
      title: '台南鐵路地下化與綠色縫合',
      subtitle: '釋出 8.23 公里綠色廊道，迎來百年都市縫合機遇',
      content: '隨著縱貫線鐵路地下化計畫的推進，地表的鐵軌障礙將被徹底消除，在台南市中心釋出了一條長達 8.23 公里、寬度數十公尺的帶狀開放空間。這條騰空的新生綠廊，是台南百年來最大規模的都市縫合與空間重構機會！',
      badge: '🗺️ 空間脈絡背景',
      image: '/landing_cover.png',
      color: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      textColor: 'text-indigo-800'
    },
    {
      title: '多元價值的空間拉鋸與衝突',
      subtitle: '高架快速自行車道的提案，引發市民群體的價值交鋒',
      content: '最初的規劃方案提出興建一條連續的高架自行車道以確保騎士能高速過境。但這也引起了沿線居民隱私受干擾的擔憂、沿街店家擔心流失地面層人流、長者抱怨缺乏樹蔭與座椅，以及環保團體對於水泥硬質鋪面阻礙都市降溫的抗議。通勤、隱私、商業、生態與安全，該如何取捨？',
      badge: '⚖️ 利益關係人衝突',
      image: '/greenway_watercolor.png',
      color: 'bg-gradient-to-br from-amber-50 to-orange-100',
      textColor: 'text-orange-800'
    },
    {
      title: '當鐵路進入地下，地面上的綠園道該屬於誰？',
      subtitle: '核心空間主權拷問 ── 綠園道的命運由您共同審議',
      content: '這個長達 8.23 公里的線性公共空間，是應該優先作為騎士的「高速通勤路廊」？還是應該還給沿線居民與店鋪店家的「地面層慢活街區」？又或者是屬於高齡市民與環保人士的「降溫林蔭生態帶」？不同的空間分配，決定了這座城市未來的公共生活面貌。',
      badge: '❓ 公民共創核心詰問',
      image: '/future_city_25d.png',
      color: 'bg-gradient-to-br from-rose-50 to-pink-100',
      textColor: 'text-rose-800'
    },
    {
      title: '您的城市協調者使命',
      subtitle: '排除假消息、降低暴民衝突，共創共榮綠色日常',
      content: '這不是一次由上而下的傳統規劃，而是一場參與式的都市探索 RPG！您將扮演選定的協調角色，踏入 2.5D 綠道地圖，行走並接觸現場居民與衝突 NPC（如「抱怨暴民」、「過度管制者」、「極端開發派」等），通過規劃抉擇降低衝突值（Conflict Value），取得最終綠廊的動態模擬展示！',
      badge: '🎮 玩家協調者使命',
      image: '/meeting_photo.jpg',
      color: 'bg-gradient-to-br from-emerald-50 to-teal-100',
      textColor: 'text-emerald-800'
    }
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onStart();
    }
  };

  const handlePrev = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    }
  };

  const currentSlide = slides[slide];

  if (isIntroStarted) {
    return (
      <div className="flex-1 flex flex-col p-4 md:p-8 bg-[#1f1d1b] text-white h-full justify-center items-center overflow-hidden relative font-sans">
        {/* Animated Background Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

        {/* Ambient Watercolor Panning Background Layer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-15 pointer-events-none mix-blend-screen scale-105 transition-all duration-[2000ms]">
          <img src={currentSlide.image} alt="ambient bg" className="w-full h-full object-cover blur-md" />
        </div>

        {/* Cinematic Main Story Container */}
        <div className="max-w-5xl w-full bg-[#FFFFFF] border-3 border-black text-[#1f1d1b] rounded-2xl p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col justify-between min-h-[560px] md:min-h-[600px] overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b-3 border-[#1f1d1b] pb-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-red-100 border-2 border-[#1f1d1b] text-red-800 text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono tracking-wider">
                【 COZY PROLOGUE // 前情提要 】
              </span>
              <span className="text-[10px] text-gray-400 font-mono hidden sm:inline-block">8.23 KM GREENWAY OVERVIEW</span>
            </div>
            <span className="text-xs font-mono font-bold text-gray-400">分鏡：{slide + 1} / 4</span>
          </div>

          {/* Core layout */}
          <div className="flex-1 flex flex-col md:flex-row gap-8 items-center my-4 overflow-y-auto pr-1">
            
            {/* Left: Text & Story Context */}
            <div className="w-full md:w-1/2 flex flex-col text-left">
              <span className="self-start px-2 py-0.5 mb-3.5 bg-white border-2 border-[#1f1d1b] text-[10px] font-black rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b]">
                {currentSlide.badge}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-1.5 text-[#1f1d1b] font-serif leading-tight animate-fade-in">
                {currentSlide.title}
              </h1>
              <h2 className={`text-xs md:text-sm font-black mb-5 tracking-wide ${currentSlide.textColor}`}>
                {currentSlide.subtitle}
              </h2>
              
              <div className="bg-[#FAF8F5] border-3 border-[#1f1d1b] p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(31,29,27,1)] text-xs md:text-sm leading-relaxed font-semibold text-gray-700 leading-relaxed font-serif relative">
                {/* Visual pin decoration */}
                <div className="absolute top-2.5 right-3 w-2.5 h-2.5 rounded-full bg-red-400 border border-black" />
                {currentSlide.content}
              </div>
            </div>

            {/* Right: Immersive Image with Stakeholder Silhouettes */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className={`w-full h-52 md:h-72 rounded-2xl border-3 border-[#1f1d1b] shadow-flat-pop relative overflow-hidden ${currentSlide.color} flex items-center justify-center`}>
                
                {/* Slide Artwork */}
                <img 
                  src={currentSlide.image} 
                  alt={currentSlide.title} 
                  className="w-full h-full object-cover select-none pointer-events-none opacity-85 transition-transform duration-[4000ms] hover:scale-105"
                />

                {/* Silhouette Overlays to reinforce the community context */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                {/* Watercolor Stamp Tag */}
                <div className="absolute bottom-3 right-3 bg-white border-2 border-[#1f1d1b] px-2.5 py-0.5 rounded-md text-[8.5px] font-bold text-gray-500 shadow-[1px_1px_0px_0px_#1f1d1b]">
                  🏡 市民大會共創資料
                </div>
              </div>
            </div>

          </div>

          {/* Footer Navigation controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t-3 border-[#1f1d1b] pt-4 mt-2 shrink-0">
            
            {/* Dots */}
            <div className="flex gap-2.5">
              {slides.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`w-3.5 h-3.5 rounded-full border-2 border-[#1f1d1b] transition-all duration-200 ${
                    idx === slide ? 'bg-[#f3ce6b] scale-110 shadow-[1px_1px_0px_0px_#1f1d1b]' : 'bg-white'
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              {slide > 0 && (
                <button 
                  onClick={handlePrev}
                  className="btn-flat-action px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 bg-white text-[#1f1d1b] border-3 border-[#1f1d1b] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  <ChevronLeft size={16} /> 上一步 / Prev
                </button>
              )}
              
              <button 
                onClick={handleNext}
                className="flex-1 sm:flex-none btn-flat-action px-7 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 bg-[var(--color-brand-green)] hover:bg-[#a6bf4c] text-white shadow-flat-pop font-bold cursor-pointer"
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
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-8 md:p-12 shadow-flat-pop-lg relative overflow-hidden flex flex-col md:flex-row gap-8 items-center animate-scale-in">
        
        {/* Left Side: Illustration and Tag */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border-3 border-[#1f1d1b] shadow-flat-pop relative bg-blob-blue mb-4">
            <img 
              src="/meeting_photo.jpg" 
              alt="台南綠園道共創現場照片" 
              className={`w-full h-full object-cover transition-opacity duration-[1800ms] ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          <div className="bg-blob-yellow border-2 border-[#1f1d1b] p-3 rounded-lg text-[10.5px] font-bold text-[#1f1d1b] leading-normal font-sans shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            📌 【城市縫合挑戰】：台南鐵路地下化後騰出 **8.23 公里** 綠色廊道，如何滿足「通勤效率」、「住宅隱私」、「街區經濟」、「生態保水」的多方平衡？考驗您作為協調者的智慧！
          </div>
        </div>

        {/* Right Side: Title and Controls */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-full py-2">
          <div>
            {/* Project Proposal Tag */}
            <div className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 justify-center md:justify-start">
              <span>Project RPG // 2.5D 城市協商遊戲</span>
            </div>

            {/* Memphis Styled Large Title */}
            <div className="text-center md:text-left mb-5 text-[#1f1d1b]">
              <h1 className="text-3xl md:text-4.5xl font-extrabold tracking-tight mb-2 title-memphis leading-tight">
                Tainan <br className="hidden md:block" /> Greenway <br className="hidden md:block" /> Co-Creation
              </h1>
              <p className="text-xs md:text-sm font-black text-rose-500 font-sans tracking-wide uppercase mt-1 animate-pulse flex items-center justify-center md:justify-start gap-1">
                <ShieldAlert size={14} />
                「當鐵道走入地下，市民的衝突該如何平息？」
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs text-[#5c554e] leading-relaxed mb-6 text-center md:text-left bg-gray-50 border-2 border-[#1f1d1b] p-4 rounded-xl shadow-[2.5px_2.5px_0px_0px_#1f1d1b] font-semibold font-serif">
              在這個遊戲中，您將登記為代表市民的協調者，踏入 2.5D 大地圖關卡。您需要親臨通行、商業、生態等衝突節點，會晤暴民與極端意見，做出關鍵規劃抉擇以降低衝突值，最後共創出大會審定的綠意新日常！
            </p>
          </div>

          {/* RPG Style Start Menu Buttons */}
          <div className="flex flex-col gap-3 w-full mx-auto md:mx-0">
            <button 
              onClick={() => setIsIntroStarted(true)}
              className="btn-flat-action w-full bg-[var(--color-brand-green)] hover:bg-[#a6bf4c] text-white py-3.5 rounded-xl text-base flex items-center justify-center gap-2 cursor-pointer shadow-flat-pop font-bold"
            >
              <BookOpen size={18} />
              進入協調協商任務 / Start Quest
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
              className="btn-flat-action w-full bg-white hover:bg-[#fffdf2] text-[#1f1d1b] py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] font-bold"
            >
              <HelpCircle size={16} className="text-[var(--color-brand-blue)]" />
              協調遊戲指引 / Game Guide
            </button>
          </div>
        </div>

        {/* Tutorial Overlay Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#FFFFFF] max-w-md w-full border-3 border-[#1f1d1b] rounded-2xl p-6 shadow-flat-pop-lg relative text-left">
              <button 
                onClick={() => setShowTutorial(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1f1d1b] pb-2">
                <BookOpen className="text-[var(--color-brand-blue)] w-5 h-5" />
                <h3 className="text-lg font-bold text-[#1f1d1b] font-serif">台南綠園道：協調指南</h3>
              </div>

              <div className="space-y-3.5 text-xs text-[#1f1d1b] leading-relaxed font-sans font-medium">
                <div className="bg-blob-green/30 border-2 border-[#1f1d1b] p-3 rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-bold text-[#3e5f4c] block mb-0.5">🕹️ 鍵盤左右與行走</span>
                  使用 WASD 或方向鍵控制角色在大地圖上自由漫步，尋找發光的關卡入口。
                </div>
                
                <div className="bg-blob-blue/30 border-2 border-[#1f1d1b] p-3 rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-bold text-[#4d7082] block mb-0.5">⚔️ 對話對決與意見收集</span>
                  接近「抱怨暴民」、「過度管制者」或關卡傳送門後，按 **【E / SPACE】** 進入關卡。閱讀代表與衝突者的對白並進行設計選擇。
                </div>

                <div className="bg-blob-pink/30 border-2 border-[#1f1d1b] p-3 rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-bold text-[#c26257] block mb-0.5">📉 扣減衝突值與通關</span>
                  每個關卡共有多個設計方案。若成功將大眾「衝突值」降至 **30% 以下** 即算成功通關，並解鎖下一個廊段關卡，直到召開市民大會！
                </div>
              </div>

              <button 
                onClick={() => setShowTutorial(false)}
                className="btn-flat-action mt-6 w-full bg-[var(--color-brand-blue)] hover:bg-[#8bbddf] text-white py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                理解了，關閉指引
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
