import React, { useState, useEffect, useCallback } from 'react';
import { GameId, GameState, PlayerScores } from './types/game';
import { GAMES_DATA } from './data/games';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GameBriefingModal } from './components/GameBriefingModal';
import { CountdownOverlay } from './components/CountdownOverlay';
import { TowerStackerGame } from './components/games/TowerStackerGame';
import { BrickBreakerGame } from './components/games/BrickBreakerGame';
import { TriviaQuizGame } from './components/games/TriviaQuizGame';
import { GameDescriptionSection } from './components/GameDescriptionSection';

const STORAGE_KEY = 'piksel_arena_highscores_v3';

export default function App() {
  const [activeGameId, setActiveGameId] = useState<GameId>('tower-stack');
  const [gameState, setGameState] = useState<GameState>('BRIEFING');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Player High Scores
  const [scores, setScores] = useState<PlayerScores>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            'tower-stack': Number(parsed['tower-stack']) || 0,
            'brick-breaker': Number(parsed['brick-breaker']) || 0,
            'trivia-quiz': Number(parsed['trivia-quiz']) || 0,
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      'tower-stack': 0,
      'brick-breaker': 0,
      'trivia-quiz': 0,
    };
  });

  // Save scores to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
      // ignore
    }
  }, [scores]);

  // Active game metadata
  const activeGame = GAMES_DATA.find((g) => g.id === activeGameId) || GAMES_DATA[0];

  // Sound toggle
  const handleToggleSound = useCallback(() => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  }, []);

  // Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen change
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // When user switches game, immediately switch to BRIEFING so game doesn't auto-start
  const handleSelectGame = useCallback((id: GameId) => {
    setActiveGameId(id);
    setGameState('BRIEFING');
  }, []);

  // User explicitly clicks "OYUNA BAŞLA"
  const handleStartGame = useCallback(() => {
    setGameState('COUNTDOWN');
  }, []);

  // Countdown completed -> PLAYING
  const handleCountdownFinished = useCallback(() => {
    setGameState('PLAYING');
  }, []);

  // Game over handler -> records new high score if beat
  const handleGameOver = useCallback((finalScore: number) => {
    setGameState('GAME_OVER');
    setScores((prev) => {
      if (finalScore > prev[activeGameId]) {
        return {
          ...prev,
          [activeGameId]: finalScore,
        };
      }
      return prev;
    });
  }, [activeGameId]);

  // Restart game: starts directly or via countdown
  const handleRestart = useCallback(() => {
    setGameState('COUNTDOWN');
  }, []);

  // Open briefing explicitly
  const handleOpenBriefing = useCallback(() => {
    setGameState('BRIEFING');
  }, []);

  // Reset all records
  const handleResetScores = useCallback(() => {
    const reset = {
      'tower-stack': 0,
      'brick-breaker': 0,
      'trivia-quiz': 0,
    };
    setScores(reset);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeGameId={activeGameId}
        onSelectGame={handleSelectGame}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Layout Area: Left Sidebar + Center Game & Descriptions */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          games={GAMES_DATA}
          activeGameId={activeGameId}
          onSelectGame={handleSelectGame}
          scores={scores}
          onResetScores={handleResetScores}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Center Main Stage */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col">
          {/* Main Top Header Section */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                <span>{activeGame.category}</span>
                <span aria-hidden="true">·</span>
                <span className={activeGame.accentText}>{activeGame.difficulty} Seviye</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-display">
                {activeGame.title}
              </h1>
            </div>

            {/* Quick Action Button to see Briefing / How to play */}
            {gameState !== 'BRIEFING' && (
              <button
                onClick={handleOpenBriefing}
                className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Nasıl Oynanır?</span>
              </button>
            )}
          </div>

          {/* Game Viewport Container with Absolute Briefing & Countdown Overlays */}
          <div className="relative w-full max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden bg-slate-900 border border-slate-800">
            {/* The Active Game Canvas Component */}
            {activeGameId === 'tower-stack' && (
              <TowerStackerGame
                gameState={gameState}
                onGameOver={handleGameOver}
                onRestart={handleRestart}
                onOpenBriefing={handleOpenBriefing}
                highScore={scores['tower-stack']}
              />
            )}

            {activeGameId === 'brick-breaker' && (
              <BrickBreakerGame
                gameState={gameState}
                onGameOver={handleGameOver}
                onRestart={handleRestart}
                onOpenBriefing={handleOpenBriefing}
                highScore={scores['brick-breaker']}
              />
            )}

            {activeGameId === 'trivia-quiz' && (
              <TriviaQuizGame
                gameState={gameState}
                onGameOver={handleGameOver}
                onRestart={handleRestart}
                onOpenBriefing={handleOpenBriefing}
                highScore={scores['trivia-quiz']}
              />
            )}

            {/* BRIEFING OVERLAY (MANDATORY GATE: User must read how to play and click "Oyuna Başla") */}
            {gameState === 'BRIEFING' && (
              <GameBriefingModal
                game={activeGame}
                highScore={scores[activeGameId]}
                onStartGame={handleStartGame}
              />
            )}

            {/* 3-2-1 COUNTDOWN OVERLAY */}
            {gameState === 'COUNTDOWN' && (
              <CountdownOverlay onComplete={handleCountdownFinished} />
            )}
          </div>

          {/* Under-Game Detailed Explanation Section */}
          <div className="max-w-4xl w-full mx-auto">
            <GameDescriptionSection
              game={activeGame}
              highScore={scores[activeGameId]}
            />
          </div>

          {/* Footer note */}
          <footer className="mt-12 pt-6 pb-4 border-t border-slate-800/60 text-center text-xs text-slate-500">
            <p>Piksel Arena &copy; 2026. Çevrimiçi Web Arcade Deneyimi.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
