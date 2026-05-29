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
    { id: 'elderly', x: 28, y: 68, vx: -0.06, vy: -0.06 }, // slow
    { id: 'environmentalist', x: 52, y: 72, vx: 0.12, vy: -0.12 },
    { id: 'government', x: 82, y: 58, vx: -0.09, vy: 0.11 }
  ]);
  const [tick, setTick] = useState(0);
  const [viewingRoleId, setViewingRoleId] = useState<string | null>(null);

  // Organic wander movement loop
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

          // Small random chance to shift direction organically
          if (Math.random() < 0.02) {
            // Commuter moves faster, elderly slower, others medium
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
    <div className="flex-1 flex flex-col p-6 bg-[var(--color-bg-warm)] h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-8 shadow-flat-pop-lg relative flex flex-col min-h-[640px]">
        
        {/* Progress header */}
        <div className="flex justify-between items-center mb-6 border-b-3 border-[#1f1d1b] pb-4 shrink-0">
          <span className="px-3.5 py-1 bg-blob-pink border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 圓桌登記：選擇您的協商身分 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">進度：1 / 2 步</span>
        </div>

        {/* Title */}
        <div className="shrink-0 mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-[#1f1d1b] font-serif flex items-center gap-2">
            <Sparkles className="text-[var(--color-brand-yellow)]" />
            選擇您的協商身分
          </h1>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-sans">
            請在下方的**「市民共創廣場」**中點選走動的市民代表，查看其立場詳情並登記為您的協商身分！在接下來的綠園道踏查中，您將代表該立場，左右最終的空間決策與民意滿意度。
          </p>
        </div>

        {/* Citizens Wandering Plaza */}
        <div className="flex-1 min-h-[380px] relative bg-[#FAF8F5] border-3 border-[#1f1d1b] rounded-2xl shadow-flat-pop overflow-hidden mb-6 select-none bg-[radial-gradient(rgba(31,29,27,0.06)_1.5px,transparent_1.5px)] bg-[size:20px_20px]">
          
          {/* Plaza Static Decors (Line-art SVGs of Trees & Benches) */}
          <div className="absolute top-1/4 left-[8%] pointer-events-none select-none z-0">
            <svg className="w-10 h-14 opacity-40" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="17" y="35" width="6" height="25" fill="#1f1d1b" />
              <path d="M20 5C10 5 5 15 5 25C5 35 12 40 20 40C28 40 35 35 35 25C35 15 30 5 20 5Z" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="2.5" />
              <circle cx="15" cy="18" r="3" fill="#ffffff" opacity="0.3" />
            </svg>
          </div>
          <div className="absolute top-2/3 left-[33%] pointer-events-none select-none z-0">
            <svg className="w-12 h-7 opacity-30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="15" width="4" height="15" fill="#1f1d1b" />
              <rect x="48" y="15" width="4" height="15" fill="#1f1d1b" />
              <rect x="5" y="0" width="50" height="6" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="2" rx="2" />
              <rect x="3" y="10" width="54" height="6" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="2" rx="2" />
              <path d="M5 6V10M55 6V10" stroke="#1f1d1b" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-[66%] pointer-events-none select-none z-0">
            <svg className="w-10 h-14 opacity-40" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="17" y="35" width="6" height="25" fill="#1f1d1b" />
              <path d="M20 5C10 5 5 15 5 25C5 35 12 40 20 40C28 40 35 35 35 25C35 15 30 5 20 5Z" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="2.5" />
              <circle cx="15" cy="18" r="3" fill="#ffffff" opacity="0.3" />
            </svg>
          </div>
          <div className="absolute top-[20%] left-[80%] pointer-events-none select-none z-0">
            <svg className="w-12 h-7 opacity-35" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="15" width="4" height="15" fill="#1f1d1b" />
              <rect x="48" y="15" width="4" height="15" fill="#1f1d1b" />
              <rect x="5" y="0" width="50" height="6" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="2" rx="2" />
              <rect x="3" y="10" width="54" height="6" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="2" rx="2" />
              <path d="M5 6V10M55 6V10" stroke="#1f1d1b" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute bottom-[12%] right-[8%] pointer-events-none select-none z-0">
            <svg className="w-10 h-14 opacity-45" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="17" y="35" width="6" height="25" fill="#1f1d1b" />
              <path d="M20 5C10 5 5 15 5 25C5 35 12 40 20 40C28 40 35 35 35 25C35 15 30 5 20 5Z" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="2.5" />
              <circle cx="15" cy="18" r="3" fill="#ffffff" opacity="0.3" />
            </svg>
          </div>

          {/* Plaza Signpost Tag */}
          <div className="absolute top-4 left-4 bg-white border-2 border-[#1f1d1b] px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-[#1f1d1b] shadow-[2.5px_2.5px_0px_0px_#1f1d1b] z-20 flex items-center gap-1.5 font-serif uppercase tracking-wider">
            <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-[#1f1d1b]" />
            📍 市民共創圓桌廣場 (Citizens Plaza)
          </div>

          {/* Prompt banner */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 border-2 border-[#1f1d1b] px-4 py-2 rounded-xl text-[10.5px] font-bold text-[#1f1d1b] shadow-[3px_3px_0px_0px_#1f1d1b] z-20 animate-bounce pointer-events-none font-sans text-center">
            👋 點選廣場中走動的市民，開啟對話並閱覽角色背景！
          </div>

          {/* Wandering Characters */}
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
                {/* Character Avatar bubble */}
                <div className={`w-13 h-13 rounded-full border-3 border-[#1f1d1b] ${getBlobBgClass(char.id)} flex items-center justify-center overflow-hidden shadow-flat-pop transition-all group-hover:scale-110 group-hover:shadow-[5px_5px_0px_0px_rgba(31,29,27,1)]`}>
                  <img
                    src={getRoleAvatar(char.id)}
                    alt={char.id}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                {/* Character Label Tag */}
                <span className="bg-white border-2 border-[#1f1d1b] px-2 py-0.5 rounded-lg text-[9px] font-bold text-[#1f1d1b] shadow-[1.5px_1.5px_0px_0px_#1f1d1b] mt-2 select-none group-hover:bg-[var(--color-brand-yellow)] group-hover:text-[#1f1d1b] transition-colors font-serif">
                  {getCharacterFullName(char.id).split(' ')[1]} ({getCharacterSimpleTitle(char.id)})
                </span>
              </button>
            );
          })}

        </div>

        {/* RPG Dialogue Popup Overlay for Character Details */}
        {viewingRole && (
          <div className="absolute inset-0 bg-[#1f1d1b]/40 backdrop-blur-xs flex items-center justify-center p-4 z-45 animate-fade-in rounded-2xl">
            <div className="bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-flat-pop-lg relative animate-scale-in flex flex-col gap-5 text-left select-none z-50">
              
              {/* Close Button */}
              <button 
                onClick={() => setViewingRoleId(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-[#1f1d1b] cursor-pointer transition-colors p-1"
              >
                <X size={20} />
              </button>

              {/* Dialogue Header */}
              <div className="flex items-center gap-4 border-b-3 border-[#1f1d1b] pb-4">
                <div className={`w-15 h-15 rounded-full border-3 border-[#1f1d1b] ${getBlobBgClass(viewingRole.id)} flex items-center justify-center shrink-0 overflow-hidden shadow-[2px_2px_0px_0px_#1f1d1b]`}>
                  <img 
                    src={getRoleAvatar(viewingRole.id)} 
                    alt={viewingRole.name} 
                    className="w-full h-full object-cover scale-110" 
                  />
                </div>
                <div>
                  <div className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">[ {viewingRole.id.toUpperCase()} // PROFILE ]</div>
                  <h2 className="text-xl font-extrabold text-[#1f1d1b] font-serif leading-tight">{getCharacterFullName(viewingRole.id)}</h2>
                  <span className="px-2 py-0.5 mt-1 bg-blob-yellow border-2 border-[#1f1d1b] text-[9px] font-bold text-[#1f1d1b] rounded-full shadow-[1px_1px_0px_0px_#1f1d1b] inline-block font-sans">
                    代表市民利益：{viewingRole.name}
                  </span>
                </div>
              </div>

              {/* Dialogue Bubble Styled Details Body */}
              <div className="relative bg-[#FAF8F5] border-3 border-[#1f1d1b] p-5 rounded-xl shadow-flat-pop">
                {/* Speech Arrow */}
                <div className="absolute top-[-10px] left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[#1f1d1b]" />
                <div className="absolute top-[-7px] left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[#FAF8F5]" />

                {/* Quote */}
                <div className="mb-4 text-xs font-semibold text-[#1f1d1b] font-serif italic border-l-3 border-[var(--color-brand-coral)] pl-3 leading-relaxed">
                  {viewingRole.quote}
                </div>

                {/* Core Values */}
                <div className="mb-4">
                  <span className="font-bold text-[10.5px] text-[#8ea63d] block mb-2">🌿 核心價值 / VALUES</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingRole.coreValues.split('、').map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border-2 border-[#1f1d1b] text-[#1f1d1b] rounded text-[10px] font-bold shadow-[1px_1px_0px_0px_#1f1d1b]">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Concerns */}
                <div>
                  <span className="font-bold text-[10.5px] text-[#79afd3] block mb-1">🔍 關注焦點 / CONCERNS</span>
                  <p className="text-[11px] leading-relaxed text-[#1f1d1b] font-sans font-medium">
                    {viewingRole.mainConcerns}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    onRoleSelect(viewingRole.id);
                    setViewingRoleId(null);
                  }}
                  className="flex-1 btn-flat-action bg-[var(--color-brand-green)] text-white hover:bg-[#a6bf4c] py-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-flat-pop font-bold"
                >
                  確認以此身分開始踏查 ➔
                </button>
                <button
                  onClick={() => setViewingRoleId(null)}
                  className="btn-flat-action bg-white text-[#1f1d1b] hover:bg-gray-50 py-3 px-5 rounded-xl text-xs cursor-pointer border-3 border-[#1f1d1b] font-bold"
                >
                  先去看看其他市民
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Footer Area */}
        <div className="flex justify-between items-center gap-4 border-t-3 border-[#1f1d1b] pt-6 shrink-0 text-xs font-sans font-semibold text-gray-400">
          <div className="flex items-center gap-1.5">
            <HelpCircle size={14} className="text-[var(--color-brand-blue)] shrink-0" />
            <span>請在共創廣場內點選任何一位市民以登記您的協商身分。</span>
          </div>
        </div>

      </div>
    </div>
  );
};
