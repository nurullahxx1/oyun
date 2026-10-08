import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { RotateCcw, HelpCircle, Sparkles, Trophy, Zap } from 'lucide-react';
import { MobileControls } from '../MobileControls';

interface TowerStackerGameProps {
  gameState: GameState;
  onGameOver: (finalScore: number) => void;
  onRestart: () => void;
  onOpenBriefing: () => void;
  highScore: number;
}

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface FallingSlice {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  vy: number;
  rot: number;
  vRot: number;
  alpha: number;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

export const TowerStackerGame: React.FC<TowerStackerGameProps> = ({
  gameState,
  onGameOver,
  onRestart,
  onOpenBriefing,
  highScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live HUD States
  const [level, setLevel] = useState(0);
  const [combo, setCombo] = useState(0);
  const [milestone, setMilestone] = useState<string | null>(null);

  const stateRef = useRef({
    blockHeight: 28,
    initialWidth: 220,
    stack: [] as Block[],
    currentBlock: {
      x: 50,
      y: 0,
      width: 220,
      height: 28,
      speed: 3.5,
      direction: 1,
      color: '#f43f5e',
    },
    fallingSlices: [] as FallingSlice[],
    sparkles: [] as Sparkle[],
    combo: 0,
    level: 0,
    cameraY: 0,
    targetCameraY: 0,
    isOver: false,
  });

  const getColorForLevel = (lvl: number) => {
    const hue = (lvl * 15 + 340) % 360;
    return `hsl(${hue}, 85%, 60%)`;
  };

  const handlePlaceBlock = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    const st = stateRef.current;
    if (st.isOver) return;

    const topBlock = st.stack[st.stack.length - 1];
    const curr = st.currentBlock;
    const diff = curr.x - topBlock.x;
    const absDiff = Math.abs(diff);

    // PERFECT HIT TOLERANCE
    if (absDiff <= 4) {
      // Perfect match!
      curr.x = topBlock.x; // Snap
      st.combo++;
      soundManager.playStackSuccess(st.combo);
      if (st.combo >= 3) {
        soundManager.playPerfectCombo();
        // Expand width if reduced
        curr.width = Math.min(st.initialWidth, curr.width + 12);
      }

      // Sparkle burst
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        st.sparkles.push({
          x: curr.x + (Math.random() * curr.width),
          y: curr.y + curr.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          color: '#fef08a',
          alpha: 1,
          size: Math.random() * 3 + 2,
        });
      }
    } else if (absDiff < curr.width) {
      // Partial hit - Cut off overhang!
      st.combo = 0;
      soundManager.playStackSuccess(0);

      const newWidth = curr.width - absDiff;
      let sliceX: number;
      let sliceWidth = absDiff;

      if (diff > 0) {
        // Overhang on right
        sliceX = topBlock.x + curr.width;
        curr.x = topBlock.x + diff;
      } else {
        // Overhang on left
        sliceX = curr.x;
        curr.x = topBlock.x;
      }
      curr.width = newWidth;

      // Add falling sliced piece
      st.fallingSlices.push({
        x: sliceX,
        y: curr.y,
        width: sliceWidth,
        height: curr.height,
        color: curr.color,
        vy: 1,
        rot: 0,
        vRot: (Math.random() - 0.5) * 0.1,
        alpha: 1,
      });
    } else {
      // Completely missed!
      st.isOver = true;
      soundManager.playGameOver();

      // Drop entire current block
      st.fallingSlices.push({
        x: curr.x,
        y: curr.y,
        width: curr.width,
        height: curr.height,
        color: curr.color,
        vy: 2,
        rot: 0,
        vRot: (curr.direction > 0 ? 0.08 : -0.08),
        alpha: 1,
      });

      onGameOver(st.level);
      return;
    }

    // Push placed block to stack
    st.stack.push({
      x: curr.x,
      y: curr.y,
      width: curr.width,
      height: curr.height,
      color: curr.color,
    });

    st.level++;
    setLevel(st.level);
    setCombo(st.combo);

    // Milestones check
    if (st.level === 5) setMilestone('5. Kat: Temel Sağlam!');
    else if (st.level === 10) setMilestone('10. Kat: Göğe Yükseliş!');
    else if (st.level === 20) setMilestone('20. Kat: Gökdelen Mimarı!');
    else if (st.level === 35) setMilestone('35. Kat: Kozmik Zirve!');
    else setMilestone(null);

    // Prepare next block
    const nextY = curr.y - st.blockHeight;
    const nextColor = getColorForLevel(st.level);
    const speed = Math.min(6.5, 3.4 + st.level * 0.09);

    st.currentBlock = {
      x: st.level % 2 === 0 ? 30 : 450,
      y: nextY,
      width: curr.width,
      height: st.blockHeight,
      speed,
      direction: st.level % 2 === 0 ? 1 : -1,
      color: nextColor,
    };

    // Smooth camera target
    if (st.level > 5) {
      st.targetCameraY = (st.level - 5) * st.blockHeight;
    }
  }, [gameState, onGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 560;
    const height = 520;
    canvas.width = width;
    canvas.height = height;

    const st = stateRef.current;

    // Reset game state
    if (gameState === 'PLAYING') {
      const baseWidth = 220;
      const baseHeight = 35;
      const baseY = height - baseHeight - 40;
      const baseX = (width - baseWidth) / 2;

      st.stack = [
        {
          x: baseX,
          y: baseY,
          width: baseWidth,
          height: baseHeight,
          color: getColorForLevel(0),
        },
      ];

      st.currentBlock = {
        x: 40,
        y: baseY - st.blockHeight,
        width: baseWidth,
        height: st.blockHeight,
        speed: 3.5,
        direction: 1,
        color: getColorForLevel(1),
      };

      st.fallingSlices = [];
      st.sparkles = [];
      st.combo = 0;
      st.level = 0;
      st.cameraY = 0;
      st.targetCameraY = 0;
      st.isOver = false;

      setLevel(0);
      setCombo(0);
      setMilestone(null);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlaceBlock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    let animationFrameId: number;

    const gameLoop = () => {
      // Smooth Camera Lerp
      st.cameraY += (st.targetCameraY - st.cameraY) * 0.1;

      // Update Moving Current Block
      if (gameState === 'PLAYING' && !st.isOver) {
        const curr = st.currentBlock;
        curr.x += curr.speed * curr.direction;
        if (curr.x > width - curr.width - 20) {
          curr.direction = -1;
        } else if (curr.x < 20) {
          curr.direction = 1;
        }
      }

      // Update Falling Slices
      for (let i = st.fallingSlices.length - 1; i >= 0; i--) {
        const sl = st.fallingSlices[i];
        sl.y += sl.vy;
        sl.vy += 0.45; // gravity
        sl.rot += sl.vRot;
        sl.alpha -= 0.015;
        if (sl.alpha <= 0 || sl.y > height + 100) {
          st.fallingSlices.splice(i, 1);
        }
      }

      // Update Sparkles
      for (let i = st.sparkles.length - 1; i >= 0; i--) {
        const sp = st.sparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= 0.03;
        if (sp.alpha <= 0) {
          st.sparkles.splice(i, 1);
        }
      }

      // RENDER
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Starry twilight particles in background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 37) % width);
        const sy = ((i * 73 + st.cameraY * 0.2) % height);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      ctx.save();
      // Apply camera vertical offset
      ctx.translate(0, st.cameraY);

      // Draw Stack Blocks
      st.stack.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, 4);
        ctx.fill();

        // 3D Top bevel highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(b.x, b.y, b.width, 3);
      });
      ctx.shadowBlur = 0;

      // Draw Current Moving Block (if not over)
      if (!st.isOver) {
        const curr = st.currentBlock;
        ctx.fillStyle = curr.color;
        ctx.shadowColor = curr.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(curr.x, curr.y, curr.width, curr.height, 4);
        ctx.fill();

        // Top highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(curr.x, curr.y, curr.width, 4);
        ctx.shadowBlur = 0;
      }

      // Draw Falling Slices
      st.fallingSlices.forEach((sl) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, sl.alpha);
        ctx.translate(sl.x + sl.width / 2, sl.y + sl.height / 2);
        ctx.rotate(sl.rot);
        ctx.fillStyle = sl.color;
        ctx.fillRect(-sl.width / 2, -sl.height / 2, sl.width, sl.height);
        ctx.restore();
      });

      // Draw Sparkles
      st.sparkles.forEach((sp) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, onGameOver, handlePlaceBlock]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* HUD Header Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 rounded-t-2xl text-xs sm:text-sm text-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 uppercase text-[11px] font-bold">Kat Sayısı</span>
            <span className="font-mono-num font-black text-rose-400 text-base">{level}</span>
          </div>

          {combo > 1 && (
            <span className="text-amber-300 font-bold text-xs bg-amber-400/15 px-2 py-0.5 rounded border border-amber-400/40 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-400" /> {combo}x Kusursuz
            </span>
          )}

          {milestone && (
            <span className="text-emerald-300 text-[11px] font-bold hidden sm:inline-block">
              {milestone}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBriefing}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Nasıl Oynanır?"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        className="relative w-full aspect-[5.6/5.2] max-h-[520px] bg-slate-950 border-x border-b border-slate-800 rounded-b-2xl overflow-hidden flex items-center justify-center cursor-pointer select-none"
        onClick={handlePlaceBlock}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain touch-none"
        />

        {/* Visual Cue for Click/Tap */}
        {gameState === 'PLAYING' && level === 0 && (
          <div className="absolute top-12 px-3 py-1.5 bg-slate-900/80 backdrop-blur rounded-full border border-slate-700 text-[11px] font-medium text-slate-300 pointer-events-none animate-pulse">
            Bloğu durdurmak için tıkla veya Boşluk tuşuna bas!
          </div>
        )}

        {/* Game Over Modal Overlay */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm p-6 text-center animate-in fade-in duration-200">
            <span className="text-4xl sm:text-5xl font-black text-rose-500 mb-2 font-display">
              KULE YIKILDI!
            </span>
            <p className="text-sm text-slate-300 mb-6">Blok desteğini kaybetti ve kule devrildi!</p>

            <div className="flex items-center gap-6 mb-6 p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Toplam Kat</span>
                <span className="text-2xl font-black text-rose-400 font-mono-num">{level}</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">En Yüksek</span>
                <span className="text-2xl font-black text-amber-400 font-mono-num">
                  {Math.max(level, highScore)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRestart();
                }}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-400 active:scale-95 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                Yeniden İnşa Et
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBriefing();
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
              >
                <HelpCircle className="w-4 h-4" />
                Nasıl Oynanır?
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <MobileControls
        gameId="tower-stack"
        onDirection={() => {}}
        onAction={handlePlaceBlock}
        actionLabel="Bloğu Yerleştir"
      />
    </div>
  );
};
