import React, { useState } from 'react';
import { GameStats } from '@/app/page';
import { RefreshCw, CheckCircle, Award, Sparkles, Smile, ShieldAlert, Heart, Trees, HelpCircle } from 'lucide-react';

interface FinalResultProps {
  stats: GameStats;
  playerRole: { id: string; name: string };
  levelChoices: Record<number, string>;
  onRestart: () => void;
}

export const FinalResult: React.FC<FinalResultProps> = ({
  stats,
  playerRole,
  levelChoices,
  onRestart
}) => {
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);

  // Calculate Title & Badge based on final scores
  const getAwardInfo = () => {
    const { residentSat, merchantSat, commuterEff, ecologicalScore, safetySense, activityVitality, conflictValue } = stats;
    
    if (conflictValue <= 20 && residentSat >= 60 && merchantSat >= 60 && commuterEff >= 60 && ecologicalScore >= 60) {
      return {
        title: '城市共感設計師',
        description: '您成功在居民隱私、商圈生存、綠色通勤與生態降溫之間找到了完美的黃金平衡，達成了極其珍貴的市民大會共識！',
        stamp: '💮 共感優等',
        bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        stampColor: 'text-emerald-600 border-emerald-600'
      };
    } else if (ecologicalScore >= 75) {
      return {
        title: '綠色守護者',
        description: '您在大會中堅持守護城市的生態走廊，廣植密林大樹與海綿透水雨水花園，為台南的炎夏帶來了最清涼的自然救贖。',
        stamp: '🌳 生態特優',
        bgColor: 'bg-green-50 text-green-800 border-green-300',
        stampColor: 'text-green-600 border-green-600'
      };
    } else if (activityVitality >= 70 && merchantSat >= 70) {
      return {
        title: '活力街區策展人',
        description: '您極大化地保留了地面層的共享街區、外送臨停與夜市活動，讓鐵路地下化後的地面成了最熱鬧的人流磁鐵與商機聚落！',
        stamp: '🛍️ 活力商業',
        bgColor: 'bg-amber-50 text-amber-800 border-amber-300',
        stampColor: 'text-amber-600 border-amber-600'
      };
    } else if (commuterEff >= 70) {
      return {
        title: '流線效率規劃師',
        description: '速度就是正義！您規劃出連續、安全且順暢的單車通勤引道與 YouBike 停靠，極大化了台南低碳綠色通勤的速度感。',
        stamp: '🚲 交通效率',
        bgColor: 'bg-sky-50 text-sky-800 border-sky-300',
        stampColor: 'text-sky-600 border-sky-600'
      };
    } else {
      return {
        title: '混亂野性規劃師',
        description: '在利益的拉鋸戰中，您的規劃偏向了特定極端，或者大眾衝突值依然居高不下。這是一段狂野的綠園道，市民們仍在努力習慣中。',
        stamp: '💢 狂野共創',
        bgColor: 'bg-red-50 text-red-800 border-red-300',
        stampColor: 'text-red-600 border-red-600'
      };
    }
  };

  const award = getAwardInfo();

  // Helper to calculate custom SVG radar chart points
  const getRadarPoints = () => {
    const cx = 150;
    const cy = 135;
    const rMax = 90;
    const metrics = [
      stats.residentSat,       // 0: 居民
      stats.merchantSat,       // 1: 商家
      stats.commuterEff,       // 2: 交通
      stats.ecologicalScore,   // 3: 生態
      stats.safetySense,       // 4: 安全
      stats.activityVitality   // 5: 活力
    ];

    return metrics.map((val, idx) => {
      const angle = (idx * Math.PI) / 3 - Math.PI / 2; // Straight up at index 0
      const radius = (val / 100) * rMax;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // Get grid polygon points for radar background (e.g. at 25, 50, 75, 100%)
  const getRadarGridPoints = (percent: number) => {
    const cx = 150;
    const cy = 135;
    const r = (percent / 100) * 90;
    return Array.from({ length: 6 }).map((_, idx) => {
      const angle = (idx * Math.PI) / 3 - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
  };

  // Reactive feedback dictionary based on player choices
  const getCharacterFeedback = (charId: string) => {
    const c1 = levelChoices[1]; // Level 1 Choice (a, b, c)
    const c2 = levelChoices[2]; // Level 2 Choice (a, b, c)
    const c3 = levelChoices[3]; // Level 3 Choice (a, b, c)

    switch (charId) {
      case 'resident': // 周明 (居民)
        if (c1 === '1c') return '「平面綠牆分流設計很棒！防範了單車視線，保留了我們二樓陽台隱私，清靜又安全。」';
        if (c1 === '1b') return '「平面慢行很安全，但外面的單車騎士好像一直在抱怨騎不動。」';
        return '「這連續高架車道太貼近我們陽台了，每天像被人看光光，睡覺也吵得要命！」';

      case 'merchant': // 莉雅 (商家)
        if (c2 === '2c') return '「口袋廣場和時段分流真讚！晚上九點收攤顧全了鄰里，臨停位更方便店面進出卸貨，生意旺旺！」';
        if (c2 === '2b') return '「擺攤自由是好，但垃圾和油煙被住戶投訴，天天在吵架，也讓人頭大。」';
        return '「完全禁止攤商活動簡直扼殺了青年路商圈！整個綠道冷冰冰，沒人來消費！」';

      case 'commuter': // 小宇 (騎士)
        if (c1 === '1c') return '「雖然降到地面，但因為有綠牆分流，不需要一直閃避老人家，騎起來還是很順暢安全！」';
        if (c1 === '1a') return '「高架自行車道沒有紅綠燈，騎起來極速狂飆，超有快感！」';
        return '「平面速限只有 10km，比走路快一點而已，綠色通勤路網形同虛設！」';

      case 'elderly': // 陳伯伯 (長者)
        if (c3 === '3c') return '「透水碎石與向下照的暖色路燈非常貼心！路燈既不刺眼，又照亮了腳步，散步不怕摔倒了。」';
        if (c3 === '3a') return '「路燈像太陽一樣刺眼，整片水泥硬邦邦的，吸熱很嚴重，走沒幾步就累了。」';
        return '「沒有路燈黑漆漆的灌木叢太可怕了，晚上根本不敢出門散步。」';

      case 'environmentalist': // 綠野老師 (生態學者)
        if (c3 === '3c') return '「暖光地燈避開樹冠，保護了鳥類和昆蟲的夜空；碎石透水雨水花園也留住了海綿綠廊，很讚！」';
        if (c3 === '3b') return '「生態保留最完整！只是一到晚上市民就抗議太暗，說有蚊蟲，這需要協調。」';
        return '「全線水泥化和高強度鈉路燈是生態災難！熱島效應更嚴重，這完全是假綠園道！」';

      case 'designer': // 林科長 (設計師)
        if (c1 === '1c' && c2 === '2c' && c3 === '3c') {
          return '「太完美了！各項空間策略都落在最佳協商點，大會審定一致通過，這就是參與式共創！」';
        }
        return '「這是一個充滿個性的方案。雖然某些群體非常滿意，但大眾的衝突依然需要後續持續協商與優化。」';

      case 'mob': // 暴民阿寶 (改過自新的暴民)
        if (c2 === '2c' && c3 === '3c') return '「本來我覺得綠地多蚊蟲、點燈不夠亮是在擺爛，但這個暖光人行道和限時廣場規劃讓我無話可說，現在每天都來散步！」';
        if (c2 === '2b') return '「這裡油煙噪音太重了，吵死人！天天投訴，不投訴才怪！」';
        return '「晚上黑得像鬼片現場，政府是沒預算裝路燈是不是？太危險了！」';

      default:
        return '「綠園道是我們市民共同的生活空間，讓我們繼續共創！」';
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-6 bg-[var(--color-bg-warm)] h-full overflow-y-auto font-sans text-left relative">
      
      {/* Dynamic CSS Keyframe animations for Comic Simulation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes floatCloud {
          0% { transform: translateX(-40px); }
          100% { transform: translateX(860px); }
        }
        @keyframes bobCharacter {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes cyclePedal {
          0% { transform: translate(0, 0); }
          50% { transform: translate(15px, -2px); }
          100% { transform: translate(30px, 0); }
        }
        @keyframes steamRise {
          0% { transform: translateY(0) scale(0.9); opacity: 0.2; }
          50% { transform: translateY(-8px) scale(1.1); opacity: 0.6; }
          100% { transform: translateY(-16px) scale(1.3); opacity: 0; }
        }
        .animate-sway {
          animation: sway 4s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .animate-cloud {
          animation: floatCloud 25s linear infinite;
        }
        .animate-bob {
          animation: bobCharacter 1.8s ease-in-out infinite;
        }
        .animate-cycle {
          animation: cyclePedal 3.5s ease-in-out infinite;
        }
        .animate-steam {
          animation: steamRise 2.5s ease-in-out infinite;
        }
      `}} />

      {/* Hand-drawn style sketchbook binder mockup */}
      <div className="max-w-4xl w-full bg-[#FCFAF2] border-3 border-[#1f1d1b] rounded-2xl p-6 md:p-10 shadow-flat-pop-lg text-left relative overflow-hidden mt-6">
        
        {/* Notebook top spiral holes decoration */}
        <div className="absolute top-0 left-12 right-12 h-4 flex justify-between pointer-events-none opacity-80 select-none">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-3.5 h-6 bg-[var(--color-bg-warm)] border-2 border-[#1f1d1b] rounded-full -translate-y-3.5 shadow-inner" />
          ))}
        </div>

        {/* Memo header */}
        <div className="flex justify-between items-center mb-6 border-b-3 border-[#1f1d1b] pb-4 mt-2">
          <span className="px-3.5 py-1 bg-rose-100 border-2 border-rose-400 text-rose-800 text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#f43f5e] font-mono uppercase tracking-wider">
            【 PHASE 3 : 市民大會最終方案審定結果 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">核備單：Tainan Greenway Final Verdict</span>
        </div>

        {/* Strategy Header with dynamic Badge and Stamp */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-5">
          <div className="flex-1">
            <div className="uppercase tracking-widest text-[10px] font-mono text-[var(--color-brand-coral)] font-bold mb-1.5 flex items-center gap-1">
              <Sparkles size={12} className="animate-spin" />
              Tainan Greenway Co-Creation Agreement / 8.23KM 廊道審定書
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f1d1b] title-memphis leading-tight">
              台南綠園道：{award.title}
            </h1>
          </div>
          
          {/* Stamp Badge */}
          <div className="shrink-0 flex items-center">
            <div className={`px-4 py-2.5 rounded-xl border-3 border-[#1f1d1b] bg-white shadow-[3px_3px_0px_0px_#1f1d1b] flex items-center gap-2 rotate-[-4deg] hover:rotate-0 transition-all duration-200 select-none ${award.bgColor}`}>
              <span className="text-xl">🏛️</span>
              <div className="text-left">
                <div className="text-[7.5px] font-extrabold text-gray-500 font-mono tracking-wider">OFFICIAL SEAL</div>
                <div className="text-xs font-black tracking-tight">{award.stamp}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Immersive Fully Animated Comic-style Simulation Map */}
        <div className="mb-8">
          <span className="text-[10px] font-black text-gray-400 font-mono block mb-2 uppercase">
            [ 🏡 審定方案之未來綠園道：動態漫畫成果模擬圖 ]
          </span>

          <div className="w-full h-64 md:h-80 border-3 border-black rounded-2xl bg-[#ebf3ed] relative overflow-hidden shadow-flat-pop">
            
            {/* Drifting Clouds */}
            <div className="absolute top-4 left-0 w-12 h-6 opacity-40 pointer-events-none animate-cloud">
              <div className="w-8 h-4 bg-white rounded-full absolute" />
              <div className="w-6 h-4 bg-white rounded-full absolute left-4 -top-1" />
            </div>
            <div className="absolute top-10 left-[-200px] w-12 h-6 opacity-30 pointer-events-none animate-cloud" style={{ animationDelay: '8s' }}>
              <div className="w-10 h-5 bg-white rounded-full absolute" />
              <div className="w-6 h-4 bg-white rounded-full absolute left-4 -top-1" />
            </div>

            {/* Winding Green Parkway Ribbon */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              {/* grass background */}
              <path d="M 0,200 Q 250,150 500,210 T 1000,190 L 1000,320 L 0,320 Z" fill="#acd0a2" opacity="0.85" />
              {/* cycle track */}
              <path d="M 0,210 Q 250,160 500,220 T 1000,200" stroke="#cfe2d7" strokeWidth="18" fill="none" opacity="0.9" />
              {/* pedestrian path */}
              <path d="M 0,222 Q 250,172 500,232 T 1000,212" stroke="#FAF8F5" strokeWidth="8" fill="none" opacity="0.95" />
            </svg>

            {/* Swaying Landscape Trees */}
            <div className="absolute top-36 left-[8%] animate-sway pointer-events-none" style={{ animationDelay: '0.2s' }}>
              <span className="text-4xl">🌳</span>
            </div>
            <div className="absolute top-28 left-[28%] animate-sway pointer-events-none" style={{ animationDelay: '1.2s' }}>
              <span className="text-3.5xl">🌳</span>
            </div>
            <div className="absolute top-36 left-[54%] animate-sway pointer-events-none" style={{ animationDelay: '0.8s' }}>
              <span className="text-4xl">🌳</span>
            </div>
            <div className="absolute top-32 left-[74%] animate-sway pointer-events-none" style={{ animationDelay: '1.6s' }}>
              <span className="text-3.5xl">🌳</span>
            </div>

            {/* Active Stalls with rising Steam */}
            <div className="absolute top-[170px] left-[32%] pointer-events-none select-none">
              <span className="text-3xl">🍲</span>
              {/* Steam bubbles */}
              <div className="absolute -top-2 left-2 w-1.5 h-1.5 rounded-full bg-white opacity-0 animate-steam" />
              <div className="absolute -top-4 left-3 w-2 h-2 rounded-full bg-white opacity-0 animate-steam" style={{ animationDelay: '0.8s' }} />
            </div>

            {/* Dynamic Interactive Character Overlays */}
            {/* Resident */}
            <div 
              onMouseEnter={() => setHoveredCharacter('resident')}
              onMouseLeave={() => setHoveredCharacter(null)}
              className="absolute top-[195px] left-[15%] cursor-pointer pointer-events-auto group animate-bob"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-black bg-rose-100 flex items-center justify-center overflow-hidden hover:scale-115 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img src="/avatar_resident.png" alt="周明" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-black px-1 rounded text-[7px] font-extrabold whitespace-nowrap">居民周明</span>
            </div>

            {/* Shop owner */}
            <div 
              onMouseEnter={() => setHoveredCharacter('merchant')}
              onMouseLeave={() => setHoveredCharacter(null)}
              className="absolute top-[200px] left-[35%] cursor-pointer pointer-events-auto group animate-bob"
              style={{ animationDelay: '0.9s' }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-black bg-orange-100 flex items-center justify-center overflow-hidden hover:scale-115 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img src="/avatar_shopowner.png" alt="莉雅" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-black px-1 rounded text-[7px] font-extrabold whitespace-nowrap">店家莉雅</span>
            </div>

            {/* Commuter Cycling */}
            <div 
              onMouseEnter={() => setHoveredCharacter('commuter')}
              onMouseLeave={() => setHoveredCharacter(null)}
              className="absolute top-[160px] left-[48%] cursor-pointer pointer-events-auto group animate-cycle"
            >
              <div className="w-10 h-10 rounded-full border-2 border-black bg-blue-100 flex items-center justify-center overflow-hidden hover:scale-115 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img src="/avatar_commuter.png" alt="小宇" className="w-full h-full object-cover scale-110 animate-pulse" />
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-black px-1 rounded text-[7px] font-extrabold whitespace-nowrap">騎行小宇 🚲</span>
            </div>

            {/* Elderly */}
            <div 
              onMouseEnter={() => setHoveredCharacter('elderly')}
              onMouseLeave={() => setHoveredCharacter(null)}
              className="absolute top-[205px] left-[65%] cursor-pointer pointer-events-auto group animate-bob"
              style={{ animationDelay: '1.4s' }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-black bg-red-100 flex items-center justify-center overflow-hidden hover:scale-115 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img src="/avatar_elderly.png" alt="陳伯伯" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-black px-1 rounded text-[7px] font-extrabold whitespace-nowrap">長者陳松林</span>
            </div>

            {/* Environmentalist */}
            <div 
              onMouseEnter={() => setHoveredCharacter('environmentalist')}
              onMouseLeave={() => setHoveredCharacter(null)}
              className="absolute top-[175px] left-[78%] cursor-pointer pointer-events-auto group animate-bob"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-black bg-emerald-100 flex items-center justify-center overflow-hidden hover:scale-115 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img src="/avatar_environmentalist.png" alt="綠野老師" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-black px-1 rounded text-[7px] font-extrabold whitespace-nowrap">綠野老師</span>
            </div>

            {/* Designer */}
            <div 
              onMouseEnter={() => setHoveredCharacter('designer')}
              onMouseLeave={() => setHoveredCharacter(null)}
              className="absolute top-[195px] left-[88%] cursor-pointer pointer-events-auto group animate-bob"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-black bg-slate-200 flex items-center justify-center overflow-hidden hover:scale-115 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img src="/avatar_government.png" alt="林科長" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-black px-1 rounded text-[7px] font-extrabold whitespace-nowrap">設計代表林科長</span>
            </div>

            {/* Reformed Mob */}
            <div 
              onMouseEnter={() => setHoveredCharacter('mob')}
              onMouseLeave={() => setHoveredCharacter(null)}
              className="absolute top-[195px] left-[25%] cursor-pointer pointer-events-auto group animate-bob"
              style={{ animationDelay: '1.1s' }}
            >
              <div className="w-9 h-9 rounded-full border-2 border-black bg-[#fff8e6] flex items-center justify-center overflow-hidden hover:scale-115 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-base">🧒</span>
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-black px-1 rounded text-[7px] font-extrabold whitespace-nowrap">市民阿寶</span>
            </div>

            {/* Pop-up dynamic Dialogue bubble */}
            {hoveredCharacter && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 max-w-sm w-[90%] bg-white border-3 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-30 animate-scale-in text-xs font-serif font-semibold text-gray-700">
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-black" />
                <div className="absolute bottom-[-7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white" />
                <div className="text-[8px] font-bold text-gray-400 mb-0.5 uppercase tracking-wide">
                  💬 {hoveredCharacter === 'mob' ? '前對立市民阿寶的反饋' : `${hoveredCharacter} 的規劃心聲`}
                </div>
                {getCharacterFeedback(hoveredCharacter)}
              </div>
            )}

          </div>
        </div>

        {/* Core summary card */}
        <div className="mb-8 p-6 bg-white border-3 border-[#1f1d1b] rounded-xl shadow-flat-pop text-[#1f1d1b] leading-relaxed text-xs relative">
          <div className="absolute top-[-10px] left-8 w-24 h-5 bg-yellow-200/60 border border-yellow-300 rotate-[-4deg] opacity-75 shadow-sm" />
          <span className="font-mono text-[10px] text-gray-400 block mb-2 font-bold uppercase">[ 城市協調審定意見書 ]</span>
          <strong>【協同共創成果】</strong>{award.description}
          <div className="mt-2 text-gray-500 font-sans">
            在您的領導下，我們將 8.23 公里的地下化路段重塑為一個多重分流、能呼吸且融合歷史記憶的慢活網絡。大眾對立衝突已順利平息，代表著參與式共創都市設計的新篇章！
          </div>
        </div>

        {/* Evaluation and Radar Chart layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Radar Chart */}
          <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-flat-pop flex flex-col items-center">
            <h3 className="text-xs font-black text-gray-400 font-mono uppercase mb-4 self-start">
              [ 成果滿意度雷達圖 / SATISFACTION RADAR ]
            </h3>
            
            <div className="w-[300px] h-[260px] relative shrink-0">
              <svg className="w-full h-full" viewBox="0 0 300 270">
                {/* Concentric grid lines */}
                <polygon points={getRadarGridPoints(25)} fill="none" stroke="#e5dfd5" strokeWidth="1" strokeDasharray="2,2" />
                <polygon points={getRadarGridPoints(50)} fill="none" stroke="#cfe2d7" strokeWidth="1" />
                <polygon points={getRadarGridPoints(75)} fill="none" stroke="#e5dfd5" strokeWidth="1" strokeDasharray="2,2" />
                <polygon points={getRadarGridPoints(100)} fill="none" stroke="#1f1d1b" strokeWidth="1.5" />

                {/* Draw axes */}
                {Array.from({ length: 6 }).map((_, idx) => {
                  const angle = (idx * Math.PI) / 3 - Math.PI / 2;
                  const x = 150 + 90 * Math.cos(angle);
                  const y = 135 + 90 * Math.sin(angle);
                  return (
                    <line key={idx} x1="150" y1="135" x2={x} y2={y} stroke="#1f1d1b" strokeWidth="1" strokeDasharray="1,2" />
                  );
                })}

                {/* Filled Player Radar Polygon */}
                <polygon points={getRadarPoints()} fill="rgba(142,166,61,0.22)" stroke="var(--color-brand-green)" strokeWidth="2.5" />

                {/* Score dots */}
                {(() => {
                  const cx = 150;
                  const cy = 135;
                  const rMax = 90;
                  const metrics = [
                    stats.residentSat,
                    stats.merchantSat,
                    stats.commuterEff,
                    stats.ecologicalScore,
                    stats.safetySense,
                    stats.activityVitality
                  ];
                  return metrics.map((val, idx) => {
                    const angle = (idx * Math.PI) / 3 - Math.PI / 2;
                    const radius = (val / 100) * rMax;
                    const x = cx + radius * Math.cos(angle);
                    const y = cy + radius * Math.sin(angle);
                    return (
                      <circle key={idx} cx={x} cy={y} r="3.5" fill="var(--color-brand-coral)" stroke="#1f1d1b" strokeWidth="1.2" />
                    );
                  });
                })()}

                {/* Axis Labels */}
                <text x="150" y="30" textAnchor="middle" fontSize="9" fontWeight="black" fill="#1f1d1b">🏠 居民滿意 ({stats.residentSat}%)</text>
                <text x="260" y="88" textAnchor="start" fontSize="9" fontWeight="black" fill="#1f1d1b">🛍️ 商家滿意 ({stats.merchantSat}%)</text>
                <text x="260" y="195" textAnchor="start" fontSize="9" fontWeight="black" fill="#1f1d1b">🚲 通勤效率 ({stats.commuterEff}%)</text>
                <text x="150" y="248" textAnchor="middle" fontSize="9" fontWeight="black" fill="#1f1d1b">🌿 生態降溫 ({stats.ecologicalScore}%)</text>
                <text x="40" y="195" textAnchor="end" fontSize="9" fontWeight="black" fill="#1f1d1b">🚦 安全指數 ({stats.safetySense}%)</text>
                <text x="40" y="88" textAnchor="end" fontSize="9" fontWeight="black" fill="#1f1d1b">🎪 活動活力 ({stats.activityVitality}%)</text>
              </svg>
            </div>
          </div>

          {/* Verdict and Stamps details */}
          <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-flat-pop flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-gray-400 font-mono uppercase mb-4">
                [ 協調指標核備評等 / AUDIT EVALUATION ]
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500 font-semibold">協商代表角色：</span>
                  <span className="font-extrabold">{playerRole.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500 font-semibold">最終取得稱號：</span>
                  <span className="font-extrabold text-[var(--color-brand-green)]">{award.title}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500 font-semibold">綠園道大眾衝突值：</span>
                  <span className="font-extrabold text-red-600">{stats.conflictValue}%</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500 font-semibold">評估核備印章：</span>
                  <span className={`px-2 py-0.5 rounded font-black border-2 border-dashed ${award.stampColor}`}>
                    {award.stamp}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                * 評估結果係依大會成員於關卡中針對住宅、商業、生態段之設計對策折衷所計算生成。
              </p>
            </div>
          </div>

        </div>

        {/* Action button row */}
        <div className="flex justify-center border-t-3 border-[#1f1d1b] pt-6 mt-4">
          <button
            onClick={onRestart}
            className="btn-flat-action px-8 py-3.5 bg-white text-[#1f1d1b] border-3 border-black rounded-xl text-xs flex items-center gap-2 font-bold shadow-flat-pop cursor-pointer"
          >
            <RefreshCw size={15} />
            重新開始共創遊戲 / Restart Quest
          </button>
        </div>

      </div>
    </div>
  );
};
