import React from 'react';
import { GameId, GameMetadata, PlayerScores } from '../types/game';
import { Trophy, Gamepad2, Sparkles, ChevronRight, RotateCcw, Flame } from 'lucide-react';

interface SidebarProps {
  games: GameMetadata[];
  activeGameId: GameId;
  onSelectGame: (id: GameId) => void;
  scores: PlayerScores;
  onResetScores: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  games,
  activeGameId,
  onSelectGame,
  scores,
  onResetScores,
  isOpenMobile,
  onCloseMobile,
}) => {
  const totalScore =
    (scores['tower-stack'] || 0) +
    (scores['brick-breaker'] || 0) +
    (scores['trivia-quiz'] || 0);

  const content = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 p-4 sm:p-5 select-none">
      {/* Sidebar Top Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Gamepad2 className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-extrabold uppercase tracking-wider text-white font-display">
            Arcade Oyunları
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Oynamak istediğin oyunu seç ve maceraya başla.
        </p>
      </div>

      {/* Game Selection Cards */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {games.map((g) => {
          const isActive = g.id === activeGameId;
          const currentHighScore = Number(scores?.[g.id]) || 0;

          return (
            <button
              key={g.id}
              onClick={() => {
                onSelectGame(g.id);
                onCloseMobile();
              }}
              className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border flex flex-col gap-2.5 relative group ${
                isActive
                  ? 'bg-slate-900 border-sky-500/60 shadow-lg shadow-sky-950/40 ring-1 ring-sky-500/40'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60 relative">
                  <img
                    src={g.image}
                    alt={g.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-sky-500/15 ring-2 ring-inset ring-sky-400 rounded-lg pointer-events-none" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-slate-400 truncate">
                      {g.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 shrink-0">
                      {g.difficulty}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold truncate transition-colors ${
                      isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {g.title}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                    <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Rekor:</span>
                    <span className="font-mono-num font-bold text-amber-300">
                      {currentHighScore.toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 transition-transform shrink-0 ${
                    isActive ? 'text-sky-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </div>

              {/* Tagline / Subtitle */}
              <p className="text-[11px] text-slate-400 line-clamp-1 border-t border-slate-800/60 pt-1.5">
                {g.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Player Aggregate Stats Box */}
      <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Toplam Skor
          </span>
          <span className="font-mono-num font-extrabold text-base text-amber-300">
            {(totalScore || 0).toLocaleString('tr-TR')}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Tüm oyunlardaki rekor puanlarının genel toplamıdır.
        </p>

        <button
          onClick={() => {
            if (window.confirm('Tüm oyunlardaki rekorlarınızı sıfırlamak istediğinize emin misiniz?')) {
              onResetScores();
            }
          }}
          className="mt-3 w-full py-1.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-[11px] font-semibold rounded-lg border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Skorları Sıfırla
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden md:block w-72 lg:w-80 shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
