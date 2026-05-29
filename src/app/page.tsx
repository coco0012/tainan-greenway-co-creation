'use client';

import React, { useState } from 'react';
import { LandingScreen } from '@/components/LandingScreen';
import { RoleSelection } from '@/components/RoleSelection';
import { AdventureScreen } from '@/components/AdventureScreen';
import { FinalResult } from '@/components/FinalResult';
import { roles, StakeholderRole } from '@/data/roles';
import { missionData, Choice, Effect } from '@/data/missionData';

type Screen = 'landing' | 'role' | 'adventure' | 'result';

const INITIAL_SCORES: Effect = {
  residential: 50,
  commercial: 50,
  mobility: 50,
  ecological: 50,
  cultural: 50
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [scores, setScores] = useState<Effect>(INITIAL_SCORES);
  const [spatialActions, setSpatialActions] = useState<string[]>([]);

  const handleStart = () => setCurrentScreen('role');
  
  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    setCurrentScreen('adventure');
  };

  const handleChoiceMade = (choice: Choice) => {
    // Update scores in real-time
    setScores(prev => ({
      residential: Math.max(0, Math.min(100, prev.residential + choice.effects.residential)),
      commercial: Math.max(0, Math.min(100, prev.commercial + choice.effects.commercial)),
      mobility: Math.max(0, Math.min(100, prev.mobility + choice.effects.mobility)),
      ecological: Math.max(0, Math.min(100, prev.ecological + choice.effects.ecological)),
      cultural: Math.max(0, Math.min(100, prev.cultural + choice.effects.cultural)),
    }));

    // Add spatial action
    if (choice.spatialAction) {
      setSpatialActions(prev => [...prev, choice.spatialAction]);
    }
  };

  const handleComplete = () => {
    setCurrentScreen('result');
  };

  const handleRestart = () => {
    setCurrentScreen('landing');
    setSelectedRoleId(null);
    setScores(INITIAL_SCORES);
    setSpatialActions([]);
  };

  const playerRole = roles.find(r => r.id === selectedRoleId) as StakeholderRole;

  return (
    <main className="h-screen w-full flex overflow-hidden bg-[var(--color-bg-warm)]">
      {currentScreen === 'landing' && (
        <LandingScreen onStart={handleStart} />
      )}
      
      {currentScreen === 'role' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}
      
      {currentScreen === 'adventure' && (
        <div className="flex-1 flex flex-col h-full w-full p-4 md:p-6 max-w-[1600px] mx-auto overflow-hidden">
          {/* Top Panel Banner */}
          <div className="mb-4 flex justify-between items-center border-2 border-[#e5dfd5] bg-white p-4 rounded-2xl shadow-soft-sm select-none shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-serif font-extrabold text-base tracking-tight text-[var(--color-text-dark)]">
                台南綠園道共創
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-[var(--color-brand-green)] text-[9px] font-bold rounded-full font-mono">
                參與式都市空間踏查 RPG
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="font-mono bg-white px-2 py-1 rounded-lg border border-[#e5dfd5] text-[10px]">里程比例尺 1:2500</span>
              <span className="text-[var(--color-brand-coral)] font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand-coral)] animate-ping" />
                市民規劃踏查進行中
              </span>
            </div>
          </div>
          
          <div className="flex-1 flex h-full overflow-hidden">
            <AdventureScreen 
              playerRole={playerRole}
              rounds={missionData.rounds}
              scores={scores}
              spatialActions={spatialActions}
              onChoiceMade={handleChoiceMade}
              onComplete={handleComplete}
            />
          </div>
        </div>
      )}
      
      {currentScreen === 'result' && (
        <FinalResult 
          scores={scores}
          playerRole={playerRole}
          spatialActions={spatialActions}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
