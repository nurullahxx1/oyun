import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Menu, X } from 'lucide-react';
import { GameId } from '../types/game';

interface HeaderProps {
  activeGameId: GameId;
  onSelectGame: (id: GameId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeGameId,
  onSelectGame,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <a
            href="/"
            className="text-xl sm:text-2xl font-black tracking-tight text-white font-display hover:text-sky-400 transition-colors whitespace-nowrap"
          >
            Piksel Arena
          </a>
        </div>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectGame('tower-stack')}
            className={`transition-colors cursor-pointer ${
              activeGameId === 'tower-stack'
                ? 'text-rose-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kule Ustası
          </button>
          <button
            onClick={() => onSelectGame('brick-breaker')}
            className={`transition-colors cursor-pointer ${
              activeGameId === 'brick-breaker'
                ? 'text-sky-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tuğla Kırıcı DX
          </button>
          <button
            onClick={() => onSelectGame('trivia-quiz')}
            className={`transition-colors cursor-pointer ${
              activeGameId === 'trivia-quiz'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Makaralı Kültür
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
            aria-label={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            title={soundEnabled ? 'Ses Açık' : 'Ses Kapalı'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
            <span className="hidden sm:inline-block">
              {soundEnabled ? 'Ses Açık' : 'Sessiz'}
            </span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
            aria-label="Tam Ekran"
            title="Tam Ekran"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline-block">
              {isFullscreen ? 'Küçült' : 'Tam Ekran'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
