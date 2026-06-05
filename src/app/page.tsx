'use client';

import React, { useState } from 'react';
import { LandingScreen } from '@/components/LandingScreen';
import { StoryScreen } from '@/components/StoryScreen';
import { RoleSelection } from '@/components/RoleSelection';
import { ExplorationScreen } from '@/components/ExplorationScreen';
import { MissionBriefScreen } from '@/components/MissionBriefScreen';
import { NegotiationScreen } from '@/components/NegotiationScreen';
import { StrategyRevisionScreen } from '@/components/StrategyRevisionScreen';
import { FinalResult } from '@/components/FinalResult';
import { roles, StakeholderRole } from '@/data/roles';
import { missionData, Choice, Effect } from '@/data/missionData';

type Screen = 'landing' | 'story' | 'role' | 'exploration' | 'brief' | 'negotiation' | 'revision' | 'result';

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
  const [collectedInsights, setCollectedInsights] = useState<string[]>([]);
  
  // Track player choices from Negotiation rounds to preload Strategy Revision Screen
  const [negotiationChoices, setNegotiationChoices] = useState<Record<number, string>>({});

  const handleStart = () => setCurrentScreen('story');
  
  const handleStoryComplete = () => setCurrentScreen('role');

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    setCurrentScreen('exploration');
  };

  const handleExploreComplete = (insights: string[]) => {
    setCollectedInsights(insights);
    setCurrentScreen('brief');
  };

  const handleStartNegotiation = () => {
    setCurrentScreen('negotiation');
  };

  const handleChoiceMade = (choice: Choice) => {
    // Map choices to segment indexes for preloading Phase 6 StrategyRevision:
    // Round 1 (choices start with '1') is for Residential segment (ID 0)
    // Round 2 (choices start with '2') is for Commercial segment (ID 1)
    // Round 3 (choices start with '3') is for Ecological segment (ID 4)
    let segmentId = 0;
    if (choice.id.startsWith('2')) segmentId = 1;
    if (choice.id.startsWith('3')) segmentId = 4;

    setNegotiationChoices(prev => ({
      ...prev,
      [segmentId]: choice.id
    }));
  };

  const handleNegotiationComplete = () => {
    setCurrentScreen('revision');
  };

  const handleRevisionComplete = (finalScores: Effect, finalActions: string[]) => {
    setScores(finalScores);
    setSpatialActions(finalActions);
    setCurrentScreen('result');
  };

  const handleRestart = () => {
    setCurrentScreen('landing');
    setSelectedRoleId(null);
    setScores(INITIAL_SCORES);
    setSpatialActions([]);
    setNegotiationChoices({});
    setCollectedInsights([]);
  };

  const playerRole = roles.find(r => r.id === selectedRoleId) as StakeholderRole;

  return (
    <main className="h-screen w-full flex overflow-hidden bg-[var(--color-bg-warm)] select-none">
      
      {currentScreen === 'landing' && (
        <LandingScreen onStart={handleStart} />
      )}

      {currentScreen === 'story' && (
        <StoryScreen onComplete={handleStoryComplete} />
      )}
      
      {currentScreen === 'role' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}
      
      {currentScreen === 'exploration' && (
        <div className="flex-1 flex flex-col h-full w-full p-4 overflow-hidden">
          {/* Top Panel Banner */}
          <div className="mb-4 flex justify-between items-center border-3 border-[#1f1d1b] bg-white p-4 rounded-xl shadow-flat-pop select-none shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-serif font-extrabold text-base tracking-tight text-[var(--color-text-dark)]">
                台南綠園道共創
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 border-2 border-[#1f1d1b] text-[var(--color-brand-green)] text-[9px] font-bold rounded-full font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                參與式都市空間踏查 RPG
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="font-mono bg-white px-2 py-1 rounded-lg border-2 border-[#1f1d1b] text-[10px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">里程比例尺 1:2500</span>
              <span className="text-[var(--color-brand-coral)] font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand-coral)] animate-ping" />
                實地踏查與訪談收集
              </span>
            </div>
          </div>
          
          <div className="flex-1 flex h-full overflow-hidden">
            <ExplorationScreen 
              playerRole={playerRole}
              onExploreComplete={handleExploreComplete}
            />
          </div>
        </div>
      )}

      {currentScreen === 'brief' && (
        <MissionBriefScreen 
          playerRole={playerRole}
          onStartNegotiation={handleStartNegotiation}
        />
      )}

      {currentScreen === 'negotiation' && (
        <div className="flex-1 flex flex-col h-full w-full p-4 overflow-hidden">
          {/* Top Panel Banner */}
          <div className="mb-4 flex justify-between items-center border-3 border-[#1f1d1b] bg-white p-4 rounded-xl shadow-flat-pop select-none shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-serif font-extrabold text-base tracking-tight text-[var(--color-text-dark)]">
                台南綠園道共創
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 border-2 border-[#1f1d1b] text-[var(--color-brand-green)] text-[9px] font-bold rounded-full font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                參與式都市空間踏查 RPG
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="font-mono bg-white px-2 py-1 rounded-lg border-2 border-[#1f1d1b] text-[10px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">里程比例尺 1:2500</span>
              <span className="text-[var(--color-brand-coral)] font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand-coral)] animate-ping" />
                市民協商會議進行中
              </span>
            </div>
          </div>
          
          <div className="flex-1 flex h-full overflow-hidden">
            <NegotiationScreen 
              playerRole={playerRole}
              rounds={missionData.rounds}
              onChoiceMade={handleChoiceMade}
              onNegotiationComplete={handleNegotiationComplete}
              collectedInsights={collectedInsights}
            />
          </div>
        </div>
      )}

      {currentScreen === 'revision' && (
        <div className="flex-1 flex flex-col h-full w-full p-4 overflow-hidden">
          {/* Top Panel Banner */}
          <div className="mb-4 flex justify-between items-center border-3 border-[#1f1d1b] bg-white p-4 rounded-xl shadow-flat-pop select-none shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-serif font-extrabold text-base tracking-tight text-[var(--color-text-dark)]">
                台南綠園道共創
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 border-2 border-[#1f1d1b] text-[var(--color-brand-green)] text-[9px] font-bold rounded-full font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                參與式都市空間踏查 RPG
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="font-mono bg-white px-2 py-1 rounded-lg border-2 border-[#1f1d1b] text-[10px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">里程比例尺 1:2500</span>
              <span className="text-[var(--color-brand-coral)] font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand-coral)] animate-ping" />
                空間規劃草案修訂工作台
              </span>
            </div>
          </div>
          
          <div className="flex-1 flex h-full overflow-hidden">
            <StrategyRevisionScreen 
              playerRole={playerRole}
              initialSelections={negotiationChoices}
              onRevisionComplete={handleRevisionComplete}
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
