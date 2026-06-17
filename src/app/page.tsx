'use client';

import React, { useState } from 'react';
import { LandingScreen } from '@/components/LandingScreen';
import { RoleSelection } from '@/components/RoleSelection';
import { ExplorationScreen } from '@/components/ExplorationScreen';
import { FinalResult } from '@/components/FinalResult';
import { roles, StakeholderRole } from '@/data/roles';

export interface GameStats {
  residentSat: number;       // 居民滿意度
  merchantSat: number;       // 商家滿意度
  commuterEff: number;       // 通勤效率
  ecologicalScore: number;   // 生態分數
  safetySense: number;       // 安全感
  activityVitality: number;  // 活動活力
  conflictValue: number;     // 衝突值
}

export type Screen = 'landing' | 'role' | 'exploration' | 'result';

const INITIAL_STATS: GameStats = {
  residentSat: 50,
  merchantSat: 50,
  commuterEff: 50,
  ecologicalScore: 50,
  safetySense: 50,
  activityVitality: 50,
  conflictValue: 80, // 初始衝突值偏高，需要通關降低
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [levelChoices, setLevelChoices] = useState<Record<number, string>>({});
  
  // Unlocked levels state
  const [unlockedLevels, setUnlockedLevels] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false
  });

  const handleStart = () => {
    setCurrentScreen('role');
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    
    // Apply role-based initial stats modifier
    const newStats = { ...INITIAL_STATS };
    switch (roleId) {
      case 'resident':
        newStats.residentSat += 20;
        newStats.safetySense += 10;
        newStats.activityVitality -= 10;
        newStats.conflictValue += 5;
        break;
      case 'shop_owner':
        newStats.merchantSat += 20;
        newStats.activityVitality += 15;
        newStats.residentSat -= 10;
        newStats.conflictValue += 5;
        break;
      case 'commuter':
        newStats.commuterEff += 20;
        newStats.safetySense += 10;
        newStats.ecologicalScore -= 10;
        break;
      case 'elderly':
        newStats.safetySense += 15;
        newStats.residentSat += 10;
        newStats.commuterEff -= 10;
        break;
      case 'environmentalist':
        newStats.ecologicalScore += 25;
        newStats.residentSat += 5;
        newStats.merchantSat -= 10;
        newStats.conflictValue += 10;
        break;
      case 'government':
        newStats.residentSat += 10;
        newStats.merchantSat += 10;
        newStats.commuterEff += 10;
        newStats.ecologicalScore += 10;
        newStats.conflictValue -= 15; // 市府代表更有條理，初始衝突較低
        break;
    }
    setStats(newStats);
    setCurrentScreen('exploration');
  };

  const handleLevelComplete = (levelId: number, choiceId: string, statsChange: Partial<GameStats>) => {
    // Save level choices
    setLevelChoices(prev => ({
      ...prev,
      [levelId]: choiceId
    }));

    // Update stats
    setStats(prev => {
      const nextStats = { ...prev };
      Object.keys(statsChange).forEach((key) => {
        const k = key as keyof GameStats;
        nextStats[k] = Math.max(0, Math.min(100, nextStats[k] + (statsChange[k] || 0)));
      });
      return nextStats;
    });

    // Unlock next level
    if (levelId === 1) {
      setUnlockedLevels(prev => ({ ...prev, 2: true }));
    } else if (levelId === 2) {
      setUnlockedLevels(prev => ({ ...prev, 3: true }));
    }
  };

  const handleFinishGame = () => {
    setCurrentScreen('result');
  };

  const handleRestart = () => {
    setCurrentScreen('landing');
    setSelectedRoleId(null);
    setStats(INITIAL_STATS);
    setLevelChoices({});
    setUnlockedLevels({
      1: true,
      2: false,
      3: false
    });
  };

  const playerRole = roles.find(r => r.id === selectedRoleId) as StakeholderRole;

  return (
    <main className="h-screen w-full flex overflow-hidden bg-[var(--color-bg-warm)] select-none">
      {currentScreen === 'landing' && (
        <LandingScreen onStart={handleStart} />
      )}

      {currentScreen === 'role' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}
      
      {currentScreen === 'exploration' && (
        <div className="flex-1 flex flex-col h-full w-full p-4 overflow-hidden">
          {/* Top Panel Banner */}
          <div className="mb-4 flex justify-between items-center border-3 border-[#1f1d1b] bg-white p-4 rounded-xl shadow-flat-pop select-none shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-serif font-extrabold text-base tracking-tight text-[var(--color-text-dark)] animate-pulse">
                台南綠園道共創 RPG 🌲
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 border-2 border-[#1f1d1b] text-[var(--color-brand-green)] text-[9px] font-bold rounded-full font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                Zelda-Style 城市協調協商任務
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="font-mono bg-white px-2 py-1 rounded-lg border-2 border-[#1f1d1b] text-[10px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">空間跨度：8.23 公里綠色畫卷</span>
              <span className="text-[var(--color-brand-coral)] font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-coral)] animate-ping" />
                協調代表身分：{playerRole?.name}
              </span>
            </div>
          </div>
          
          <div className="flex-1 flex h-full overflow-hidden">
            <ExplorationScreen 
              playerRole={playerRole}
              stats={stats}
              unlockedLevels={unlockedLevels}
              levelChoices={levelChoices}
              onLevelComplete={handleLevelComplete}
              onFinishGame={handleFinishGame}
            />
          </div>
        </div>
      )}
      
      {currentScreen === 'result' && (
        <FinalResult 
          stats={stats}
          playerRole={playerRole}
          levelChoices={levelChoices}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
