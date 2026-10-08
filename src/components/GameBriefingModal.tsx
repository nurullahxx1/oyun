import React from 'react';
import { GameMetadata } from '../types/game';
import { Play, Sparkles, Trophy, Shield, Zap, Flame, Award, Gamepad2, ArrowRight } from 'lucide-react';

interface GameBriefingModalProps {
  game: GameMetadata;
  highScore: number;
  onStartGame: () => void;
}

export const GameBriefingModal: React.FC<GameBriefingModalProps> = ({
  game,
  highScore,
  onStartGame,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-white my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Game Tag & High Score */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">Zorluk: {game.difficulty}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {game.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">En Yüksek</span>
              <span className="text-sm font-extrabold text-amber-300 font-mono-num">
                {(highScore || 0).toLocaleString('tr-TR')}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Banner with zero broken image fallback */}
        <div className="relative my-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[21/9]">
          <img
            src={game.image}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-4">
            <p className="text-sm text-slate-200 font-medium drop-shadow-md">
              {game.tagline}
            </p>
          </div>
        </div>

        {/* Narrative / About Brief */}
        <div className="mb-5 bg-slate-950/60 rounded-xl p-4 border border-slate-800/60">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Oyunun Amacı & Tanıtımı
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Step-by-Step How to Play */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
            Nasıl Oynanır? (Kurallar)
          </h3>
          <ul className="grid grid-cols-1 gap-2 text-sm text-slate-300">
            {game.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-800/40">
                <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Controls Grid */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Kontrol Tuşları
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {game.controls.map((ctrl, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800"
              >
                <kbd className="px-2 py-1 bg-slate-800 text-slate-100 font-mono font-semibold text-[11px] rounded border border-slate-700 shadow-sm">
                  {ctrl.key}
                </kbd>
                <span className="text-slate-300 font-medium text-right pl-2">
                  {ctrl.action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Big Start Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Hazırsan butona tıkla ve maceraya başla!
          </div>

          <button
            onClick={onStartGame}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-black text-base rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
          >
            <Play className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>OYUNA BAŞLA</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
