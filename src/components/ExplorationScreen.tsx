import React, { useState, useEffect } from 'react';
import { StakeholderRole } from '@/data/roles';
import { Greenway25DMap } from './Greenway25DMap';
import { Sparkles, Check, ArrowRight, Lightbulb, Keyboard, Info, MessageSquare, MapPin } from 'lucide-react';
import { officialSpatialSegments, sourceNotes } from '@/data/officialGreenwayData';

interface ExplorationScreenProps {
  playerRole: StakeholderRole;
  onExploreComplete: (collectedInsights: string[]) => void;
}

interface NPC {
  id: string;
  name: string;
  title: string;
  pct: number;
  avatar: string;
  cardName: string;
  dialogue: string;
  issue: string;
  insightSummary: string;
  icon: string;
  segmentId: number;
}

const NPCS_DATA: NPC[] = [
  {
    id: 'resident',
    name: '阿明',
    title: '周邊居民',
    pct: 18,
    avatar: '/avatar_resident.png',
    cardName: '住宅隱私卡',
    dialogue: '「鐵路進入地下後，住宅段本來可以很安寧。如果高架自行車道設計在我們陽台二樓高度，每天有幾百個人對著我家看，實在很受不了。我們希望可以平面慢行，或者設置高大的綠牆防隱私遮簾，留給我們起居空間一點隱私和寧靜！」',
    issue: '🏠 交通通勤 vs 居住隱私',
    insightSummary: '住宅段非常需要生活隱私、噪音限制與安寧生活過渡設計。',
    icon: '🏡',
    segmentId: 0
  },
  {
    id: 'shop_owner',
    name: '莉雅',
    title: '在地店家',
    pct: 38,
    avatar: '/avatar_shopowner.png',
    cardName: '商業人流卡',
    dialogue: '「青年路商圈最需要的是地面層的人流和客源。如果把自行車道全部高架化，騎士通勤一分鐘就飛過去，根本不會有人進店消費。我們希望把活動引導到地面層，規劃為地面人車共享街道，並預留臨停區和自行車停靠架，這樣才能帶動在地商機！」',
    issue: '🛍️ 街區商業活力 vs 快速通過',
    insightSummary: '商業段需要將通勤流轉化為地面停留人潮，並保障店面裝卸物流臨停。',
    icon: '🛍️',
    segmentId: 1
  },
  {
    id: 'commuter',
    name: '小宇',
    title: '通勤 / 騎士',
    pct: 56,
    avatar: '/avatar_commuter.png',
    cardName: '轉乘效率卡',
    dialogue: '「通勤最重要的就是速度、路徑連續性與轉乘效率。如果綠園道在每個路口或住宅段都斷掉、或者速度限得非常低，我就不會想騎了。我們希望車站節點有便利的 YouBike 停靠站，並保證連續騎行路網的安全效率！」',
    issue: '🚲 快速通勤 vs 行人安全',
    insightSummary: '車站節點與通勤線路需要高效率的轉乘樞紐、連續的車道與分流號誌。',
    icon: '🚲',
    segmentId: 2
  },
  {
    id: 'elderly',
    name: '陳伯伯',
    title: '高齡漫步者',
    pct: 84,
    avatar: '/avatar_elderly.png',
    cardName: '高齡友善卡',
    dialogue: '「台南的夏天實在太熱了，如果綠園道全都是硬邦邦的水泥地，我們老人家哪敢出來散步？我們需要寬大的大樹遮陰冠層、平緩無陡坡的無障礙步道，還有走幾步就有的休憩長椅，這樣出門散步才安全舒服啊。」',
    issue: '🚶 安全步行 vs 自行車高速通過',
    insightSummary: '高齡市民需要連續林蔭遮陰、平緩通道、充足休息座椅與低速步行環境。',
    icon: '👴',
    segmentId: 4
  },
  {
    id: 'environmentalist',
    name: '綠野老師',
    title: '環保團體',
    pct: 92,
    avatar: '/avatar_environmentalist.png',
    cardName: '生態降溫卡',
    dialogue: '「綠園道是台南這座高溫城市的重要降溫廊道。如果鋪滿不透水水泥，熱島效應會更嚴重。這裡應該大量保留綠地、鋪設透水鋪面，並規劃雨水花園吸收暴雨、廣植林蔭大樹，真正打造會呼吸的都市生態走廊！」',
    issue: '🌿 生態降溫廊道 vs 水泥鋪面開發',
    insightSummary: '生態段需減少水泥不透水硬面，廣植複層林蔭、保水透水鋪面與雨水花園。',
    icon: '🌿',
    segmentId: 4
  },
  {
    id: 'government',
    name: '林科長',
    title: '市府 / 設計師',
    pct: 74,
    avatar: '/avatar_government.png',
    cardName: '局部高架卡',
    dialogue: '「從工程可行性與預算來看，路口立體化陸橋造價極高，且會遮擋民房採光；但平面直接穿越幹道又有高度危險。我們需要綜合評估預算、後續維護管理經費與分段交織安全，比如使用保護型路口號誌，或局部高架跨越。」',
    issue: '🚦 安全可行性 vs 工程造價預算',
    insightSummary: '主要交織路口需評估局部高架陸橋或地面保護型安全分流與號誌控制。',
    icon: '🚦',
    segmentId: 3
  }
];

export const ExplorationScreen: React.FC<ExplorationScreenProps> = ({ playerRole, onExploreComplete }) => {
  const [avatarPosition, setAvatarPosition] = useState<number>(5); // Start at start of the greenway (5%)
  const [activeNpcForDialogue, setActiveNpcForDialogue] = useState<NPC | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Track collected cards using NPC ID keys
  const [collectedInsights, setCollectedInsights] = useState<Record<string, boolean>>({
    resident: false,
    shop_owner: false,
    commuter: false,
    elderly: false,
    environmentalist: false,
    government: false
  });

  // Dynamically check if the player character is close to any NPC along the S-curve
  const getActiveNpcNearby = () => {
    return NPCS_DATA.find(npc => Math.abs(avatarPosition - npc.pct) <= 4.5);
  };

  const nearbyNpc = getActiveNpcNearby();

  // Keyboard controls listener (Arrow keys, WASD, Space/E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Freezes character movement if dialogue is open
      if (activeNpcForDialogue) return;

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setAvatarPosition(p => Math.min(100, p + 2));
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setAvatarPosition(p => Math.max(0, p - 2));
      } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        const activeNearby = getActiveNpcNearby();
        if (activeNearby) {
          handleOpenDialogue(activeNearby);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [avatarPosition, activeNpcForDialogue, collectedInsights]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

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

  const handleOpenDialogue = (npc: NPC) => {
    setActiveNpcForDialogue(npc);
  };

  const handleCollectInsight = () => {
    if (!activeNpcForDialogue) return;
    const npc = activeNpcForDialogue;
    setCollectedInsights(prev => ({
      ...prev,
      [npc.id]: true
    }));
    setToastMsg(`Civic Insight Collected: 已成功解鎖收集【${npc.cardName}】！`);
    setActiveNpcForDialogue(null);
  };

  // Click-to-walk navigation handler
  const handleSegmentClick = (segmentId: number) => {
    // Map segment IDs (0 to 4) to walk locations
    const segmentLocationsPct = [18, 38, 56, 74, 90];
    const targetPct = segmentLocationsPct[segmentId] !== undefined ? segmentLocationsPct[segmentId] : 18;
    setAvatarPosition(targetPct);
  };

  const totalCollected = Object.values(collectedInsights).filter(Boolean).length;
  const isExplorationDone = totalCollected >= 3;

  const handleFinishExploration = () => {
    if (isExplorationDone) {
      // Map collected cards to insight strings for roundtable
      const insightStrings = NPCS_DATA
        .filter(npc => collectedInsights[npc.id])
        .map(npc => `${npc.cardName}的觀點：${npc.insightSummary}`);
      onExploreComplete(insightStrings);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-0 bg-[var(--color-bg-warm)] h-full overflow-hidden relative">
      
      {/* Toast Notification HUD */}
      {toastMsg && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#e2f0d9] border-3 border-[#1f1d1b] px-5 py-3 rounded-xl text-xs font-black text-[#3e5f4c] shadow-flat-pop animate-bounce flex items-center gap-1.5 select-none">
          <span className="text-sm">💡</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="w-full h-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-xl p-5 shadow-flat-pop-lg flex flex-col overflow-hidden relative">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-3 border-b-3 border-[#1f1d1b] pb-2.5 shrink-0">
          <span className="px-3 py-1 bg-blob-blue border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 PHASE 2 : 2.5D 綠園道實地踏查 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">已收集觀點卡：{totalCollected} / 6 (集滿 3 張解鎖協商簡報)</span>
        </div>

        {/* Keyboard instructions */}
        <div className="shrink-0 mb-3 bg-[#FAF8F5] border-2 border-[#1f1d1b] p-2.5 rounded-xl flex items-center justify-between shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 text-[#1f1d1b] text-[10.5px] font-bold">
            <Keyboard size={15} className="text-[var(--color-brand-blue)] shrink-0 animate-bounce" />
            <span>使用鍵盤左右方向鍵 <strong>← →</strong> 或 <strong>A D</strong> 移動角色，接近市民代表後按 <strong>空白鍵 (Space)</strong> 或 <strong>E</strong> 開啟交談！</span>
          </div>
          <span className="text-[9.5px] bg-white px-2 py-0.5 rounded border-2 border-[#1f1d1b] font-bold">
            代表身分：{playerRole.name}
          </span>
        </div>

        {/* 2.5D Greenway Map Centerpiece */}
        <div className="flex-1 min-h-0 relative flex flex-col mb-4">
          <Greenway25DMap 
            activeSegmentId={nearbyNpc ? nearbyNpc.segmentId : undefined}
            avatarPosition={avatarPosition}
            playerRole={playerRole}
            collectedInsights={collectedInsights}
            interactive={true}
            onSegmentClick={handleSegmentClick}
          />

          {/* RPG HUD dialogue alert overlay */}
          {nearbyNpc && !collectedInsights[nearbyNpc.id] && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#ffffff] border-3 border-[#1f1d1b] px-4 py-2 rounded-xl text-[10.5px] font-bold text-[#1f1d1b] shadow-flat-pop z-30 animate-pulse flex items-center gap-1.5">
              <span>💬</span>
              <span>您已接近 <strong>{nearbyNpc.name}（{nearbyNpc.title}）</strong>，按 <strong>空白鍵 (Space)</strong> 或 <strong>E</strong> 開始交談！</span>
            </div>
          )}
        </div>

        {/* Collected Insights Deck - RPG Inventory Panel */}
        <div className="shrink-0 border-t-3 border-[#1f1d1b] pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-[#1f1d1b] font-serif block">[ 🎒 您的公民觀點卡卡包 / CIVIC INSIGHT DECK ]</span>
            <div className="text-[8.5px] text-gray-400 font-mono flex items-center gap-1.5">
              <span>{sourceNotes.visibleNote}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {NPCS_DATA.map((npc) => {
              const isCollected = collectedInsights[npc.id];
              return (
                <div 
                  key={npc.id}
                  className={`relative p-2.5 rounded-xl border-2 border-[#1f1d1b] flex flex-col justify-between min-h-[92px] text-left transition-all ${
                    isCollected 
                      ? 'bg-white shadow-[2.5px_2.5px_0px_0px_#1f1d1b] scale-100' 
                      : 'bg-gray-100/50 border-dashed border-gray-400 text-gray-400 scale-95 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`px-1 rounded text-[7px] font-extrabold uppercase tracking-wider ${
                      isCollected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {npc.cardName}
                    </span>
                    <span className="text-sm">
                      {npc.icon}
                    </span>
                  </div>

                  <div className="text-[8.5px] font-bold leading-normal font-sans tracking-tight mb-1 flex-1">
                    {isCollected ? (
                      <p className="text-gray-700 line-clamp-3">"{npc.insightSummary}"</p>
                    ) : (
                      <div className="h-full flex items-center justify-center italic text-gray-400 text-[8px]">
                        🔒 [ 探索市民 {npc.name} 解鎖 ]
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-1 mt-1 text-[7px] font-bold">
                    <span>{isCollected ? `代表：${npc.name}` : '未探索'}</span>
                    {isCollected && <span className="text-emerald-600 font-extrabold text-[7.5px]">💡 已收集</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exploration finish transition bar at bottom */}
        {isExplorationDone && (
          <div className="mt-4 pt-3 border-t-3 border-[#1f1d1b] flex justify-between items-center shrink-0 animate-fade-in">
            <div className="text-xs font-sans text-emerald-700 font-bold flex items-center gap-1">
              <Check size={14} className="animate-bounce" /> 已成功收集超過 3 張公民觀點卡！您可以隨時召開市民協商大會。
            </div>
            <button 
              onClick={handleFinishExploration}
              className="btn-flat-action px-6 py-2.5 rounded-xl text-xs bg-[var(--color-brand-coral)] hover:bg-[#c06a5f] text-white flex items-center gap-1.5 shadow-flat-pop font-bold"
            >
              前往協商任務簡報 <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Phase 3 NPC Dialogue Bubble Overlay Modal */}
        {activeNpcForDialogue && (
          <div className="absolute inset-0 bg-[#1f1d1b]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in rounded-xl">
            <div className="bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 max-w-lg w-full shadow-flat-pop-lg relative animate-scale-in text-left select-none flex flex-col gap-4">
              
              <div className="flex items-center gap-3 border-b-2 border-dashed border-gray-300 pb-2 mb-1 shrink-0">
                <div className={`w-10 h-10 rounded-full border-2 border-[#1f1d1b] ${getBlobBgClass(activeNpcForDialogue.id)} flex items-center justify-center overflow-hidden shrink-0`}>
                  <img 
                    src={
                      activeNpcForDialogue.id === 'resident' ? '/avatar_resident.png' :
                      activeNpcForDialogue.id === 'shop_owner' ? '/avatar_shopowner.png' :
                      activeNpcForDialogue.id === 'commuter' ? '/avatar_commuter.png' :
                      activeNpcForDialogue.id === 'elderly' ? '/avatar_elderly.png' :
                      activeNpcForDialogue.id === 'environmentalist' ? '/avatar_environmentalist.png' :
                      '/avatar_government.png'
                    } 
                    alt={activeNpcForDialogue.name} 
                    className="w-full h-full object-cover scale-110" 
                  />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#1f1d1b] font-serif">{activeNpcForDialogue.name}</h4>
                  <span className="text-[8px] text-gray-400 font-mono uppercase tracking-wider">{activeNpcForDialogue.title}</span>
                </div>
              </div>

              {/* Spatial Issue Tag */}
              <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg text-[9px] font-bold text-rose-800 flex items-center gap-1 shrink-0">
                <span className="text-rose-600">📌 相關空間議題：</span>
                <span>{activeNpcForDialogue.issue}</span>
              </div>

              {/* Dialogue Box */}
              <div className="relative bg-[#FAF8F5] border-3 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop text-xs md:text-sm text-[#1f1d1b] leading-relaxed font-serif font-semibold">
                <div className="absolute top-[-9px] left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#1f1d1b]" />
                <div className="absolute top-[-6px] left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#FAF8F5]" />
                
                {activeNpcForDialogue.dialogue}
              </div>

              <div className="bg-blob-yellow/30 border border-amber-300 px-3 py-2 rounded-lg text-[9.5px] text-amber-800 leading-normal flex items-start gap-1">
                <Lightbulb size={12} className="shrink-0 mt-0.5 text-amber-600 animate-pulse" />
                <span>交談後將會收集到：<strong>【{activeNpcForDialogue.cardName}】</strong>，可用於市民協商大會中做為討論證據！</span>
              </div>

              <button
                onClick={handleCollectInsight}
                className="w-full btn-flat-action py-2.5 rounded-xl text-xs bg-[var(--color-brand-green)] text-white shadow-flat-pop font-bold mt-2"
              >
                收進卡包，解鎖{activeNpcForDialogue.cardName} ➔
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
