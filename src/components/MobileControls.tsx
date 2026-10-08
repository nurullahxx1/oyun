import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Target } from 'lucide-react';
import { GameId } from '../types/game';

interface MobileControlsProps {
  gameId: GameId;
  onDirection: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onAction: () => void;
  actionLabel?: string;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  gameId,
  onDirection,
  onAction,
  actionLabel = 'Ateş / Blok'
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-4 mt-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl select-none touch-manipulation sm:hidden">
      {/* Direction Pad */}
      {gameId !== 'tower-stack' ? (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirection('UP'); }}
            onClick={() => onDirection('UP')}
            className="absolute top-0 w-10 h-10 bg-slate-800 active:bg-sky-500 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow active:scale-95 transition-all"
            aria-label="Yukarı"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirection('DOWN'); }}
            onClick={() => onDirection('DOWN')}
            className="absolute bottom-0 w-10 h-10 bg-slate-800 active:bg-sky-500 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow active:scale-95 transition-all"
            aria-label="Aşağı"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirection('LEFT'); }}
            onClick={() => onDirection('LEFT')}
            className="absolute left-0 w-10 h-10 bg-slate-800 active:bg-sky-500 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow active:scale-95 transition-all"
            aria-label="Sol"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirection('RIGHT'); }}
            onClick={() => onDirection('RIGHT')}
            className="absolute right-0 w-10 h-10 bg-slate-800 active:bg-sky-500 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow active:scale-95 transition-all"
            aria-label="Sağ"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-700" />
        </div>
      ) : (
        <div className="text-xs text-slate-400 pl-2">
          Ekrana dokunarak veya yandaki butona basarak bloğu bırakabilirsin!
        </div>
      )}

      {/* Action Button */}
      <div className="flex-1 flex justify-end">
        <button
          onTouchStart={(e) => { e.preventDefault(); onAction(); }}
          onClick={onAction}
          className="h-20 px-6 bg-gradient-to-br from-rose-500 via-amber-500 to-emerald-500 text-slate-950 font-black rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-transform cursor-pointer"
        >
          <Zap className="w-6 h-6 fill-slate-950" />
          <span className="text-xs uppercase tracking-wider">{actionLabel}</span>
        </button>
      </div>
    </div>
  );
};
