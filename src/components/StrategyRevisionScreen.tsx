import React, { useState, useEffect } from 'react';
import { Effect } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { Sparkles, Check, RefreshCw, BarChart2, CheckCircle } from 'lucide-react';

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
      name: '住宅社區段 (Residential Segment)',
      options: [
        {
          id: 'a',
          text: '維持高架自行車道 (Mobility +15, Residential -15)',
          effects: { residential: -15, commercial: 0, mobility: 15, ecological: 0, cultural: -10 },
          actionText: '住宅區保持高架自行車道'
        },
        {
          id: 'b',
          text: '自行車道降至地面層 (Residential +15, Mobility -10)',
          effects: { residential: 15, commercial: 0, mobility: -10, ecological: 0, cultural: 10 },
          actionText: '住宅區自行車道降至地面層'
        },
        {
          id: 'c',
          text: '部分高架 + 增設綠化隱私遮簾 (Residential +10, Mobility +10)',
          effects: { residential: 10, commercial: 0, mobility: 10, ecological: -5, cultural: 0 },
          actionText: '住宅區增設綠化隱私遮簾'
        }
      ]
    },
    {
      id: 1,
      name: '繁榮商業段 (Commercial Segment)',
      options: [
        {
          id: 'a',
          text: '維持高架快速通過 (Mobility +15, Commercial -15)',
          effects: { residential: 0, commercial: -15, mobility: 15, ecological: 0, cultural: 0 },
          actionText: '商業區維持高架快速通過'
        },
        {
          id: 'b',
          text: '導引自行車降至地面 (Commercial +15, Mobility -5)',
          effects: { residential: 0, commercial: 15, mobility: -5, ecological: 0, cultural: 10 },
          actionText: '商業區導引自行車降至地面'
        },
        {
          id: 'c',
          text: '打造慢速共享街區與停靠站 (Commercial +15, Residential +10)',
          effects: { residential: 10, commercial: 15, mobility: 0, ecological: 0, cultural: 10 },
          actionText: '商業區打造慢速共享街區與停靠站'
        }
      ]
    },
    {
      id: 2,
      name: '台南車站樞紐 (Station Node)',
      options: [
        {
          id: 'a',
          text: '保留舊月台與軌道歷史廣場 (Cultural +15, Ecological +10)',
          effects: { residential: 0, commercial: 5, mobility: 0, ecological: 10, cultural: 15 },
          actionText: '車站區保留月台軌道歷史廣場'
        },
        {
          id: 'b',
          text: '改建水泥轉運大廣場 (Mobility +15, Cultural -15)',
          effects: { residential: 0, commercial: 5, mobility: 15, ecological: -10, cultural: -15 },
          actionText: '車站區改建水泥轉運大廣場'
        }
      ]
    },
    {
      id: 3,
      name: '幹道交叉路口 (Major Crossing)',
      options: [
        {
          id: 'a',
          text: '設置立體交叉自行車專用陸橋 (Mobility +15, Ecological -5)',
          effects: { residential: 0, commercial: 0, mobility: 15, ecological: -5, cultural: 0 },
          actionText: '路口設置立體交叉自行車陸橋'
        },
        {
          id: 'b',
          text: '採用地面行人優先平面路口 (Mobility -10, Residential +5)',
          effects: { residential: 5, commercial: 0, mobility: -10, ecological: 5, cultural: 0 },
          actionText: '路口採用地面層人行優先路口'
        }
      ]
    },
    {
      id: 4,
      name: '綠意生態廊道 (Ecological Segment)',
      options: [
        {
          id: 'a',
          text: '全線鋪設高強度硬鋪面廣場 (Mobility +10, Ecological -15)',
          effects: { residential: 0, commercial: 10, mobility: 10, ecological: -15, cultural: 0 },
          actionText: '生態區鋪設高強度硬鋪面廣場'
        },
        {
          id: 'b',
          text: '打造連續綠色林蔭與雨水花園 (Ecological +20, Residential +10)',
          effects: { residential: 10, commercial: 0, mobility: -5, ecological: 20, cultural: 0 },
          actionText: '生態區打造林蔭與雨水花園'
        },
        {
          id: 'c',
          text: '採用節點硬鋪面與生態綠帶混合 (Ecological +15, Commercial +10)',
          effects: { residential: 0, commercial: 10, mobility: 5, ecological: 15, cultural: 0 },
          actionText: '生態區採用節點鋪面與綠帶混合'
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
            【 PHASE 6 : 空間策略修訂工作台 】
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
