import React from 'react';

interface GreenwayMapProps {
  spatialActions: string[];
}

export const GreenwayMap: React.FC<GreenwayMapProps> = ({ spatialActions }) => {
  // We represent the map as an abstract linear diagram
  // Using 5 major segments based on user requirements
  const segments = [
    { 
      id: 'residential', 
      name: 'Residential Segment (住宅段)', 
      sta: 'STA 0+000 - 0+400', 
      coords: 'X: 120.218 / Y: 22.998',
      defaultStyle: 'border-arch-thin bg-white' 
    },
    { 
      id: 'commercial', 
      name: 'Commercial Segment (商業段)', 
      sta: 'STA 0+400 - 0+700', 
      coords: 'X: 120.220 / Y: 22.995',
      defaultStyle: 'border-arch-thin bg-white' 
    },
    { 
      id: 'node', 
      name: 'Station Node (台南車站節點)', 
      sta: 'STA 0+700', 
      coords: 'X: 120.222 / Y: 22.992',
      defaultStyle: 'border-arch bg-gray-100 font-bold' 
    },
    { 
      id: 'crossing', 
      name: 'Road Crossing (道路交叉口)', 
      sta: 'STA 0+700 - 0+900', 
      coords: 'X: 120.223 / Y: 22.990',
      defaultStyle: 'border-arch-thin border-dashed bg-hatch' 
    },
    { 
      id: 'ecological', 
      name: 'Ecological Corridor (生態段)', 
      sta: 'STA 0+900 - 1+400', 
      coords: 'X: 120.225 / Y: 22.985',
      defaultStyle: 'border-arch-thin bg-white' 
    }
  ];

  // Helper to determine the current status label based on choices
  const getStatusLabel = (segmentId: string) => {
    const actions = spatialActions.join(' ').toLowerCase();
    switch (segmentId) {
      case 'residential':
        if (actions.includes('ground level')) return 'Ground Level Mobility (平面慢速通道)';
        if (actions.includes('privacy')) return 'Elevated Path + Screens (高架+遮光綠簾)';
        return 'Elevated Bike Path (高架自行車道)';
      case 'commercial':
        if (actions.includes('shared street')) return 'Slow Shared Street (慢速共享街區)';
        if (actions.includes('ground level')) return 'Ground Level Access (地面層人流通道)';
        return 'Elevated Bike Path (高架自行車道)';
      case 'ecological':
        if (actions.includes('tree canopy')) return 'Canopy & Rain Garden (複層林蔭與雨水花園)';
        if (actions.includes('hybrid')) return 'Hybrid Ecological Buffer (混生生態緩衝帶)';
        return 'Hard Paved Event Area (硬質廣場鋪面)';
      case 'node':
        return 'Cultural Plaza & Hub (鐵道記憶歷史廣場)';
      case 'crossing':
        return 'Grade-Separated Crossing (安全立體交叉設計)';
      default:
        return '';
    }
  };

  const getVisualIndicator = (segmentId: string) => {
    const actions = spatialActions.join(' ').toLowerCase();
    switch (segmentId) {
      case 'residential':
        if (actions.includes('ground level')) return '▰▰▰ 地面層慢速通道';
        if (actions.includes('privacy')) return '▞▞▞ 高架層 [增設綠簾]';
        return '▲▲▲ 高架過境車道';
      case 'commercial':
        if (actions.includes('shared street')) return '░░░ 地面人車共享街區';
        if (actions.includes('ground level')) return '▰▰▰ 地面人行鋪面';
        return '▲▲▲ 高架過境車道';
      case 'ecological':
        if (actions.includes('tree canopy')) return '♣♣♣ 林蔭與雨水花園';
        if (actions.includes('hybrid')) return '♣░♣ 混合綠帶生態廊道';
        return '▩▩▩ 水泥活動廣場';
      case 'node':
        return '◈ 車站樞紐核心';
      case 'crossing':
        return '✕✕✕ 安全立體交叉';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-arch overflow-hidden">
      {/* Schematic Header */}
      <div className="bg-gray-100 border-b border-black p-4 text-center">
        <div className="anno-label text-gray-500 font-bold mb-0.5">[ 繪圖圖紙：空間規劃配置地圖 ]</div>
        <div className="font-extrabold text-sm text-black tracking-widest uppercase">
          台南鐵路地下化綠園道剖面示意圖
        </div>
      </div>
      
      {/* Schematic Diagram Area */}
      <div className="flex-1 p-5 flex flex-col justify-between relative bg-dot-grid overflow-y-auto">
        {/* Draw vertical alignment centerline (Corridor axis) */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-500 border-l border-dashed border-gray-400 z-0" />
        
        {/* Ruler ticks on the left */}
        <div className="absolute left-1.5 top-6 bottom-6 flex flex-col justify-between text-[8px] font-mono text-gray-400 select-none z-0">
          <div>起點 0m</div>
          <div>里程 300m</div>
          <div>里程 600m</div>
          <div>里程 900m</div>
          <div>里程 1200m</div>
          <div>終點 1400m</div>
        </div>

        {segments.map((segment) => {
          const isNode = segment.id === 'node';
          const isCrossing = segment.id === 'crossing';
          const highlightColor = isNode 
            ? 'border-[var(--color-brand-blue)]' 
            : isCrossing 
              ? 'border-gray-500' 
              : 'border-black';

          return (
            <div key={segment.id} className="relative z-10 flex items-center pl-10 my-2">
              
              {/* Connector Node Dot */}
              <div className={`absolute left-5 w-2.5 h-2.5 border border-black bg-white -translate-x-1/2 flex items-center justify-center`}>
                <div className={`w-1 h-1 ${isNode ? 'bg-[var(--color-brand-blue)]' : 'bg-black'}`} />
              </div>

              {/* Diagram block */}
              <div className={`w-full p-3.5 border-arch-thin bg-white hover:bg-gray-50 transition-colors ${segment.defaultStyle} ${highlightColor}`}>
                
                {/* Meta details */}
                <div className="flex justify-between items-center mb-1 font-mono text-[8px] text-gray-400">
                  <span>{segment.sta}</span>
                  <span>{segment.coords}</span>
                </div>
                
                {/* Name */}
                <div className="text-xs font-bold text-black flex items-center gap-1.5">
                  <span>{segment.name}</span>
                </div>

                {/* Treatment Text & Visual Hatching Bar */}
                <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                  <div className="text-[10px] font-mono text-gray-800 bg-gray-50 px-1.5 py-0.5 border border-gray-200 inline-block mb-1">
                    {getStatusLabel(segment.id)}
                  </div>
                  <div className="text-[9px] font-mono text-gray-400 flex justify-between items-center">
                    <span>{getVisualIndicator(segment.id)}</span>
                    <span className="text-[8px] font-bold text-gray-400">[已審定]</span>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>
      
      {/* Legend footer */}
      <div className="border-t border-black bg-gray-50 p-2.5 font-mono text-[9px] text-gray-500 flex justify-around">
        <span>▲ 高架路廊</span>
        <span>▰ 地面路廊</span>
        <span>♣ 生態綠帶</span>
      </div>
    </div>
  );
};

