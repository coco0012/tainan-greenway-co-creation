import React, { useState, useEffect, useRef } from 'react';
import { StakeholderRole, roles } from '@/data/roles';
import { Sparkles, HelpCircle, MapPin, MessageSquare, Check, ArrowRight, Lightbulb, BookOpen } from 'lucide-react';

interface ExplorationScreenProps {
  playerRole: StakeholderRole;
  onExploreComplete: (collectedInsights: string[]) => void;
}

interface Segment {
  id: number;
  name: string;
  sta: string;
  left: number;
  npcId: string;
  npcName: string;
  npcTitle: string;
  condition: string;
  conflict: string;
  concern: string;
  observation: string;
  dialogue: string;
}

export const ExplorationScreen: React.FC<ExplorationScreenProps> = ({ playerRole, onExploreComplete }) => {
  const [selectedSegId, setSelectedSegId] = useState<number>(0);
  const [activeDialogueNpc, setActiveDialogueNpc] = useState<string | null>(null);
  const [collectedInsights, setCollectedInsights] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  });
  
  const mapRef = useRef<HTMLDivElement>(null);

  const segments: Segment[] = [
    {
      id: 0,
      name: '住宅社區段',
      sta: 'STA 0+000 - 0+400',
      left: 20,
      npcId: 'resident',
      npcName: '阿明',
      npcTitle: '居民代表',
      condition: '緊鄰透天住宅與社區小巷，路面寬度較窄，生活氛圍安寧。',
      conflict: '高架自行車道帶來的隱私干擾 vs 騎士的高速通勤效率。',
      concern: '居民阿明擔心隱私被看光；通勤族小宇希望有直達不中斷的連續高架路段。',
      observation: '現場觀察發現居民經常在二樓露台晾衣或乘涼，若興建高架，距離其窗戶僅有數公尺，視覺壓迫感極重。',
      dialogue: '「我家就在舊鐵軌路廊旁邊，自行車高架如果緊貼著二樓陽台，我們每天在家裡都覺得有人在看我，非常不自在。如果能把自行車道降低到地面層，拉開與居民陽台的距離，甚至增加防隱私的隔板或垂直綠化，生活會安全很多。」'
    },
    {
      id: 1,
      name: '繁榮商業段',
      sta: 'STA 0+400 - 0+700',
      left: 40,
      npcId: 'shop_owner',
      npcName: '莉雅',
      npcTitle: '在地店家代表',
      condition: '沿線商店林立，包含傳統美食、零售店家與特色咖啡廳，人潮絡繹不絕。',
      conflict: '自行車高架快速過境 vs 地面零售商業活力流失。',
      concern: '店家莉雅強烈希望引導車流降至地面，增加店面能見度與客流量；通勤族小宇擔心地面層人車混雜減慢車速。',
      observation: '此路段是鐵路地下化後的經濟繁榮帶，若將自行車道維持在高架二樓快速通過，騎士直接飛越，對地面零售店家完全沒有引客與導流效果。',
      dialogue: '「如果騎士全都從高架天橋上飛越過去，我們地面層的麵店、飲料店、傳統美食就吃不到任何商業人氣。我希望能把自行車道引導到地面，打造慢速人車共享街區與臨時停靠站，把人流帶進店裡！」'
    },
    {
      id: 2,
      name: '台南車站樞紐',
      sta: 'STA 0+700',
      left: 56,
      npcId: 'government',
      npcName: '林科長',
      npcTitle: '市府與景觀代表',
      condition: '台南舊車站後方軌道區段，是鐵路地下化後的歷史地景象徵節點。',
      conflict: '保留百年舊月台與軌道遺址 vs 完全移除改建為水泥轉運接駁廣場。',
      concern: '市民希望留存台南的出鄉與返鄉集體記憶；市府部門則考量公眾交通接駁效率與空曠活動空間。',
      observation: '舊月台石砌古樸，鐵軌仍躺在原處。這裡是串聯綠園道文化軸線的精神地標，也是呈現台南鐵道文化的絕佳場所。',
      dialogue: '「這段是綠園道的歷史紐帶。我們希望能保留台南舊車站的古樸月台與舊鐵軌，整理周邊植栽，打造一座鐵道歷史廣場。這不僅能提供市民散步休憩的廣場，還能把這座城市的記憶留在公共地景中。」'
    },
    {
      id: 3,
      name: '幹道交叉路口',
      sta: 'STA 0+700 - 0+900',
      left: 72,
      npcId: 'commuter',
      npcName: '小宇',
      npcTitle: '通勤與自行車族代表',
      condition: '縱向主要交通幹道（如青年路路口）交會處，平日車流量龐大且車速極快。',
      conflict: '自行車平面穿越的車禍安全風險 vs 立體人行陸橋/地下道的建設經費與障礙。',
      concern: '通勤族小宇擔心平面過路口有極大安全威脅；高齡長者陳伯伯害怕人車衝突與過陡的天橋斜坡。',
      observation: '尖峰時間幹道車流沒有間斷，平面直接穿越不僅影響騎乘連貫性，亦增加人車交織的碰撞風險，急需安全分隔設施。',
      dialogue: '「這段是穿越大馬路的十字路口，平時上下班時間汽機車車速極快。直接在平面騎過去，每次都要停等很久的紅綠燈，而且人車混雜真的非常危險。希望能做立體化人車分流，或是至少有專用自行車綠燈號誌！」'
    },
    {
      id: 4,
      name: '綠意生態廊道',
      sta: 'STA 0+900 - 1+400',
      left: 88,
      npcId: 'environmentalist',
      npcName: '綠野老師',
      npcTitle: '環保志工代表',
      condition: '綠園道最南端，面臨台南炎熱曝曬的氣候，缺乏林蔭與遮光。',
      conflict: '大面積保水林蔭生態綠帶 vs 水泥硬質活動鋪面廣場。',
      concern: '綠野老師提倡複層造林與雨水花園以調節都市熱島效應；高齡長者陳伯伯希望有充足的遮陰長椅與平緩鋪面。',
      observation: '台南夏季曝曬強烈。若全鋪設水泥硬路幅，白天熱輻射效應會使地表溫度飆高，居民根本無法停留散步，不利於微氣候降溫。',
      dialogue: '「台南的夏天高溫驚人，我們不需要一條鋪滿冰冷水泥的水泥路！我們應該多種植在地大樹，規劃大片林蔭綠帶、透水鋪面與雨水花園。讓綠園道成為城市裡的冷氣風脊，還能提供小動物棲息的生態廊道。」'
    }
  ];

  // Sync scroll positioning to center selected segment
  useEffect(() => {
    if (mapRef.current) {
      const activeSeg = segments.find(s => s.id === selectedSegId);
      if (activeSeg) {
        const containerWidth = mapRef.current.clientWidth;
        const scrollWidth = mapRef.current.scrollWidth;
        const targetPixel = (activeSeg.left / 100) * scrollWidth;
        mapRef.current.scrollLeft = targetPixel - containerWidth / 2;
      }
    }
  }, [selectedSegId]);

  const getRoleAvatar = (id: string) => {
    switch (id) {
      case 'resident': return '/avatar_resident.png';
      case 'shop_owner': return '/avatar_shopowner.png';
      case 'commuter': return '/avatar_commuter.png';
      case 'elderly': return '/avatar_elderly.png';
      case 'environmentalist': return '/avatar_environmentalist.png';
      case 'government': return '/avatar_government.png';
      default: return '/avatar_resident.png';
    }
  };

  const getBlobBgClass = (id: string) => {
    switch (id) {
      case 'resident': return 'bg-blob-pink';
      case 'shop_owner': return 'bg-blob-yellow';
      case 'commuter': return 'bg-blob-blue';
      case 'elderly': return 'bg-blob-pink';
      case 'environmentalist': return 'bg-blob-green';
      case 'government': return 'bg-gray-200';
      default: return 'bg-gray-150';
    }
  };

  const handleTalk = (segId: number, npcId: string) => {
    setActiveDialogueNpc(npcId);
  };

  const handleCloseDialogue = () => {
    setCollectedInsights(prev => ({
      ...prev,
      [selectedSegId]: true
    }));
    setActiveDialogueNpc(null);
  };

  const totalCollected = Object.values(collectedInsights).filter(Boolean).length;
  const isExplorationDone = totalCollected === 5;

  const currentSeg = segments[selectedSegId];

  const handleFinishExploration = () => {
    if (isExplorationDone) {
      const insightNames = segments.map(s => `${s.name}的觀點：${s.npcName}`);
      onExploreComplete(insightNames);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-0 bg-[var(--color-bg-warm)] h-full overflow-hidden">
      <div className="w-full h-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-xl p-5 shadow-flat-pop-lg flex flex-col overflow-hidden relative">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-4 border-b-3 border-[#1f1d1b] pb-3 shrink-0">
          <span className="px-3.5 py-1 bg-blob-blue border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 PHASE 2 & 3 : 實地踏查與公民觀點收集 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">已收集公民觀點：{totalCollected} / 5</span>
        </div>

        {/* Info panel */}
        <div className="shrink-0 mb-4 bg-gray-50 border-2 border-[#1f1d1b] p-3 rounded-xl flex items-center justify-between shadow-[2px_2px_0px_0px_#1f1d1b]">
          <div className="flex items-center gap-2 text-[#1f1d1b] font-serif text-xs md:text-sm font-bold">
            <Lightbulb className="text-[var(--color-brand-yellow)] w-5 h-5 shrink-0" />
            <span>請點選下方綠園道地圖上的各路段，閱讀觀察筆記並與該區市民交談，收集規劃觀點！</span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 bg-white border border-gray-300 text-[10px] rounded-lg font-mono">
            當前身分：{playerRole.name}
          </span>
        </div>

        {/* Scrollable Greenway Map Explorer */}
        <div 
          ref={mapRef}
          className="h-44 w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-xl overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth relative shadow-flat-pop shrink-0 mb-4"
        >
          <div className="inline-block min-w-[1200px] w-full h-full relative select-none">
            <img 
              src="/greenway_watercolor.png" 
              alt="綠園道水彩畫卷" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 pointer-events-none"
            />
            
            {/* Horizontal progress path overlay */}
            <div className="absolute inset-x-0 bottom-4 h-1.5 bg-[#1f1d1b] opacity-20 pointer-events-none" />

            {/* Segment pins */}
            {segments.map((seg) => {
              const isSelected = selectedSegId === seg.id;
              const hasInsight = collectedInsights[seg.id];
              return (
                <button 
                  key={seg.id}
                  onClick={() => setSelectedSegId(seg.id)}
                  style={{ left: `${seg.left}%` }}
                  className={`absolute bottom-8 -translate-x-1/2 flex flex-col items-center z-10 focus:outline-none transition-transform ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  {/* Pin tag */}
                  <div className={`px-2.5 py-1 border-2 border-[#1f1d1b] font-serif text-[9px] font-bold shadow-[2px_2px_0px_0px_#1f1d1b] rounded-lg flex items-center gap-1 transition-colors ${
                    isSelected 
                      ? 'bg-[#f3ce6b]' 
                      : hasInsight 
                        ? 'bg-blob-green' 
                        : 'bg-white'
                  }`}>
                    <MapPin size={10} className={isSelected ? 'animate-bounce text-[#1f1d1b]' : 'text-gray-400'} />
                    <span>{seg.name}</span>
                    {hasInsight && <Check size={10} className="text-emerald-700 font-bold" />}
                  </div>
                  
                  {/* Stakeholder small avatar on map */}
                  <div className={`mt-2 w-8 h-8 rounded-full border-2 border-[#1f1d1b] ${getBlobBgClass(seg.npcId)} flex items-center justify-center overflow-hidden shadow-[1px_1px_0px_0px_#1f1d1b] bg-white`}>
                    <img src={getRoleAvatar(seg.npcId)} alt={seg.npcName} className="w-full h-full object-cover scale-110" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Segment Details and Citizen Talk card */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-5 relative overflow-hidden">
          
          {/* Left panel: Condition details */}
          <div className="flex-1 bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-xl p-5 shadow-flat-pop text-left flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b-2 border-[#1f1d1b] pb-2 mb-3 shrink-0">
                <h3 className="text-lg font-extrabold text-[#1f1d1b] font-serif">{currentSeg.name}</h3>
                <span className="font-mono text-[9px] bg-blob-blue border border-[#1f1d1b] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#1f1d1b]">
                  {currentSeg.sta}
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <span className="font-bold text-[10px] text-[#79afd3] block mb-0.5">🛣️ 空間現況分析 / SPATIAL CONDITION</span>
                  <p className="text-[#1f1d1b] font-medium leading-relaxed">{currentSeg.condition}</p>
                </div>
                <div>
                  <span className="font-bold text-[10px] text-rose-500 block mb-0.5">⚡ 關鍵空間衝突 / KEY CONFLICT</span>
                  <p className="text-[#1f1d1b] font-medium leading-relaxed">{currentSeg.conflict}</p>
                </div>
                <div>
                  <span className="font-bold text-[10px] text-amber-600 block mb-0.5">👥 相關代表立場關切 / STAKEHOLDER CONCERN</span>
                  <p className="text-[#1f1d1b] font-medium leading-relaxed">{currentSeg.concern}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <span className="font-bold text-[9px] text-gray-500 block mb-0.5">✏️ 踏查現場觀察筆記 / OBSERVATION NOTE</span>
                  <p className="italic text-gray-600 text-[11px] leading-relaxed">{currentSeg.observation}</p>
                </div>
              </div>
            </div>

            {/* Collected Insight status check */}
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center shrink-0">
              <span className="text-[10px] font-bold text-gray-400 font-mono">[ Insight Collection Status ]</span>
              {collectedInsights[currentSeg.id] ? (
                <span className="px-2.5 py-1 bg-blob-green border-2 border-[#1f1d1b] text-xs font-bold text-[#3e5f4c] rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] flex items-center gap-1 font-serif">
                  <Check size={12} /> 已收集此路段觀點 💡
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-blob-pink border-2 border-[#1f1d1b] text-xs font-bold text-[#c26257] rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] flex items-center gap-1 font-serif animate-pulse">
                  ⚠️ 待收集市民觀點
                </span>
              )}
            </div>
          </div>

          {/* Right panel: Citizen Card & Dialog Trigger */}
          <div className="w-full md:w-80 bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-xl p-5 shadow-flat-pop text-center flex flex-col justify-between shrink-0">
            <div className="flex flex-col items-center">
              <div className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mb-3">[ REPRESENTATIVE ON SITE ]</div>
              
              {/* NPC avatar with Memphis blob background */}
              <div className={`w-24 h-24 rounded-full border-3 border-[#1f1d1b] ${getBlobBgClass(currentSeg.npcId)} flex items-center justify-center overflow-hidden shadow-flat-pop mb-4`}>
                <img src={getRoleAvatar(currentSeg.npcId)} alt={currentSeg.npcName} className="w-full h-full object-cover scale-110" />
              </div>
              
              <h4 className="text-base font-extrabold text-[#1f1d1b] font-serif mb-0.5">{currentSeg.npcName}</h4>
              <span className="px-2 py-0.5 bg-gray-150 border border-gray-300 text-[10px] text-gray-600 rounded-md font-sans font-bold">
                {currentSeg.npcTitle}
              </span>
            </div>

            {/* Trigger buttons */}
            <div className="mt-6">
              {collectedInsights[currentSeg.id] ? (
                <div className="w-full py-3 bg-gray-100 border-2 border-gray-300 text-gray-500 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1">
                  <Check size={14} /> 已完成對話與意見收集
                </div>
              ) : (
                <button
                  onClick={() => handleTalk(currentSeg.id, currentSeg.npcId)}
                  className="w-full btn-flat-action py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 bg-[var(--color-brand-yellow)] text-[#1f1d1b] font-bold shadow-flat-pop"
                >
                  <MessageSquare size={14} /> 與 {currentSeg.npcName} 開啟現場交談
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Exploration finish transition bar at bottom */}
        {isExplorationDone && (
          <div className="mt-4 pt-4 border-t-3 border-[#1f1d1b] flex justify-between items-center shrink-0">
            <div className="text-xs font-sans text-emerald-700 font-bold flex items-center gap-1">
              <Check size={14} className="animate-bounce" /> 已成功收集完 5 個路段的全體市民代表觀點！即將開啟協商會議。
            </div>
            <button 
              onClick={handleFinishExploration}
              className="btn-flat-action px-6 py-2.5 rounded-xl text-xs bg-[var(--color-brand-coral)] hover:bg-[#c06a5f] text-white flex items-center gap-1.5 shadow-flat-pop font-bold"
            >
              前往協商任務簡報 <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Dialogue Bubble Overlay Modal */}
        {activeDialogueNpc && (
          <div className="absolute inset-0 bg-[#1f1d1b]/40 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-fade-in rounded-xl">
            <div className="bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 max-w-lg w-full shadow-flat-pop-lg relative animate-scale-in text-left select-none flex flex-col gap-4">
              
              <div className="flex items-center gap-3 border-b-2 border-dashed border-gray-300 pb-2 mb-1 shrink-0">
                <div className={`w-12 h-12 rounded-full border-2 border-[#1f1d1b] ${getBlobBgClass(currentSeg.npcId)} flex items-center justify-center overflow-hidden shrink-0`}>
                  <img src={getRoleAvatar(currentSeg.npcId)} alt={currentSeg.npcName} className="w-full h-full object-cover scale-110" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#1f1d1b] font-serif">{currentSeg.npcName} ({currentSeg.npcTitle})</h4>
                  <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">綠園道現場・踏查訪談</span>
                </div>
              </div>

              {/* Dialogue Box */}
              <div className="relative bg-[#FAF8F5] border-3 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop text-xs md:text-sm text-[#1f1d1b] leading-relaxed font-serif font-semibold">
                <div className="absolute top-[-9px] left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#1f1d1b]" />
                <div className="absolute top-[-6px] left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#FAF8F5]" />
                
                {currentSeg.dialogue}
              </div>

              <div className="bg-blob-yellow/30 border border-amber-300 px-3 py-2 rounded-lg text-[10px] text-amber-800 leading-normal flex items-start gap-1">
                <Lightbulb size={12} className="shrink-0 mt-0.5 text-amber-600" />
                <span>理解市民的擔憂，已在您的規劃筆記中解鎖：**【{currentSeg.name}】的公民觀點**。</span>
              </div>

              <button
                onClick={handleCloseDialogue}
                className="w-full btn-flat-action py-2.5 rounded-xl text-xs bg-[var(--color-brand-green)] text-white shadow-flat-pop font-bold mt-2"
              >
                好的，記錄此觀點並結束交談
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
