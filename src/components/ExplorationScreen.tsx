import React, { useState, useEffect } from 'react';
import { StakeholderRole } from '@/data/roles';
import { Greenway25DMap } from './Greenway25DMap';
import { Sparkles, Check, ArrowRight, Lightbulb, Keyboard, Info, MessageSquare, MapPin } from 'lucide-react';
import { officialSpatialSegments, sourceNotes } from '@/data/officialGreenwayData';

interface ExplorationScreenProps {
  playerRole: StakeholderRole;
  onExploreComplete: (collectedInsights: string[]) => void;
}

interface Segment {
  id: number;
  name: string;
  sta: string;
  pct: number;
  npcId: string;
  npcName: string;
  npcTitle: string;
  condition: string;
  conflict: string;
  concern: string;
  observation: string;
  dialogue: string;
  insightSummary: string;
}

export const ExplorationScreen: React.FC<ExplorationScreenProps> = ({ playerRole, onExploreComplete }) => {
  const [selectedSegId, setSelectedSegId] = useState<number>(0);
  const [avatarPosition, setAvatarPosition] = useState<number>(15); // Start at Residential Segment (15%)
  const [activeDialogueNpc, setActiveDialogueNpc] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [collectedInsights, setCollectedInsights] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  });

  const getSegmentPct = (id: number) => {
    switch (id) {
      case 0: return 15;
      case 1: return 38;
      case 2: return 56;
      case 3: return 74;
      case 4: return 90;
      default: return 15;
    }
  };

  const segments: Segment[] = [
    {
      id: 0,
      name: '住宅段',
      sta: 'STA 0+000 - 0+400',
      pct: 15,
      npcId: 'resident',
      npcName: '阿明',
      npcTitle: '周邊居民代表',
      condition: '住宅建築直接面向未來的綠園道。',
      conflict: '高架自行車道可能會造成視覺侵入與隱私壓力。',
      concern: '周邊居民',
      observation: '高架自行車道設計如果過於貼近住宅二樓，將對沿線住戶的生活隱私與日照採光造成實質干擾。',
      dialogue: '「住宅段非常需要寧靜與隱私。如果高架自行車道離我們的二樓陽台太近，每天生活都像被路人公開展示。我們希望降至地面層慢行，或者有高架隱私遮簾，保留我們社區的安寧！」',
      insightSummary: '住宅段需要處理視線遮蔽、夜間噪音與生活安寧。'
    },
    {
      id: 1,
      name: '商業段',
      sta: 'STA 0+400 - 0+700',
      pct: 38,
      npcId: 'shop_owner',
      npcName: '莉雅',
      npcTitle: '在地店家代表',
      condition: '商家依賴地面人流與慢速停留。',
      conflict: '若騎士走高架路廊飛越街區，地方店鋪恐流失能見度與客源。',
      concern: '在地店家',
      observation: '本區段店家林立，若是高架化設計，騎士高速通過將跳過地面商圈，不利於地區商業復甦與活力。',
      dialogue: '「商業段最需要的是人流停留！如果騎士都從高架自行車道飛越過去，我們地面層的傳統店家與日常生活就完全失去商機。我們支持降至地面，打造慢速人車共享街區與廣場！」',
      insightSummary: '商業段需要把通行效率轉化為可停留的人流。'
    },
    {
      id: 2,
      name: '車站節點',
      sta: 'STA 0+700',
      pct: 56,
      npcId: 'commuter',
      npcName: '小宇',
      npcTitle: '通勤 / 騎士代表',
      condition: '車站區域連結步行、自行車、大眾運輸與 YouBike 系統。',
      conflict: '快速通過與轉乘便利性可能與行人步行舒適度產生衝突。',
      concern: '通勤 / 騎士',
      observation: '鐵路地下化後的舊車站節點是交通匯集處，如何在保障行人安全步行的同時，維護高效率的轉乘與騎行？',
      dialogue: '「車站節點是交通的核心，我們最關心的是通勤騎乘的連續性與轉乘效率。如果綠園道不順暢，每天上班通勤都會延誤。我們希望這裡有清晰的YouBike與大眾運輸轉乘樞紐，人車分流，不要中斷我們的騎行線路！」',
      insightSummary: '車站節點需要整合轉乘效率與步行安全。'
    },
    {
      id: 3,
      name: '主要路口',
      sta: 'STA 0+700 - 0+900',
      pct: 74,
      npcId: 'government',
      npcName: '林科長',
      npcTitle: '市府 / 設計師代表',
      condition: '主要幹道切斷了綠園道的空間連續性。',
      conflict: '平面穿越可能較為危險，但連續的立體高架基礎設施會產生空間壓迫感。',
      concern: '市府 / 設計師',
      observation: '綠廊面臨十字路口繁忙車流，平面交織的衝突點極多，需有專用號誌控制或立體化分流對策。',
      dialogue: '「主要路口車流量大，我們的核心考量是交通安全與工程可行性。平面穿越需要有受保護的自行車十字路口，或者規劃人車分流號誌。若要維持高架，就要考慮立體自行車陸橋，但預算和空間遮擋也需要審慎評估。」',
      insightSummary: '主要路口適合討論局部高架或受保護穿越。'
    },
    {
      id: 4,
      name: '生態綠帶段',
      sta: 'STA 0+900 - 1+400',
      pct: 90,
      npcId: 'environmentalist_elderly',
      npcName: '綠野老師 與 陳伯伯',
      npcTitle: '環保代表 與 高齡漫步代表',
      condition: '綠園道可成為台南市區的降溫綠化廊道。',
      conflict: '過多的水泥硬鋪面會加劇熱島效應並降低基地透水率。',
      concern: '環保團體 與 高齡漫步者',
      observation: '本段南部綠蔭環繞。如果全鋪設不透水的水泥硬質鋪面，都市風道將受阻，熱島效應會讓地表高溫難耐。',
      dialogue: '「生態綠帶段是台南市中心的降溫廊道！我們反對過多的硬鋪面和水泥建設。這裡必須廣植林蔭大樹，高透水雨水花園，以及平緩的無障礙散步道，讓老人家有地方坐著歇腳，也讓綠廊發揮降溫保水效益。」',
      insightSummary: '生態段需要樹蔭、雨水花園、透水鋪面與舒適步行環境。'
    }
  ];

  const currentSeg = segments[selectedSegId];

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDialogueNpc) return;

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setAvatarPosition(p => {
          const next = Math.min(100, p + 2.5);
          const closeSeg = segments.find(s => Math.abs(next - s.pct) <= 4);
          if (closeSeg) setSelectedSegId(closeSeg.id);
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setAvatarPosition(p => {
          const next = Math.max(0, p - 2.5);
          const closeSeg = segments.find(s => Math.abs(next - s.pct) <= 4);
          if (closeSeg) setSelectedSegId(closeSeg.id);
          return next;
        });
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        const dist = Math.abs(avatarPosition - currentSeg.pct);
        if (dist <= 6 && !collectedInsights[selectedSegId]) {
          handleTalk(selectedSegId, currentSeg.npcId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [avatarPosition, selectedSegId, activeDialogueNpc, collectedInsights]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

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

  const handleSegmentClick = (id: number) => {
    setSelectedSegId(id);
    setAvatarPosition(getSegmentPct(id));
  };

  const handleTalk = (segId: number, npcId: string) => {
    setActiveDialogueNpc(npcId);
  };

  const handleCloseDialogue = () => {
    setCollectedInsights(prev => ({
      ...prev,
      [selectedSegId]: true
    }));
    setToastMsg(`Civic Insight Collected: 已成功解鎖【${currentSeg.name}】市民觀點卡！`);
    setActiveDialogueNpc(null);
  };

  const totalCollected = Object.values(collectedInsights).filter(Boolean).length;
  const isExplorationDone = totalCollected >= 3;

  const handleFinishExploration = () => {
    if (isExplorationDone) {
      const insightNames = segments
        .filter(s => collectedInsights[s.id])
        .map(s => `${s.name}的觀點：${s.insightSummary}`);
      onExploreComplete(insightNames);
    }
  };

  const isAvatarCloseToCurrentNpc = Math.abs(avatarPosition - currentSeg.pct) <= 6;

  return (
    <div className="flex-1 flex flex-col p-0 bg-[var(--color-bg-warm)] h-full overflow-hidden relative">
      
      {/* Toast Notification HUD */}
      {toastMsg && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-blob-green border-3 border-[#1f1d1b] px-4 py-2.5 rounded-xl text-xs font-black text-[#3e5f4c] shadow-flat-pop animate-bounce flex items-center gap-1.5 select-none">
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
          <span className="text-xs font-mono font-bold text-gray-400">已收集公民觀點卡：{totalCollected} / 5 (集滿 3 個解鎖市民大會)</span>
        </div>

        {/* Keyboard instructions */}
        <div className="shrink-0 mb-3 bg-[#FAF8F5] border-2 border-[#1f1d1b] p-2.5 rounded-xl flex items-center justify-between shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 text-[#1f1d1b] text-[10.5px] font-bold">
            <Keyboard size={15} className="text-[var(--color-brand-blue)] shrink-0 animate-bounce" />
            <span>使用鍵盤左右方向鍵 <strong>← →</strong> 或 <strong>A D</strong> 移動角色，接近市民後按 <strong>空白鍵 (Space)</strong> 開啟交談！</span>
          </div>
          <span className="text-[9.5px] bg-white px-2 py-0.5 rounded border-2 border-[#1f1d1b] font-bold">
            代表身分：{playerRole.name}
          </span>
        </div>

        {/* Main Columns layout: Left is wide map, Right is floating drawer HUD */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-5 overflow-hidden mb-3">
          
          {/* Left Column: 2.5D Map Centerpiece (Wide) */}
          <div className="flex-1 h-full relative flex flex-col">
            <Greenway25DMap 
              activeSegmentId={selectedSegId}
              avatarPosition={avatarPosition}
              playerRole={playerRole}
              collectedInsights={collectedInsights}
              interactive={true}
              onSegmentClick={handleSegmentClick}
            />
          </div>

          {/* Right Column: Sleek RPG Dialogue HUD (340px) */}
          <div className="w-full md:w-80 shrink-0 h-full bg-white border-3 border-[#1f1d1b] rounded-2xl p-4 shadow-flat-pop flex flex-col justify-between overflow-y-auto">
            
            {/* Upper Details Block */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center border-b-2 border-[#1f1d1b] pb-2">
                <h3 className="text-sm font-extrabold text-[#1f1d1b] font-serif flex items-center gap-1">
                  <MapPin size={13} className="text-[var(--color-brand-coral)] shrink-0" />
                  {currentSeg.name} 現場情資
                </h3>
                <span className="font-mono text-[8.5px] bg-blob-blue border border-[#1f1d1b] px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  {currentSeg.sta}
                </span>
              </div>

              <div className="space-y-2 text-[10.5px] text-left leading-normal font-sans">
                <div>
                  <span className="font-bold text-[8.5px] text-[#79afd3] block mb-0.5">🛣️ 空間環境現況 / CONDITIONS</span>
                  <p className="text-[#1f1d1b] font-semibold">{currentSeg.condition}</p>
                </div>
                <div>
                  <span className="font-bold text-[8.5px] text-rose-500 block mb-0.5">⚡ 關鍵規劃衝突點 / SPATIAL CONFLICT</span>
                  <p className="text-[#1f1d1b] font-semibold">{currentSeg.conflict}</p>
                </div>
                <div>
                  <span className="font-bold text-[8.5px] text-[var(--color-brand-green)] block mb-0.5">🏛️ 官方規劃考量 / OFFICIAL RELEVANCE</span>
                  <p className="text-[#1f1d1b] font-semibold">
                    {officialSpatialSegments.find(s => s.id === selectedSegId)?.officialRelevance}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg">
                  <span className="font-bold text-[8px] text-gray-500 block mb-0.5">✏️ 踏查現場規劃觀察 / OBSERVATION NOTE</span>
                  <p className="italic text-gray-600 text-[10px] leading-relaxed">{currentSeg.observation}</p>
                </div>
              </div>
            </div>

            {/* Lower NPC block & Button */}
            <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
              <div className="flex items-center gap-3 mb-3">
                {currentSeg.npcId === 'environmentalist_elderly' ? (
                  <div className="flex -space-x-3 shrink-0">
                    <div className="w-10 h-10 rounded-full border-2 border-[#1f1d1b] bg-blob-green flex items-center justify-center overflow-hidden shadow-flat-pop">
                      <img src="/avatar_environmentalist.png" alt="環保代表" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#1f1d1b] bg-blob-pink flex items-center justify-center overflow-hidden shadow-flat-pop">
                      <img src="/avatar_elderly.png" alt="高齡代表" className="w-full h-full object-cover scale-110" />
                    </div>
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full border-2 border-[#1f1d1b] shrink-0 ${getBlobBgClass(currentSeg.npcId)} flex items-center justify-center overflow-hidden shadow-flat-pop`}>
                    <img src={getRoleAvatar(currentSeg.npcId)} alt={currentSeg.npcName} className="w-full h-full object-cover scale-110" />
                  </div>
                )}
                <div className="text-left">
                  <h4 className="text-xs font-serif font-black text-[#1f1d1b] leading-tight">{currentSeg.npcName}</h4>
                  <span className="text-[8px] text-gray-400 font-mono block mt-0.5 truncate">{currentSeg.npcTitle}</span>
                </div>
              </div>

              {collectedInsights[currentSeg.id] ? (
                <div className="w-full py-2 bg-gray-100 border-2 border-gray-300 text-gray-400 rounded-xl text-[9px] font-bold text-center flex items-center justify-center gap-1 select-none">
                  <Check size={11} /> 已成功收集該區觀點卡
                </div>
              ) : (
                <button
                  disabled={!isAvatarCloseToCurrentNpc}
                  onClick={() => handleTalk(currentSeg.id, currentSeg.npcId)}
                  className={`w-full btn-flat-action py-2.5 rounded-xl text-[9.5px] flex items-center justify-center gap-1.5 font-bold shadow-flat-pop ${
                    isAvatarCloseToCurrentNpc 
                      ? 'bg-[var(--color-brand-yellow)] text-[#1f1d1b]' 
                      : 'bg-gray-150 text-gray-400 border-gray-300 cursor-not-allowed shadow-none hover:transform-none'
                  }`}
                >
                  💬 與現場代表開啟對話
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Collected Insights Deck - RPG Cards visual */}
        <div className="shrink-0 border-t-3 border-[#1f1d1b] pt-3.5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-[#1f1d1b] font-serif block">[ 🎒 您的公民觀點卡手牌 / YOUR INSIGHT CARD DECK ]</span>
            <div className="text-left font-sans select-none text-[8.5px] text-gray-400 flex items-center gap-1.5">
              <span>{sourceNotes.visibleNote}</span>
              <span>•</span>
              <span>來源：<a href={sourceNotes.sourcesList[0].url} target="_blank" rel="noreferrer" className="underline hover:text-[var(--color-brand-blue)] font-bold">{sourceNotes.sourcesList[0].name}</a></span>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-3.5">
            {segments.map((seg) => {
              const isCollected = collectedInsights[seg.id];
              return (
                <div 
                  key={seg.id}
                  className={`relative p-2.5 rounded-xl border-3 border-[#1f1d1b] flex flex-col justify-between min-h-[92px] text-left transition-all ${
                    isCollected 
                      ? 'bg-white shadow-[3px_3px_0px_0px_#1f1d1b] scale-100' 
                      : 'bg-gray-100/50 border-dashed border-gray-400 text-gray-400 scale-95 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-extrabold uppercase font-serif tracking-tight">
                      {seg.name}卡
                    </span>
                    <span className="text-xs">
                      {seg.id === 0 ? '🏡' : seg.id === 1 ? '🛍️' : seg.id === 2 ? '🚲' : seg.id === 3 ? '🚂' : '🌿'}
                    </span>
                  </div>

                  <div className="text-[8.5px] font-bold leading-normal font-sans tracking-tight mb-1 flex-1">
                    {isCollected ? (
                      <p className="text-gray-700 line-clamp-3">"{seg.insightSummary}"</p>
                    ) : (
                      <div className="h-full flex items-center justify-center italic text-gray-400">
                        [ 尚未探索解鎖 ]
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-1 mt-1 text-[7px] font-bold">
                    <span>{isCollected ? `代表：${seg.npcName.split(' ')[0]}` : '關卡鎖定'}</span>
                    {isCollected && <span className="text-emerald-600 font-extrabold text-[8px]">💡 已收集</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exploration finish transition bar at bottom */}
        {isExplorationDone && (
          <div className="mt-4 pt-3.5 border-t-3 border-[#1f1d1b] flex justify-between items-center shrink-0 animate-fade-in">
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

        {/* Dialogue Bubble Overlay Modal */}
        {activeDialogueNpc && (
          <div className="absolute inset-0 bg-[#1f1d1b]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in rounded-xl">
            <div className="bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 max-w-lg w-full shadow-flat-pop-lg relative animate-scale-in text-left select-none flex flex-col gap-4">
              
              <div className="flex items-center gap-3 border-b-2 border-dashed border-gray-300 pb-2 mb-1 shrink-0">
                {currentSeg.npcId === 'environmentalist_elderly' ? (
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#1f1d1b] bg-blob-green flex items-center justify-center overflow-hidden shrink-0">
                      <img src="/avatar_environmentalist.png" alt="環保代表" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#1f1d1b] bg-blob-pink flex items-center justify-center overflow-hidden shrink-0">
                      <img src="/avatar_elderly.png" alt="高齡代表" className="w-full h-full object-cover scale-110" />
                    </div>
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full border-2 border-[#1f1d1b] ${getBlobBgClass(currentSeg.npcId)} flex items-center justify-center overflow-hidden shrink-0`}>
                    <img src={getRoleAvatar(currentSeg.npcId)} alt={currentSeg.npcName} className="w-full h-full object-cover scale-110" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-extrabold text-[#1f1d1b] font-serif">{currentSeg.npcName}</h4>
                  <span className="text-[8px] text-gray-400 font-mono uppercase tracking-wider">{currentSeg.npcTitle}</span>
                </div>
              </div>

              {/* Dialogue Box */}
              <div className="relative bg-[#FAF8F5] border-3 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop text-xs md:text-sm text-[#1f1d1b] leading-relaxed font-serif font-semibold">
                <div className="absolute top-[-9px] left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#1f1d1b]" />
                <div className="absolute top-[-6px] left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#FAF8F5]" />
                
                {currentSeg.dialogue}
              </div>

              <div className="bg-blob-yellow/30 border border-amber-300 px-3 py-2 rounded-lg text-[10px] text-amber-800 leading-normal flex items-start gap-1">
                <Lightbulb size={12} className="shrink-0 mt-0.5 text-amber-600 animate-pulse" />
                <span>恭喜！理解市民代表的訴求後，您已解鎖並收集了：<strong>【{currentSeg.name}觀點卡】💡</strong>！</span>
              </div>

              <button
                onClick={handleCloseDialogue}
                className="w-full btn-flat-action py-2.5 rounded-xl text-xs bg-[var(--color-brand-green)] text-white shadow-flat-pop font-bold mt-2"
              >
                收進卡包，結束現場交談 ➔
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
