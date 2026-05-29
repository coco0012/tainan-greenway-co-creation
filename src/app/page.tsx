'use client';

import React, { useState } from 'react';
import { LandingScreen } from '@/components/LandingScreen';
import { RoleSelection } from '@/components/RoleSelection';
import { MissionScreen } from '@/components/MissionScreen';
import { NegotiationDashboard } from '@/components/NegotiationDashboard';
import { GreenwayMap } from '@/components/GreenwayMap';
import { CivicIndicators } from '@/components/CivicIndicators';
import { FinalResult } from '@/components/FinalResult';
import { roles, StakeholderRole } from '@/data/roles';
import { missionData, Choice, Effect } from '@/data/missionData';

type Screen = 'landing' | 'role' | 'mission' | 'negotiation' | 'result';

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
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [spatialActions, setSpatialActions] = useState<string[]>([]);

  const handleStart = () => setCurrentScreen('role');
  
  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    setCurrentScreen('mission');
  };

  const handleStartNegotiation = () => {
    setCurrentScreen('negotiation');
  };

  const handleChoiceSelected = (choice: Choice) => {
    // Update scores
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

    // Go to next round or finish
    if (currentRoundIndex < missionData.rounds.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      setCurrentScreen('result');
    }
  };

  const handleRestart = () => {
    setCurrentScreen('landing');
    setSelectedRoleId(null);
    setScores(INITIAL_SCORES);
    setCurrentRoundIndex(0);
    setSpatialActions([]);
  };

  const playerRole = roles.find(r => r.id === selectedRoleId) as StakeholderRole;
  const currentRound = missionData.rounds[currentRoundIndex];

  return (
    <main className="h-screen w-full flex overflow-hidden bg-[var(--color-bg-warm)]">
      {currentScreen === 'landing' && (
        <LandingScreen onStart={handleStart} />
      )}
      
      {currentScreen === 'role' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}
      
      {currentScreen === 'mission' && (
        <MissionScreen onStartNegotiation={handleStartNegotiation} />
      )}
      
      {currentScreen === 'negotiation' && (
        <div className="flex-1 flex flex-col h-full w-full p-6 max-w-[1600px] mx-auto overflow-hidden">
          {/* Top Panel Banner */}
          <div className="mb-4 flex justify-between items-center border border-[#e8e5e0] bg-[#FAF8F5] p-4 rounded-2xl shadow-soft-sm select-none shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-base tracking-tight text-gray-800">
                台南綠園道共創
              </span>
              <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-100 text-[var(--color-brand-blue)] text-[9px] font-bold rounded-full font-mono">
                參與式數位雙生原型
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="font-mono bg-white px-2 py-1 rounded-lg border border-gray-100">比例尺 1:2500</span>
              <span className="text-[var(--color-brand-coral)] font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-coral)]" />
                模擬協商進行中
              </span>
            </div>
          </div>
          
          <div className="flex-1 flex gap-4 h-full overflow-hidden">
            {/* Left Panel: Map */}
            <div className="w-1/4 h-full hidden lg:block">
              <GreenwayMap spatialActions={spatialActions} />
            </div>
            
            {/* Center Panel: Dashboard */}
            <div className="flex-1 h-full">
              <NegotiationDashboard 
                round={currentRound}
                playerRole={playerRole}
                onChoiceSelected={handleChoiceSelected}
              />
            </div>
            
            {/* Right Panel: Indicators */}
            <div className="w-1/4 h-full hidden lg:block">
              <CivicIndicators 
                scores={scores} 
                playerRole={playerRole} 
              />
            </div>
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
