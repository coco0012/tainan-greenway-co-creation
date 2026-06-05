import React from 'react';
import { StakeholderRole } from '@/data/roles';

interface Greenway25DMapProps {
  activeSegmentId?: number;
  avatarPosition?: number; // 0 to 100 (percentage along the path)
  playerRole?: StakeholderRole;
  selections?: Record<number, string>; // {0: 'a', 1: 'b', ...} selected options
  collectedInsights?: Record<number, boolean>;
  interactive?: boolean;
  onSegmentClick?: (id: number) => void;
}

export const Greenway25DMap: React.FC<Greenway25DMapProps> = ({
  activeSegmentId,
  avatarPosition,
  playerRole,
  selections = {},
  collectedInsights = {},
  interactive = true,
  onSegmentClick
}) => {
  // Mapping segments to path percentages
  const segmentLocations = [
    { id: 0, name: '住宅段', x: 200, y: 155, pct: 15 },
    { id: 1, name: '商業段', x: 380, y: 135, pct: 38 },
    { id: 2, name: '車站節點', x: 560, y: 125, pct: 56 },
    { id: 3, name: '主要路口', x: 740, y: 110, pct: 74 },
    { id: 4, name: '生態綠帶段', x: 890, y: 100, pct: 90 }
  ];

  // Helper to get coordinates at any percentage along the path
  const getCoordinatesAtPct = (pct: number) => {
    // Basic linear interpolation across the 5 points
    const pts = [
      { pct: 0, x: 80, y: 190 },
      { pct: 15, x: 200, y: 155 },
      { pct: 38, x: 380, y: 135 },
      { pct: 56, x: 560, y: 125 },
      { pct: 74, x: 740, y: 110 },
      { pct: 90, x: 890, y: 100 },
      { pct: 100, x: 960, y: 90 }
    ];

    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      if (pct >= p1.pct && pct <= p2.pct) {
        const ratio = (pct - p1.pct) / (p2.pct - p1.pct);
        return {
          x: p1.x + (p2.x - p1.x) * ratio,
          y: p1.y + (p2.y - p1.y) * ratio
        };
      }
    }
    return { x: 890, y: 100 };
  };

  const avatarCoords = avatarPosition !== undefined ? getCoordinatesAtPct(avatarPosition) : null;

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#FAF8F5] border-3 border-[#1f1d1b] rounded-xl shadow-flat-pop">
      {/* Dynamic Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(31,29,27,0.06)_1.5px,transparent_1.5px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Map Content SVG */}
      <svg viewBox="0 0 1000 240" className="w-full h-full relative z-10">
        
        {/* Ground grid / Linear land block */}
        <polygon points="40,210 920,80 970,110 90,240" fill="#e8e5db" stroke="#1f1d1b" strokeWidth="3" />
        
        {/* Future Greenway base line */}
        <path 
          d="M 80,190 L 200,155 L 380,135 L 560,125 L 740,110 L 890,100" 
          stroke="#1f1d1b" 
          strokeWidth="10" 
          fill="none" 
          strokeLinecap="round" 
        />
        <path 
          d="M 80,190 L 200,155 L 380,135 L 560,125 L 740,110 L 890,100" 
          stroke="#fcfaf6" 
          strokeWidth="4" 
          fill="none" 
          strokeDasharray="4,4" 
          strokeLinecap="round" 
        />

        {/* --- DECORATIONS & BUILDINGS FOR EACH SEGMENT --- */}

        {/* 1. Residential Segment (X: 200, Y: 155) */}
        <g transform="translate(140, 100)">
          {/* Isometric House 1 */}
          <polygon points="10,40 30,50 30,20 10,10" fill="#fadbdc" stroke="#1f1d1b" strokeWidth="1.5" />
          <polygon points="30,50 50,40 50,10 30,20" fill="#fbc4c6" stroke="#1f1d1b" strokeWidth="1.5" />
          <polygon points="10,10 30,20 50,10 30,0" fill="#d37b70" stroke="#1f1d1b" strokeWidth="1.5" />
          
          {/* Noise barrier or privacy green buffer depending on selection */}
          {selections[0] === 'b' ? (
            // Partial elevated with green shield
            <g transform="translate(30, 45)">
              <line x1="0" y1="5" x2="30" y2="-10" stroke="#1f1d1b" strokeWidth="3" />
              <rect x="5" y="-12" width="20" height="10" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="1.5" rx="1" />
              <circle cx="10" cy="-7" r="2" fill="#ffffff" opacity="0.4" />
            </g>
          ) : selections[0] === 'c' ? (
            // Quiet neighborhood buffer
            <g transform="translate(20, 50)">
              <circle cx="10" cy="0" r="8" fill="#5a7a68" stroke="#1f1d1b" strokeWidth="1.2" />
              <circle cx="20" cy="5" r="6" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="1.2" />
            </g>
          ) : (
            // Ground bike path - default grey
            <path d="M 10,55 L 60,35" stroke="#79afd3" strokeWidth="3" strokeDasharray="2,2" />
          )}
        </g>

        {/* 2. Commercial Segment (X: 380, Y: 135) */}
        <g transform="translate(330, 85)">
          {/* Shop building */}
          <polygon points="10,40 25,48 25,23 10,15" fill="#faecd0" stroke="#1f1d1b" strokeWidth="1.5" />
          <polygon points="25,48 45,38 45,13 25,23" fill="#fce4d6" stroke="#1f1d1b" strokeWidth="1.5" />
          <polygon points="10,15 25,23 45,13 30,5" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="1.5" />
          
          {/* Red/white striped awning */}
          <polygon points="23,28 35,34 47,28 35,22" fill="#d37b70" stroke="#1f1d1b" strokeWidth="1" />

          {/* Dynamic options visuals */}
          {selections[1] === 'b' ? (
            // Bike plaza with umbrella
            <g transform="translate(48, 38)">
              <line x1="0" y1="0" x2="0" y2="-12" stroke="#1f1d1b" strokeWidth="1.5" />
              <path d="M -8,-12 C -8,-17 8,-17 8,-12 Z" fill="#79afd3" stroke="#1f1d1b" strokeWidth="1.5" />
            </g>
          ) : selections[1] === 'c' ? (
            // Delivery box
            <polygon points="45,45 60,37 70,42 55,50" fill="#fcfaf6" stroke="#f3ce6b" strokeWidth="1.5" />
          ) : (
            // Shared street markings
            <path d="M 25,48 L 50,38" stroke="#1f1d1b" strokeWidth="1" />
          )}
        </g>

        {/* 3. Station Node (X: 560, Y: 125) */}
        <g transform="translate(515, 75)">
          {/* Historical Tainan Station Architecture */}
          <polygon points="10,40 45,55 45,25 10,10" fill="#d4e5f2" stroke="#1f1d1b" strokeWidth="1.5" />
          <polygon points="45,55 70,45 70,15 45,25" fill="#b9d0e1" stroke="#1f1d1b" strokeWidth="1.5" />
          <polygon points="10,10 45,25 70,15 35,0" fill="#79afd3" stroke="#1f1d1b" strokeWidth="1.5" />
          {/* Station Clock tower detail */}
          <rect x="25" y="10" width="8" height="12" fill="#ffffff" stroke="#1f1d1b" strokeWidth="1.2" />
          <circle cx="29" cy="16" r="2" fill="#d37b70" />

          {/* Dynamic details */}
          {selections[2] === 'b' ? (
            // Historical train plaza
            <g transform="translate(55, 45)">
              <rect x="-10" y="-5" width="20" height="10" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="1" rx="1" />
              <text x="-6" y="2" fill="#1f1d1b" fontSize="6" fontWeight="bold">🚂</text>
            </g>
          ) : selections[2] === 'c' ? (
            // Clear wayfinding signpost
            <g transform="translate(50, 48)">
              <line x1="0" y1="0" x2="0" y2="-14" stroke="#1f1d1b" strokeWidth="2" />
              <rect x="-8" y="-14" width="16" height="5" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="1" />
            </g>
          ) : (
            // YouBike dock
            <g transform="translate(50, 48)">
              <circle cx="-5" cy="0" r="3" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="1" />
              <circle cx="5" cy="0" r="3" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* 4. Major Road Crossing (X: 740, Y: 110) */}
        <g transform="translate(700, 65)">
          {/* Roads crossing (two black stripes cut) */}
          <polygon points="15,45 60,25 80,35 35,55" fill="#3a3734" stroke="#1f1d1b" strokeWidth="1.5" />
          {/* Zebra cross lines */}
          <line x1="25" y1="44" x2="35" y2="40" stroke="#ffffff" strokeWidth="2" />
          <line x1="33" y1="40" x2="43" y2="36" stroke="#ffffff" strokeWidth="2" />
          <line x1="41" y1="36" x2="51" y2="32" stroke="#ffffff" strokeWidth="2" />

          {/* Dynamic options */}
          {selections[3] === 'a' ? (
            // Elevated bike flyover arch
            <path d="M 10,48 Q 45,15 80,33" stroke="#d37b70" strokeWidth="5" fill="none" strokeLinecap="round" />
          ) : selections[3] === 'c' ? (
            // Traffic signal light
            <g transform="translate(55, 23)">
              <line x1="0" y1="0" x2="0" y2="-16" stroke="#1f1d1b" strokeWidth="1.5" />
              <circle cx="0" cy="-16" r="3.5" fill="#d37b70" stroke="#1f1d1b" strokeWidth="1" />
            </g>
          ) : (
            // Ground crossing dividers
            <circle cx="48" cy="28" r="3.5" fill="#79afd3" stroke="#1f1d1b" strokeWidth="1" />
          )}
        </g>

        {/* 5. Ecological Segment (X: 890, Y: 100) */}
        <g transform="translate(850, 45)">
          {/* Green tree clusters */}
          <circle cx="15" cy="40" r="14" fill="#5a7a68" stroke="#1f1d1b" strokeWidth="1.5" />
          <circle cx="28" cy="30" r="16" fill="#3e5f4c" stroke="#1f1d1b" strokeWidth="1.5" />
          <circle cx="42" cy="45" r="12" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="1.5" />
          
          {/* Details based on selection */}
          {selections[4] === 'b' ? (
            // Rain garden pool (Blue pond)
            <polygon points="12,50 35,42 45,50 22,58" fill="#d4e5f2" stroke="#1f1d1b" strokeWidth="1.5" />
          ) : selections[4] === 'c' ? (
            // Cooling wind lines
            <path d="M -5,35 Q 20,20 45,35" stroke="#79afd3" strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
          ) : (
            // Extra thick forest
            <circle cx="28" cy="18" r="9" fill="#2d493a" stroke="#1f1d1b" strokeWidth="1.2" />
          )}
        </g>

        {/* --- INTERACTIVE SEGMENT BUTTON HOTSPOTS --- */}
        {segmentLocations.map(seg => {
          const isSelected = activeSegmentId === seg.id;
          const hasInsight = collectedInsights[seg.id];
          return (
            <g 
              key={seg.id} 
              className={interactive ? 'cursor-pointer' : ''}
              onClick={() => interactive && onSegmentClick && onSegmentClick(seg.id)}
            >
              {/* Pulsing ring if active */}
              {isSelected && (
                <circle 
                  cx={seg.x} 
                  cy={seg.y} 
                  r="24" 
                  className="fill-none stroke-[var(--color-brand-coral)] stroke-2 animate-ping opacity-60" 
                />
              )}

              {/* Hotspot Outer Anchor */}
              <circle 
                cx={seg.x} 
                cy={seg.y} 
                r="10" 
                fill={isSelected ? '#f3ce6b' : hasInsight ? '#8ea63d' : '#ffffff'} 
                stroke="#1f1d1b" 
                strokeWidth="2.5" 
                className="transition-colors duration-200"
              />
              <circle 
                cx={seg.x} 
                cy={seg.y} 
                r="4" 
                fill="#1f1d1b" 
              />

              {/* Segment Labels */}
              <g transform={`translate(${seg.x}, ${seg.y - 18})`}>
                <rect 
                  x="-35" 
                  y="-11" 
                  width="70" 
                  height="18" 
                  rx="4" 
                  fill="#ffffff" 
                  stroke={isSelected ? 'var(--color-brand-coral)' : '#1f1d1b'} 
                  strokeWidth="2" 
                  className="shadow-[1.5px_1.5px_0px_0px_#1f1d1b]"
                />
                <text 
                  x="0" 
                  y="2" 
                  textAnchor="middle" 
                  fill="#1f1d1b" 
                  fontSize="8" 
                  fontWeight="bold" 
                  fontFamily="sans-serif"
                >
                  {seg.name}
                </text>
              </g>
            </g>
          );
        })}

        {/* --- PLAYER AVATAR WALKING SPRITE --- */}
        {avatarCoords && playerRole && (
          <g 
            transform={`translate(${avatarCoords.x}, ${avatarCoords.y - 20})`}
            className="transition-all duration-300 ease-out"
          >
            {/* Animated speech bubble pointer or label */}
            <rect 
              x="-22" 
              y="-38" 
              width="44" 
              height="15" 
              rx="4" 
              fill="#d37b70" 
              stroke="#1f1d1b" 
              strokeWidth="1.5" 
            />
            <text 
              x="0" 
              y="-28" 
              textAnchor="middle" 
              fill="#ffffff" 
              fontSize="7.5" 
              fontWeight="black"
            >
              YOU (您)
            </text>
            <polygon points="0,-23 -4,-18 4,-18" fill="#1f1d1b" />

            {/* Avatar bubble circle */}
            <circle 
              cx="0" 
              cy="-6" 
              r="15" 
              fill="#ffffff" 
              stroke="#1f1d1b" 
              strokeWidth="2.5" 
              className="shadow-[2px_2px_0px_0px_#1f1d1b]"
            />
            
            {/* Player Avatar Image clip */}
            <g transform="translate(-15, -21)">
              <clipPath id="avatar-clip">
                <circle cx="15" cy="15" r="13.5" />
              </clipPath>
              <image 
                href={
                  playerRole.id === 'resident' ? '/avatar_resident.png' :
                  playerRole.id === 'shop_owner' ? '/avatar_shopowner.png' :
                  playerRole.id === 'commuter' ? '/avatar_commuter.png' :
                  playerRole.id === 'elderly' ? '/avatar_elderly.png' :
                  playerRole.id === 'environmentalist' ? '/avatar_environmentalist.png' :
                  '/avatar_government.png'
                }
                width="30"
                height="30"
                clipPath="url(#avatar-clip)"
                className="scale-110"
              />
            </g>
          </g>
        )}
      </svg>
      
      {/* HUD Station indicators */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between z-20 pointer-events-none text-[8px] font-mono font-bold text-gray-500 bg-white/70 px-2 py-0.5 rounded border border-gray-200">
        <span>STA 0+000 (起點)</span>
        <span>STA 0+700 (車站樞紐)</span>
        <span>STA 1+400 (終點)</span>
      </div>
    </div>
  );
};
