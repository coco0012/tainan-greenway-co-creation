import React, { useState, useEffect, useRef } from 'react';
import { StakeholderRole } from '@/data/roles';
import { Greenway25DMap } from './Greenway25DMap';
import { Sparkles, Check, ArrowRight, Lightbulb, Keyboard, Info, BookOpen, Layers, Eye, EyeOff } from 'lucide-react';
import { sourceNotes } from '@/data/officialGreenwayData';

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
  x: number;
  y: number;
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
    segmentId: 0,
    x: 180,
    y: 25
  },
  {
    id: 'shop_owner',
    name: '莉雅',
    title: '在地店家',
    pct: 38,
    avatar: '/avatar_shopowner.png',
    cardName: '商業人流卡',
    dialogue: '「青年路商圈最需要的是地面層的人流和客源。如果把自行車道全部高架化，騎士通勤一分鐘就飛過去，根本不會有人進店消費。我們希望把活動引導到地面層，規劃為地面人車共享街道，並預留臨停區 and 自行車停靠架，這樣才能帶動在地商機！」',
    issue: '🛍️ 街區商業活力 vs 快速通過',
    insightSummary: '商業段需要將通勤流轉化為地面停留人潮，並保障店面裝卸物流臨停。',
    icon: '🛍️',
    segmentId: 1,
    x: 380,
    y: 25
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
    segmentId: 2,
    x: 560,
    y: 25
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
    segmentId: 4,
    x: 840,
    y: 25
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
    segmentId: 4,
    x: 920,
    y: 25
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
    segmentId: 3,
    x: 740,
    y: 25
  }
];

export const ExplorationScreen: React.FC<ExplorationScreenProps> = ({ playerRole, onExploreComplete }) => {
  // RPG 2D Player coordinates state in coordinate space
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 25 });
  const [activeNpcForDialogue, setActiveNpcForDialogue] = useState<NPC | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [showInventory, setShowInventory] = useState(true);

  // Viewport centering state
  const [viewportSize, setViewportSize] = useState({ w: 1000, h: 520 });
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Track collected cards using NPC ID keys
  const [collectedInsights, setCollectedInsights] = useState<Record<string, boolean>>({
    resident: false,
    shop_owner: false,
    commuter: false,
    elderly: false,
    environmentalist: false,
    government: false
  });

  const keysPressed = useRef<Record<string, boolean>>({});
  const requestRef = useRef<number | null>(null);

  // Collision box checking
  const checkCollision = (x: number, y: number) => {
    // 1. Boundaries of walking
    if (x < 30 || x > 970) return true;
    if (y < -110 || y > 110) return true;

    // 2. Bounding boxes around 3D buildings (Houses & Shops & Station Node)
    // Residential houses: X = 150 to 260, Y = -95 to -45
    if (x >= 150 && x <= 260 && y >= -95 && y <= -45) return true;

    // Commercial shops: X = 350 to 470, Y = -95 to -45
    if (x >= 350 && x <= 470 && y >= -95 && y <= -45) return true;

    // Station building: X = 560 to 660, Y = -105 to -45
    if (x >= 560 && x <= 660 && y >= -105 && y <= -45) return true;

    return false;
  };

  // Euclidean proximity checking for NPCs
  const getActiveNpcNearby = () => {
    return NPCS_DATA.find(npc => {
      const dx = playerPos.x - npc.x;
      const dy = playerPos.y - npc.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= 45; // Close enough to talk
    });
  };

  const nearbyNpc = getActiveNpcNearby();

  // Keyboard controls listener (Keydown/Keyup state mapping)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      keysPressed.current[e.key.toLowerCase()] = true;

      // Prevent scrolling default behavior
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'e', 'E'].includes(e.key)) {
        e.preventDefault();
      }

      // Dialog trigger
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'e' || e.key === 'E') {
        const activeNearby = getActiveNpcNearby();
        if (activeNearby) {
          handleOpenDialogue(activeNearby);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerPos, activeNpcForDialogue, collectedInsights]);

  // requestAnimationFrame walk physics loop
  useEffect(() => {
    if (activeNpcForDialogue) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const moveSpeed = 2.4;

    const tick = () => {
      let dx = 0;
      let dy = 0;

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= 1;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += 1;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= 1;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += 1;

      if (dx !== 0 || dy !== 0) {
        let speedX = dx * moveSpeed;
        let speedY = dy * moveSpeed;

        // Normalize speed
        if (dx !== 0 && dy !== 0) {
          speedX *= 0.707;
          speedY *= 0.707;
        }

        setPlayerPos(current => {
          const nextX = current.x + speedX;
          const nextY = current.y + speedY;

          // Slide physics along obstacles
          if (!checkCollision(nextX, nextY)) {
            return { x: nextX, y: nextY };
          }
          if (!checkCollision(nextX, current.y)) {
            return { x: nextX, y: current.y };
          }
          if (!checkCollision(current.x, nextY)) {
            return { x: current.x, y: nextY };
          }
          return current;
        });
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeNpcForDialogue]);

  // Track viewport container dimensions on load/resize
  useEffect(() => {
    if (viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      setViewportSize({ w: rect.width || 1000, h: rect.height || 520 });
    }

    const handleResize = () => {
      if (viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        setViewportSize({ w: rect.width || 1000, h: rect.height || 520 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setToastMsg(`公民觀察卡已解鎖：已收集【${npc.cardName}】！`);
    setActiveNpcForDialogue(null);
  };

  const handleSegmentClick = (segmentId: number) => {
    // Teleport character to selected segment in coordinates
    const segmentLocationsX = [180, 380, 560, 740, 920];
    const targetX = segmentLocationsX[segmentId] !== undefined ? segmentLocationsX[segmentId] : 180;
    setPlayerPos({ x: targetX, y: 25 });
  };

  // Camera viewport translate calculation in pixel space
  const mapScale = 1.6;
  const mapWidth = 1000 * mapScale;
  const mapHeight = 520 * mapScale;

  const getIsoPointForCamera = (x: number, yOffset: number) => {
    const startX = 80;
    const startY = 410;
    const endX = 920;
    const endY = 130;
    const ratio = x / 1000;
    const baseX = startX + (endX - startX) * ratio;
    const baseY = startY + (endY - startY) * ratio;
    const wiggle = Math.sin(ratio * Math.PI * 2) * 35;
    const y = yOffset + wiggle;
    return {
      x: baseX - y * 0.65,
      y: baseY + y * 0.38
    };
  };

  const playerScreenCoords = getIsoPointForCamera(playerPos.x, playerPos.y);
  const playerPixelX = playerScreenCoords.x * mapScale;
  const playerPixelY = playerScreenCoords.y * mapScale;

  const rawOffsetX = viewportSize.w / 2 - playerPixelX;
  const rawOffsetY = viewportSize.h / 2 - playerPixelY;

  const cameraOffsetX = Math.min(0, Math.max(viewportSize.w - mapWidth, rawOffsetX));
  const cameraOffsetY = Math.min(0, Math.max(viewportSize.h - mapHeight, rawOffsetY));

  const totalCollected = Object.values(collectedInsights).filter(Boolean).length;
  const isExplorationDone = totalCollected >= 3;

  const handleFinishExploration = () => {
    if (isExplorationDone) {
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
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-[#e2f0d9] border-3 border-[#1f1d1b] px-5 py-3 rounded-xl text-xs font-black text-[#3e5f4c] shadow-flat-pop animate-bounce flex items-center gap-1.5 select-none">
          <span className="text-sm">💡</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="w-full h-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-xl p-5 shadow-flat-pop-lg flex flex-col overflow-hidden relative">
        
        {/* Progress & Quest HUD Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 border-b-3 border-[#1f1d1b] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blob-blue border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
              【 PHASE 2 : 2.5D 綠園道實地踏查 】
            </span>
            <span className="text-xs font-mono font-bold text-gray-400">已收集觀點卡：{totalCollected} / 6</span>
          </div>
          
          {/* Dynamic Quest Log HUD */}
          <div className="w-full sm:w-auto bg-[#fff8e6] border-2 border-[#1f1d1b] px-3 py-1 rounded-lg text-[10.5px] font-black text-amber-800 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
            <span className="animate-pulse">🎯</span>
            <span>當前任務：{totalCollected < 3 ? '探索綠園道，收集 3 張公民觀察卡' : '前往協商圓桌，討論高架自行車道方案'}</span>
          </div>
        </div>

        {/* Playable controls instructions & HUD toolbars */}
        <div className="shrink-0 mb-3 bg-[#FAF8F5] border-2 border-[#1f1d1b] p-2 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 text-[#1f1d1b] text-[10.5px] font-bold">
            <Keyboard size={15} className="text-[var(--color-brand-blue)] shrink-0 animate-bounce" />
            <span>使用 <strong>WASD</strong> 或方向鍵 <strong>← ↑ ↓ →</strong> 自由行走，接近市民代表按 <strong>E</strong> 或 <strong>Space</strong> 開啟交談！</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Map Legend button */}
            <button 
              onClick={() => setShowLegendModal(true)}
              className="px-2.5 py-1 bg-white hover:bg-gray-50 border-2 border-[#1f1d1b] text-[9.5px] font-bold rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 cursor-pointer"
            >
              <Layers size={12} className="text-emerald-600" />
              地圖圖例
            </button>
            {/* Toggle Inventory button */}
            <button 
              onClick={() => setShowInventory(!showInventory)}
              className="px-2.5 py-1 bg-white hover:bg-gray-50 border-2 border-[#1f1d1b] text-[9.5px] font-bold rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 cursor-pointer"
            >
              {showInventory ? (
                <>
                  <EyeOff size={12} className="text-rose-500" />
                  隱藏卡包
                </>
              ) : (
                <>
                  <Eye size={12} className="text-blue-500" />
                  顯示卡包
                </>
              )}
            </button>
            <span className="text-[9.5px] bg-white px-2 py-1 rounded border-2 border-[#1f1d1b] font-bold font-mono">
              身分：{playerRole.name}
            </span>
          </div>
        </div>

        {/* 2.5D Greenway Playable World Viewport (Camera center loop) */}
        <div 
          ref={viewportRef}
          className="flex-1 min-h-0 relative overflow-hidden border-3 border-[#1f1d1b] rounded-2xl bg-[#FAF8F5] shadow-flat-pop"
        >
          {/* Scrollable Container */}
          <div
            style={{
              transform: `translate3d(${cameraOffsetX}px, ${cameraOffsetY}px, 0)`,
              transition: 'transform 0.08s ease-out', // smooth camera follow
              width: `${mapWidth}px`,
              height: `${mapHeight}px`
            }}
            className="absolute top-0 left-0 origin-top-left"
          >
            <Greenway25DMap 
              playerPos={playerPos}
              playerRole={playerRole}
              collectedInsights={collectedInsights}
              interactive={true}
              onSegmentClick={handleSegmentClick}
            />
          </div>

          {/* Near NPC prompt indicator */}
          {nearbyNpc && !collectedInsights[nearbyNpc.id] && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#ffffff] border-3 border-[#1f1d1b] px-4 py-2.5 rounded-xl text-[11px] font-bold text-[#1f1d1b] shadow-flat-pop z-30 animate-bounce flex items-center gap-1.5 select-none pointer-events-none">
              <span className="text-sm">💬</span>
              <span>您已接近 <strong>{nearbyNpc.name}（{nearbyNpc.title}）</strong>，按下 <strong>E</strong> 或 <strong>空白鍵 (Space)</strong> 開始交談！</span>
            </div>
          )}
        </div>

        {/* Collected Insights Deck - RPG Inventory Panel */}
        {showInventory && (
          <div className="shrink-0 border-t-3 border-[#1f1d1b] pt-3 mt-3 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-[#1f1d1b] font-serif block">[ 🎒 您的公民觀點卡包 / CIVIC INSIGHT DECK ]</span>
              <div className="text-[8.5px] text-gray-400 font-mono">
                <span>{sourceNotes.visibleNote}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {NPCS_DATA.map((npc) => {
                const isCollected = collectedInsights[npc.id];
                return (
                  <div 
                    key={npc.id}
                    className={`relative p-2 rounded-xl border-2 border-[#1f1d1b] flex flex-col justify-between min-h-[92px] text-left transition-all ${
                      isCollected 
                        ? 'bg-white shadow-[2.5px_2.5px_0px_0px_#1f1d1b] scale-100' 
                        : 'bg-gray-100/50 border-dashed border-gray-400 text-gray-400 scale-95 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`px-1.5 py-0.2 rounded text-[7px] font-extrabold uppercase tracking-wider ${
                        isCollected ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-gray-200 text-gray-400'
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
                      <span>{isCollected ? `代表：${npc.name}` : '未解鎖'}</span>
                      {isCollected && <span className="text-emerald-600 font-extrabold text-[7.5px]">💡 已收集</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quest finish transition panel */}
        {isExplorationDone && (
          <div className="mt-4 pt-3 border-t-3 border-[#1f1d1b] flex justify-between items-center shrink-0 animate-fade-in">
            <div className="text-xs font-sans text-emerald-700 font-bold flex items-center gap-1">
              <Check size={14} className="animate-bounce" /> 已成功收集超過 3 張公民觀察卡！可以隨時召開審議大會。
            </div>
            <button 
              onClick={handleFinishExploration}
              className="btn-flat-action px-6 py-2.5 rounded-xl text-xs bg-[var(--color-brand-coral)] hover:bg-[#c06a5f] text-white flex items-center gap-1.5 shadow-flat-pop font-bold cursor-pointer"
            >
              前往協商任務簡報 <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Phase 3 NPC Dialogue Bubble Modal Overlay */}
        {activeNpcForDialogue && (
          <div className="absolute inset-0 bg-[#1f1d1b]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in rounded-xl">
            <div className="bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 max-w-lg w-full shadow-flat-pop-lg relative animate-scale-in text-left select-none flex flex-col gap-4">
              
              <div className="flex items-center gap-3 border-b-2 border-dashed border-gray-300 pb-2 mb-1 shrink-0">
                <div className={`w-10 h-10 rounded-full border-2 border-[#1f1d1b] ${getBlobBgClass(activeNpcForDialogue.id)} flex items-center justify-center overflow-hidden shrink-0`}>
                  <img 
                    src={activeNpcForDialogue.avatar} 
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
                <span>交談後將會獲得：<strong>【{activeNpcForDialogue.cardName}】</strong>，可用於市民協商大會中做為討論證據！</span>
              </div>

              <button
                onClick={handleCollectInsight}
                className="w-full btn-flat-action py-2.5 rounded-xl text-xs bg-[var(--color-brand-green)] text-white shadow-flat-pop font-bold mt-2 cursor-pointer"
              >
                收進卡包，解鎖{activeNpcForDialogue.cardName} ➔
              </button>
            </div>
          </div>
        )}

        {/* Map Legend Overlay Modal */}
        {showLegendModal && (
          <div className="absolute inset-0 bg-[#1f1d1b]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in rounded-xl">
            <div className="bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 max-w-md w-full shadow-flat-pop-lg relative text-left select-none flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b-2 border-[#1f1d1b] pb-2">
                <BookOpen className="text-[var(--color-brand-blue)] w-5 h-5" />
                <h3 className="text-sm font-extrabold text-[#1f1d1b] font-serif">🗺️ 台南綠園道 2.5D 數位雙生地圖圖例</h3>
              </div>

              <div className="space-y-3.5 text-xs text-[#1f1d1b] leading-relaxed max-h-[300px] overflow-y-auto pr-1">
                <div className="flex gap-2.5 items-start p-2.5 bg-[#f5efe1] border border-[#d5ccb9] rounded-xl">
                  <span className="text-base">🏡</span>
                  <div>
                    <h5 className="font-bold text-[11px]">住宅段 (暖米色板塊)</h5>
                    <p className="text-[9.5px] text-gray-500 mt-0.5">鄰近密集老舊透天厝，規劃重點在於防範高架車流的視線隱私干擾與夜間安寧。</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start p-2.5 bg-[#fbf6e2] border border-[#ded8bf] rounded-xl">
                  <span className="text-base">🛍️</span>
                  <div>
                    <h5 className="font-bold text-[11px]">商業段 (暖黃色板塊)</h5>
                    <p className="text-[9.5px] text-gray-500 mt-0.5">青年路商圈，規劃重點在於將通勤車流引入地面共享街道，帶動沿街店鋪商機。</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start p-2.5 bg-[#ebf3f7] border border-[#cbd5dc] rounded-xl">
                  <span className="text-base">🚂</span>
                  <div>
                    <h5 className="font-bold text-[11px]">車站節點 (水藍色板塊)</h5>
                    <p className="text-[9.5px] text-gray-500 mt-0.5">台南車站轉乘大廳與 YouBike 車柱，規畫重點在於大眾轉乘效率與行人優先廣場平衡。</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start p-2.5 bg-[#f1f3f5] border border-[#d1d5db] rounded-xl">
                  <span className="text-base">🚦</span>
                  <div>
                    <h5 className="font-bold text-[11px]">主要路口 (水泥灰路段)</h5>
                    <p className="text-[9.5px] text-gray-500 mt-0.5">主要車行幹道切斷處，規劃重點在於安全跨越（立體自行車天橋或受保護平面路口）。</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start p-2.5 bg-[#edf3ed] border border-[#cbdcbd] rounded-xl">
                  <span className="text-base">🌿</span>
                  <div>
                    <h5 className="font-bold text-[11px]">生態綠帶段 (自然草綠板塊)</h5>
                    <p className="text-[9.5px] text-gray-500 mt-0.5">熱島效應降溫核心，規劃重點在於複層林蔭冠層、雨水花園與高透水率泥土鋪面。</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowLegendModal(false)}
                className="w-full btn-flat-action py-2.5 rounded-xl text-xs bg-[var(--color-brand-blue)] text-white shadow-flat-pop font-bold mt-2 cursor-pointer animate-scale-in"
              >
                關閉圖例說明
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
