import React, { useState, useEffect, useRef } from 'react';
import { Greenway25DMap } from './Greenway25DMap';
import { Sparkles, Check, ArrowRight, ShieldAlert, Award, Lightbulb, Keyboard, Info, BookOpen, Lock, RefreshCw, X, AlertCircle } from 'lucide-react';
import { StakeholderRole } from '@/data/roles';
import { GameStats } from '@/app/page';

interface ExplorationScreenProps {
  playerRole: StakeholderRole;
  stats: GameStats;
  unlockedLevels: Record<number, boolean>;
  levelChoices: Record<number, string>;
  onLevelComplete: (levelId: number, choiceId: string, statsChange: Partial<GameStats>) => void;
  onFinishGame: () => void;
}

interface Choice {
  id: string;
  text: string;
  feedback: string;
  effects: Partial<GameStats>;
}

interface LevelData {
  id: number;
  title: string;
  portalName: string;
  x: number;
  y: number;
  objective: string;
  mobs: { name: string; role: string; avatar: string; phrase: string }[];
  choices: Choice[];
}

const LEVELS_DATA: Record<number, LevelData> = {
  1: {
    id: 1,
    title: 'Level 1: 日常通行衝突 (住宅與慢行段)',
    portalName: '🚶 通行協調節點',
    x: 200,
    y: 25,
    objective: '降低高架車流對住宅隱私與行人安全的衝擊。目標：將衝突值降低！',
    mobs: [
      { name: '小宇', role: '衝鋒通勤騎士', avatar: '/avatar_commuter.png', phrase: '「高架快又爽，沒人能在平面慢吞吞地騎！時間就是金錢！」' },
      { name: '陳阿嬤', role: '安全至上長者', avatar: '/avatar_elderly.png', phrase: '「車子騎那麼快，橋又對著我家二樓，吵得睡不著、隱私全沒了！」' }
    ],
    choices: [
      {
        id: '1a',
        text: '【方案 A】全線雙軌鋼構高架車道 (騎士高速通過)',
        feedback: '小宇大聲叫好，但陳阿嬤氣壞了：高架橋正對二樓陽台，起居生活毫無隱私！鄰里抗議四起！',
        effects: { commuterEff: 25, safetySense: 15, residentSat: -20, ecologicalScore: -10, conflictValue: -20 }
      },
      {
        id: '1b',
        text: '【方案 B】完全行人優先平面慢行區 (單車速限 10km)',
        feedback: '陳阿嬤非常高興，但小宇崩潰：這跟牽車走路有什麼兩樣？通勤效率降到冰點，大家寧願騎大馬路！',
        effects: { residentSat: 25, safetySense: 20, commuterEff: -25, activityVitality: 10, conflictValue: -30 }
      },
      {
        id: '1c',
        text: '【方案 C】平面水平綠牆分流設計 (1.5米多層次防護植栽)',
        feedback: '雙贏共識！平面防護綠牆成功隔離了噪音與視線干擾，同時確保通勤車道有適當速度與高透水安全分流！',
        effects: { residentSat: 20, merchantSat: 5, commuterEff: 10, ecologicalScore: 15, safetySense: 15, conflictValue: -60 }
      }
    ]
  },
  2: {
    id: 2,
    title: 'Level 2: 商業與生活衝突 (青年路商圈段)',
    portalName: '🛍️ 商業協調節點',
    x: 450,
    y: 25,
    objective: '平衡商圈人流、外送臨停與周邊居民夜間安寧。目標：平息攤販噪音！',
    mobs: [
      { name: '莉雅', role: '夜市攤主代表', avatar: '/avatar_shopowner.png', phrase: '「不准擺設攤位和戶外座位，我們商家生意要怎麼活下去？」' },
      { name: '阿明', role: '噪音崩潰住戶', avatar: '/avatar_resident.png', phrase: '「油煙味沖天，半夜還有人聚眾喧嘩唱歌，我們明天還要上班啊！」' }
    ],
    choices: [
      {
        id: '2a',
        text: '【方案 A】全天候禁設攤商與街頭藝人 (淨空綠道)',
        feedback: '阿明稱讚清靜，但莉雅生計受重創：整個商圈沒有停留客源，死氣沉沉！店家關門潮爆發！',
        effects: { residentSat: 25, merchantSat: -25, activityVitality: -25, safetySense: 10, conflictValue: -30 }
      },
      {
        id: '2b',
        text: '【方案 B】完全開放露天攤商與美食廣場 (不限營業時段)',
        feedback: '商家大繁榮！但油煙噪音沖天，阿明投訴不斷，警方天天到場，衝突越演越烈！',
        effects: { merchantSat: 25, activityVitality: 25, residentSat: -25, safetySense: -15, conflictValue: -15 }
      },
      {
        id: '2c',
        text: '【方案 C】劃設時段性口袋廣場與裝卸貨綠帶分流',
        feedback: '精準分流！限時 21:00 前結束營業，並預留臨停物流車位與遮蔭口袋廣場，人潮停留意願大增！',
        effects: { residentSat: 15, merchantSat: 20, activityVitality: 20, ecologicalScore: 5, safetySense: 10, conflictValue: -65 }
      }
    ]
  },
  3: {
    id: 3,
    title: 'Level 3: 綠化、安全與活動衝突 (生態降溫段)',
    portalName: '🌿 生態休憩協調節點',
    x: 800,
    y: 25,
    objective: '兼顧林蔭生態降溫與夜間防範暗處犯罪。目標：抵制極端水泥派！',
    mobs: [
      { name: '綠野老師', role: '生態保育學者', avatar: '/avatar_environmentalist.png', phrase: '「大量鋪設水泥會加劇熱島效應，鳥類和昆蟲都會失去家園！」' },
      { name: '林小姐', role: '夜行怕黑媽媽', avatar: '/avatar_government.png', phrase: '「晚上黑漆漆的灌木叢容易藏壞人，根本不敢帶小孩來這裡散步！」' }
    ],
    choices: [
      {
        id: '3a',
        text: '【方案 A】硬質水泥廣場與全夜強光照明 (消滅生態死角)',
        feedback: '林小姐覺得安全，但綠野老師痛心：綠園道完全失去呼吸功能，水泥吸熱導致熱島效應嚴重，生態化為零。',
        effects: { safetySense: 25, activityVitality: 15, ecologicalScore: -30, residentSat: -10, conflictValue: -35 }
      },
      {
        id: '3b',
        text: '【方案 B】野化森林與零光害生態管制區 (無路燈)',
        feedback: '生態指標大增！但抱怨暴民在網路上大罵：晚上黑得像鬼片現場，蚊蟲孳生，成了治安死角！',
        effects: { ecologicalScore: 30, residentSat: 10, safetySense: -25, activityVitality: -20, conflictValue: -25 }
      },
      {
        id: '3c',
        text: '【方案 C】透水碎石引道與低照度向上遮光暖 LED 引導',
        feedback: '生態科技結合！向下暖光 LED 確保了行人足部照明安全，又避開了鳥類棲息樹冠；雨水花園與碎石鋪面提供完美透水！',
        effects: { residentSat: 15, ecologicalScore: 25, safetySense: 20, activityVitality: 10, conflictValue: -70 }
      }
    ]
  }
};

export const ExplorationScreen: React.FC<ExplorationScreenProps> = ({
  playerRole,
  stats,
  unlockedLevels,
  levelChoices,
  onLevelComplete,
  onFinishGame
}) => {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 25 });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [levelStage, setLevelStage] = useState<'dialogue' | 'feedback'>('dialogue');

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ w: 1000, h: 520 });

  const keysPressed = useRef<Record<string, boolean>>({});
  const requestRef = useRef<number | null>(null);

  // Set up sizes for 2D panning map
  const mapScale = 1.6;
  const mapWidth = 1000 * mapScale;
  const mapHeight = 520 * mapScale;

  const checkCollision = (x: number, y: number) => {
    if (x < 30 || x > 970) return true;
    if (y < -110 || y > 110) return true;

    // Houses
    if (x >= 150 && x <= 260 && y >= -95 && y <= -45) return true;
    // Commercial shops
    if (x >= 350 && x <= 470 && y >= -95 && y <= -45) return true;
    // Station building
    if (x >= 560 && x <= 660 && y >= -105 && y <= -45) return true;

    return false;
  };

  const get2DPointForCamera = (x: number, yOffset: number) => {
    const ratio = x / 1000;
    const baseX = 30 + ratio * 940;
    const baseY = 260;
    const wiggle = Math.sin(ratio * Math.PI * 2) * 35;
    const y = yOffset + wiggle;
    return {
      x: baseX,
      y: baseY + y
    };
  };

  const getNearbyLevelId = () => {
    for (const [idStr, lv] of Object.entries(LEVELS_DATA)) {
      const id = parseInt(idStr);
      const dx = playerPos.x - lv.x;
      const dy = playerPos.y - lv.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 40) return id;
    }
    return null;
  };

  const nearbyLevelId = getNearbyLevelId();

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
        const lvId = getNearbyLevelId();
        if (lvId && unlockedLevels[lvId] && levelChoices[lvId] === undefined) {
          handleOpenLevel(lvId);
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
  }, [playerPos, unlockedLevels, levelChoices]);

  // requestAnimationFrame walk physics loop
  useEffect(() => {
    if (activeLevelId) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const moveSpeed = 2.8;

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
  }, [activeLevelId]);

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

  const handleOpenLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    setLevelStage('dialogue');
    setSelectedChoiceId(null);
  };

  const handleLevelChoiceSelect = (choice: Choice) => {
    setSelectedChoiceId(choice.id);
    setLevelStage('feedback');
  };

  const handleConfirmLevelComplete = () => {
    if (activeLevelId && selectedChoiceId) {
      const lv = LEVELS_DATA[activeLevelId];
      const ch = lv.choices.find(c => c.id === selectedChoiceId);
      if (ch) {
        onLevelComplete(activeLevelId, selectedChoiceId, ch.effects);
        setToastMsg(`🎉 已通過 ${lv.title}！`);
      }
    }
    setActiveLevelId(null);
    setSelectedChoiceId(null);
    setLevelStage('dialogue');
  };

  // Camera scroll offsets
  const playerScreenCoords = get2DPointForCamera(playerPos.x, playerPos.y);
  const playerPixelX = playerScreenCoords.x * mapScale;
  const playerPixelY = playerScreenCoords.y * mapScale;

  const rawOffsetX = viewportSize.w / 2 - playerPixelX;
  const rawOffsetY = viewportSize.h / 2 - playerPixelY;

  const cameraOffsetX = Math.min(0, Math.max(viewportSize.w - mapWidth, rawOffsetX));
  const cameraOffsetY = Math.min(0, Math.max(viewportSize.h - mapHeight, rawOffsetY));

  const allLevelsDone = levelChoices[1] !== undefined && levelChoices[2] !== undefined && levelChoices[3] !== undefined;

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-0 h-full overflow-hidden relative font-sans text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-[#e2f0d9] border-3 border-[#1f1d1b] px-5 py-3 rounded-xl text-xs font-black text-[#3e5f4c] shadow-flat-pop animate-bounce flex items-center gap-1.5 select-none">
          <span className="text-sm">💡</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Left Area: 2.5D Playable World Map */}
      <div className="flex-1 flex flex-col bg-white border-3 border-[#1f1d1b] rounded-2xl p-4 shadow-flat-pop-lg overflow-hidden relative">
        
        {/* HUD control guide bar */}
        <div className="shrink-0 mb-3 bg-[#FAF8F5] border-2 border-[#1f1d1b] p-2.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 text-[#1f1d1b] text-[10px] font-bold">
            <Keyboard size={14} className="text-[var(--color-brand-blue)] shrink-0 animate-bounce" />
            <span>使用 <strong>WASD / 方向鍵</strong> 移動。接近發光關卡節點或衝突 NPC，按 <strong>E / 空白鍵</strong> 進行協商對決！</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setShowLegendModal(true)}
              className="px-2.5 py-1 bg-white hover:bg-gray-50 border-2 border-[#1f1d1b] text-[9.5px] font-bold rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 cursor-pointer"
            >
              地圖圖例說明
            </button>
            <span className="text-[9.5px] bg-[#fff8e6] px-2 py-0.5 rounded border border-amber-300 text-amber-800 font-bold font-mono">
              目標：降低大眾衝突值 & 解鎖市民大會
            </span>
          </div>
        </div>

        {/* Viewport */}
        <div 
          ref={viewportRef}
          className="flex-1 min-h-0 relative overflow-hidden border-3 border-[#1f1d1b] rounded-2xl bg-[#FAF8F5] shadow-inner"
        >
          {/* Scrolling Map */}
          <div
            style={{
              transform: `translate3d(${cameraOffsetX}px, ${cameraOffsetY}px, 0)`,
              transition: 'transform 0.08s ease-out',
              width: `${mapWidth}px`,
              height: `${mapHeight}px`
            }}
            className="absolute top-0 left-0 origin-top-left"
          >
            <Greenway25DMap 
              playerPos={playerPos}
              playerRole={playerRole}
              collectedInsights={{
                resident: levelChoices[1] !== undefined,
                shop_owner: levelChoices[2] !== undefined,
                commuter: levelChoices[3] !== undefined,
                elderly: levelChoices[1] !== undefined,
                environmentalist: levelChoices[3] !== undefined
              }}
              interactive={true}
              mapState="exploration"
            />

            {/* Level Portals & Conflict NPCs rendered as overlay elements */}
            {Object.values(LEVELS_DATA).map((lv) => {
              const pt = get2DPointForCamera(lv.x, lv.y);
              const left = pt.x * mapScale;
              const top = pt.y * mapScale;
              const isUnlocked = unlockedLevels[lv.id];
              const isCompleted = levelChoices[lv.id] !== undefined;

              return (
                <div 
                  key={lv.id} 
                  style={{ left: `${left}px`, top: `${top}px` }}
                  className="absolute -translate-x-1/2 -translate-y-[80%] z-20 flex flex-col items-center pointer-events-none"
                >
                  {/* Glowing Portal ring on the ground */}
                  <div className={`w-14 h-6 rounded-full border-2 border-dashed ${
                    isCompleted ? 'bg-emerald-100/35 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                    isUnlocked ? 'bg-amber-100/35 border-amber-500 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.7)]' :
                    'bg-gray-100/10 border-gray-300'
                  }`} />

                  {/* Portal badge tag */}
                  <div className={`mt-1.5 px-2 py-0.5 rounded border-2 border-black font-mono text-[8.5px] font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                    isCompleted ? 'bg-emerald-100 text-emerald-800' :
                    isUnlocked ? 'bg-amber-100 text-amber-800 animate-bounce' :
                    'bg-gray-100 text-gray-400 border-dashed border-gray-300 shadow-none'
                  }`}>
                    {lv.portalName} {isCompleted ? '✅' : isUnlocked ? '⚡' : '🔒'}
                  </div>

                  {/* Conflict/Angry Emoji bubbles for unlocked levels */}
                  {isUnlocked && !isCompleted && (
                    <div className="absolute top-[-44px] bg-red-100 border-2 border-black rounded-full px-2 py-0.5 font-bold text-[10px] text-red-600 animate-bounce flex items-center gap-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <span>💢 對立!</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Final Council Hall Gate Portal (at the end) */}
            {(() => {
              const pt = get2DPointForCamera(920, 25);
              const left = pt.x * mapScale;
              const top = pt.y * mapScale;
              return (
                <div 
                  style={{ left: `${left}px`, top: `${top}px` }}
                  className="absolute -translate-x-1/2 -translate-y-[80%] z-20 flex flex-col items-center pointer-events-none"
                >
                  <div className={`w-16 h-8 rounded-full border-3 ${
                    allLevelsDone 
                      ? 'bg-rose-100/50 border-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.7)]' 
                      : 'bg-gray-200/20 border-dashed border-gray-300'
                  }`} />
                  <div className={`mt-1.5 px-3 py-1 rounded-md border-2 border-black font-mono text-[9px] font-bold shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${
                    allLevelsDone ? 'bg-rose-100 text-rose-800 animate-bounce' : 'bg-gray-100 text-gray-400'
                  }`}>
                    🏛️ 市民大會堂 {allLevelsDone ? '➔' : '🔒'}
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Near Portal prompt indicator overlay */}
          {nearbyLevelId !== null && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border-3 border-[#1f1d1b] px-4 py-2.5 rounded-xl text-[11px] font-bold text-[#1f1d1b] shadow-flat-pop z-30 animate-bounce flex items-center gap-1.5 select-none pointer-events-none">
              <span className="text-sm">🗣️</span>
              {levelChoices[nearbyLevelId] !== undefined ? (
                <span>此節點已協調完畢。請前往其他亮起的衝突區域！</span>
              ) : unlockedLevels[nearbyLevelId] ? (
                <span>接近 <strong>{LEVELS_DATA[nearbyLevelId].title}</strong>，按下 <strong>E / 空白鍵</strong> 或點選進入對決！</span>
              ) : (
                <span>此區段協商被鎖定。請先解決前面的路段衝突！</span>
              )}
            </div>
          )}

          {/* Near Council Hall portal prompt indicator */}
          {Math.sqrt(Math.pow(playerPos.x - 920, 2) + Math.pow(playerPos.y - 25, 2)) <= 40 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border-3 border-[#1f1d1b] px-4 py-2.5 rounded-xl text-[11px] font-bold text-[#1f1d1b] shadow-flat-pop z-30 animate-bounce flex items-center gap-1.5 select-none pointer-events-none">
              <span className="text-sm">🏛️</span>
              {allLevelsDone ? (
                <span>已抵達大會堂！請點選右下角 <strong>「召開大會，審定綠園道 ➔」</strong> 按鈕！</span>
              ) : (
                <span>大會堂關閉中。必須先解決 Level 1-3 的所有路段衝突！</span>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Right Area: Stats Dashboard & Quest Log */}
      <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
        
        {/* Current Stats Panel */}
        <div className="bg-white border-3 border-[#1f1d1b] rounded-2xl p-4 shadow-flat-pop flex flex-col justify-between">
          <div className="border-b-2 border-dashed border-gray-300 pb-2 mb-3">
            <span className="text-xs font-black text-[#1f1d1b] font-serif flex items-center gap-1">
              📊 綠園道即時數值系統
            </span>
          </div>

          <div className="space-y-3">
            {/* Resident Satisfaction */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-700">
                <span>🏠 居民滿意度 (Resident Sat)</span>
                <span>{stats.residentSat}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 border border-black rounded-sm overflow-hidden">
                <div className="h-full bg-rose-400" style={{ width: `${stats.residentSat}%` }} />
              </div>
            </div>

            {/* Merchant Satisfaction */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-700">
                <span>🛍️ 商家滿意度 (Merchant Sat)</span>
                <span>{stats.merchantSat}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 border border-black rounded-sm overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${stats.merchantSat}%` }} />
              </div>
            </div>

            {/* Commuter Efficiency */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-700">
                <span>🚲 通勤效率 (Commuter Eff)</span>
                <span>{stats.commuterEff}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 border border-black rounded-sm overflow-hidden">
                <div className="h-full bg-sky-400" style={{ width: `${stats.commuterEff}%` }} />
              </div>
            </div>

            {/* Ecological Score */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-700">
                <span>🌿 生態棲地分數 (Habitat Score)</span>
                <span>{stats.ecologicalScore}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 border border-black rounded-sm overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${stats.ecologicalScore}%` }} />
              </div>
            </div>

            {/* Safety Sense */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-700">
                <span>🚦 安全感指數 (Safety Index)</span>
                <span>{stats.safetySense}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 border border-black rounded-sm overflow-hidden">
                <div className="h-full bg-blue-400" style={{ width: `${stats.safetySense}%` }} />
              </div>
            </div>

            {/* Activity Vitality */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-700">
                <span>🎪 活動活力值 (Vitality)</span>
                <span>{stats.activityVitality}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 border border-black rounded-sm overflow-hidden">
                <div className="h-full bg-purple-400" style={{ width: `${stats.activityVitality}%` }} />
              </div>
            </div>

            {/* Conflict Value */}
            <div className="space-y-0.5 border-t border-dashed border-gray-300 pt-3">
              <div className="flex justify-between text-[10px] font-extrabold text-red-600">
                <span className="flex items-center gap-0.5">
                  <ShieldAlert size={12} className="animate-pulse" />
                  ⚠️ 綠園道大眾衝突值 (Conflict)
                </span>
                <span>{stats.conflictValue}%</span>
              </div>
              <div className="h-3 w-full bg-red-50 border-2 border-red-800 rounded-md overflow-hidden relative">
                <div className="h-full bg-red-600 animate-pulse" style={{ width: `${stats.conflictValue}%` }} />
                <div className="absolute inset-0 flex items-center justify-center text-[7.5px] font-black text-red-950 uppercase select-none">
                  {stats.conflictValue > 60 ? '高度對立' : stats.conflictValue > 30 ? '中度分歧' : '順利整合'}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Quest/Level log list */}
        <div className="bg-[#FAF8F5] border-3 border-[#1f1d1b] rounded-2xl p-4 shadow-flat-pop flex-1 flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-dashed border-gray-300 pb-2 mb-3">
              <span className="text-xs font-black text-[#1f1d1b] font-serif">
                🎯 協商任務清單 (Quest Log)
              </span>
            </div>
            
            <div className="space-y-2.5">
              {Object.values(LEVELS_DATA).map((lv) => {
                const isCompleted = levelChoices[lv.id] !== undefined;
                const isUnlocked = unlockedLevels[lv.id];
                return (
                  <div 
                    key={lv.id} 
                    onClick={() => isUnlocked && !isCompleted && handleOpenLevel(lv.id)}
                    className={`p-2 border-2 rounded-xl text-left flex items-start gap-2 select-none transition-all ${
                      isCompleted ? 'bg-emerald-50 border-emerald-500 text-emerald-800' :
                      isUnlocked ? 'bg-white border-[#1f1d1b] text-[#1f1d1b] cursor-pointer hover:bg-amber-50/20' :
                      'bg-gray-100/50 border-dashed border-gray-300 text-gray-400'
                    }`}
                  >
                    <span className="text-xs mt-0.5 shrink-0">{isCompleted ? '✅' : isUnlocked ? '⚡' : '🔒'}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-extrabold leading-tight truncate">{lv.title}</div>
                      <div className="text-[8px] mt-0.5 opacity-80 leading-normal line-clamp-1">
                        {isCompleted ? '已完成方案協審' : isUnlocked ? '可前往該節點進行協商' : '未解鎖'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit action button */}
          <div className="mt-4 border-t border-dashed border-gray-300 pt-3">
            <button
              disabled={!allLevelsDone}
              onClick={onFinishGame}
              className={`w-full btn-flat-action py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 font-bold shadow-flat-pop ${
                allLevelsDone 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white cursor-pointer' 
                  : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>🏛️ 召開市民大會，審定綠園道</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Map Legend Overlay Modal */}
      {showLegendModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 max-w-md w-full shadow-flat-pop-lg relative text-left select-none flex flex-col gap-4">
            <button 
              onClick={() => setShowLegendModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <BookOpen className="text-[var(--color-brand-blue)] w-5 h-5" />
              <h3 className="text-sm font-extrabold text-[#1f1d1b] font-serif">🗺️ 台南綠園道 2D 俯視規劃地圖說明</h3>
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
              關閉地圖圖例
            </button>
          </div>
        </div>
      )}

      {/* Dialogue Battle overlay modal for active level */}
      {activeLevelId !== null && (() => {
        const lv = LEVELS_DATA[activeLevelId];
        return (
          <div className="fixed inset-0 bg-[#1f1d1b]/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border-3 border-[#1f1d1b] rounded-2xl p-6 max-w-2xl w-full shadow-flat-pop-lg relative animate-scale-in flex flex-col gap-4 text-left">
              
              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2 mb-1 shrink-0">
                <h3 className="text-sm font-extrabold text-[#1f1d1b] font-serif">{lv.title}</h3>
                <div className="text-[9px] bg-red-100 border border-red-300 text-red-800 font-mono px-2 py-0.5 rounded font-black">
                  🎯 任務目標：協調對立價值，降低衝突值
                </div>
              </div>

              {levelStage === 'dialogue' ? (
                <>
                  {/* Context objective description */}
                  <div className="bg-[#fff8e6] border border-amber-300 px-3.5 py-2.5 rounded-xl text-[10.5px] text-amber-800 leading-normal flex items-start gap-2">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <div>
                      <strong>衝突緣起：</strong>{lv.objective}
                    </div>
                  </div>

                  {/* Character dialogue showoffs */}
                  <div className="space-y-3 my-2 max-h-56 overflow-y-auto pr-1">
                    {lv.mobs.map((mob, idx) => (
                      <div key={idx} className="flex gap-3 items-start bg-gray-50 border-2 border-[#1f1d1b] p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center overflow-hidden shrink-0">
                          <img src={mob.avatar} alt={mob.name} className="w-full h-full object-cover scale-110" />
                        </div>
                        <div>
                          <div className="text-[9px] font-black text-gray-500">{mob.name} / {mob.role}</div>
                          <div className="text-xs font-serif font-semibold text-[#1f1d1b] leading-relaxed mt-0.5">
                            {mob.phrase}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Choices list */}
                  <div className="border-t border-dashed border-gray-300 pt-3 space-y-2">
                    <span className="text-[9.5px] font-black text-gray-400 font-mono block">🛠️ 選擇協調方案對策 / SELECT STRATEGY</span>
                    <div className="space-y-2">
                      {lv.choices.map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => handleLevelChoiceSelect(choice)}
                          className="w-full text-left px-4 py-3 bg-white border-2 border-[#1f1d1b] rounded-xl text-xs font-bold hover:bg-[#fffdf2] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1f1d1b] hover:translate-x-1"
                        >
                          <div className="flex justify-between items-center">
                            <span>{choice.text}</span>
                            <div className="flex gap-1.5">
                              {Object.entries(choice.effects).map(([k, v]) => {
                                if (k === 'conflictValue') {
                                  return (
                                    <span key={k} className="text-[8px] bg-red-100 text-red-800 border border-red-300 px-1 py-0.2 rounded font-mono">
                                      衝突 {v}
                                    </span>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Feedback Screen */}
                  {(() => {
                    const choice = lv.choices.find(c => c.id === selectedChoiceId);
                    if (!choice) return null;
                    return (
                      <div className="space-y-4 py-2 text-center flex-1 flex flex-col justify-between min-h-[300px]">
                        
                        {/* Status change preview */}
                        <div className="max-w-md w-full mx-auto bg-gray-50 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center relative">
                          <div className="absolute top-[-10px] left-6 bg-red-500 border border-black text-white px-2 py-0.5 text-[8.5px] font-black rounded uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            施作結果 / Design Result
                          </div>
                          
                          <p className="text-xs md:text-sm font-serif font-black text-gray-700 leading-relaxed mb-4">
                            {choice.feedback}
                          </p>

                          <div className="border-t border-dashed border-gray-300 pt-3.5">
                            <span className="text-[8.5px] font-black text-gray-400 block mb-2">📊 數值異動反饋 / STAT CHANGE PREVIEW</span>
                            <div className="flex flex-wrap justify-center gap-2">
                              {Object.entries(choice.effects).map(([key, val]) => {
                                const isPositive = (val || 0) > 0;
                                let metricLabel = key;
                                if (key === 'residentSat') metricLabel = '居民滿意';
                                else if (key === 'merchantSat') metricLabel = '商家滿意';
                                else if (key === 'commuterEff') metricLabel = '通勤效率';
                                else if (key === 'ecologicalScore') metricLabel = '生態環境';
                                else if (key === 'safetySense') metricLabel = '安全感';
                                else if (key === 'activityVitality') metricLabel = '活動活力';
                                else if (key === 'conflictValue') metricLabel = '衝突值';

                                return (
                                  <span key={key} className={`px-2 py-0.5 rounded border text-[8.5px] font-extrabold ${
                                    key === 'conflictValue' 
                                      ? 'bg-red-50 border-red-300 text-red-700'
                                      : isPositive ? 'bg-green-50 border-green-300 text-green-700' : 'bg-rose-50 border-rose-300 text-rose-700'
                                  }`}>
                                    {metricLabel} {isPositive ? `+${val}` : val}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Confirmation button */}
                        <div className="pt-4 border-t border-dashed border-gray-300">
                          <button
                            onClick={handleConfirmLevelComplete}
                            className="btn-flat-action w-full bg-[var(--color-brand-green)] hover:bg-[#a6bf4c] text-white py-3 rounded-2xl text-xs flex items-center justify-center gap-1 cursor-pointer font-bold shadow-flat-pop"
                          >
                            <span>確認提交本段對策，更新園道規劃</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>

                      </div>
                    );
                  })()}
                </>
              )}

            </div>
          </div>
        );
      })()}

    </div>
  );
};
