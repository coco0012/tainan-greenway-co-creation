import React, { useState, useEffect } from 'react';
import { Effect } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { Sparkles, Check, RefreshCw, BarChart2, CheckCircle } from 'lucide-react';
import { Greenway25DMap } from './Greenway25DMap';

interface StrategyRevisionScreenProps {
  playerRole: StakeholderRole;
  initialSelections: Record<number, string>; // preloaded option ids (e.g. {0: 'b', 1: 'c', 2: 'a', 3: 'a', 4: 'b'})
  onRevisionComplete: (finalScores: Effect, finalActions: string[]) => void;
}

interface RevisionOption {
  id: string; // 'a' | 'b' | 'c'
  text: string;
  effects: Effect;
  actionText: string;
}

interface RevisionSegment {
  id: number;
  name: string;
  options: RevisionOption[];
}

export const StrategyRevisionScreen: React.FC<StrategyRevisionScreenProps> = ({
  playerRole,
  initialSelections,
  onRevisionComplete
}) => {
  // Option mapping from Phase 5 Rounds
  // Mapping rounds choices to strategy options:
  // Round 1 (Residential): '1a'->'a', '1b'->'b', '1c'->'c'
  // Round 2 (Commercial): '2a'->'a', '2b'->'b', '2c'->'c'
  // Round 3 (Ecological): '3a'->'a', '3b'->'b', '3c'->'c'
  const getPreselectedId = (segId: number): string => {
    const rawVal = initialSelections[segId] || '';
    if (rawVal.endsWith('a')) return 'a';
    if (rawVal.endsWith('b')) return 'b';
    if (rawVal.endsWith('c')) return 'c';
    return 'a'; // Default
  };

  const [selections, setSelections] = useState<Record<number, string>>({
    0: getPreselectedId(0),
    1: getPreselectedId(1),
    2: 'a', // Default Station node
    3: 'a', // Default Crossing
    4: getPreselectedId(4)
  });

  const segments: RevisionSegment[] = [
    {
      id: 0,
      name: '住宅段',
      options: [
        {
          id: 'a',
          text: '地面慢速自行車道 (居住舒適 +5, 交通效率 +5, 生態棲地 +5)',
          effects: { residential: 5, commercial: 0, mobility: 5, ecological: 5, cultural: 0 },
          actionText: '住宅段：地面慢速自行車道'
        },
        {
          id: 'b',
          text: '局部高架設綠化隱私遮簾 (交通效率 +15, 居住舒適 -5, 生態棲地 +5, 歷史記憶 -5)',
          effects: { residential: -5, commercial: 0, mobility: 15, ecological: 5, cultural: -5 },
          actionText: '住宅段：局部高架設綠化隱私遮簾'
        },
        {
          id: 'c',
          text: '社區安寧綠色緩衝帶 (居住舒適 +15, 生態棲地 +10, 歷史記憶 +5, 交通效率 -5)',
          effects: { residential: 15, commercial: 0, mobility: -5, ecological: 10, cultural: 5 },
          actionText: '住宅段：社區安寧綠色緩衝帶'
        }
      ]
    },
    {
      id: 1,
      name: '商業段',
      options: [
        {
          id: 'a',
          text: '地面慢速人車共享街區 (商業活力 +15, 歷史記憶 +5, 交通效率 -5)',
          effects: { residential: 0, commercial: 15, mobility: -5, ecological: 0, cultural: 5 },
          actionText: '商業段：地面慢速人車共享街區'
        },
        {
          id: 'b',
          text: '自行車停靠點與遮陰休閒廣場 (商業活力 +10, 交通效率 +5, 生態棲地 +5, 歷史記憶 +5)',
          effects: { residential: 0, commercial: 10, mobility: 5, ecological: 5, cultural: 5 },
          actionText: '商業段：自行車停靠點與遮陰休閒廣場'
        },
        {
          id: 'c',
          text: '店家物流裝卸與臨停區 (商業活力 +10, 交通效率 +10, 居住舒適 -5, 生態棲地 -5)',
          effects: { residential: -5, commercial: 10, mobility: 10, ecological: -5, cultural: 0 },
          actionText: '商業段：店家物流裝卸與臨停區'
        }
      ]
    },
    {
      id: 2,
      name: '車站節點',
      options: [
        {
          id: 'a',
          text: 'YouBike與大眾運輸轉乘樞紐 (交通效率 +15, 商業活力 +5, 生態棲地 -5)',
          effects: { residential: 0, commercial: 5, mobility: 15, ecological: -5, cultural: 0 },
          actionText: '車站節點：YouBike與大眾運輸轉乘樞紐'
        },
        {
          id: 'b',
          text: '行人優先漫步歷史廣場 (歷史記憶 +15, 生態棲地 +10, 居住舒適 +5, 商業活力 +5, 交通效率 -5)',
          effects: { residential: 5, commercial: 5, mobility: -5, ecological: 10, cultural: 15 },
          actionText: '車站節點：行人優先漫步歷史廣場'
        },
        {
          id: 'c',
          text: '清晰指引與慢速微行動特區 (交通效率 +10, 商業活力 +5, 歷史記憶 +5)',
          effects: { residential: 0, commercial: 5, mobility: 10, ecological: 0, cultural: 5 },
          actionText: '車站節點：清晰指引與慢速微行動特區'
        }
      ]
    },
    {
      id: 3,
      name: '主要路口',
      options: [
        {
          id: 'a',
          text: '局部自行車立體陸橋 (交通效率 +15, 生態棲地 -10, 居住舒適 -5, 歷史記憶 -5)',
          effects: { residential: -5, commercial: 0, mobility: 15, ecological: -10, cultural: -5 },
          actionText: '主要路口：局部自行車立體陸橋'
        },
        {
          id: 'b',
          text: '地面保護型自行車道十字路口 (交通效率 +10, 居住舒適 +5)',
          effects: { residential: 5, commercial: 0, mobility: 10, ecological: 0, cultural: 0 },
          actionText: '主要路口：地面保護型自行車道十字路口'
        },
        {
          id: 'c',
          text: '人車分流專用號誌系統 (居住舒適 +10, 交通效率 +5, 生態棲地 +5)',
          effects: { residential: 10, commercial: 0, mobility: 5, ecological: 5, cultural: 0 },
          actionText: '主要路口：人車分流專用號誌系統'
        }
      ]
    },
    {
      id: 4,
      name: '生態綠帶段',
      options: [
        {
          id: 'a',
          text: '連續複層大樹林蔭冠層 (生態棲地 +15, 居住舒適 +10, 歷史記憶 +5, 交通效率 -5)',
          effects: { residential: 10, commercial: 0, mobility: -5, ecological: 15, cultural: 5 },
          actionText: '生態綠帶段：連續複層大樹林蔭冠層'
        },
        {
          id: 'b',
          text: '高透水鋪面與雨水花園 (生態棲地 +20, 居住舒適 +5, 交通效率 -5)',
          effects: { residential: 5, commercial: 0, mobility: -5, ecological: 20, cultural: 0 },
          actionText: '生態綠帶段：高透水鋪面與雨水花園'
        },
        {
          id: 'c',
          text: '生態緩衝降溫廊道 (生態棲地 +15, 歷史記憶 +10, 居住舒適 +5)',
          effects: { residential: 5, commercial: 0, mobility: 0, ecological: 15, cultural: 10 },
          actionText: '生態綠帶段：生態緩衝降溫廊道'
        }
      ]
    }
  ];

  // Dynamic live score calculator
  const calculateScores = (): Effect => {
    const finalScores: Effect = {
      residential: 50,
      commercial: 50,
      mobility: 50,
      ecological: 50,
      cultural: 50
    };

    segments.forEach(seg => {
      const selectedId = selections[seg.id];
      const option = seg.options.find(opt => opt.id === selectedId);
      if (option) {
        finalScores.residential += option.effects.residential;
        finalScores.commercial += option.effects.commercial;
        finalScores.mobility += option.effects.mobility;
        finalScores.ecological += option.effects.ecological;
        finalScores.cultural += option.effects.cultural;
      }
    });

    // Clamp between 0 and 100
    finalScores.residential = Math.max(0, Math.min(100, finalScores.residential));
    finalScores.commercial = Math.max(0, Math.min(100, finalScores.commercial));
    finalScores.mobility = Math.max(0, Math.min(100, finalScores.mobility));
    finalScores.ecological = Math.max(0, Math.min(100, finalScores.ecological));
    finalScores.cultural = Math.max(0, Math.min(100, finalScores.cultural));

    return finalScores;
  };

  const scores = calculateScores();

  // Dynamic stakeholder satisfaction calculator
  const allScores = Object.values(scores);
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

  const getRoleSatisfaction = (roleId: string) => {
    let scoreVal = 50;
    switch (roleId) {
      case 'resident': scoreVal = scores.residential; break;
      case 'shop_owner': scoreVal = scores.commercial; break;
      case 'commuter': scoreVal = scores.mobility; break;
      case 'elderly': scoreVal = (scores.residential + scores.ecological) / 2; break;
      case 'environmentalist': scoreVal = scores.ecological; break;
      case 'government': scoreVal = avgScore; break;
    }

    if (scoreVal >= 60) return { emoji: '😊', text: '非常滿意', color: 'text-[#3e5f4c] bg-blob-green' };
    if (scoreVal >= 45) return { emoji: '😐', text: '可以接受', color: 'text-[#b37a3c] bg-blob-yellow' };
    return { emoji: '😞', text: '有些疑慮', color: 'text-[#c26257] bg-blob-pink' };
  };

  const handleOptionSelect = (segId: number, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [segId]: optionId
    }));
  };

  const handleReset = () => {
    setSelections({
      0: getPreselectedId(0),
      1: getPreselectedId(1),
      2: 'a',
      3: 'a',
      4: getPreselectedId(4)
    });
  };

  const handleSubmit = () => {
    const finalActions = segments.map(seg => {
      const selectedId = selections[seg.id];
      const option = seg.options.find(opt => opt.id === selectedId);
      return option ? option.actionText : '';
    }).filter(Boolean);

    onRevisionComplete(scores, finalActions);
  };

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

  return (
    <div className="flex-1 flex flex-col p-0 bg-[var(--color-bg-warm)] h-full overflow-hidden">
      <div className="w-full h-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-xl p-5 shadow-flat-pop-lg flex flex-col overflow-hidden relative">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-4 border-b-3 border-[#1f1d1b] pb-3 shrink-0">
          <span className="px-3 py-1 bg-blob-green border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 PHASE 5 : 空間策略修訂工作台 】
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handleReset}
              className="flex items-center gap-1 bg-white border border-[#1f1d1b] px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 hover:bg-gray-50"
            >
              <RefreshCw size={10} /> 重置協商決策
            </button>
          </div>
        </div>

        {/* 2.5D Digital Twin Map View at the top of the Revision screen */}
        <div className="h-40 w-full shrink-0 mb-4">
          <Greenway25DMap 
            playerRole={playerRole}
            selections={selections}
            interactive={false}
          />
        </div>

        {/* Dashboard layout */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 overflow-hidden">
          
          {/* Left Side: Live Score & Stakeholders satisfaction */}
          <div className="w-full lg:w-80 bg-gray-50 border-3 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop flex flex-col justify-between shrink-0 overflow-y-auto max-h-48 lg:max-h-none">
            
            {/* Indicators */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 border-b border-gray-200 pb-1.5">
                <BarChart2 size={14} className="text-[#79afd3]" />
                <h3 className="text-xs font-bold text-[#1f1d1b] font-serif">[ 空間績效指標評估 / METRICS ]</h3>
              </div>
              <div className="space-y-2.5">
                {Object.entries(scores).map(([key, value]) => {
                  let barColor = 'bg-gray-400';
                  let labelZh = key;
                  if (key === 'residential') { barColor = 'bg-[#d37b70]'; labelZh = '居住舒適'; }
                  else if (key === 'commercial') { barColor = 'bg-[#e2a968]'; labelZh = '商業活力'; }
                  else if (key === 'mobility') { barColor = 'bg-[#6b8b9b]'; labelZh = '交通效率'; }
                  else if (key === 'ecological') { barColor = 'bg-[#5a7a68]'; labelZh = '生態棲地'; }
                  else if (key === 'cultural') { barColor = 'bg-stone-400'; labelZh = '歷史記憶'; }

                  return (
                    <div key={key} className="space-y-0.5 font-sans text-[10.5px]">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-[#1f1d1b]">{labelZh}</span>
                        <span className="font-mono">{value} / 100</span>
                      </div>
                      <div className="memphis-progress-track h-2 w-full bg-white">
                        <div 
                          className={`memphis-progress-fill h-full ${barColor}`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Satisfaction Matrix */}
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-gray-500 font-serif block mb-2">[ 市民滿意度反應 / SIGNATURES ]</span>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => {
                  const sat = getRoleSatisfaction(r.id);
                  return (
                    <div key={r.id} className="bg-white border border-gray-300 rounded-lg p-1.5 flex flex-col items-center justify-between text-center min-h-[56px] shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]">
                      <div className={`w-5 h-5 rounded-full border border-gray-400 ${getBlobBgClass(r.id)} flex items-center justify-center overflow-hidden shrink-0`}>
                        <img src={getRoleAvatar(r.id)} alt={r.name} className="w-full h-full object-cover scale-110" />
                      </div>
                      <div className="text-[8px] font-bold text-gray-700 truncate w-full">{r.name}</div>
                      <div className={`text-[7.5px] px-1 rounded-sm font-extrabold ${sat.color}`}>
                        {sat.emoji} {sat.text.slice(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Side: Scrollable Segments policy revision */}
          <div className="flex-1 bg-white border-3 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop overflow-y-auto text-left">
            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase block mb-3 border-b border-gray-200 pb-1">
              [ 📋 空間策略草案修訂細目 / SEGMENT POLICY EDITING ]
            </span>
            
            <div className="space-y-4">
              {segments.map((seg) => {
                const activeId = selections[seg.id];
                return (
                  <div key={seg.id} className="border-2 border-[#1f1d1b] rounded-xl p-3.5 bg-gray-50/50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] flex flex-col">
                    <h4 className="text-xs font-extrabold text-[#1f1d1b] font-serif mb-2">{seg.name}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {seg.options.map((opt) => {
                        const isSelected = activeId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleOptionSelect(seg.id, opt.id)}
                            className={`p-2.5 rounded-lg border-2 text-left text-[10.5px] font-bold leading-normal transition-all outline-none flex flex-col justify-between min-h-[64px] ${
                              isSelected 
                                ? 'bg-white border-[var(--color-brand-green)] shadow-[2px_2px_0px_0px_rgba(142,166,61,0.35)] ring-1 ring-[var(--color-brand-green)]' 
                                : 'bg-white border-gray-300 hover:border-[#1f1d1b] text-gray-600 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]'
                            }`}
                          >
                            <span className="text-[#1f1d1b] mb-1">{opt.text.split(' (')[0]}</span>
                            <span className="text-[8.5px] text-gray-400 block border-t border-dashed border-gray-200 pt-0.5 mt-0.5">
                              {opt.text.includes('(') ? '(' + opt.text.split('(')[1] : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Source Note Label */}
        <div className="text-[8.5px] text-gray-400 font-mono select-none text-left mt-2 border-t border-dashed border-gray-200 pt-2 shrink-0">
          <span>⚠️ 依官方公開資訊整理之原型資料 / Source-informed prototype data</span>
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-4 border-t-3 border-[#1f1d1b] flex justify-between items-center shrink-0">
          <div className="text-[10px] text-gray-400 font-mono font-bold">[ PLANNING WORKDESK READY ]</div>
          <button
            onClick={handleSubmit}
            className="btn-flat-action px-8 py-3 bg-[var(--color-brand-coral)] hover:bg-[#c06a5f] text-white rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-flat-pop font-bold"
          >
            <CheckCircle size={14} /> 送交市民審查，生成最終規劃成果 ➔
          </button>
        </div>

      </div>
    </div>
  );
};
