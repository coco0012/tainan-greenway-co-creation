import React from 'react';
import { StakeholderRole } from '@/data/roles';

interface Greenway25DMapProps {
  activeSegmentId?: number;
  avatarPosition?: number; // 0 to 100
  playerPos?: { x: number; y: number }; // Custom 2D coordinate position
  playerRole?: StakeholderRole;
  selections?: Record<number, string>; // selected options (e.g. {0: 'a', 1: 'b'})
  collectedInsights?: Record<string, boolean>; // Record<string, boolean> to match NPC IDs
  interactive?: boolean;
  onSegmentClick?: (id: number) => void;
  mapState?: 'initial' | 'exploration' | 'revision' | 'final'; // Map states prop
  wigglingNode?: string | null;
}

// 1. Flat 2D Projection Helper (Declared at module level)
const get2DPoint = (x: number, yOffset: number) => {
  const ratio = x / 1000;
  const baseX = 30 + ratio * 940;
  const baseY = 260;
  // Organic S-curve winding offset (wiggle) running along the corridor
  const wiggle = Math.sin(ratio * Math.PI * 2) * 35;
  const y = yOffset + wiggle;
  return {
    x: baseX,
    y: baseY + y
  };
};

// Helper to generate winding SVG path string
const getWindingPathD = (yOffset: number) => {
  let d = '';
  for (let x = 30; x <= 970; x += 15) {
    const pt = get2DPoint(x, yOffset);
    d += `${x === 30 ? 'M' : 'L'} ${pt.x} ${pt.y} `;
  }
  return d;
};

// --- MODULE-LEVEL SUB-COMPONENTS FOR DRAWING FLAT 2D SHAPES ---

// Flat Rectangle
const FlatBox: React.FC<{
  x: number;
  y: number;
  w: number;
  d: number;
  fill: string;
  onClick?: () => void;
}> = ({ x, y, w, d, fill, onClick }) => {
  const p = get2DPoint(x, y);
  return (
    <g onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      {/* Shadow */}
      <rect x={p.x - w/2 + 2} y={p.y - d/2 + 2} width={w} height={d} rx="2" fill="rgba(31,29,27,0.1)" />
      {/* Outline */}
      <rect x={p.x - w/2} y={p.y - d/2} width={w} height={d} rx="2" fill={fill} stroke="#1f1d1b" strokeWidth="1.5" />
    </g>
  );
};

// Flat House (top-down view with split pitched roof)
const FlatHouse: React.FC<{
  x: number;
  y: number;
  w: number;
  d: number;
  fillWall: string;
  fillRoof: string;
}> = ({ x, y, w, d, fillWall, fillRoof }) => {
  const p = get2DPoint(x, y);
  return (
    <g>
      {/* Shadow */}
      <rect x={p.x - w/2 + 2} y={p.y - d/2 + 2} width={w} height={d} rx="3" fill="rgba(31,29,27,0.12)" />
      {/* Wall base */}
      <rect x={p.x - w/2} y={p.y - d/2} width={w} height={d} rx="3" fill={fillWall} stroke="#1f1d1b" strokeWidth="1.5" />
      {/* Roof (top slope) */}
      <rect x={p.x - w/2} y={p.y - d/2} width={w} height={d/2} rx="1" fill={fillRoof} stroke="#1f1d1b" strokeWidth="1.5" />
      {/* Roof ridge line */}
      <line x1={p.x - w/2} y1={p.y} x2={p.x + w/2} y2={p.y} stroke="#1f1d1b" strokeWidth="1.5" />
    </g>
  );
};

// Flat Shop (top-down view with striped awning)
const FlatShop: React.FC<{
  x: number;
  y: number;
  w: number;
  d: number;
  fillWall: string;
  fillRoof: string;
  fillAwning: string;
}> = ({ x, y, w, d, fillWall, fillRoof, fillAwning }) => {
  const p = get2DPoint(x, y);
  return (
    <g>
      {/* Shadow */}
      <rect x={p.x - w/2 + 2} y={p.y - d/2 + 2} width={w} height={d} rx="3" fill="rgba(31,29,27,0.12)" />
      {/* Wall base */}
      <rect x={p.x - w/2} y={p.y - d/2} width={w} height={d} rx="3" fill={fillWall} stroke="#1f1d1b" strokeWidth="1.5" />
      {/* Roof */}
      <rect x={p.x - w/2} y={p.y - d/2} width={w} height={d - 10} rx="1.5" fill={fillRoof} stroke="#1f1d1b" strokeWidth="1.5" />
      {/* Front Awning strip */}
      <rect x={p.x - w/2} y={p.y + d/2 - 10} width={w} height="10" fill={fillAwning} stroke="#1f1d1b" strokeWidth="1.5" />
      {/* Awning stripes */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1={p.x - w/2 + (w / 5) * i}
          y1={p.y + d/2 - 10}
          x2={p.x - w/2 + (w / 5) * i}
          y2={p.y + d/2}
          stroke="#1f1d1b"
          strokeWidth="1.5"
        />
      ))}
    </g>
  );
};

// Flat Station Node
const FlatStation: React.FC<{
  x: number;
  y: number;
  w: number;
  d: number;
}> = ({ x, y, w, d }) => {
  const p = get2DPoint(x, y);
  return (
    <g>
      {/* Shadow */}
      <rect x={p.x - w/2 + 3} y={p.y - d/2 + 3} width={w} height={d} rx="4" fill="rgba(31,29,27,0.12)" />
      {/* Station roof block */}
      <rect x={p.x - w/2} y={p.y - d/2} width={w} height={d} rx="4" fill="#c7dbe8" stroke="#1f1d1b" strokeWidth="2" />
      {/* Skylight strip */}
      <rect x={p.x - w/3} y={p.y - d/4} width={(w * 2) / 3} height={d/2} rx="2" fill="#1e293b" stroke="#1f1d1b" strokeWidth="1.5" />
      {/* Skylight division lines */}
      <line x1={p.x} y1={p.y - d/4} x2={p.x} y2={p.y + d/4} stroke="#ffffff" strokeWidth="1" opacity="0.4" />
      <line x1={p.x - w/6} y1={p.y - d/4} x2={p.x - w/6} y2={p.y + d/4} stroke="#ffffff" strokeWidth="1" opacity="0.4" />
      <line x1={p.x + w/6} y1={p.y - d/4} x2={p.x + w/6} y2={p.y + d/4} stroke="#ffffff" strokeWidth="1" opacity="0.4" />
    </g>
  );
};

// Flat 2D Tree
const FlatTree: React.FC<{
  x: number;
  y: number;
  size?: number;
  color1?: string;
  color2?: string;
}> = ({ x, y, size = 18, color1 = '#5a7a68', color2 = '#445f50' }) => {
  const p = get2DPoint(x, y);
  return (
    <g>
      {/* Shadow */}
      <circle cx={p.x + 2} cy={p.y + 2} r={size} fill="rgba(31,29,27,0.1)" />
      {/* Outer canopy circle */}
      <circle cx={p.x} cy={p.y} r={size} fill={color1} stroke="#1f1d1b" strokeWidth="1.5" />
      {/* Inner canopy circle */}
      <circle cx={p.x - size*0.15} cy={p.y - size*0.15} r={size * 0.7} fill={color2} opacity="0.8" />
      {/* Highlight circle */}
      <circle cx={p.x - size*0.3} cy={p.y - size*0.3} r={size * 0.3} fill="#ffffff" opacity="0.25" />
    </g>
  );
};

// Flat YouBike Racks
const FlatYouBikeRacks: React.FC<{
  x: number;
  y: number;
  w: number;
  d: number;
}> = ({ x, y, w, d }) => {
  const p = get2DPoint(x, y);
  return (
    <g>
      {/* Rack base */}
      <rect x={p.x - w/2} y={p.y - d/2} width={w} height={d} rx="1" fill="#e5e7eb" stroke="#1f1d1b" strokeWidth="1.2" />
      {/* Orange bike icons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i} transform={`translate(${p.x - w/2 + 3 + i * 7}, ${p.y - 1})`}>
          <rect x="0" y="0" width="4" height="2" rx="0.5" fill="#d97706" stroke="#1f1d1b" strokeWidth="0.8" />
          <circle cx="0.8" cy="1" r="0.6" fill="#ffffff" stroke="#1f1d1b" strokeWidth="0.4" />
          <circle cx="3.2" cy="1" r="0.6" fill="#ffffff" stroke="#1f1d1b" strokeWidth="0.4" />
        </g>
      ))}
    </g>
  );
};

// Flat 2D Sign
const FlatCrossingSign: React.FC<{
  x: number;
  y: number;
  wiggling?: boolean;
}> = ({ x, y, wiggling }) => {
  const p = get2DPoint(x, y);
  return (
    <g className={wiggling ? 'animate-wiggle' : ''}>
      {/* Shadow */}
      <circle cx={p.x + 1} cy={p.y + 1} r="5" fill="rgba(31,29,27,0.15)" />
      {/* Pole base */}
      <circle cx={p.x} cy={p.y} r="4" fill="#374151" stroke="#1f1d1b" strokeWidth="1.2" />
      {/* Diamond Sign */}
      <rect x={p.x - 7} y={p.y - 7} width="14" height="14" rx="2" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="1.2" transform={`rotate(45 ${p.x} ${p.y})`} />
      <text x={p.x} y={p.y + 2} textAnchor="middle" fontSize="7" fontWeight="black" fill="#1f1d1b">⚠</text>
    </g>
  );
};

// Flat Zebra Crossing
const FlatZebraCrossing: React.FC<{
  x: number;
  y: number;
  w: number;
  d: number;
}> = ({ x, y, w, d }) => {
  const p = get2DPoint(x, y);
  return (
    <g>
      {/* Zebra stripes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect
          key={i}
          x={p.x - w/2}
          y={p.y - d/2 + (d / 6) * i + 1}
          width={w}
          height={d / 12}
          fill="#ffffff"
          opacity="0.85"
        />
      ))}
    </g>
  );
};

export const Greenway25DMap: React.FC<Greenway25DMapProps> = ({
  activeSegmentId,
  avatarPosition,
  playerPos,
  playerRole,
  selections = {},
  collectedInsights = {},
  interactive = true,
  onSegmentClick,
  mapState,
  wigglingNode = null
}) => {
  // Determine active map state
  const activeState = mapState || (Object.keys(selections).length > 0 ? 'revision' : 'exploration');

  // SVG Canvas configuration
  const canvasWidth = 1000;
  const canvasHeight = 520;

  // 2. Segments Configuration
  const segments = [
    { id: 0, name: '住宅段', x: 180, icon: '🏡', detailZh: '低矮透天與陽台隱私' },
    { id: 1, name: '商業段', x: 380, icon: '🛍️', detailZh: '店家活絡與人車共享' },
    { id: 2, name: '車站節點', x: 560, icon: '🚂', detailZh: 'YouBike與大眾轉乘' },
    { id: 3, name: '主要路口', x: 740, icon: '🚦', detailZh: '道路穿越與立體分流' },
    { id: 4, name: '生態綠帶段', x: 900, icon: '🌿', detailZh: '大樹降溫與雨水花園' }
  ];

  // Helper to map segment ID to collected insights based on NPC keys
  const getSegmentCollected = (segId: number): boolean => {
    if (segId === 0) return collectedInsights['resident'] || false;
    if (segId === 1) return collectedInsights['shop_owner'] || false;
    if (segId === 2) return collectedInsights['commuter'] || false;
    if (segId === 3) return collectedInsights['government'] || false;
    if (segId === 4) return (collectedInsights['elderly'] || false) || (collectedInsights['environmentalist'] || false);
    return false;
  };

  // 3. NPCs List for drawing on the map
  const npcsList = [
    { id: 'resident', name: '阿明', pct: 18, avatar: '/avatar_resident.png', color: '#fbc4c6' },
    { id: 'shop_owner', name: '莉雅', pct: 38, avatar: '/avatar_shopowner.png', color: '#faf0d8' },
    { id: 'commuter', name: '小宇', pct: 56, avatar: '/avatar_commuter.png', color: '#c7dce7' },
    { id: 'government', name: '林科長', pct: 74, avatar: '/avatar_government.png', color: '#e2e8f0' },
    { id: 'elderly', name: '陳伯伯', pct: 84, avatar: '/avatar_elderly.png', color: '#ffe4e6' },
    { id: 'environmentalist', name: '綠野老師', pct: 92, avatar: '/avatar_environmentalist.png', color: '#acd0a2' }
  ];

  // Helper to interpolate coordinates along the path for the player avatar
  const getCoordinatesAtPct = (pct: number) => {
    // Avatar walks along the pedestrian path (yOffset = 25)
    return get2DPoint(pct * 10, 25);
  };

  const avatarCoords = playerPos 
    ? get2DPoint(playerPos.x, playerPos.y) 
    : (avatarPosition !== undefined ? getCoordinatesAtPct(avatarPosition) : null);

  const avatarBobZ = playerPos
    ? Math.abs(Math.sin((playerPos.x + playerPos.y) * 0.3)) * 4.5
    : (avatarPosition !== undefined ? Math.abs(Math.sin(avatarPosition * 0.5)) * 4.5 : 0);

  // Construct Dynamic Y-Sorted Middle Occlusion Layer
  const renderList: { y: number; render: () => React.JSX.Element }[] = [];

  // 1. Residential Segment (🏡 Houses & Balcony)
  renderList.push({
    y: -70,
    render: () => (
      <g key="res-houses-group" className={wigglingNode === 'residential' ? 'animate-wiggle' : ''}>
        <FlatHouse
          key="res-house-1"
          x={175}
          y={-70}
          w={42}
          d={32}
          fillWall="#fbc4c6"
          fillRoof="#e17b70"
        />
        <FlatHouse
          key="res-house-2"
          x={235}
          y={-75}
          w={45}
          d={32}
          fillWall="#fbc4c6"
          fillRoof="#e17b70"
        />
        {/* Balcony */}
        <FlatBox
          key="res-balcony"
          x={185}
          y={-50}
          w={16}
          d={8}
          fill="#f3f4f6"
        />
      </g>
    )
  });

  // Residential Strategies
  if (activeState === 'revision' || activeState === 'final') {
    if (selections[0] === 'b') {
      renderList.push({
        y: -4,
        render: () => (
          <g key="res-strategy-elevated">
            {/* Draw flat elevated bicycle path bridge path */}
            <path
              d={getWindingPathD(-4).split(' L').slice(15, 60).join(' L')}
              stroke="#1f1d1b"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={getWindingPathD(-4).split(' L').slice(15, 60).join(' L')}
              stroke="#c5bead"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Green privacy shield wall indicator */}
            <path
              d={getWindingPathD(-10).split(' L').slice(18, 56).join(' L')}
              stroke="#5a7a68"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )
      });
    } else if (selections[0] === 'c') {
      renderList.push({
        y: -38,
        render: () => (
          <FlatBox
            key="res-strategy-wall"
            x={210}
            y={-38}
            w={110}
            d={12}
            fill="#4b6b55"
          />
        )
      });
    }
  }

  // 2. Commercial Segment (🛍️ Storefronts)
  renderList.push({
    y: -70,
    render: () => (
      <g key="comm-shops-group" className={wigglingNode === 'commercial' ? 'animate-wiggle' : ''}>
        <FlatShop
          key="comm-shop-1"
          x={380}
          y={-70}
          w={45}
          d={32}
          fillWall="#faf0d8"
          fillRoof="#f59e0b"
          fillAwning="#d97706"
        />
        <FlatShop
          key="comm-shop-2"
          x={445}
          y={-70}
          w={42}
          d={32}
          fillWall="#fde8e8"
          fillRoof="#dc2626"
          fillAwning="#b91c1c"
        />
      </g>
    )
  });

  // Commercial Strategy: YouBike rack/parking
  if ((activeState === 'revision' || activeState === 'final') && selections[1] === 'b') {
    renderList.push({
      y: 28,
      render: () => (
        <FlatYouBikeRacks key="comm-strategy-racks" x={395} y={28} w={20} d={8} />
      )
    });
  }

  // 3. Station Node (🚂 Station & Clock Tower)
  renderList.push({
    y: -75,
    render: () => (
      <g key="station-group" className={wigglingNode === 'station' ? 'animate-wiggle' : ''}>
        <FlatStation
          key="station-main-box"
          x={620}
          y={-75}
          w={70}
          d={45}
        />
        {/* Clock Tower block top-down */}
        <FlatBox
          key="station-tower-box"
          x={580}
          y={-75}
          w={22}
          d={22}
          fill="#8cb1cc"
        />
      </g>
    )
  });

  // Station Strategy
  if (activeState === 'revision' || activeState === 'final') {
    if (selections[2] === 'a') {
      renderList.push({
        y: 35,
        render: () => (
          <g key="station-strategy-transit">
            {/* Bus shelter flat box */}
            <FlatBox x={665} y={35} w={30} d={12} fill="#dc2626" />
            {/* YouBike lane line */}
            <line x1={get2DPoint(600, 40).x} y1={get2DPoint(600, 40).y} x2={get2DPoint(630, 28).x} y2={get2DPoint(630, 28).y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          </g>
        )
      });
    } else if (selections[2] === 'c') {
      renderList.push({
        y: 30,
        render: () => (
          /* Small slow sign block */
          <circle key="station-strategy-sign" cx={get2DPoint(610, 30).x} cy={get2DPoint(610, 30).y} r="6" fill="#ef4444" stroke="#1f1d1b" strokeWidth="1.5" />
        )
      });
    }
  }

  // 4. Crossing Strategy (🚦 Bridge or zebra)
  if (activeState === 'revision' || activeState === 'final') {
    if (selections[3] === 'a') {
      renderList.push({
        y: -2,
        render: () => (
          <g key="crossing-strategy-elevated">
            {/* Simple flat elevated bridge path */}
            <line x1={get2DPoint(695, 10).x} y1={get2DPoint(695, 10).y} x2={get2DPoint(860, 10).x} y2={get2DPoint(860, 10).y} stroke="#1f1d1b" strokeWidth="8" strokeLinecap="round" />
            <line x1={get2DPoint(695, 10).x} y1={get2DPoint(695, 10).y} x2={get2DPoint(860, 10).x} y2={get2DPoint(860, 10).y} stroke="#e57a73" strokeWidth="4" strokeLinecap="round" />
          </g>
        )
      });
    } else if (selections[3] === 'c') {
      renderList.push({
        y: 40,
        render: () => (
          <g key="crossing-strategy-signals">
            {/* Small flat signal traffic light circle */}
            <circle cx={get2DPoint(750, 40).x} cy={get2DPoint(750, 40).y} r="5" fill="#1f1d1b" stroke="#ffffff" strokeWidth="1" />
            <circle cx={get2DPoint(750, 40).x} cy={get2DPoint(750, 40).y} r="2.2" fill="#ef4444" />
          </g>
        )
      });
    }
  }

  // 5. Ecological Segment (🌿 Trees)
  renderList.push({
    y: -70,
    render: () => <FlatTree key="eco-tree-1" x={860} y={-70} size={20} color1="#3e5f4c" color2="#2d4838" />
  });
  renderList.push({
    y: -60,
    render: () => <FlatTree key="eco-tree-2" x={930} y={-60} size={22} color1="#5a7a68" color2="#3e5f4c" />
  });
  renderList.push({
    y: 65,
    render: () => (
      <g key="eco-tree-3-group" className={wigglingNode === 'ecological' ? 'animate-wiggle' : ''}>
        <FlatTree key="eco-tree-3" x={900} y={65} size={18} color1="#8ea63d" color2="#748c2b" />
      </g>
    )
  });

  // Ecology Strategy: Extra canopy trees
  if ((activeState === 'revision' || activeState === 'final') && selections[4] === 'a') {
    renderList.push({
      y: -45,
      render: () => <FlatTree key="eco-strategy-tree-1" x={875} y={-45} size={21} color1="#283e31" color2="#1b2a21" />
    });
    renderList.push({
      y: -35,
      render: () => <FlatTree key="eco-strategy-tree-2" x={915} y={-35} size={23} color1="#334f3f" color2="#24382c" />
    });
  }

  // 6. Generic Environment Decor Trees (Depth sorted)
  renderList.push({
    y: -80,
    render: () => <FlatTree key="decor-tree-1" x={100} y={-80} size={18} />
  });
  renderList.push({
    y: 80,
    render: () => <FlatTree key="decor-tree-2" x={280} y={80} size={16} />
  });
  renderList.push({
    y: -90,
    render: () => <FlatTree key="decor-tree-3" x={510} y={-90} size={20} />
  });
  renderList.push({
    y: 80,
    render: () => <FlatTree key="decor-tree-4" x={690} y={80} size={18} />
  });

  // 7. NPCs Standees (Only show in exploration mode)
  if (activeState === 'exploration') {
    npcsList.forEach(npc => {
      const isClose = playerPos !== undefined 
        ? Math.sqrt(Math.pow(playerPos.x - (npc.pct * 10), 2) + Math.pow(playerPos.y - 25, 2)) <= 45
        : (avatarPosition !== undefined && Math.abs(avatarPosition - npc.pct) <= 4.5);
      const isTalked = collectedInsights[npc.id] || false;
      const npcPos = get2DPoint(npc.pct * 10, 25);

      renderList.push({
        y: 25,
        render: () => (
          <g key={`npc-${npc.id}`} className="select-none">
            {/* Shadow */}
            <circle
              cx={npcPos.x}
              cy={npcPos.y}
              r="14"
              fill="rgba(31,29,27,0.12)"
            />

            {/* Pulsing ring if close and not talked yet */}
            {isClose && !isTalked && (
              <circle
                cx={npcPos.x}
                cy={npcPos.y}
                r="16"
                fill="none"
                stroke="var(--color-brand-yellow)"
                strokeWidth="2"
                className="animate-ping opacity-60"
                style={{ animationDuration: '1.5s' }}
              />
            )}

            {/* Avatar circle frame */}
            <circle
              cx={npcPos.x}
              cy={npcPos.y}
              r="12"
              fill={npc.color}
              stroke="#1f1d1b"
              strokeWidth="2.2"
              className="shadow-flat-pop"
            />

            {/* Avatar Image clip */}
            <g transform={`translate(${npcPos.x - 10}, ${npcPos.y - 10})`}>
              <image
                href={npc.avatar}
                width="20"
                height="20"
                clipPath="url(#npc-avatar-clip-circle)"
              />
            </g>

            {/* Name label tag */}
            <g transform={`translate(${npcPos.x}, ${npcPos.y - 18})`}>
              <rect
                x="-15"
                y="-6"
                width="30"
                height="11"
                rx="3.5"
                fill="#ffffff"
                stroke="#1f1d1b"
                strokeWidth="1.2"
                className="shadow-[1px_1px_0px_0px_#1f1d1b]"
              />
              <text
                x="0"
                y="2"
                textAnchor="middle"
                fill="#1f1d1b"
                fontSize="6.5"
                fontWeight="black"
                fontFamily="sans-serif"
              >
                {npc.name}
              </text>
            </g>

            {/* Checkmark bubble if talked */}
            {isTalked && (
              <g transform={`translate(${npcPos.x + 8}, ${npcPos.y - 8})`}>
                <circle cx="0" cy="0" r="4.5" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="1" />
                <polyline points="-2,-0.5 -0.8,1 2,-1" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}

            {/* Interactive Speech Prompt */}
            {isClose && !isTalked && (
              <g transform={`translate(${npcPos.x}, ${npcPos.y - 32})`} className="animate-bounce">
                <rect
                  x="-24"
                  y="-7"
                  width="48"
                  height="12"
                  rx="3"
                  fill="var(--color-brand-yellow)"
                  stroke="#1f1d1b"
                  strokeWidth="1.2"
                  className="shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                />
                <text
                  x="0"
                  y="1.5"
                  textAnchor="middle"
                  fill="#1f1d1b"
                  fontSize="6.5"
                  fontWeight="black"
                  fontFamily="sans-serif"
                >
                  💬 E 對話
                </text>
              </g>
            )}
          </g>
        )
      });
    });
  }

  // 8. Player Avatar Walking Sprite
  if (avatarCoords && playerRole && (activeState === 'exploration' || playerPos !== undefined)) {
    renderList.push({
      y: playerPos ? playerPos.y : 25,
      render: () => (
        <g
          key="player-avatar"
          transform={`translate(${avatarCoords.x}, ${avatarCoords.y})`}
          className="transition-all duration-300 ease-out"
        >
          {/* Shadow */}
          <circle
            cx="0"
            cy="2"
            r="14"
            fill="rgba(31,29,27,0.18)"
          />
          <circle
            cx="0"
            cy="0"
            r="14"
            fill="#ffffff"
            stroke="#1f1d1b"
            strokeWidth="2.5"
            className="shadow-[2px_2px_0px_0px_#1f1d1b]"
          />
          <g transform="translate(-14, -14)">
            <clipPath id="avatar-clip-25d-v2">
              <circle cx="14" cy="14" r="12.5" />
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
              width="28"
              height="28"
              clipPath="url(#avatar-clip-25d-v2)"
              className="scale-110"
            />
          </g>
          {/* Label tag */}
          <g transform={`translate(0, -24)`}>
            <rect
              x="-20"
              y="-6"
              width="40"
              height="11"
              rx="3"
              fill="var(--color-brand-coral)"
              stroke="#1f1d1b"
              strokeWidth="1.2"
              className="shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            />
            <text
              x="0"
              y="2"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="6"
              fontWeight="black"
              fontFamily="sans-serif"
            >
              YOU (您)
            </text>
          </g>
        </g>
      )
    });
  }

  // 11. Crossing Sign Pole (physical inspectable object for crossing segment)
  renderList.push({
    y: 20,
    render: () => (
      <FlatCrossingSign key="crossing-sign-pole" x={770} y={20} />
    )
  });

  // Sort Middle Layer entities by Y coordinate (Y-Sorting Depth Occlusion)
  renderList.sort((a, b) => a.y - b.y);

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#FAF8F5] border-3 border-[#1f1d1b] rounded-2xl shadow-flat-pop">
      {/* Grid Pattern Overlay in background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(31,29,27,0.05)_1.5px,transparent_1.5px)] bg-[size:20px_20px] pointer-events-none z-0" />

      {/* SVG Canvas */}
      <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="w-full h-full relative z-10">
        <defs>
          <clipPath id="npc-avatar-clip-circle">
            <circle cx="10" cy="10" r="9.5" />
          </clipPath>
        </defs>

        {/* 1. Flat Zoning Slabs */}
        {/* Segment 0: 住宅段 (Beige) */}
        <rect x={30} y={30} width={250} height={460} fill="#f5efe1" stroke="#1f1d1b" strokeWidth="2.5" />
        {/* Segment 1: 商業段 (Warm Yellow) */}
        <rect x={280} y={30} width={200} height={460} fill="#fbf6e2" stroke="#1f1d1b" strokeWidth="2.5" />
        {/* Segment 2: 車站節點 (Transit Blue) */}
        <rect x={480} y={30} width={200} height={460} fill="#ebf3f7" stroke="#1f1d1b" strokeWidth="2.5" />
        {/* Segment 3: 主要路口 (Slate Grey) */}
        <rect x={680} y={30} width={140} height={460} fill="#f1f3f5" stroke="#1f1d1b" strokeWidth="2.5" />
        {/* Segment 4: 生態綠帶段 (Natural Green) */}
        <rect x={820} y={30} width={150} height={460} fill="#edf3ed" stroke="#1f1d1b" strokeWidth="2.5" />

        {/* Major Tainan Parkway Segment Headers (Reference: tainanparkway.org/latest_design) */}
        {/* 北段 Block */}
        <g>
          <rect x={32} y={35} width={446} height={20} rx="4" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="1.8" className="shadow-[1.5px_1.5px_0px_0px_#1f1d1b]" />
          <text x={255} y={48} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="black" fontFamily="sans-serif">
            【北段】三校共構全綠帶公園 (和緯路 - 小東路)
          </text>
        </g>
        {/* 中段 Block */}
        <g>
          <rect x={482} y={35} width={196} height={20} rx="4" fill="#de7861" stroke="#1f1d1b" strokeWidth="1.8" className="shadow-[1.5px_1.5px_0px_0px_#1f1d1b]" />
          <text x={580} y={48} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="black" fontFamily="sans-serif">
            【中段】府城人文地景散策 (小東路 - 民族路)
          </text>
        </g>
        {/* 南段 Block */}
        <g>
          <rect x={682} y={35} width={286} height={20} rx="4" fill="#4d7082" stroke="#1f1d1b" strokeWidth="1.8" className="shadow-[1.5px_1.5px_0px_0px_#1f1d1b]" />
          <text x={825} y={48} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="black" fontFamily="sans-serif">
            【南段】市民綠色大道 (民族路 - 生產路)
          </text>
        </g>

        {/* 2. CONTINUOUS GREENWAY ROADBED/PATHS */}
        {/* Grass lawn lane */}
        <path
          d={getWindingPathD(-28)}
          stroke="#acd0a2"
          strokeWidth="24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Pedestrian walking path */}
        <path
          d={getWindingPathD(25)}
          stroke="#ebdcb9"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={getWindingPathD(25)}
          stroke="#dfcfab"
          strokeWidth="18"
          strokeDasharray="1,12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
        {/* Bicycle lane */}
        <path
          d={getWindingPathD(-2)}
          stroke="#c7dce7"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={getWindingPathD(-2)}
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeDasharray="4,6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Rain garden strategy decorations */}
        {selections[4] === 'b' && (
          <rect x={870} y={230} width={60} height={25} rx="12" fill="#87b8d4" stroke="#1f1d1b" strokeWidth="1.5" />
        )}
        {selections[4] === 'c' && (
          <path
            d="M 850,260 Q 890,220 940,245"
            fill="none"
            stroke="#79afd3"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.85"
          />
        )}
        
        {/* Road intersection asphalt band */}
        <rect x={755} y={30} width={45} height={460} fill="#374151" stroke="#1f1d1b" strokeWidth="1.5" />
        {/* Zebra crossing markings */}
        <FlatZebraCrossing x={777} y={260} w={40} d={120} />

        {selections[3] === 'b' && (
          <rect x={757} y={220} width={41} height={80} fill="#8ea63d" stroke="#1f1d1b" strokeWidth="1" opacity="0.3" />
        )}
        
        {selections[1] === 'a' && (
          <path
            d={getWindingPathD(5).split(' L').slice(60, 100).join(' L')}
            stroke="#dfd9c8"
            strokeWidth="22"
            fill="none"
            strokeLinejoin="round"
            opacity="0.8"
          />
        )}
        {selections[1] === 'c' && (
          <rect x={395} y={280} width={50} height={20} rx="4" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
        )}

        {selections[2] === 'b' && (
          <g>
            <circle cx={get2DPoint(640, 25).x} cy={get2DPoint(640, 25).y} r="20" fill="#e5e7eb" stroke="#1f1d1b" strokeWidth="1.2" />
            <circle cx={get2DPoint(640, 25).x} cy={get2DPoint(640, 25).y} r="8" fill="#93c5fd" stroke="#1f1d1b" strokeWidth="1" />
          </g>
        )}

        {/* Proposed Continuous Elevated Bike Path - Shown in initial/exploration states */}
        {(activeState === 'initial' || activeState === 'exploration') && (
          <g>
            <path
              d={getWindingPathD(-4)}
              stroke="#d37b70"
              strokeWidth="4"
              strokeDasharray="4,4"
              fill="none"
              opacity="0.55"
            />
          </g>
        )}

        {/* 3. MIDDLE DEPTH-SORTED RENDER LAYER */}
        {renderList.map(item => item.render())}

        {/* 4. FOREGROUND INTERACTIVE SEGMENT BADGES */}
        {segments.map(seg => {
          const isSelected = activeSegmentId === seg.id;
          const hasInsight = getSegmentCollected(seg.id);
          const anchorPoint = get2DPoint(seg.x, 60);

          return (
            <g
              key={seg.id}
              className={`group ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => interactive && onSegmentClick && onSegmentClick(seg.id)}
            >
              {isSelected && (
                <circle
                  cx={anchorPoint.x}
                  cy={anchorPoint.y}
                  r="20"
                  fill="none"
                  stroke="var(--color-brand-coral)"
                  strokeWidth="2"
                  className="animate-ping opacity-50"
                  style={{ animationDuration: '2s' }}
                />
              )}
              <line
                x1={anchorPoint.x}
                y1={anchorPoint.y}
                x2={anchorPoint.x}
                y2={anchorPoint.y - 25}
                stroke="#1f1d1b"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx={anchorPoint.x}
                cy={anchorPoint.y}
                r="3.5"
                fill={hasInsight ? '#8ea63d' : '#1f1d1b'}
                stroke="#1f1d1b"
                strokeWidth="1.2"
              />
              <circle
                cx={anchorPoint.x}
                cy={anchorPoint.y - 25}
                r="10"
                fill={isSelected ? '#f3ce6b' : hasInsight ? '#8ea63d' : '#ffffff'}
                stroke="#1f1d1b"
                strokeWidth="2"
                className="transition-transform duration-200 group-hover:scale-110 shadow-flat-pop"
              />
              <text
                x={anchorPoint.x}
                y={anchorPoint.y - 22}
                textAnchor="middle"
                fontSize="9"
                className="select-none pointer-events-none"
              >
                {seg.icon}
              </text>
              <g transform={`translate(${anchorPoint.x}, ${anchorPoint.y - 42})`}>
                <rect
                  x="-28"
                  y="-9"
                  width="56"
                  height="15"
                  rx="3.5"
                  fill="#ffffff"
                  stroke={isSelected ? 'var(--color-brand-coral)' : '#1f1d1b'}
                  strokeWidth="1.8"
                  className="shadow-[1px_1px_0px_0px_#1f1d1b]"
                />
                <text
                  x="0"
                  y="1.5"
                  textAnchor="middle"
                  fill="#1f1d1b"
                  fontSize="7.5"
                  fontWeight="black"
                  fontFamily="sans-serif"
                >
                  {seg.name}
                </text>
              </g>

              {/* Pulsing warning conflict marker */}
              {!hasInsight && activeState === 'exploration' && (
                <g transform={`translate(${anchorPoint.x + 12}, ${anchorPoint.y - 32})`} className="animate-pulse">
                  <circle cx="0" cy="0" r="5.5" fill="#f3ce6b" stroke="#1f1d1b" strokeWidth="1" />
                  <text x="0" y="2.5" textAnchor="middle" fill="#1f1d1b" fontSize="7" fontWeight="black">!</text>
                </g>
              )}

              {/* Selected Strategy Tag Badge */}
              {selections[seg.id] && (
                <g transform={`translate(${anchorPoint.x}, ${anchorPoint.y + 12})`}>
                  <rect
                    x="-36"
                    y="-5"
                    width="72"
                    height="10"
                    rx="2"
                    fill="#e2f0d9"
                    stroke="#1f1d1b"
                    strokeWidth="1"
                    className="shadow-[1px_1px_0px_0px_#1f1d1b]"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fill="#3e5f4c"
                    fontSize="6"
                    fontWeight="extrabold"
                    fontFamily="sans-serif"
                  >
                    {seg.id === 0 ? (selections[0] === 'a' ? '平面慢行' : selections[0] === 'b' ? '局部高架+綠牆' : '安寧緩衝帶') :
                     seg.id === 1 ? (selections[1] === 'a' ? '地面共享街' : selections[1] === 'b' ? '單車停靠點' : selections[1] === 'c' ? '遮蔭廣場' : '外送臨停區') :
                     seg.id === 2 ? (selections[2] === 'a' ? 'YouBike轉乘' : selections[2] === 'b' ? '行人優先廣場' : '慢行交通區') :
                     seg.id === 3 ? (selections[3] === 'a' ? '局部高架跨越' : selections[3] === 'b' ? '保護平面跨越' : '人車分流號誌') :
                     (selections[4] === 'a' ? '連續樹冠' : selections[4] === 'b' ? '雨水花園' : selections[4] === 'c' ? '透水鋪面' : '生態降溫廊')}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* HUD Station indicators */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between z-20 pointer-events-none text-[8.5px] font-mono font-bold text-gray-500 bg-white/70 px-2 py-0.5 rounded border border-gray-200">
        <span>STA 0+000 (起點 / 住宅段)</span>
        <span>STA 0+700 (車站節點)</span>
        <span>STA 1+400 (終點 / 生態綠帶段)</span>
      </div>
    </div>
  );
};
