import React from 'react';
import { Home, Store, Landmark, Compass, Trees, MapPin } from 'lucide-react';

interface GreenwayMapProps {
  spatialActions: string[];
}

export const GreenwayMap: React.FC<GreenwayMapProps> = ({ spatialActions }) => {
  const segments = [
    { 
      id: 'residential', 
      name: '住宅社區段 (Residential Segment)', 
      sta: '里程 STA 0+000 - 0+400', 
      icon: <Home className="w-4 h-4 text-[#d37b70]" />,
      colorClass: 'border-[#ebd6d3] bg-[#fefbfa]',
      badgeColor: 'bg-[#f8e5e2] text-[#c26257] border-[#eed1cd]'
    },
    { 
      id: 'commercial', 
      name: '繁榮商業段 (Commercial Segment)', 
      sta: '里程 STA 0+400 - 0+700', 
      icon: <Store className="w-4 h-4 text-[#e2a968]" />,
      colorClass: 'border-[#ebdcc9] bg-[#fefdfa]',
      badgeColor: 'bg-[#f7ebd9] text-[#b37a3c] border-[#eedcbf]'
    },
    { 
      id: 'node', 
      name: '台南車站樞紐 (Tainan Station Node)', 
      sta: '里程 STA 0+700', 
      icon: <Landmark className="w-4 h-4 text-[#6b8b9b]" />,
      colorClass: 'border-[#d0dee5] bg-[#fafcfd]',
      badgeColor: 'bg-[#e4eff4] text-[#4d7082] border-[#d2e2eb]'
    },
    { 
      id: 'crossing', 
      name: '幹道交叉路口 (Arterial Crossing)', 
      sta: '里程 STA 0+700 - 0+900', 
      icon: <Compass className="w-4 h-4 text-gray-500" />,
      colorClass: 'border-[#ded8ce] bg-[#faf9f6]',
      badgeColor: 'bg-[#f1ede6] text-gray-600 border-[#ded8ce]'
    },
    { 
      id: 'ecological', 
      name: '綠意生態廊道 (Ecological Corridor)', 
      sta: '里程 STA 0+900 - 1+400', 
      icon: <Trees className="w-4 h-4 text-[#5a7a68]" />,
      colorClass: 'border-[#cbdad0] bg-[#fafcfb]',
      badgeColor: 'bg-[#e4efe8] text-[#3e5f4c] border-[#cfe2d7]'
    }
  ];

  const getStatusLabel = (segmentId: string) => {
    const actions = spatialActions.join(' ').toLowerCase();
    switch (segmentId) {
      case 'residential':
        if (actions.includes('ground level')) return '平面慢速道 (平面自行車與步道)';
        if (actions.includes('privacy')) return '高架層隔板 (增設防隱私隔板)';
        return '預設高架自行車道 (快速越過社區)';
      case 'commercial':
        if (actions.includes('shared street')) return '地面共享街區 (慢速人車共享)';
        if (actions.includes('ground level')) return '地面層人行步道 (引客流入店家)';
        return '預設高架自行車天橋 (越過商業區)';
      case 'ecological':
        if (actions.includes('tree canopy')) return '複層林蔭與雨水花園 (生態保水)';
        if (actions.includes('hybrid')) return '生態綠帶緩衝 (兼顧休閒與鳥類棲地)';
        return '硬質活動廣場 (適合節慶及攤位廣場)';
      case 'node':
        return '鐵道記憶歷史廣場 (保留舊月台與地景)';
      case 'crossing':
        return '立體交叉安全設計 (高架/地下人車分流)';
      default:
        return '';
    }
  };

  const getVisualIndicator = (segmentId: string) => {
    const actions = spatialActions.join(' ').toLowerCase();
    switch (segmentId) {
      case 'residential':
        if (actions.includes('ground level')) return '【平面慢速】';
        if (actions.includes('privacy')) return '【高架隔音】';
        return '【高架廊道】';
      case 'commercial':
        if (actions.includes('shared street')) return '【共享街區】';
        if (actions.includes('ground level')) return '【地面步道】';
        return '【自行車橋】';
      case 'ecological':
        if (actions.includes('tree canopy')) return '【林蔭花園】';
        if (actions.includes('hybrid')) return '【保水草坪】';
        return '【活動廣場】';
      case 'node':
        return '【歷史廣場】';
      case 'crossing':
        return '【立體人車】';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFDF9] border-2 border-[#e5dfd5] rounded-[24px_28px_20px_26px] overflow-hidden shadow-soft">
      
      {/* Visual Watercolor Banner */}
      <div className="w-full h-32 relative overflow-hidden border-b-2 border-[#e5dfd5] bg-[#FAF8F5]">
        <img 
          src="/greenway_watercolor.png" 
          alt="Tainan Greenway Watercolor" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 text-white">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-[var(--color-brand-coral)]" />
            <span className="text-[9px] font-mono tracking-widest uppercase opacity-90">[ SPATIAL MAP VIEW ]</span>
          </div>
          <h2 className="text-sm font-bold font-serif leading-tight">台南綠園道・共創配置圖</h2>
        </div>
      </div>
      
      {/* Schematic Diagram Area */}
      <div className="flex-1 p-4 flex flex-col justify-between relative overflow-y-auto space-y-3">
        {/* Continuous wavy vertical corridor line */}
        <div className="absolute left-7 top-4 bottom-4 w-1 bg-dashed border-r border-[#d4cbb8] z-0" />
        
        {segments.map((segment) => {
          const isNode = segment.id === 'node';
          const indicator = getVisualIndicator(segment.id);
          
          return (
            <div key={segment.id} className="relative z-10 flex items-center pl-7">
              
              {/* Wavy node marker */}
              <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-[#FFFDF9] shadow-soft-sm -translate-x-1/2 flex items-center justify-center z-20 bg-white`}>
                <div className={`w-2 h-2 rounded-full ${isNode ? 'bg-[var(--color-brand-blue)]' : 'bg-[var(--color-brand-green)]'}`} />
              </div>

              {/* Organic card style */}
              <div className={`w-full p-3.5 border-2 rounded-[16px_20px_14px_18px_/_18px_14px_20px_16px] transition-all duration-200 ${segment.colorClass} shadow-soft-sm hover:shadow-soft`}>
                
                {/* Meta details */}
                <div className="flex justify-between items-center mb-1 text-[9px] font-sans text-gray-400">
                  <span className="font-mono">{segment.sta}</span>
                  <span className={`px-2 py-0.2 rounded-full border text-[9px] font-bold ${segment.badgeColor}`}>
                    {indicator}
                  </span>
                </div>
                
                {/* Title */}
                <div className="text-xs font-bold text-[var(--color-text-dark)] flex items-center gap-1.5 font-serif">
                  <span className="opacity-90">{segment.icon}</span>
                  <span>{segment.name}</span>
                </div>

                {/* Status description */}
                <div className="mt-2 pt-1.5 border-t border-dashed border-[#e8e2d7] text-[10.5px] text-[#5c554e] leading-snug">
                  {getStatusLabel(segment.id)}
                </div>

              </div>

            </div>
          );
        })}
      </div>
      
      {/* Legend footer */}
      <div className="border-t border-[#e5dfd5] bg-[#FAF8F5] py-2 px-4 font-mono text-[9px] text-gray-400 flex justify-around select-none">
        <span>▰ 地面慢速廊道</span>
        <span>▲ 高架天橋路網</span>
        <span>♣ 複層植栽綠帶</span>
      </div>
    </div>
  );
};
