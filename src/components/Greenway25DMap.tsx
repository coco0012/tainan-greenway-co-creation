import React from 'react';
import { StakeholderRole } from '@/data/roles';

interface Greenway25DMapProps {
  activeSegmentId?: number;
  avatarPosition?: number; // 0 to 100
  playerRole?: StakeholderRole;
  selections?: Record<number, string>; // selected options (e.g. {0: 'a', 1: 'b'})
  collectedInsights?: Record<number | string, boolean>;
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
  // SVG Canvas configuration
  const canvasWidth = 1000;
  const canvasHeight = 520;

  // Floating Board Slab baseline positioning
  const startX = 80;
  const startY = 410;
  const endX = 920;
  const endY = 130;

  // 1. Isometric Projection Helper
  // Converts 3D model space coordinates (x, yOffset, z) to 2D screen coordinates (screenX, screenY).
  // x: 0 to 1000 (distance along the diagonal corridor)
  // yOffset: -120 to 120 (perpendicular offset from the center spine; negative is back, positive is front)
  // z: vertical height above ground plane
  const getIsoPoint = (x: number, yOffset: number, z: number = 0) => {
    const ratio = x / 1000;
    const baseX = startX + (endX - startX) * ratio;
    const baseY = startY + (endY - startY) * ratio;

    // Organic S-curve winding offset (wiggle) running along the corridor
    const wiggle = Math.sin(ratio * Math.PI * 2) * 35;
    const y = yOffset + wiggle;

    // Perpendicular mapping vectors:
    return {
      x: baseX - y * 0.65,
      y: baseY + y * 0.38 - z
    };
  };

  // 2. Segments Configuration
  const segments = [
    { id: 0, name: '住宅段', x: 200, icon: '🏡', detailZh: '低矮透天與陽台隱私' },
    { id: 1, name: '商業段', x: 420, icon: '🛍️', detailZh: '店家活絡與人車共享' },
    { id: 2, name: '車站節點', x: 620, icon: '🚂', detailZh: 'YouBike與大眾轉乘' },
    { id: 3, name: '主要路口', x: 780, icon: '🚦', detailZh: '道路穿越與立體分流' },
    { id: 4, name: '生態綠帶段', x: 900, icon: '🌿', detailZh: '大樹降溫與雨水花園' }
  ];

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
    return getIsoPoint(pct * 10, 25);
  };

  const avatarCoords = avatarPosition !== undefined ? getCoordinatesAtPct(avatarPosition) : null;
  const avatarBobZ = avatarPosition !== undefined ? Math.abs(Math.sin(avatarPosition * 0.5)) * 4.5 : 0;

  // --- SUB-COMPONENTS FOR DRAWING 3D SHAPES ---

  // 3D Box (Flat Roof)
  const IsoBox: React.FC<{
    x: number;
    y: number;
    w: number;
    d: number;
    h: number;
    zOffset?: number;
    fillTop: string;
    fillLeft: string;
    fillFront: string;
    stroke?: string;
    strokeWidth?: number;
    onClick?: () => void;
  }> = ({ x, y, w, d, h, zOffset = 0, fillTop, fillLeft, fillFront, stroke = '#1f1d1b', strokeWidth = 1.5, onClick }) => {
    const pBLB = getIsoPoint(x - w / 2, y - d / 2, zOffset); // back-left base
    const pFLB = getIsoPoint(x - w / 2, y + d / 2, zOffset); // front-left base
    const pFRB = getIsoPoint(x + w / 2, y + d / 2, zOffset); // front-right base
    const pBRB = getIsoPoint(x + w / 2, y - d / 2, zOffset); // back-right base

    const pBLT = getIsoPoint(x - w / 2, y - d / 2, zOffset + h); // back-left top
    const pFLT = getIsoPoint(x - w / 2, y + d / 2, zOffset + h); // front-left top
    const pFRT = getIsoPoint(x + w / 2, y + d / 2, zOffset + h); // front-right top
    const pBRT = getIsoPoint(x + w / 2, y - d / 2, zOffset + h); // back-right top

    return (
      <g onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
        {/* Left Face */}
        <polygon
          points={`${pBLB.x},${pBLB.y} ${pFLB.x},${pFLB.y} ${pFLT.x},${pFLT.y} ${pBLT.x},${pBLT.y}`}
          fill={fillLeft}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* Front Face */}
        <polygon
          points={`${pFLB.x},${pFLB.y} ${pFRB.x},${pFRB.y} ${pFRT.x},${pFRT.y} ${pFLT.x},${pFLT.y}`}
          fill={fillFront}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* Top Face */}
        <polygon
          points={`${pBLT.x},${pBLT.y} ${pBRT.x},${pBRT.y} ${pFRT.x},${pFRT.y} ${pFLT.x},${pFLT.y}`}
          fill={fillTop}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
    );
  };

  // 3D Pitched Roof House
  const PitchedRoofHouse: React.FC<{
    x: number;
    y: number;
    w: number;
    d: number;
    h: number;
    fillWallLeft: string;
    fillWallFront: string;
    fillRoofLeft: string;
    fillRoofFront: string;
  }> = ({ x, y, w, d, h, fillWallLeft, fillWallFront, fillRoofLeft, fillRoofFront }) => {
    const pBLB = getIsoPoint(x - w / 2, y - d / 2, 0);
    const pFLB = getIsoPoint(x - w / 2, y + d / 2, 0);
    const pFRB = getIsoPoint(x + w / 2, y + d / 2, 0);

    const pBLT = getIsoPoint(x - w / 2, y - d / 2, h);
    const pFLT = getIsoPoint(x - w / 2, y + d / 2, h);
    const pFRT = getIsoPoint(x + w / 2, y + d / 2, h);

    // Ridge points
    const roofH = d * 0.45;
    const pRidgeL = getIsoPoint(x - w / 2, y, h + roofH);
    const pRidgeR = getIsoPoint(x + w / 2, y, h + roofH);

    return (
      <g>
        {/* Left Side Wall */}
        <polygon
          points={`${pBLB.x},${pBLB.y} ${pFLB.x},${pFLB.y} ${pFLT.x},${pFLT.y} ${pBLT.x},${pBLT.y}`}
          fill={fillWallLeft}
          stroke="#1f1d1b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Front Wall */}
        <polygon
          points={`${pFLB.x},${pFLB.y} ${pFRB.x},${pFRB.y} ${pFRT.x},${pFRT.y} ${pFLT.x},${pFLT.y}`}
          fill={fillWallFront}
          stroke="#1f1d1b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Roof Left Triangle Gable */}
        <polygon
          points={`${pBLT.x},${pBLT.y} ${pFLT.x},${pFLT.y} ${pRidgeL.x},${pRidgeL.y}`}
          fill={fillRoofLeft}
          stroke="#1f1d1b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Roof Front Slope */}
        <polygon
          points={`${pFLT.x},${pFLT.y} ${pFRT.x},${pFRT.y} ${pRidgeR.x},${pRidgeR.y} ${pRidgeL.x},${pRidgeL.y}`}
          fill={fillRoofFront}
          stroke="#1f1d1b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
    );
  };

  // Isometric 3D Tree
  const IsoTree: React.FC<{
    x: number;
    y: number;
    size?: number;
    color1?: string;
    color2?: string;
  }> = ({ x, y, size = 18, color1 = '#5a7a68', color2 = '#445f50' }) => {
    const pBase = getIsoPoint(x, y, 0);
    const pTrunkTop = getIsoPoint(x, y, size * 0.8);
    const pCanopyCenter = getIsoPoint(x, y, size * 1.4);

    return (
      <g>
        {/* Trunk Shadow */}
        <ellipse
          cx={pBase.x}
          cy={pBase.y}
          rx={size * 0.75}
          ry={size * 0.35}
          fill="rgba(31,29,27,0.12)"
        />
        {/* Trunk line */}
        <line
          x1={pBase.x}
          y1={pBase.y}
          x2={pTrunkTop.x}
          y2={pTrunkTop.y}
          stroke="#6e4f37"
          strokeWidth={size / 4}
          strokeLinecap="round"
        />
        {/* Canopy spheres */}
        <circle
          cx={pCanopyCenter.x}
          cy={pCanopyCenter.y}
          r={size}
          fill={color1}
          stroke="#1f1d1b"
          strokeWidth="1.5"
        />
        <circle
          cx={pCanopyCenter.x - size * 0.25}
          cy={pCanopyCenter.y - size * 0.25}
          r={size * 0.7}
          fill={color2}
          opacity="0.8"
        />
        {/* Highlight circle */}
        <circle
          cx={pCanopyCenter.x - size * 0.4}
          cy={pCanopyCenter.y - size * 0.4}
          r={size * 0.3}
          fill="#ffffff"
          opacity="0.2"
        />
      </g>
    );
  };

  const drawFrontDoor = (x: number, y: number, z: number, w: number, h: number, fill: string = '#8a6245') => {
    const pFL = getIsoPoint(x - w / 2, y, z);
    const pFR = getIsoPoint(x + w / 2, y, z);
    const pTR = getIsoPoint(x + w / 2, y, z + h);
    const pTL = getIsoPoint(x - w / 2, y, z + h);
    return (
      <polygon
        points={`${pFL.x},${pFL.y} ${pFR.x},${pFR.y} ${pTR.x},${pTR.y} ${pTL.x},${pTL.y}`}
        fill={fill}
        stroke="#1f1d1b"
        strokeWidth="1.2"
      />
    );
  };

  const drawFrontWindow = (x: number, y: number, z: number, w: number, h: number, fill: string = '#cce3f0') => {
    const pFL = getIsoPoint(x - w / 2, y, z);
    const pFR = getIsoPoint(x + w / 2, y, z);
    const pTR = getIsoPoint(x + w / 2, y, z + h);
    const pTL = getIsoPoint(x - w / 2, y, z + h);
    return (
      <polygon
        points={`${pFL.x},${pFL.y} ${pFR.x},${pFR.y} ${pTR.x},${pTR.y} ${pTL.x},${pTL.y}`}
        fill={fill}
        stroke="#1f1d1b"
        strokeWidth="1.2"
      />
    );
  };

  const getWindingPathD = (yOffset: number) => {
    let d = '';
    for (let x = 30; x <= 970; x += 15) {
      const pt = getIsoPoint(x, yOffset, 0);
      d += `${x === 30 ? 'M' : 'L'} ${pt.x} ${pt.y} `;
    }
    return d;
  };

  const getElevatedBridgeD = (xStart: number, xEnd: number, yOffset: number, z: number) => {
    let d = '';
    for (let x = xStart; x <= xEnd; x += 15) {
      const pt = getIsoPoint(x, yOffset, z);
      d += `${x === xStart ? 'M' : 'L'} ${pt.x} ${pt.y} `;
    }
    return d;
  };

  const pSlabBackLeft = getIsoPoint(30, -110, 0);
  const pSlabBackRight = getIsoPoint(970, -110, 0);
  const pSlabFrontRight = getIsoPoint(970, 110, 0);
  const pSlabFrontLeft = getIsoPoint(30, 110, 0);

  const slabDepth = 35;
  const pSlabFrontRightB = getIsoPoint(970, 110, -slabDepth);
  const pSlabFrontLeftB = getIsoPoint(30, 110, -slabDepth);
  const pSlabBackLeftB = getIsoPoint(30, -110, -slabDepth);

  const renderGridLines = () => {
    const lines = [];
    for (let x = 100; x <= 900; x += 50) {
      const p1 = getIsoPoint(x, -110, 0);
      const p2 = getIsoPoint(x, 110, 0);
      lines.push(
        <line
          key={`grid-x-${x}`}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          stroke="#1f1d1b"
          strokeWidth="0.5"
          opacity="0.08"
        />
      );
    }
    for (let y = -90; y <= 90; y += 30) {
      const p1 = getIsoPoint(30, y, 0);
      const p2 = getIsoPoint(970, y, 0);
      lines.push(
        <line
          key={`grid-y-${y}`}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          stroke="#1f1d1b"
          strokeWidth="0.5"
          opacity="0.08"
        />
      );
    }
    return lines;
  };

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#FAF8F5] border-3 border-[#1f1d1b] rounded-2xl shadow-flat-pop">
      {/* Grid Pattern Overlay in background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(31,29,27,0.05)_1.5px,transparent_1.5px)] bg-[size:20px_20px] pointer-events-none z-0" />

      {/* SVG Canvas */}
      <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="metal-bridge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e57a73" />
            <stop offset="100%" stopColor="#c55a53" />
          </linearGradient>
          <linearGradient id="water-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#add1e6" />
            <stop offset="100%" stopColor="#87b8d4" />
          </linearGradient>
          <clipPath id="npc-avatar-clip-circle">
            <circle cx="10" cy="10" r="9.5" />
          </clipPath>
        </defs>

        {/* 1. 3D ISOMETRIC GROUND SLAB (FLOATING ISLAND BASE) */}
        <polygon
          points={`${pSlabBackLeft.x},${pSlabBackLeft.y} ${pSlabFrontLeft.x},${pSlabFrontLeft.y} ${pSlabFrontLeftB.x},${pSlabFrontLeftB.y} ${pSlabBackLeftB.x},${pSlabBackLeftB.y}`}
          fill="#c3bead"
          stroke="#1f1d1b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points={`${pSlabFrontLeft.x},${pSlabFrontLeft.y} ${pSlabFrontRight.x},${pSlabFrontRight.y} ${pSlabFrontRightB.x},${pSlabFrontRightB.y} ${pSlabFrontLeftB.x},${pSlabFrontLeftB.y}`}
          fill="#a59f8c"
          stroke="#1f1d1b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points={`${pSlabBackLeft.x},${pSlabBackLeft.y} ${pSlabBackRight.x},${pSlabBackRight.y} ${pSlabFrontRight.x},${pSlabFrontRight.y} ${pSlabFrontLeft.x},${pSlabFrontLeft.y}`}
          fill="#eae6d8"
          stroke="#1f1d1b"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {renderGridLines()}

        {/* 2. CONTINUOUS GREENWAY ROADBED/PATHS */}
        <path
          d={getWindingPathD(-28)}
          stroke="#acd0a2"
          strokeWidth="24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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

        {/* ========================================================
            3. DYNAMIC POLICY DECORS AND STRATEGY VISUALIZATIONS
            ======================================================== */}

        {/* ---------------- ECOLOGICAL SEGMENT (X: 900) ---------------- */}
        <IsoTree x={860} y={-70} size={20} color1="#3e5f4c" color2="#2d4838" />
        <IsoTree x={930} y={-60} size={22} color1="#5a7a68" color2="#3e5f4c" />
        <IsoTree x={900} y={65} size={18} color1="#8ea63d" color2="#748c2b" />

        {selections[4] === 'a' ? (
          <g>
            <IsoTree x={875} y={-45} size={21} color1="#283e31" color2="#1b2a21" />
            <IsoTree x={915} y={-35} size={23} color1="#334f3f" color2="#24382c" />
            <path
              d={getElevatedBridgeD(850, 940, 20, 0)}
              stroke="rgba(31,29,27,0.14)"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ) : selections[4] === 'b' ? (
          <g>
            <polygon
              points={`
                ${getIsoPoint(860, -35).x},${getIsoPoint(860, -35).y}
                ${getIsoPoint(920, -50).x},${getIsoPoint(920, -50).y}
                ${getIsoPoint(940, -20).x},${getIsoPoint(940, -20).y}
                ${getIsoPoint(875, -10).x},${getIsoPoint(875, -10).y}
              `}
              fill="url(#water-gradient)"
              stroke="#1f1d1b"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle cx={getIsoPoint(865, -34).x} cy={getIsoPoint(865, -34).y} r="3" fill="#9ca3af" stroke="#1f1d1b" strokeWidth="1" />
            <circle cx={getIsoPoint(932, -43).x} cy={getIsoPoint(932, -43).y} r="4.5" fill="#78716c" stroke="#1f1d1b" strokeWidth="1" />
            <circle cx={getIsoPoint(882, -12).x} cy={getIsoPoint(882, -12).y} r="2.5" fill="#9ca3af" stroke="#1f1d1b" strokeWidth="1" />
          </g>
        ) : selections[4] === 'c' ? (
          <g>
            <path
              d="M 850,210 Q 890,170 940,195"
              fill="none"
              stroke="#79afd3"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              opacity="0.85"
            />
            <path
              d="M 860,160 Q 900,120 950,145"
              fill="none"
              stroke="#79afd3"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              opacity="0.85"
            />
          </g>
        ) : null}

        {/* ---------------- MAJOR ROAD CROSSING (X: 780) ---------------- */}
        <polygon
          points={`
            ${getIsoPoint(755, -110).x},${getIsoPoint(755, -110).y}
            ${getIsoPoint(800, -110).x},${getIsoPoint(800, -110).y}
            ${getIsoPoint(800, 110).x},${getIsoPoint(800, 110).y}
            ${getIsoPoint(755, 110).x},${getIsoPoint(755, 110).y}
          `}
          fill="#374151"
          stroke="#1f1d1b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <line x1={getIsoPoint(762, -15).x} y1={getIsoPoint(762, -15).y} x2={getIsoPoint(792, -32).x} y2={getIsoPoint(792, -32).y} stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1={getIsoPoint(767, 10).x} y1={getIsoPoint(767, 10).y} x2={getIsoPoint(797, -7).x} y2={getIsoPoint(797, -7).y} stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1={getIsoPoint(772, 35).x} y1={getIsoPoint(772, 35).y} x2={getIsoPoint(802, 18).x} y2={getIsoPoint(802, 18).y} stroke="#ffffff" strokeWidth="3" opacity="0.9" />

        <line x1={getIsoPoint(758, -75).x} y1={getIsoPoint(758, -75).y} x2={getIsoPoint(798, -95).x} y2={getIsoPoint(798, -95).y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1={getIsoPoint(758, 75).x} y1={getIsoPoint(758, 75).y} x2={getIsoPoint(798, 55).x} y2={getIsoPoint(798, 55).y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />

        {selections[3] === 'a' ? (
          <g>
            <line x1={getIsoPoint(720, -2, 0).x} y1={getIsoPoint(720, -2, 0).y} x2={getIsoPoint(720, -2, 45).x} y2={getIsoPoint(720, -2, 45).y} stroke="#1f1d1b" strokeWidth="3.5" />
            <line x1={getIsoPoint(835, -2, 0).x} y1={getIsoPoint(835, -2, 0).y} x2={getIsoPoint(835, -2, 45).x} y2={getIsoPoint(835, -2, 45).y} stroke="#1f1d1b" strokeWidth="3.5" />
            <path
              d={getElevatedBridgeD(695, 860, 15, 0)}
              stroke="rgba(31,29,27,0.18)"
              strokeWidth="11"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={getElevatedBridgeD(695, 860, -2, 45)}
              stroke="#1f1d1b"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={getElevatedBridgeD(695, 860, -2, 45)}
              stroke="url(#metal-bridge)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M ${getIsoPoint(720, -2, 45).x} ${getIsoPoint(720, -2, 45).y} Q ${getIsoPoint(780, -2, 75).x} ${getIsoPoint(780, -2, 75).y} ${getIsoPoint(835, -2, 45).x} ${getIsoPoint(835, -2, 45).y}`}
              fill="none"
              stroke="#1f1d1b"
              strokeWidth="2"
            />
          </g>
        ) : selections[3] === 'b' ? (
          <g>
            <polygon
              points={`
                ${getIsoPoint(757, -15).x},${getIsoPoint(757, -15).y}
                ${getIsoPoint(798, -35).x},${getIsoPoint(798, -35).y}
                ${getIsoPoint(798, 12).x},${getIsoPoint(798, 12).y}
                ${getIsoPoint(757, 32).x},${getIsoPoint(757, 32).y}
              `}
              fill="#8ea63d"
              stroke="#1f1d1b"
              strokeWidth="1"
              opacity="0.55"
            />
          </g>
        ) : selections[3] === 'c' ? (
          <g>
            <line x1={getIsoPoint(750, 40, 0).x} y1={getIsoPoint(750, 40, 0).y} x2={getIsoPoint(750, 40, 35).x} y2={getIsoPoint(750, 40, 35).y} stroke="#374151" strokeWidth="2" />
            <rect x={getIsoPoint(750, 40, 35).x - 3} y={getIsoPoint(750, 40, 35).y - 8} width="6" height="10" rx="1" fill="#1f1d1b" stroke="#ffffff" strokeWidth="0.5" />
            <circle cx={getIsoPoint(750, 40, 35).x} cy={getIsoPoint(750, 40, 35).y - 5} r="1.8" fill="#ef4444" />
            <circle cx={getIsoPoint(750, 40, 35).x} cy={getIsoPoint(750, 40, 35).y - 1} r="1.8" fill="#10b981" />
          </g>
        ) : null}

        {/* ---------------- STATION NODE (X: 620) ---------------- */}
        <IsoBox
          x={620}
          y={-75}
          w={70}
          d={45}
          h={60}
          fillTop="#dceaf5"
          fillLeft="#b2c9db"
          fillFront="#c7dbe8"
        />
        <polygon
          points={`
            ${getIsoPoint(600, -52.5, 0).x},${getIsoPoint(600, -52.5, 0).y}
            ${getIsoPoint(640, -52.5, 0).x},${getIsoPoint(640, -52.5, 0).y}
            ${getIsoPoint(640, -52.5, 30).x},${getIsoPoint(640, -52.5, 30).y}
            ${getIsoPoint(600, -52.5, 30).x},${getIsoPoint(600, -52.5, 30).y}
          `}
          fill="#1e293b"
          stroke="#1f1d1b"
          strokeWidth="1.5"
        />
        <IsoBox
          x={580}
          y={-75}
          w={22}
          d={22}
          h={95}
          fillTop="#a5c4db"
          fillLeft="#769bb7"
          fillFront="#8cb1cc"
        />
        <circle
          cx={getIsoPoint(580, -64, 82).x}
          cy={getIsoPoint(580, -64, 82).y}
          r="4.5"
          fill="#ffffff"
          stroke="#1f1d1b"
          strokeWidth="1.2"
        />

        {selections[2] === 'a' ? (
          <g>
            <IsoBox x={665} y={35} w={30} d={12} h={25} fillTop="#ef4444" fillLeft="#991b1b" fillFront="#dc2626" />
            <line x1={getIsoPoint(600, 40, 0).x} y1={getIsoPoint(600, 40, 0).y} x2={getIsoPoint(630, 28, 0).x} y2={getIsoPoint(630, 28, 0).y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : selections[2] === 'b' ? (
          <g>
            <ellipse
              cx={getIsoPoint(640, 25, 0).x}
              cy={getIsoPoint(640, 25, 0).y}
              rx="30"
              ry="15"
              fill="#e5e7eb"
              stroke="#1f1d1b"
              strokeWidth="1.2"
            />
            <ellipse
              cx={getIsoPoint(640, 25, 0).x}
              cy={getIsoPoint(640, 25, 0).y}
              rx="12"
              ry="6"
              fill="#93c5fd"
              stroke="#1f1d1b"
              strokeWidth="1"
            />
          </g>
        ) : selections[2] === 'c' ? (
          <g>
            <line x1={getIsoPoint(610, 30, 0).x} y1={getIsoPoint(610, 30, 0).y} x2={getIsoPoint(610, 30, 35).x} y2={getIsoPoint(610, 30, 35).y} stroke="#1f1d1b" strokeWidth="2.5" />
          </g>
        ) : null}

        {/* ---------------- COMMERCIAL SEGMENT (X: 420) ---------------- */}
        <PitchedRoofHouse
          x={380}
          y={-70}
          w={45}
          d={32}
          h={42}
          fillWallLeft="#fef3c7"
          fillWallFront="#faf0d8"
          fillRoofLeft="#d97706"
          fillRoofFront="#f59e0b"
        />
        <polygon
          points={`
            ${getIsoPoint(358, -44, 20).x},${getIsoPoint(358, -44, 20).y}
            ${getIsoPoint(402, -44, 20).x},${getIsoPoint(402, -44, 20).y}
            ${getIsoPoint(402, -44, 16).x},${getIsoPoint(402, -44, 16).y}
            ${getIsoPoint(358, -44, 16).x},${getIsoPoint(358, -44, 16).y}
          `}
          fill="#ffffff"
          stroke="#1f1d1b"
          strokeWidth="1.2"
        />
        {drawFrontDoor(380, -54, 0, 10, 18, '#8a5c38')}
        {drawFrontWindow(364, -54, 12, 10, 10, '#c2e3f4')}

        <PitchedRoofHouse
          x={445}
          y={-70}
          w={42}
          d={32}
          h={44}
          fillWallLeft="#fee2e2"
          fillWallFront="#fde8e8"
          fillRoofLeft="#b91c1c"
          fillRoofFront="#dc2626"
        />
        {drawFrontDoor(445, -54, 0, 9, 18, '#1e293b')}

        {selections[1] === 'a' ? (
          <g>
            <path
              d={getElevatedBridgeD(350, 480, 5, 0)}
              stroke="#dfd9c8"
              strokeWidth="22"
              fill="none"
              strokeLinejoin="round"
              opacity="0.8"
            />
          </g>
        ) : selections[1] === 'b' ? (
          <g>
            <line x1={getIsoPoint(420, 30, 0).x} y1={getIsoPoint(420, 30, 0).y} x2={getIsoPoint(420, 30, 32).x} y2={getIsoPoint(420, 30, 32).y} stroke="#1f1d1b" strokeWidth="1.5" />
            <IsoBox x={395} y={28} w={15} d={6} h={8} fillTop="#d97706" fillLeft="#b45309" fillFront="#d97706" />
          </g>
        ) : selections[1] === 'c' ? (
          <g>
            <polygon
              points={`
                ${getIsoPoint(395, 35).x},${getIsoPoint(395, 35).y}
                ${getIsoPoint(445, 15).x},${getIsoPoint(445, 15).y}
                ${getIsoPoint(455, 35).x},${getIsoPoint(455, 35).y}
                ${getIsoPoint(405, 55).x},${getIsoPoint(405, 55).y}
              `}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
          </g>
        ) : null}

        {/* ---------------- RESIDENTIAL SEGMENT (X: 200) ---------------- */}
        <PitchedRoofHouse
          x={175}
          y={-70}
          w={42}
          d={32}
          h={48}
          fillWallLeft="#fbc4c6"
          fillWallFront="#fadbdc"
          fillRoofLeft="#b91c1c"
          fillRoofFront="#e17b70"
        />
        {drawFrontDoor(175, -54, 0, 9, 17, '#78350f')}

        <PitchedRoofHouse
          x={235}
          y={-75}
          w={45}
          d={32}
          h={62}
          fillWallLeft="#fbc4c6"
          fillWallFront="#fadbdc"
          fillRoofLeft="#b91c1c"
          fillRoofFront="#e17b70"
        />
        {drawFrontDoor(235, -59, 0, 10, 18, '#451a03')}

        <IsoBox
          x={185}
          y={-50}
          w={16}
          d={8}
          h={8}
          zOffset={20}
          fillTop="#ffffff"
          fillLeft="#e5e7eb"
          fillFront="#f3f4f6"
        />

        {selections[0] === 'b' ? (
          <g>
            <line x1={getIsoPoint(115, -4, 0).x} y1={getIsoPoint(115, -4, 0).y} x2={getIsoPoint(115, -4, 40).x} y2={getIsoPoint(115, -4, 40).y} stroke="#1f1d1b" strokeWidth="3.5" />
            <line x1={getIsoPoint(200, -4, 0).x} y1={getIsoPoint(200, -4, 0).y} x2={getIsoPoint(200, -4, 40).x} y2={getIsoPoint(200, -4, 40).y} stroke="#1f1d1b" strokeWidth="3.5" />
            <line x1={getIsoPoint(285, -4, 0).x} y1={getIsoPoint(285, -4, 0).y} x2={getIsoPoint(285, -4, 40).x} y2={getIsoPoint(285, -4, 40).y} stroke="#1f1d1b" strokeWidth="3.5" />
            <path
              d={getElevatedBridgeD(95, 310, 12, 0)}
              stroke="rgba(31,29,27,0.18)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={getElevatedBridgeD(95, 310, -4, 40)}
              stroke="#1f1d1b"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={getElevatedBridgeD(95, 310, -4, 40)}
              stroke="#c5bead"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <polygon
              points={`
                ${getIsoPoint(140, -10, 40).x},${getIsoPoint(140, -10, 40).y}
                ${getIsoPoint(260, -10, 40).x},${getIsoPoint(260, -10, 40).y}
                ${getIsoPoint(260, -10, 56).x},${getIsoPoint(260, -10, 56).y}
                ${getIsoPoint(140, -10, 56).x},${getIsoPoint(140, -10, 56).y}
              `}
              fill="#5a7a68"
              stroke="#1f1d1b"
              strokeWidth="1.2"
              opacity="0.8"
            />
          </g>
        ) : selections[0] === 'c' ? (
          <g>
            <IsoBox
              x={210}
              y={-38}
              w={110}
              d={12}
              h={28}
              fillTop="#4b6b55"
              fillLeft="#354e3d"
              fillFront="#4b6b55"
            />
          </g>
        ) : null}

        {/* ========================================================
            4. INTERACTIVE SEGMENT BUTTON HOTSPOTS (ZONE LABELS)
            ======================================================== */}
        {segments.map(seg => {
          const isSelected = activeSegmentId === seg.id;
          const hasInsight = collectedInsights[seg.id] || false;
          const anchorPoint = getIsoPoint(seg.x, 45, 0);

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
                  r="28"
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
                y2={anchorPoint.y - 38}
                stroke="#1f1d1b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <ellipse
                cx={anchorPoint.x}
                cy={anchorPoint.y + 1}
                rx="6"
                ry="3"
                fill="rgba(31,29,27,0.25)"
              />
              <circle
                cx={anchorPoint.x}
                cy={anchorPoint.y}
                r="4.5"
                fill={hasInsight ? '#8ea63d' : '#1f1d1b'}
                stroke="#1f1d1b"
                strokeWidth="1.5"
              />
              <circle
                cx={anchorPoint.x}
                cy={anchorPoint.y - 38}
                r="13"
                fill={isSelected ? '#f3ce6b' : hasInsight ? '#8ea63d' : '#ffffff'}
                stroke="#1f1d1b"
                strokeWidth="2.5"
                className="transition-transform duration-200 group-hover:scale-110 shadow-flat-pop"
              />
              <text
                x={anchorPoint.x}
                y={anchorPoint.y - 34}
                textAnchor="middle"
                fontSize="11.5"
                className="select-none"
              >
                {seg.icon}
              </text>
              <g transform={`translate(${anchorPoint.x}, ${anchorPoint.y - 62})`}>
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
                  fontSize="8.5"
                  fontWeight="black"
                  fontFamily="sans-serif"
                >
                  {seg.name}
                </text>
              </g>
              {/* Selected Strategy Tag Badge (Displays on Strategy revision or final summary screen) */}
              {selections[seg.id] && (
                <g transform={`translate(${anchorPoint.x}, ${anchorPoint.y + 14})`}>
                  <rect
                    x="-42"
                    y="-6"
                    width="84"
                    height="12"
                    rx="3"
                    fill="#e2f0d9"
                    stroke="#1f1d1b"
                    strokeWidth="1.2"
                    className="shadow-[1px_1px_0px_0px_#1f1d1b]"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fill="#3e5f4c"
                    fontSize="7"
                    fontWeight="extrabold"
                    fontFamily="sans-serif"
                  >
                    {seg.id === 0 ? (selections[0] === 'a' ? '平面慢行' : selections[0] === 'b' ? '局部高架 + 綠牆遮蔽' : '安寧生活緩衝帶') :
                     seg.id === 1 ? (selections[1] === 'a' ? '地面共享街道' : selections[1] === 'b' ? '自行車停靠點' : selections[1] === 'c' ? '遮蔭廣場' : '外送臨停區') :
                     seg.id === 2 ? (selections[2] === 'a' ? 'YouBike + transit' : selections[2] === 'b' ? 'pedestrian priority' : 'slow mobility zone') :
                     seg.id === 3 ? (selections[3] === 'a' ? '局部高架穿越' : selections[3] === 'b' ? '受保護平面穿越' : '人車分流專用號誌') :
                     (selections[4] === 'a' ? '連續樹冠' : selections[4] === 'b' ? '雨水花園' : selections[4] === 'c' ? '透水鋪面' : '生態降溫廊道')}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* ========================================================
            5. NPC STANDEES DRAWING (6 STAKEHOLDERS STYLED AS 3D TOKENS)
            ======================================================== */}
        {npcsList.map(npc => {
          const npcPos = getIsoPoint(npc.pct * 10, 25, 0); // Walkway layer
          const isClose = avatarPosition !== undefined && Math.abs(avatarPosition - npc.pct) <= 4.5;
          const isTalked = collectedInsights[npc.id] || false;

          return (
            <g key={npc.id} className="select-none">
              {/* NPC shadow */}
              <ellipse
                cx={npcPos.x}
                cy={npcPos.y + 12}
                rx="9"
                ry="4"
                fill="rgba(31,29,27,0.18)"
              />

              {/* Pulsing ring if close and not talked yet */}
              {isClose && !isTalked && (
                <circle
                  cx={npcPos.x}
                  cy={npcPos.y - 12}
                  r="16"
                  fill="none"
                  stroke="var(--color-brand-yellow)"
                  strokeWidth="2"
                  className="animate-ping opacity-60"
                  style={{ animationDuration: '1.5s' }}
                />
              )}

              {/* Standee stick */}
              <line
                x1={npcPos.x}
                y1={npcPos.y + 12}
                x2={npcPos.x}
                y2={npcPos.y - 12}
                stroke="#1f1d1b"
                strokeWidth="2"
              />

              {/* Avatar circle frame */}
              <circle
                cx={npcPos.x}
                cy={npcPos.y - 12}
                r="11"
                fill={npc.color}
                stroke="#1f1d1b"
                strokeWidth="2.2"
                className="shadow-flat-pop"
              />

              {/* Avatar Image clip */}
              <g transform={`translate(${npcPos.x - 10}, ${npcPos.y - 22})`}>
                <image
                  href={npc.avatar}
                  width="20"
                  height="20"
                  clipPath="url(#npc-avatar-clip-circle)"
                />
              </g>

              {/* Name label tag */}
              <g transform={`translate(${npcPos.x}, ${npcPos.y - 28})`}>
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
                <g transform={`translate(${npcPos.x + 8}, ${npcPos.y - 18})`}>
                  <circle cx="0" cy="0" r="4.5" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="1" />
                  <polyline points="-2,-0.5 -0.8,1 2,-1" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}

              {/* Interactive Speech Prompt */}
              {isClose && !isTalked && (
                <g transform={`translate(${npcPos.x}, ${npcPos.y - 45})`} className="animate-bounce">
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
                    💬 Space/E
                  </text>
                </g>
              )}
            </g>
          );
        })}


        {/* ========================================================
            6. PLAYER AVATAR WALKING SPRITE
            ======================================================== */}
        {avatarCoords && playerRole && (
          <g
            transform={`translate(${avatarCoords.x}, ${avatarCoords.y - 20 - avatarBobZ})`}
            className="transition-all duration-300 ease-out"
          >
            <ellipse
              cx="0"
              cy={15 + avatarBobZ}
              rx="12"
              ry="5"
              fill="rgba(31,29,27,0.18)"
              className="transition-all duration-300"
              style={{ transform: `scale(${1 - avatarBobZ * 0.05})` }}
            />
            <rect
              x="-24"
              y="-38"
              width="48"
              height="15"
              rx="4"
              fill="var(--color-brand-coral)"
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
              fontFamily="sans-serif"
            >
              YOU (您)
            </text>
            <polygon points="0,-23 -4,-18 4,-18" fill="#1f1d1b" />
            <circle
              cx="0"
              cy="-6"
              r="15"
              fill="#ffffff"
              stroke="#1f1d1b"
              strokeWidth="2.5"
              className="shadow-[2px_2px_0px_0px_#1f1d1b]"
            />
            <g transform="translate(-15, -21)">
              <clipPath id="avatar-clip-25d-v2">
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
                clipPath="url(#avatar-clip-25d-v2)"
                className="scale-110"
              />
            </g>
          </g>
        )}
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
