import React from 'react';
import { Home, Store, Compass, Shuffle, Leaf } from 'lucide-react';

interface GreenwayMapProps {
  spatialActions: string[];
}

export const GreenwayMap: React.FC<GreenwayMapProps> = ({ spatialActions }) => {
  const segments = [
    { 
      id: 'residential', 
      name: '住宅社區段', 
      sta: '里程 K0+000 - K0+400', 
      icon: <Home className="w-4 h-4" />,
      colorClass: 'bg-rose-50/40 border-rose-200 text-rose-700',
      activeColor: 'bg-rose-100'
    },
    { 
      id: 'commercial', 
      name: '繁榮商業段', 
      sta: '里程 K0+400 - K0+700', 
      icon: <Store className="w-4 h-4" />,
      colorClass: 'bg-amber-50/40 border-amber-200 text-amber-700',
      activeColor: 'bg-amber-100'
    },
    { 
      id: 'node', 
      name: '台南車站樞紐', 
      sta: '里程 K0+700', 
      icon: <Compass className="w-4 h-4" />,
      colorClass: 'bg-blue-50/40 border-blue-200 text-blue-700',
      activeColor: 'bg-blue-100'
    },
    { 
      id: 'crossing', 
      name: '幹道交叉路口', 
      sta: '里程 K0+700 - K0+900', 
      icon: <Shuffle className="w-4 h-4" />,
      colorClass: 'bg-gray-50 border-gray-200 text-gray-700',
      activeColor: 'bg-gray-150'
    },
    { 
      id: 'ecological', 
      name: '綠意生態廊道', 
      sta: '里程 K0+900 - K1+400', 
      icon: <Leaf className="w-4 h-4" />,
      colorClass: 'bg-emerald-50/40 border-emerald-200 text-emerald-700',
      activeColor: 'bg-emerald-100'
    }
  ];

  const getStatusLabel = (segmentId: string) => {
    const actions = spatialActions.join(' ').toLowerCase();
    switch (segmentId) {
      case 'residential':
        if (actions.includes('ground level')) return '平面慢速道 (平面自行車與步道)';
        if (actions.includes('privacy')) return '高架層隔板 (增設防隱私隔板)';
        return '預設高架自行車道 (快速過境)';
      case 'commercial':
        if (actions.includes('shared street')) return '地面共享街區 (慢速人車共享)';
        if (actions.includes('ground level')) return '地面層人行道 (引入店家客源)';
        return '預設高架自行車道 (快速越過)';
      case 'ecological':
        if (actions.includes('tree canopy')) return '林蔭與雨水花園 (微氣候降溫)';
        if (actions.includes('hybrid')) return '生態綠帶緩衝 (兼顧活動與生態)';
        return '硬質活動廣場 (適合節慶廣場)';
      case 'node':
        return '鐵道記憶歷史廣場 (地景節點)';
      case 'crossing':
        return '立體交叉安全設計 (人車分流)';
      default:
        return '';
    }
  };

  const getVisualIndicator = (segmentId: string) => {
    const actions = spatialActions.join(' ').toLowerCase();
    switch (segmentId) {
      case 'residential':
        if (actions.includes('ground level')) return '平面鋪面';
        if (actions.includes('privacy')) return '高架隔音簾';
        return '高架軌道';
      case 'commercial':
        if (actions.includes('shared street')) return '慢速人車共享';
        if (actions.includes('ground level')) return '店前寬人行道';
        return '快速自行車天橋';
      case 'ecological':
        if (actions.includes('tree canopy')) return '複層森林灌木';
        if (actions.includes('hybrid')) return '保水透水草坪';
        return '硬質活動廣場';
      case 'node':
        return '車站綠色廣場';
      case 'crossing':
        return '保護型號誌路口';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] border border-[#e8e5e0] rounded-3xl overflow-hidden shadow-soft">
      {/* Header */}
      <div className="bg-white border-b border-[#e8e5e0] p-4 text-center">
        <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-[var(--color-brand-green)] text-[9px] font-bold rounded-full font-mono uppercase tracking-wider block w-max mx-auto mb-1">
          空間配置示意圖 / SPATIAL DIAGRAM
        </span>
        <h2 className="font-extrabold text-sm text-gray-800 tracking-tight">
          台南鐵路地下化綠園道規劃剖面
        </h2>
      </div>
      
      {/* Schematic Diagram Area */}
      <div className="flex-1 p-5 flex flex-col justify-between relative overflow-y-auto">
        {/* Continuous greenway corridor centerline */}
        <div className="absolute left-9 top-6 bottom-6 w-1.5 bg-emerald-100 rounded-full z-0" />
        
        {/* Active segments highlights inside greenway line */}
        <div className="absolute left-9 top-1/4 h-1/2 w-1.5 bg-[var(--color-brand-green)] opacity-40 rounded-full z-0" />

        {segments.map((segment) => {
          const isNode = segment.id === 'node';
          return (
            <div key={segment.id} className="relative z-10 flex items-center pl-8 my-1.5">
              
              {/* Connector Node Circle */}
              <div className={`absolute left-1 w-5 h-5 rounded-full border border-white bg-white shadow-sm -translate-x-1/2 flex items-center justify-center z-20`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isNode ? 'bg-[var(--color-brand-blue)]' : 'bg-[var(--color-brand-green)]'}`} />
              </div>

              {/* Diagram Card block */}
              <div className={`w-full p-3.5 rounded-2xl border transition-all duration-200 bg-white shadow-soft-sm hover:shadow-soft ${segment.colorClass}`}>
                
                {/* Meta details */}
                <div className="flex justify-between items-center mb-1 font-mono text-[8px] text-gray-400 font-semibold">
                  <span>{segment.sta}</span>
                  <span className="px-1.5 py-0.2 rounded bg-white border border-gray-100">{getVisualIndicator(segment.id)}</span>
                </div>
                
                {/* Name */}
                <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <span className="opacity-70">{segment.icon}</span>
                  <span>{segment.name}</span>
                </div>

                {/* Treatment Text & Visual Hatching Bar */}
                <div className="mt-2 pt-2 border-t border-dashed border-gray-100 text-[10px] font-medium text-gray-600">
                  {getStatusLabel(segment.id)}
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

