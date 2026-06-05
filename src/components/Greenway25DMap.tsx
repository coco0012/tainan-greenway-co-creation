import React from 'react';
import { StakeholderRole } from '@/data/roles';

interface Greenway25DMapProps {
  activeSegmentId?: number;
  avatarPosition?: number; // 0 to 100
  playerRole?: StakeholderRole;
  selections?: Record<number, string>; // selected options (e.g. {0: 'a', 1: 'b'})
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
  // SVG Canvas configuration
  // We use a 1000x520 canvas to allow proper vertical height for isometric drawings.
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
    // positive yOffset (front) moves screen left-down
    // negative yOffset (back) moves screen right-up
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

  // Helper to interpolate coordinates along the path for the player avatar
  const getCoordinatesAtPct = (pct: number) => {
    // Avatar walks along the pedestrian path (yOffset = 25)
    return getIsoPoint(pct * 10, 25);
  };

  const avatarCoords = avatarPosition !== undefined ? getCoordinatesAtPct(avatarPosition) : null;
  // Bouncing walk cycle animation using math
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

    // Ridge points running along X-axis at center of depth
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

  // Isometric Windows & Doors helpers
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

  // Helper to generate a winding ribbon path string at a specific yOffset
  const getWindingPathD = (yOffset: number) => {
    let d = '';
    for (let x = 30; x <= 970; x += 15) {
      const pt = getIsoPoint(x, yOffset, 0);
      d += `${x === 30 ? 'M' : 'L'} ${pt.x} ${pt.y} `;
    }
    return d;
  };

  // Generate elevated bridge deck path
  const getElevatedBridgeD = (xStart: number, xEnd: number, yOffset: number, z: number) => {
    let d = '';
    for (let x = xStart; x <= xEnd; x += 15) {
      const pt = getIsoPoint(x, yOffset, z);
      d += `${x === xStart ? 'M' : 'L'} ${pt.x} ${pt.y} `;
    }
    return d;
  };

  // Define Ground Slab coordinates
  const pSlabBackLeft = getIsoPoint(30, -110, 0);
  const pSlabBackRight = getIsoPoint(970, -110, 0);
  const pSlabFrontRight = getIsoPoint(970, 110, 0);
  const pSlabFrontLeft = getIsoPoint(30, 110, 0);

  // Depth wall base coordinates (for the thick 3D floating block)
  const slabDepth = 35;
  const pSlabFrontRightB = getIsoPoint(970, 110, -slabDepth);
  const pSlabFrontLeftB = getIsoPoint(30, 110, -slabDepth);
  const pSlabBackLeftB = getIsoPoint(30, -110, -slabDepth);

  // Generate grid line elements for architectural drawing overlay
  const renderGridLines = () => {
    const lines = [];
    // Transverse grid lines
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
    // Longitudinal grid lines
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
          {/* Gradients */}
          <linearGradient id="metal-bridge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e57a73" />
            <stop offset="100%" stopColor="#c55a53" />
          </linearGradient>
          <linearGradient id="water-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#add1e6" />
            <stop offset="100%" stopColor="#87b8d4" />
          </linearGradient>
        </defs>

        {/* ========================================================
            1. 3D ISOMETRIC GROUND SLAB (FLOATING ISLAND BASE)
            ======================================================== */}
        {/* Left Side depth face */}
        <polygon
          points={`${pSlabBackLeft.x},${pSlabBackLeft.y} ${pSlabFrontLeft.x},${pSlabFrontLeft.y} ${pSlabFrontLeftB.x},${pSlabFrontLeftB.y} ${pSlabBackLeftB.x},${pSlabBackLeftB.y}`}
          fill="#c3bead"
          stroke="#1f1d1b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Front Side depth face */}
        <polygon
          points={`${pSlabFrontLeft.x},${pSlabFrontLeft.y} ${pSlabFrontRight.x},${pSlabFrontRight.y} ${pSlabFrontRightB.x},${pSlabFrontRightB.y} ${pSlabFrontLeftB.x},${pSlabFrontLeftB.y}`}
          fill="#a59f8c"
          stroke="#1f1d1b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Ground Top Slab Plane */}
        <polygon
          points={`${pSlabBackLeft.x},${pSlabBackLeft.y} ${pSlabBackRight.x},${pSlabBackRight.y} ${pSlabFrontRight.x},${pSlabFrontRight.y} ${pSlabFrontLeft.x},${pSlabFrontLeft.y}`}
          fill="#eae6d8"
          stroke="#1f1d1b"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Faint planning coordinate grid on the board surface */}
        {renderGridLines()}

        {/* ========================================================
            2. CONTINUOUS GREENWAY ROADBED/PATHS (COGNITIVE CORE SPINE)
            ======================================================== */}
        {/* Planted Buffer zone (continuous green ribbon on the back edge) */}
        <path
          d={getWindingPathD(-28)}
          stroke="#acd0a2"
          strokeWidth="24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Pedestrian Walkway path (closer to front edge) */}
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
        {/* Ground level Bicycle path (middle) */}
        <path
          d={getWindingPathD(-2)}
          stroke="#c7dce7"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dashed white center line for ground bike lane */}
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
               (Sorted from back-to-front / right-to-left for correct depth overlapping)
            ======================================================== */}

        {/* ---------------- ECOLOGICAL SEGMENT (X: 900) ---------------- */}
        {/* Base canopy trees (always present) */}
        <IsoTree x={860} y={-70} size={20} color1="#3e5f4c" color2="#2d4838" />
        <IsoTree x={930} y={-60} size={22} color1="#5a7a68" color2="#3e5f4c" />
        <IsoTree x={900} y={65} size={18} color1="#8ea63d" color2="#748c2b" />

        {/* Strategy Overlays for Ecology segment */}
        {selections[4] === 'a' ? (
          /* 連續複層大樹林蔭冠層 - Extra dense trees shading the path */
          <g>
            <IsoTree x={875} y={-45} size={21} color1="#283e31" color2="#1b2a21" />
            <IsoTree x={915} y={-35} size={23} color1="#334f3f" color2="#24382c" />
            {/* Shading shadow cast onto pedestrian walkway */}
            <path
              d={getElevatedBridgeD(850, 940, 20, 0)}
              stroke="rgba(31,29,27,0.14)"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ) : selections[4] === 'b' ? (
          /* 高透水鋪面與雨水花園 - A beautiful pond and garden beside the path */
          <g>
            {/* Water Pond */}
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
            {/* Rocks around pond */}
            <circle cx={getIsoPoint(865, -34).x} cy={getIsoPoint(865, -34).y} r="3" fill="#9ca3af" stroke="#1f1d1b" strokeWidth="1" />
            <circle cx={getIsoPoint(932, -43).x} cy={getIsoPoint(932, -43).y} r="4.5" fill="#78716c" stroke="#1f1d1b" strokeWidth="1" />
            <circle cx={getIsoPoint(882, -12).x} cy={getIsoPoint(882, -12).y} r="2.5" fill="#9ca3af" stroke="#1f1d1b" strokeWidth="1" />
            {/* Small green plant sprouts */}
            <line x1={getIsoPoint(938, -25).x} y1={getIsoPoint(938, -25).y} x2={getIsoPoint(938, -25).x - 2} y2={getIsoPoint(938, -25).y - 6} stroke="#3e5f4c" strokeWidth="1.5" />
            <line x1={getIsoPoint(938, -25).x} y1={getIsoPoint(938, -25).y} x2={getIsoPoint(938, -25).x + 2} y2={getIsoPoint(938, -25).y - 5} stroke="#3e5f4c" strokeWidth="1.5" />
          </g>
        ) : selections[4] === 'c' ? (
          /* 生態緩衝降溫廊道 - Light blue dashed dynamic wind lines */
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
            <text x={getIsoPoint(890, -40).x} y={getIsoPoint(890, -40).y} fontSize="7" fontWeight="bold" fill="#4a7b9d" fontFamily="sans-serif">❄️ 降溫風道</text>
          </g>
        ) : null}


        {/* ---------------- MAJOR ROAD CROSSING (X: 780) ---------------- */}
        {/* Crossing Asphalt Road cutting through the corridor */}
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

        {/* White Zebra Stripes */}
        <line x1={getIsoPoint(762, -15).x} y1={getIsoPoint(762, -15).y} x2={getIsoPoint(792, -32).x} y2={getIsoPoint(792, -32).y} stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1={getIsoPoint(767, 10).x} y1={getIsoPoint(767, 10).y} x2={getIsoPoint(797, -7).x} y2={getIsoPoint(797, -7).y} stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1={getIsoPoint(772, 35).x} y1={getIsoPoint(772, 35).y} x2={getIsoPoint(802, 18).x} y2={getIsoPoint(802, 18).y} stroke="#ffffff" strokeWidth="3" opacity="0.9" />

        {/* Yellow cross markings for traffic */}
        <line x1={getIsoPoint(758, -75).x} y1={getIsoPoint(758, -75).y} x2={getIsoPoint(798, -95).x} y2={getIsoPoint(798, -95).y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1={getIsoPoint(758, 75).x} y1={getIsoPoint(758, 75).y} x2={getIsoPoint(798, 55).x} y2={getIsoPoint(798, 55).y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />

        {/* Strategy Overlays for Road Crossing */}
        {selections[3] === 'a' ? (
          /* 局部自行車立體陸橋 - Elevated Flyover bridge crossing over the road */
          <g>
            {/* Columns supporting bridge */}
            <line x1={getIsoPoint(720, -2, 0).x} y1={getIsoPoint(720, -2, 0).y} x2={getIsoPoint(720, -2, 45).x} y2={getIsoPoint(720, -2, 45).y} stroke="#1f1d1b" strokeWidth="3.5" />
            <line x1={getIsoPoint(835, -2, 0).x} y1={getIsoPoint(835, -2, 0).y} x2={getIsoPoint(835, -2, 45).x} y2={getIsoPoint(835, -2, 45).y} stroke="#1f1d1b" strokeWidth="3.5" />

            {/* Cast Shadow of the Bridge on ground */}
            <path
              d={getElevatedBridgeD(695, 860, 15, 0)}
              stroke="rgba(31,29,27,0.18)"
              strokeWidth="11"
              fill="none"
              strokeLinecap="round"
            />

            {/* 3D Elevated Arch structure */}
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
            {/* Steel arch truss lines */}
            <path
              d={`M ${getIsoPoint(720, -2, 45).x} ${getIsoPoint(720, -2, 45).y} Q ${getIsoPoint(780, -2, 75).x} ${getIsoPoint(780, -2, 75).y} ${getIsoPoint(835, -2, 45).x} ${getIsoPoint(835, -2, 45).y}`}
              fill="none"
              stroke="#1f1d1b"
              strokeWidth="2"
            />
            <line x1={getIsoPoint(750, -2, 45).x} y1={getIsoPoint(750, -2, 45).y} x2={getIsoPoint(750, -2, 58).x} y2={getIsoPoint(750, -2, 58).y} stroke="#1f1d1b" strokeWidth="1" />
            <line x1={getIsoPoint(780, -2, 45).x} y1={getIsoPoint(780, -2, 45).y} x2={getIsoPoint(780, -2, 65).x} y2={getIsoPoint(780, -2, 65).y} stroke="#1f1d1b" strokeWidth="1" />
            <line x1={getIsoPoint(810, -2, 45).x} y1={getIsoPoint(810, -2, 45).y} x2={getIsoPoint(810, -2, 58).x} y2={getIsoPoint(810, -2, 58).y} stroke="#1f1d1b" strokeWidth="1" />
          </g>
        ) : selections[3] === 'b' ? (
          /* 地面保護型自行車道十字路口 - Bright Green painted cycle crossing lanes */
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
            {/* White warning squares */}
            <circle cx={getIsoPoint(760, 8).x} cy={getIsoPoint(760, 8).y} r="1.5" fill="#ffffff" />
            <circle cx={770} cy={getIsoPoint(775, 5).y} r="1.5" fill="#ffffff" />
            <circle cx={790} cy={getIsoPoint(790, -5).y} r="1.5" fill="#ffffff" />
          </g>
        ) : selections[3] === 'c' ? (
          /* 人車分流專用號誌系統 - Traffic light poles */
          <g>
            {/* Light pole right-down */}
            <line x1={getIsoPoint(750, 40, 0).x} y1={getIsoPoint(750, 40, 0).y} x2={getIsoPoint(750, 40, 35).x} y2={getIsoPoint(750, 40, 35).y} stroke="#374151" strokeWidth="2" />
            <rect x={getIsoPoint(750, 40, 35).x - 3} y={getIsoPoint(750, 40, 35).y - 8} width="6" height="10" rx="1" fill="#1f1d1b" stroke="#ffffff" strokeWidth="0.5" />
            <circle cx={getIsoPoint(750, 40, 35).x} cy={getIsoPoint(750, 40, 35).y - 5} r="1.8" fill="#ef4444" />
            <circle cx={getIsoPoint(750, 40, 35).x} cy={getIsoPoint(750, 40, 35).y - 1} r="1.8" fill="#10b981" />

            {/* Light pole left-up */}
            <line x1={getIsoPoint(805, -40, 0).x} y1={getIsoPoint(805, -40, 0).y} x2={getIsoPoint(805, -40, 35).x} y2={getIsoPoint(805, -40, 35).y} stroke="#374151" strokeWidth="2" />
            <rect x={getIsoPoint(805, -40, 35).x - 3} y={getIsoPoint(805, -40, 35).y - 8} width="6" height="10" rx="1" fill="#1f1d1b" stroke="#ffffff" strokeWidth="0.5" />
            <circle cx={getIsoPoint(805, -40, 35).x} cy={getIsoPoint(805, -40, 35).y - 5} r="1.8" fill="#10b981" />
            <circle cx={getIsoPoint(805, -40, 35).x} cy={getIsoPoint(805, -40, 35).y - 1} r="1.8" fill="#ef4444" />
          </g>
        ) : null}


        {/* ---------------- STATION NODE (X: 620) ---------------- */}
        {/* Tainan Station Terminal Building (Back area) */}
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
        {/* Grand Station Entrance Arch */}
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
        {/* Clock Tower block */}
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
        {/* Clock Face Details */}
        <circle
          cx={getIsoPoint(580, -64, 82).x}
          cy={getIsoPoint(580, -64, 82).y}
          r="4.5"
          fill="#ffffff"
          stroke="#1f1d1b"
          strokeWidth="1.2"
        />
        <line
          x1={getIsoPoint(580, -64, 82).x}
          y1={getIsoPoint(580, -64, 82).y}
          x2={getIsoPoint(580, -64, 82).x}
          y2={getIsoPoint(580, -64, 82).y - 2.5}
          stroke="#1f1d1b"
          strokeWidth="1"
        />
        <line
          x1={getIsoPoint(580, -64, 82).x}
          y1={getIsoPoint(580, -64, 82).y}
          x2={getIsoPoint(580, -64, 82).x + 2}
          y2={getIsoPoint(580, -64, 82).y}
          stroke="#1f1d1b"
          strokeWidth="1"
        />

        {/* Strategy Overlays for Station Node */}
        {selections[2] === 'a' ? (
          /* YouBike與大眾運輸轉乘樞紐 - Yellow docks + parked bikes + bus stop */
          <g>
            {/* Bus Shelter */}
            <IsoBox x={665} y={35} w={30} d={12} h={25} fillTop="#ef4444" fillLeft="#991b1b" fillFront="#dc2626" />
            <rect x={getIsoPoint(665, 41, 5).x - 6} y={getIsoPoint(665, 41, 5).y - 15} width="12" height="12" fill="#ffffff" opacity="0.6" />
            {/* YouBike Dock line */}
            <line x1={getIsoPoint(600, 40, 0).x} y1={getIsoPoint(600, 40, 0).y} x2={getIsoPoint(630, 28, 0).x} y2={getIsoPoint(630, 28, 0).y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            {/* YouBike bikes */}
            <circle cx={getIsoPoint(605, 38, 4).x} cy={getIsoPoint(605, 38, 4).y} r="2" fill="#ef4444" stroke="#1f1d1b" strokeWidth="1" />
            <circle cx={getIsoPoint(615, 34, 4).x} cy={getIsoPoint(615, 34, 4).y} r="2" fill="#ef4444" stroke="#1f1d1b" strokeWidth="1" />
            <circle cx={getIsoPoint(625, 30, 4).x} cy={getIsoPoint(625, 30, 4).y} r="2" fill="#ef4444" stroke="#1f1d1b" strokeWidth="1" />
          </g>
        ) : selections[2] === 'b' ? (
          /* 行人優先漫步歷史廣場 - Memorial circular rail track & public fountain */
          <g>
            {/* Circular plaza base */}
            <ellipse
              cx={getIsoPoint(640, 25, 0).x}
              cy={getIsoPoint(640, 25, 0).y}
              rx="30"
              ry="15"
              fill="#e5e7eb"
              stroke="#1f1d1b"
              strokeWidth="1.2"
            />
            {/* Water fountain */}
            <ellipse
              cx={getIsoPoint(640, 25, 0).x}
              cy={getIsoPoint(640, 25, 0).y}
              rx="12"
              ry="6"
              fill="#93c5fd"
              stroke="#1f1d1b"
              strokeWidth="1"
            />
            {/* Fountain water jet */}
            <path
              d={`M ${getIsoPoint(640, 25, 0).x} ${getIsoPoint(640, 25, 0).y} Q ${getIsoPoint(640, 25, 12).x} ${getIsoPoint(640, 25, 12).y - 5} ${getIsoPoint(644, 28, 2).x} ${getIsoPoint(644, 28, 2).y}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d={`M ${getIsoPoint(640, 25, 0).x} ${getIsoPoint(640, 25, 0).y} Q ${getIsoPoint(640, 25, 12).x - 6} ${getIsoPoint(640, 25, 12).y - 4} ${getIsoPoint(635, 23, 1).x} ${getIsoPoint(635, 23, 1).y}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        ) : selections[2] === 'c' ? (
          /* 清晰指引與慢速微行動特區 - Directional signage and scooter parkings */
          <g>
            {/* Direction Sign Pole */}
            <line x1={getIsoPoint(610, 30, 0).x} y1={getIsoPoint(610, 30, 0).y} x2={getIsoPoint(610, 30, 35).x} y2={getIsoPoint(610, 30, 35).y} stroke="#1f1d1b" strokeWidth="2.5" />
            <polygon
              points={`
                ${getIsoPoint(610, 30, 35).x},${getIsoPoint(610, 30, 35).y}
                ${getIsoPoint(610, 30, 35).x + 12},${getIsoPoint(610, 30, 35).y + 2}
                ${getIsoPoint(610, 30, 28).x + 12},${getIsoPoint(610, 30, 28).y + 2}
                ${getIsoPoint(610, 30, 28).x},${getIsoPoint(610, 30, 28).y}
              `}
              fill="#f59e0b"
              stroke="#1f1d1b"
              strokeWidth="1.2"
            />
            <text x={getIsoPoint(610, 30, 32).x + 3} y={getIsoPoint(610, 30, 32).y + 1} fontSize="5" fontWeight="bold">園道</text>
          </g>
        ) : null}


        {/* ---------------- COMMERCIAL SEGMENT (X: 420) ---------------- */}
        {/* Storefront A (Noodle shop) */}
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
        {/* Shop canopy */}
        <polygon
          points={`
            ${getIsoPoint(358, -54, 26).x},${getIsoPoint(358, -54, 26).y}
            ${getIsoPoint(402, -54, 26).x},${getIsoPoint(402, -54, 26).y}
            ${getIsoPoint(402, -44, 20).x},${getIsoPoint(402, -44, 20).y}
            ${getIsoPoint(358, -44, 20).x},${getIsoPoint(358, -44, 20).y}
          `}
          fill="#ef4444"
          stroke="#1f1d1b"
          strokeWidth="1.2"
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
        {/* Shop sign text */}
        <text x={getIsoPoint(395, -54, 28).x} y={getIsoPoint(395, -54, 28).y} fontSize="6" fontWeight="bold" fill="#1f1d1b">麵</text>

        {/* Storefront B (Cafe) */}
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
        {drawFrontWindow(432, -54, 15, 8, 12, '#93c5fd')}
        {drawFrontWindow(458, -54, 15, 8, 12, '#93c5fd')}
        {/* Shop sign text */}
        <text x={getIsoPoint(445, -54, 32).x} y={getIsoPoint(445, -54, 32).y} fontSize="6" fontWeight="bold" fill="#1f1d1b">茶</text>

        {/* Strategy Overlays for Commercial segment */}
        {selections[1] === 'a' ? (
          /* 地面慢速人車共享街區 - Brick paving texture details */
          <g>
            <path
              d={getElevatedBridgeD(350, 480, 5, 0)}
              stroke="#dfd9c8"
              strokeWidth="22"
              fill="none"
              strokeLinejoin="round"
              opacity="0.8"
            />
            {/* Pavement details */}
            <line x1={getIsoPoint(370, 10).x} y1={getIsoPoint(370, 10).y} x2={getIsoPoint(370, -10).x} y2={getIsoPoint(370, -10).y} stroke="#1f1d1b" strokeWidth="0.8" opacity="0.3" />
            <line x1={getIsoPoint(400, 10).x} y1={getIsoPoint(400, 10).y} x2={getIsoPoint(400, -10).x} y2={getIsoPoint(400, -10).y} stroke="#1f1d1b" strokeWidth="0.8" opacity="0.3" />
            <line x1={getIsoPoint(430, 10).x} y1={getIsoPoint(430, 10).y} x2={getIsoPoint(430, -10).x} y2={getIsoPoint(430, -10).y} stroke="#1f1d1b" strokeWidth="0.8" opacity="0.3" />
            <line x1={getIsoPoint(460, 10).x} y1={getIsoPoint(460, 10).y} x2={getIsoPoint(460, -10).x} y2={getIsoPoint(460, -10).y} stroke="#1f1d1b" strokeWidth="0.8" opacity="0.3" />
          </g>
        ) : selections[1] === 'b' ? (
          /* 自行車停靠點與遮陰休閒廣場 - Large shaded umbrella + bench + bike rack */
          <g>
            {/* Sun Umbrella */}
            <line x1={getIsoPoint(420, 30, 0).x} y1={getIsoPoint(420, 30, 0).y} x2={getIsoPoint(420, 30, 32).x} y2={getIsoPoint(420, 30, 32).y} stroke="#1f1d1b" strokeWidth="1.5" />
            {/* Canopy */}
            <path
              d={`M ${getIsoPoint(420, 30, 32).x} ${getIsoPoint(420, 30, 32).y} 
                  Q ${getIsoPoint(420, 30, 32).x - 18} ${getIsoPoint(420, 30, 32).y + 5} ${getIsoPoint(405, 38, 24).x} ${getIsoPoint(405, 38, 24).y}
                  L ${getIsoPoint(435, 22, 24).x} ${getIsoPoint(435, 22, 24).y} Z`}
              fill="#3b82f6"
              stroke="#1f1d1b"
              strokeWidth="1.2"
            />
            {/* Wooden Bench */}
            <IsoBox x={395} y={28} w={15} d={6} h={8} fillTop="#d97706" fillLeft="#b45309" fillFront="#d97706" />
            {/* Bicycle Rack with a parked bike */}
            <line x1={getIsoPoint(440, 24, 0).x} y1={getIsoPoint(440, 24, 0).y} x2={getIsoPoint(455, 18, 0).x} y2={getIsoPoint(455, 18, 0).y} stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
            <circle cx={getIsoPoint(445, 22, 4).x} cy={getIsoPoint(445, 22, 4).y} r="3.5" fill="none" stroke="#374151" strokeWidth="1" />
            <circle cx={getIsoPoint(452, 19, 4).x} cy={getIsoPoint(452, 19, 4).y} r="3.5" fill="none" stroke="#374151" strokeWidth="1" />
          </g>
        ) : selections[1] === 'c' ? (
          /* 店家物流裝卸與臨停區 - Yellow dashed zone and parked delivery vehicle */
          <g>
            {/* Yellow dashed parking box on pedestrian path */}
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
            <text x={getIsoPoint(420, 35).x} y={getIsoPoint(420, 35).y} fontSize="6" fontWeight="bold" fill="#b45309">LOADING</text>
            {/* Parked Delivery Scooter */}
            <rect x={getIsoPoint(415, 30, 0).x - 4} y={getIsoPoint(415, 30, 0).y - 8} width="8" height="8" rx="1.5" fill="#10b981" stroke="#1f1d1b" strokeWidth="1" />
            <circle cx={getIsoPoint(415, 30, 0).x - 3} cy={getIsoPoint(415, 30, 0).y + 1} r="2" fill="#1f1d1b" />
            <circle cx={getIsoPoint(415, 30, 0).x + 3} cy={getIsoPoint(415, 30, 0).y - 1} r="2" fill="#1f1d1b" />
          </g>
        ) : null}


        {/* ---------------- RESIDENTIAL SEGMENT (X: 200) ---------------- */}
        {/* House A (Pitched Roof) */}
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
        {drawFrontWindow(164, -54, 25, 8, 9, '#cce3f0')}
        {drawFrontWindow(186, -54, 25, 8, 9, '#cce3f0')}

        {/* House B (Pitched Roof, taller) */}
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
        {drawFrontWindow(222, -59, 22, 9, 10, '#cce3f0')}
        {drawFrontWindow(248, -59, 22, 9, 10, '#cce3f0')}
        {drawFrontWindow(222, -59, 42, 9, 10, '#cce3f0')}
        {drawFrontWindow(248, -59, 42, 9, 10, '#cce3f0')}

        {/* Balconies facing the greenway */}
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
        {/* Balcony Railings */}
        <line x1={getIsoPoint(177, -46, 28).x} y1={getIsoPoint(177, -46, 28).y} x2={getIsoPoint(177, -46, 20).x} y2={getIsoPoint(177, -46, 20).y} stroke="#1f1d1b" strokeWidth="1" />
        <line x1={getIsoPoint(193, -54, 28).x} y1={getIsoPoint(193, -54, 28).y} x2={getIsoPoint(193, -54, 20).x} y2={getIsoPoint(193, -54, 20).y} stroke="#1f1d1b" strokeWidth="1" />

        <IsoBox
          x={245}
          y={-55}
          w={18}
          d={8}
          h={8}
          zOffset={22}
          fillTop="#ffffff"
          fillLeft="#e5e7eb"
          fillFront="#f3f4f6"
        />
        <line x1={getIsoPoint(236, -51, 30).x} y1={getIsoPoint(236, -51, 30).y} x2={getIsoPoint(236, -51, 22).x} y2={getIsoPoint(236, -51, 22).y} stroke="#1f1d1b" strokeWidth="1" />
        <line x1={getIsoPoint(254, -59, 30).x} y1={getIsoPoint(254, -59, 30).y} x2={getIsoPoint(254, -59, 22).x} y2={getIsoPoint(254, -59, 22).y} stroke="#1f1d1b" strokeWidth="1" />

        {/* Strategy Overlays for Residential segment */}
        {selections[0] === 'b' ? (
          /* Raised Elevated Bikeway with Columns & Shadow & Privacy Shield */
          <g>
            {/* Columns supporting the bridge */}
            <line x1={getIsoPoint(115, -4, 0).x} y1={getIsoPoint(115, -4, 0).y} x2={getIsoPoint(115, -4, 40).x} y2={getIsoPoint(115, -4, 40).y} stroke="#1f1d1b" strokeWidth="3.5" />
            <line x1={getIsoPoint(200, -4, 0).x} y1={getIsoPoint(200, -4, 0).y} x2={getIsoPoint(200, -4, 40).x} y2={getIsoPoint(200, -4, 40).y} stroke="#1f1d1b" strokeWidth="3.5" />
            <line x1={getIsoPoint(285, -4, 0).x} y1={getIsoPoint(285, -4, 0).y} x2={getIsoPoint(285, -4, 40).x} y2={getIsoPoint(285, -4, 40).y} stroke="#1f1d1b" strokeWidth="3.5" />

            {/* Bridge Shadow cast on ground */}
            <path
              d={getElevatedBridgeD(95, 310, 12, 0)}
              stroke="rgba(31,29,27,0.18)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />

            {/* Elevated Bridge Deck */}
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

            {/* Green Privacy Shield Wall on the back side of bridge facing houses */}
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
            {/* Visual plants pattern on privacy shield */}
            <circle cx={getIsoPoint(160, -10, 48).x} cy={getIsoPoint(160, -10, 48).y} r="2.5" fill="#aed0a2" />
            <circle cx={getIsoPoint(200, -10, 48).x} cy={getIsoPoint(200, -10, 48).y} r="2.5" fill="#aed0a2" />
            <circle cx={getIsoPoint(240, -10, 48).x} cy={getIsoPoint(240, -10, 48).y} r="2.5" fill="#aed0a2" />
          </g>
        ) : selections[0] === 'c' ? (
          /* 社區安寧綠色緩衝帶 - Quiet Neighborhood Buffer Green Wall/Hedge */
          <g>
            {/* Green hedge blocking view between path and houses */}
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
            {/* Little flowers on the hedge */}
            <circle cx={getIsoPoint(170, -32, 20).x} cy={getIsoPoint(170, -32, 20).y} r="1.5" fill="#e17b70" />
            <circle cx={getIsoPoint(210, -32, 20).x} cy={getIsoPoint(210, -32, 20).y} r="1.5" fill="#e5c158" />
            <circle cx={getIsoPoint(250, -32, 20).x} cy={getIsoPoint(250, -32, 20).y} r="1.5" fill="#e17b70" />
          </g>
        ) : (
          /* 地面慢速自行車道 - Slow pavement painting */
          <g>
            <text x={getIsoPoint(200, -5).x} y={getIsoPoint(200, -5).y} fontSize="7.5" fontWeight="black" fill="#3e5f4c" fontFamily="sans-serif">🚲 慢速區</text>
          </g>
        )}


        {/* ========================================================
            4. INTERACTIVE SEGMENT BUTTON HOTSPOTS (FOREGROUND OVERLAYS)
            ======================================================== */}
        {segments.map(seg => {
          const isSelected = activeSegmentId === seg.id;
          const hasInsight = collectedInsights[seg.id];

          // Hotspots are anchored at yOffset = 45 (foreground walkway) to prevent overlap with background structures.
          const anchorPoint = getIsoPoint(seg.x, 45, 0);

          return (
            <g
              key={seg.id}
              className={`group ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => interactive && onSegmentClick && onSegmentClick(seg.id)}
            >
              {/* Highlight pulsing circle overlay on active selection */}
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

              {/* Vertical Flagpole line */}
              <line
                x1={anchorPoint.x}
                y1={anchorPoint.y}
                x2={anchorPoint.x}
                y2={anchorPoint.y - 38}
                stroke="#1f1d1b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Small shadow circle at the base */}
              <ellipse
                cx={anchorPoint.x}
                cy={anchorPoint.y + 1}
                rx="6"
                ry="3"
                fill="rgba(31,29,27,0.25)"
              />

              {/* Flagpole Base Dot */}
              <circle
                cx={anchorPoint.x}
                cy={anchorPoint.y}
                r="4.5"
                fill={hasInsight ? '#8ea63d' : '#1f1d1b'}
                stroke="#1f1d1b"
                strokeWidth="1.5"
              />

              {/* Flagpole Top Circle Badge */}
              <circle
                cx={anchorPoint.x}
                cy={anchorPoint.y - 38}
                r="13"
                fill={isSelected ? '#f3ce6b' : hasInsight ? '#8ea63d' : '#ffffff'}
                stroke="#1f1d1b"
                strokeWidth="2.5"
                className="transition-transform duration-200 group-hover:scale-110 shadow-flat-pop"
              />

              {/* Badge Icon (Emoji) */}
              <text
                x={anchorPoint.x}
                y={anchorPoint.y - 34}
                textAnchor="middle"
                fontSize="11.5"
                className="select-none"
              >
                {seg.icon}
              </text>

              {/* Little checkmark bubble for explored zones */}
              {hasInsight && (
                <g transform={`translate(${anchorPoint.x + 8}, ${anchorPoint.y - 45})`}>
                  <circle cx="0" cy="0" r="5" fill="#8ea63d" stroke="#1f1d1b" strokeWidth="1.2" />
                  <polyline points="-2.5,-0.5 -1,1.2 2.5,-1.5" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}

              {/* Floating segment label tag (always visible, highlight on hover/select) */}
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
                    {seg.id === 0 ? (selections[0] === 'a' ? '平面慢行' : selections[0] === 'b' ? '局部高架 / 隱私簾' : '綠牆遮蔽 / 緩衝帶') :
                     seg.id === 1 ? (selections[1] === 'a' ? '共享街道 / 慢行' : selections[1] === 'b' ? '共享街道 / 休閒廣場' : '共享街道 / 物流臨停') :
                     seg.id === 2 ? (selections[2] === 'a' ? 'YouBike / 轉乘樞紐' : selections[2] === 'b' ? '記憶節點 / 歷史廣場' : 'YouBike / 微行動') :
                     seg.id === 3 ? (selections[3] === 'a' ? '局部高架 / 自行車陸橋' : selections[3] === 'b' ? '平面慢行 / 保護路口' : '平面慢行 / 專用號誌') :
                     (selections[4] === 'a' ? '綠牆遮蔽 / 複層林蔭' : selections[4] === 'b' ? '雨水花園 / 保水' : '雨水花園 / 降溫廊道')}
                  </text>
                </g>
              )}
            </g>
          );
        })}


        {/* ========================================================
            5. PLAYER AVATAR WALKING SPRITE (Bobbing walking animation)
            ======================================================== */}
        {avatarCoords && playerRole && (
          <g
            transform={`translate(${avatarCoords.x}, ${avatarCoords.y - 20 - avatarBobZ})`}
            className="transition-all duration-300 ease-out"
          >
            {/* Shadow beneath walking character */}
            <ellipse
              cx="0"
              cy={15 + avatarBobZ}
              rx="12"
              ry="5"
              fill="rgba(31,29,27,0.18)"
              className="transition-all duration-300"
              style={{ transform: `scale(${1 - avatarBobZ * 0.05})` }}
            />

            {/* "YOU / 您" floating badge */}
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

            {/* Character circle frame */}
            <circle
              cx="0"
              cy="-6"
              r="15"
              fill="#ffffff"
              stroke="#1f1d1b"
              strokeWidth="2.5"
              className="shadow-[2px_2px_0px_0px_#1f1d1b]"
            />

            {/* ClipPath avatar image */}
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
