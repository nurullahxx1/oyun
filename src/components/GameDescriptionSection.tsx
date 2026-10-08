import React from 'react';
import { GameMetadata } from '../types/game';
import { Sparkles, Gamepad2, Shield, Flame, Zap, Award, Lightbulb, Trophy, CheckCircle2 } from 'lucide-react';

interface GameDescriptionSectionProps {
  game: GameMetadata;
  highScore: number;
}

export const GameDescriptionSection: React.FC<GameDescriptionSectionProps> = ({
  game,
  highScore,
}) => {
  return (
    <section className="w-full mt-8 pt-8 border-t border-slate-800/80">
      <div className="flex flex-col gap-8">
        {/* Title and Short Overview */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span>Rehber & Açıklama</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
              {game.title} Hakkında
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {game.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="font-semibold text-slate-200">Hedef:</span>
              <span>{game.objective}</span>
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 min-w-[200px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Senin Rekorun:</span>
              <span className="font-mono-num font-bold text-amber-400">
                {(highScore || 0).toLocaleString('tr-TR')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Zorluk:</span>
              <span className="font-semibold text-slate-200">{game.difficulty}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Oyun Modu:</span>
              <span className="font-semibold text-emerald-400">Çevrimiçi / Sonsuz</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: How to Play + Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rules & Gameplay */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              Nasıl Oynanır?
            </h4>
            <div className="space-y-3">
              {game.rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                    {idx + 1}
                  </span>
                  <p className="leading-snug">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Table */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Kontroller & Kısayollar
            </h4>
            <div className="space-y-2.5">
              {game.controls.map((ctrl, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <kbd className="px-2.5 py-1 bg-slate-800 text-slate-200 font-mono font-semibold rounded border border-slate-700 shadow-sm">
                    {ctrl.key}
                  </kbd>
                  <span className="text-slate-300 font-medium text-right pl-2">
                    {ctrl.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Powerups if available */}
        {game.powerups && game.powerups.length > 0 && (
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Özel Güçlendirmeler & Çekirdekler
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {game.powerups.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-slate-950 text-xs font-bold`}>
                      ★
                    </div>
                    <span className="font-bold text-sm text-slate-100">{p.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pro Tips & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pro Tips */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              Usta Taktikleri & İpuçları
            </h4>
            <div className="space-y-3">
              {game.proTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300"
                >
                  <span className="text-amber-400 font-bold shrink-0">💡</span>
                  <p className="leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Kazanılabilir Başarımlar
            </h4>
            <div className="space-y-3">
              {game.achievements.map((ach) => {
                const isUnlocked = highScore >= ach.requiredScore;
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      isUnlocked
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isUnlocked
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">
                            {ach.name}
                          </span>
                          {isUnlocked && (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Kazanıldı
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{ach.description}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono-num font-bold text-slate-400 whitespace-nowrap">
                      {ach.requiredScore} Puan
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
