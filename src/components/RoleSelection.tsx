import React, { useState, useEffect } from 'react';
import { roles, StakeholderRole } from '@/data/roles';
import { Sparkles, HelpCircle, X } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (roleId: string) => void;
}

interface CharacterState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const [characters, setCharacters] = useState<CharacterState[]>([
    { id: 'resident', x: 18, y: 32, vx: 0.14, vy: 0.1 },
    { id: 'shop_owner', x: 38, y: 22, vx: -0.11, vy: 0.13 },
    { id: 'commuter', x: 72, y: 38, vx: 0.16, vy: -0.11 },
    { id: 'elderly', x: 28, y: 68, vx: -0.06, vy: -0.06 },
    { id: 'environmentalist', x: 52, y: 72, vx: 0.12, vy: -0.12 },
    { id: 'government', x: 82, y: 58, vx: -0.09, vy: 0.11 }
  ]);
  const [tick, setTick] = useState(0);
  const [viewingRoleId, setViewingRoleId] = useState<string | null>(null);

  // Wandering movement loop
  useEffect(() => {
    if (viewingRoleId) return; // Freeze walking when checking details

    const interval = setInterval(() => {
      setCharacters(prev =>
        prev.map(char => {
          let nextX = char.x + char.vx;
          let nextY = char.y + char.vy;
          let nextVx = char.vx;
          let nextVy = char.vy;

          // Bounds: X 6% to 92%, Y 20% to 78%
          if (nextX < 6 || nextX > 92) {
            nextVx = -char.vx;
            nextX = Math.max(6, Math.min(92, nextX));
          }
          if (nextY < 20 || nextY > 78) {
            nextVy = -char.vy;
            nextY = Math.max(20, Math.min(78, nextY));
          }

          // organically change directions slightly
          if (Math.random() < 0.02) {
            const speed = char.id === 'elderly' ? 0.06 : char.id === 'commuter' ? 0.18 : 0.11;
            const angle = Math.random() * 2 * Math.PI;
            nextVx = Math.cos(angle) * speed;
            nextVy = Math.sin(angle) * speed;
          }

          return {
            ...char,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy
          };
        })
      );
      setTick(t => t + 1);
    }, 45);

    return () => clearInterval(interval);
  }, [viewingRoleId]);

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

  const getCharacterFullName = (id: string) => {
    switch (id) {
      case 'resident': return '居民 阿明';
      case 'shop_owner': return '店家 莉雅';
      case 'commuter': return '通勤族 小宇';
      case 'elderly': return '長者 陳伯伯';
      case 'environmentalist': return '環保代表 綠野老師';
      case 'government': return '市府代表 林科長';
      default: return '市民代表';
    }
  };

  const getCharacterSimpleTitle = (id: string) => {
    switch (id) {
      case 'resident': return '居民';
      case 'shop_owner': return '店家';
      case 'commuter': return '通勤';
      case 'elderly': return '長者';
      case 'environmentalist': return '環保';
      case 'government': return '市府';
      default: return '市民';
    }
  };

  const getPhase = (id: string) => {
    switch (id) {
      case 'resident': return 0;
      case 'shop_owner': return 1.2;
      case 'commuter': return 2.4;
      case 'elderly': return 3.6;
      case 'environmentalist': return 4.8;
      case 'government': return 6.0;
      default: return 0;
    }
  };

  const viewingRole = roles.find(r => r.id === viewingRoleId);

  return (
    <div className="flex-1 flex flex-col p-0 bg-[var(--color-bg-warm)] h-full overflow-hidden">
      <div className="w-full h-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-xl p-5 shadow-flat-pop-lg relative flex flex-col overflow-hidden">
        
        {/* Progress header */}
        <div className="flex justify-between items-center mb-4 border-b-3 border-[#1f1d1b] pb-3 shrink-0">
          <span className="px-3.5 py-1 bg-blob-pink border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 PHASE 1 : 選擇您的協商身分 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">進度：1 / 2 步</span>
        </div>

        {/* Title */}
        <div className="shrink-0 mb-4 text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-[#1f1d1b] font-serif flex items-center gap-2">
            <Sparkles className="text-[var(--color-brand-yellow)]" />
            選擇您的協商代表身分
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed font-sans">
            您可以點選左側廣場內走動的代表頭像，或是點選右側的名錄，查看全身立體形象與立場，以登記為您的協商代表。
          </p>
        </div>

        {/* Split view: Wandering Plaza + Illustrated Roster */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 overflow-hidden mb-4">
          
          {/* Wandering Plaza */}
          <div className="flex-1 min-h-[280px] lg:min-h-0 relative bg-[#FAF8F5] border-3 border-[#1f1d1b] rounded-2xl shadow-flat-pop overflow-hidden select-none bg-[radial-gradient(rgba(31,29,27,0.06)_1.5px,transparent_1.5px)] bg-[size:20px_20px]">
            
            {/* Decors */}
            <div className="absolute top-1/4 left-[8%] pointer-events-none select-none z-0">
              <svg className="w-10 h-14 opacity-40" viewBox="0 0 40 60" fill="none">
                <rect x="17" y="35" width="6" height="25" fill="#1f1d1b" />
                <path d="M20 5C10 5 5 15 5 25C5 35 12 40 20 40C28 40 35 35 35 25C35 15 30 5 20 5Z" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="absolute top-2/3 left-[33%] pointer-events-none select-none z-0">
              <svg className="w-12 h-7 opacity-30" viewBox="0 0 60 30" fill="none">
                <rect x="8" y="15" width="4" height="15" fill="#1f1d1b" />
                <rect x="48" y="15" width="4" height="15" fill="#1f1d1b" />
                <rect x="5" y="0" width="50" height="6" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="2" rx="2" />
                <rect x="3" y="10" width="54" height="6" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="2" rx="2" />
              </svg>
            </div>

            {/* Plaza labels */}
            <div className="absolute top-3 left-3 bg-white border-2 border-[#1f1d1b] px-3.5 py-1.5 rounded-xl text-[9px] font-bold text-[#1f1d1b] shadow-[2px_2px_0px_0px_#1f1d1b] z-20 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-[#1f1d1b]" />
              📍 市民共創圓桌廣場 (Plaza Map)
            </div>

            {/* Wandering bubbles */}
            {characters.map(char => {
              const bob = Math.sin(tick * 0.25 + getPhase(char.id)) * 4.5;
              return (
                <button
                  key={char.id}
                  onClick={() => setViewingRoleId(char.id)}
                  style={{
                    left: `${char.x}%`,
                    top: `${char.y}%`,
                    transform: `translate(-50%, -50%) translateY(${bob}px)`,
                    transition: 'left 0.05s linear, top 0.05s linear'
                  }}
                  className="absolute cursor-pointer flex flex-col items-center group z-10 hover:z-30 outline-none"
                >
                  <div className={`w-12 h-12 rounded-full border-3 border-[#1f1d1b] ${getBlobBgClass(char.id)} flex items-center justify-center overflow-hidden shadow-flat-pop transition-all group-hover:scale-110 group-hover:shadow-[4px_4px_0px_0px_rgba(31,29,27,1)]`}>
                    <img
                      src={getRoleAvatar(char.id)}
                      alt={char.id}
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                  <span className="bg-white border-2 border-[#1f1d1b] px-2 py-0.5 rounded-lg text-[8.5px] font-bold text-[#1f1d1b] shadow-[1.5px_1.5px_0px_0px_#1f1d1b] mt-1.5 select-none group-hover:bg-[var(--color-brand-yellow)] transition-colors">
                    {getCharacterFullName(char.id).split(' ')[1]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Roster lists panel showing full body thumbnails */}
          <div className="w-full lg:w-80 bg-gray-50 border-3 border-[#1f1d1b] p-4 rounded-2xl shadow-flat-pop overflow-y-auto text-left flex flex-col shrink-0">
            <span className="text-[9px] font-bold text-gray-400 font-mono uppercase block mb-3 border-b border-gray-200 pb-1">
              [ 👥 市民協商代表名錄 / STAKEHOLDER ROSTER ]
            </span>
            <div className="space-y-3 flex-1">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setViewingRoleId(r.id)}
                  className="w-full bg-white border-2 border-[#1f1d1b] rounded-xl p-3 hover:border-[var(--color-brand-coral)] hover:bg-[#FAF8F5] transition-all text-left flex gap-3 shadow-[2px_2px_0px_0px_#1f1d1b]"
                >
                  {/* Miniature illustrated character card */}
                  <div className={`w-11 h-14 rounded-lg border-2 border-[#1f1d1b] ${getBlobBgClass(r.id)} flex items-center justify-center overflow-hidden shrink-0 bg-white shadow-[1px_1px_0px_0px_#1f1d1b]`}>
                    <img src={r.id === 'shop_owner' ? '/char_shopowner.png' : `/char_${r.id}.png`} alt={r.name} className="w-full h-full object-contain scale-110" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-serif font-black text-[#1f1d1b] leading-tight">{r.name}</h4>
                      <p className="text-[8.5px] text-gray-400 font-mono tracking-tight mt-0.5">代表身分: {r.id.toUpperCase()}</p>
                    </div>
                    <span className="self-start text-[7.5px] bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded border border-gray-300 font-bold mt-1.5">
                      點選登記身分 ➔
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Dialogue popup details */}
        {viewingRole && (
          <div className="absolute inset-0 bg-[#1f1d1b]/40 backdrop-blur-xs flex items-center justify-center p-4 z-45 animate-fade-in rounded-xl">
            <div className="bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 md:p-8 max-w-3xl w-full shadow-flat-pop-lg relative animate-scale-in flex flex-col md:flex-row gap-6 text-left select-none z-50 overflow-y-auto max-h-[90%] md:max-h-none">
              
              <button 
                onClick={() => setViewingRoleId(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-[#1f1d1b] cursor-pointer transition-colors p-1"
              >
                <X size={20} />
              </button>

              {/* Character full-body display card */}
              <div className={`w-full md:w-2/5 rounded-xl border-3 border-[#1f1d1b] ${getBlobBgClass(viewingRole.id)} flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-flat-pop shrink-0 min-h-[250px] md:min-h-0`}>
                <div className="absolute top-2 left-2 bg-white border-2 border-[#1f1d1b] px-2 py-0.5 rounded text-[8px] font-bold text-[#1f1d1b] shadow-[1px_1px_0px_0px_#1f1d1b] z-10 font-serif">
                  FULL PROFILE CHARACTER
                </div>
                <img 
                  src={viewingRole.id === 'shop_owner' ? '/char_shopowner.png' : `/char_${viewingRole.id}.png`} 
                  alt={viewingRole.name} 
                  className="h-44 md:h-64 object-contain select-none pointer-events-none drop-shadow-[4px_4px_0px_rgba(0,0,0,0.15)] transform hover:scale-105 transition-transform"
                />
              </div>

              {/* Right Side: Dialogue Profile Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 border-b-2 border-dashed border-gray-300 pb-3 mb-3">
                    <div className={`w-10 h-10 rounded-full border-2 border-[#1f1d1b] ${getBlobBgClass(viewingRole.id)} flex items-center justify-center overflow-hidden shrink-0`}>
                      <img src={getRoleAvatar(viewingRole.id)} alt={viewingRole.name} className="w-full h-full object-cover scale-110" />
                    </div>
                    <div>
                      <div className="font-mono text-[8px] text-gray-400 uppercase tracking-widest">[ {viewingRole.id.toUpperCase()} // PROFILE ]</div>
                      <h2 className="text-lg font-extrabold text-[#1f1d1b] font-serif leading-tight">{getCharacterFullName(viewingRole.id)}</h2>
                    </div>
                  </div>

                  <div className="relative bg-[#FAF8F5] border-3 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop mb-4 font-serif">
                    <div className="mb-3 text-[11px] font-semibold text-[#1f1d1b] italic border-l-3 border-[var(--color-brand-coral)] pl-2.5 leading-relaxed">
                      {viewingRole.quote}
                    </div>

                    <div className="mb-3">
                      <span className="font-bold text-[10px] text-[#8ea63d] block mb-1">🌿 核心價值 / VALUES</span>
                      <div className="flex flex-wrap gap-1.5">
                        {viewingRole.coreValues.split('、').map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white border-2 border-[#1f1d1b] text-[#1f1d1b] rounded text-[9px] font-bold shadow-[1px_1px_0px_0px_#1f1d1b]">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-[10px] text-[#79afd3] block mb-0.5 font-sans">🔍 關注焦點 / CONCERNS</span>
                      <p className="text-[10px] leading-relaxed text-[#1f1d1b] font-sans font-semibold">
                        {viewingRole.mainConcerns}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={() => {
                      onRoleSelect(viewingRole.id);
                      setViewingRoleId(null);
                    }}
                    className="flex-1 btn-flat-action bg-[var(--color-brand-green)] text-white hover:bg-[#a6bf4c] py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-flat-pop font-bold"
                  >
                    確認登記代表身分 ➔
                  </button>
                  <button
                    onClick={() => setViewingRoleId(null)}
                    className="btn-flat-action bg-white text-[#1f1d1b] hover:bg-gray-50 py-2.5 px-4 rounded-xl text-xs cursor-pointer border-3 border-[#1f1d1b] font-bold"
                  >
                    先去看看其他市民
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Footer Area */}
        <div className="flex justify-between items-center gap-4 border-t-3 border-[#1f1d1b] pt-6 shrink-0 text-xs font-sans font-semibold text-gray-400">
          <div className="flex items-center gap-1.5">
            <HelpCircle size={14} className="text-[var(--color-brand-blue)] shrink-0" />
            <span>您可以直接點選左側廣場走動的人像，或是右側代表名錄。</span>
          </div>
        </div>

      </div>
    </div>
  );
};
