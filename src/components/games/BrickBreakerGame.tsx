import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { Heart, RotateCcw, HelpCircle, Sparkles, Zap, Flame, Shield } from 'lucide-react';
import { MobileControls } from '../MobileControls';

interface BrickBreakerGameProps {
  gameState: GameState;
  onGameOver: (finalScore: number) => void;
  onRestart: () => void;
  onOpenBriefing: () => void;
  highScore: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isFireball: boolean;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  alive: boolean;
  hp: number;
}

interface PowerUp {
  x: number;
  y: number;
  vy: number;
  type: 'MULTIBALL' | 'FIREBALL' | 'WIDE' | 'SHIELD' | 'LASER';
  color: string;
  label: string;
}

interface LaserBolt {
  x: number;
  y: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export const BrickBreakerGame: React.FC<BrickBreakerGameProps> = ({
  gameState,
  onGameOver,
  onRestart,
  onOpenBriefing,
  highScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // HUD States
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(1);
  const [activeBuff, setActiveBuff] = useState<string | null>(null);

  // Mutable Game Loop State
  const stateRef = useRef({
    score: 0,
    lives: 3,
    level: 1,
    combo: 1,
    isOver: false,
    paddle: {
      x: 270,
      y: 490,
      width: 110,
      baseWidth: 110,
      height: 14,
      speed: 8.5,
      hasLaser: false,
      laserTimer: 0,
      wideTimer: 0,
    },
    balls: [] as Ball[],
    bricks: [] as Brick[],
    powerUps: [] as PowerUp[],
    lasers: [] as LaserBolt[],
    particles: [] as Particle[],
    shieldTimer: 0,
    fireballTimer: 0,
    screenShake: 0,
    keys: {
      ArrowLeft: false,
      ArrowRight: false,
      KeyA: false,
      KeyD: false,
      Space: false,
    },
    isLaunched: false,
  });

  // Generate Bricks for current level
  const generateLevelBricks = useCallback((lvl: number): Brick[] => {
    const bricks: Brick[] = [];
    const rows = Math.min(6, 4 + lvl);
    const cols = 9;
    const brickWidth = 62;
    const brickHeight = 22;
    const paddingX = 8;
    const paddingY = 8;
    const offsetX = 18;
    const offsetY = 50;

    const rowColors = [
      { color: '#f43f5e', points: 50 }, // Rose
      { color: '#fb923c', points: 40 }, // Orange
      { color: '#facc15', points: 30 }, // Amber
      { color: '#34d399', points: 20 }, // Emerald
      { color: '#38bdf8', points: 15 }, // Cyan
      { color: '#a855f7', points: 10 }, // Purple
    ];

    for (let r = 0; r < rows; r++) {
      const rowStyle = rowColors[r % rowColors.length];
      for (let c = 0; c < cols; c++) {
        // Special patterns for higher levels
        if (lvl > 1 && (r + c) % 5 === 0 && r > 2) continue; // interesting gaps

        bricks.push({
          x: offsetX + c * (brickWidth + paddingX),
          y: offsetY + r * (brickHeight + paddingY),
          width: brickWidth,
          height: brickHeight,
          color: rowStyle.color,
          points: rowStyle.points * lvl,
          alive: true,
          hp: r === 0 && lvl > 2 ? 2 : 1,
        });
      }
    }
    return bricks;
  }, []);

  // Launch the ball if held on paddle
  const launchBall = useCallback(() => {
    const st = stateRef.current;
    if (!st.isLaunched && st.balls.length > 0) {
      st.isLaunched = true;
      const b = st.balls[0];
      const speed = 6 + st.level * 0.4;
      b.vx = (Math.random() - 0.5) * 4;
      b.vy = -speed;
      soundManager.playLaser();
    }
  }, []);

  // Fire paddle lasers if buff is active
  const fireLasers = useCallback(() => {
    const st = stateRef.current;
    if (st.paddle.hasLaser && performance.now() < st.paddle.laserTimer) {
      soundManager.playLaser();
      st.lasers.push({ x: st.paddle.x + 12, y: st.paddle.y - 8, vy: -12 });
      st.lasers.push({ x: st.paddle.x + st.paddle.width - 12, y: st.paddle.y - 8, vy: -12 });
    }
  }, []);

  // Mobile paddle direction
  const handleMobileDirection = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const p = stateRef.current.paddle;
    const delta = 45;
    if (dir === 'LEFT') p.x = Math.max(10, p.x - delta);
    if (dir === 'RIGHT') p.x = Math.min(650 - p.width - 10, p.x + delta);
  }, []);

  // Canvas Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 650;
    const height = 530;
    canvas.width = width;
    canvas.height = height;

    const st = stateRef.current;

    // Reset game state on PLAYING start
    if (gameState === 'PLAYING') {
      st.score = 0;
      st.lives = 3;
      st.level = 1;
      st.combo = 1;
      st.isOver = false;
      st.isLaunched = false;
      st.paddle.x = (width - st.paddle.baseWidth) / 2;
      st.paddle.width = st.paddle.baseWidth;
      st.paddle.hasLaser = false;
      st.balls = [
        {
          x: width / 2,
          y: st.paddle.y - 12,
          vx: 0,
          vy: 0,
          radius: 7,
          isFireball: false,
        },
      ];
      st.bricks = generateLevelBricks(1);
      st.powerUps = [];
      st.lasers = [];
      st.particles = [];
      st.shieldTimer = 0;
      st.fireballTimer = 0;

      setScore(0);
      setLives(3);
      setLevel(1);
      setCombo(1);
      setActiveBuff(null);
    }

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') st.keys.ArrowLeft = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') st.keys.ArrowRight = true;
      if (e.code === 'Space') {
        launchBall();
        fireLasers();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') st.keys.ArrowLeft = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') st.keys.ArrowRight = false;
    };

    // Smooth Mouse / Pointer move control
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      st.paddle.x = Math.max(10, Math.min(width - st.paddle.width - 10, mouseX - st.paddle.width / 2));
    };

    const handlePointerDown = () => {
      launchBall();
      fireLasers();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);

    let animId: number;

    const createBrickParticles = (bx: number, by: number, bw: number, bh: number, color: string) => {
      for (let i = 0; i < 16; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4 + 1.5;
        st.particles.push({
          x: bx + bw / 2,
          y: by + bh / 2,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          color,
          size: Math.random() * 3.5 + 1.5,
          alpha: 1,
        });
      }
    };

    const spawnPowerup = (x: number, y: number) => {
      const types: PowerUp['type'][] = ['MULTIBALL', 'FIREBALL', 'WIDE', 'SHIELD', 'LASER'];
      const chosen = types[Math.floor(Math.random() * types.length)];
      const colors = {
        MULTIBALL: '#38bdf8',
        FIREBALL: '#f43f5e',
        WIDE: '#34d399',
        SHIELD: '#a855f7',
        LASER: '#fbbf24',
      };
      const labels = {
        MULTIBALL: '3x Top',
        FIREBALL: 'Alev Topu',
        WIDE: 'Geniş Raket',
        SHIELD: 'Taban Kalkanı',
        LASER: 'Lazer Namlu',
      };
      st.powerUps.push({
        x,
        y,
        vy: 2.2,
        type: chosen,
        color: colors[chosen],
        label: labels[chosen],
      });
    };

    const loop = () => {
      const now = performance.now();

      // Screen shake decay
      if (st.screenShake > 0) {
        st.screenShake *= 0.88;
        if (st.screenShake < 0.1) st.screenShake = 0;
      }

      ctx.save();
      if (st.screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * st.screenShake * 8, (Math.random() - 0.5) * st.screenShake * 8);
      }

      // PHYSICS UPDATE
      if (gameState === 'PLAYING' && !st.isOver) {
        // Paddle movement via keyboard
        const p = st.paddle;
        if (st.keys.ArrowLeft) p.x -= p.speed;
        if (st.keys.ArrowRight) p.x += p.speed;
        p.x = Math.max(10, Math.min(width - p.width - 10, p.x));

        // Buff Timers
        if (p.wideTimer > 0 && now > p.wideTimer) {
          p.width = p.baseWidth;
          p.wideTimer = 0;
        }
        if (p.hasLaser && now > p.laserTimer) {
          p.hasLaser = false;
        }
        if (st.fireballTimer > 0 && now > st.fireballTimer) {
          st.balls.forEach((b) => (b.isFireball = false));
          st.fireballTimer = 0;
        }

        // Active Buff HUD label
        if (now < p.laserTimer) setActiveBuff('Lazer Namluları (Ateş Et!)');
        else if (now < st.fireballTimer) setActiveBuff('Plazma Alev Topu!');
        else if (now < st.shieldTimer) setActiveBuff('Taban Kalkanı Koruyor');
        else if (now < p.wideTimer) setActiveBuff('Genişletilmiş Raket');
        else setActiveBuff(null);

        // If not launched, ball sticks to paddle
        if (!st.isLaunched && st.balls.length > 0) {
          st.balls[0].x = p.x + p.width / 2;
          st.balls[0].y = p.y - st.balls[0].radius - 2;
        }

        // Update Balls
        for (let bIdx = st.balls.length - 1; bIdx >= 0; bIdx--) {
          const b = st.balls[bIdx];
          if (!st.isLaunched) continue;

          b.x += b.vx;
          b.y += b.vy;

          // Wall Collisions
          if (b.x - b.radius < 0) {
            b.x = b.radius;
            b.vx = Math.abs(b.vx);
            soundManager.playTick();
          } else if (b.x + b.radius > width) {
            b.x = width - b.radius;
            b.vx = -Math.abs(b.vx);
            soundManager.playTick();
          }

          // Ceiling Collision
          if (b.y - b.radius < 0) {
            b.y = b.radius;
            b.vy = Math.abs(b.vy);
            soundManager.playTick();
          }

          // Floor Shield Collision
          if (now < st.shieldTimer && b.y + b.radius >= height - 12) {
            b.y = height - 12 - b.radius;
            b.vy = -Math.abs(b.vy);
            soundManager.playStackSuccess(1);
          }

          // Paddle Collision
          if (
            b.y + b.radius >= p.y &&
            b.y - b.radius <= p.y + p.height &&
            b.x >= p.x &&
            b.x <= p.x + p.width
          ) {
            // Calculate deflection angle based on hit location
            const hitPoint = (b.x - (p.x + p.width / 2)) / (p.width / 2); // -1 to 1
            const maxBounceAngle = Math.PI / 3; // 60 degrees
            const bounceAngle = hitPoint * maxBounceAngle;
            const currentSpeed = Math.hypot(b.vx, b.vy);

            b.vx = currentSpeed * Math.sin(bounceAngle);
            b.vy = -currentSpeed * Math.cos(bounceAngle);
            b.y = p.y - b.radius - 1;

            soundManager.playStackSuccess(st.combo);
          }

          // Ball vs Bricks Collision
          for (let brickIdx = st.bricks.length - 1; brickIdx >= 0; brickIdx--) {
            const brick = st.bricks[brickIdx];
            if (!brick.alive) continue;

            if (
              b.x + b.radius > brick.x &&
              b.x - b.radius < brick.x + brick.width &&
              b.y + b.radius > brick.y &&
              b.y - b.radius < brick.y + brick.height
            ) {
              // Brick Hit!
              brick.hp--;
              if (brick.hp <= 0) {
                brick.alive = false;
                createBrickParticles(brick.x, brick.y, brick.width, brick.height, brick.color);
                soundManager.playExplosion(false);

                st.score += brick.points * st.combo;
                st.combo = Math.min(st.combo + 1, 5);
                setScore(st.score);
                setCombo(st.combo);

                // Chance to drop power-up
                if (Math.random() < 0.28) {
                  spawnPowerup(brick.x + brick.width / 2, brick.y + brick.height);
                }
              }

              // Fireball does not bounce, passes through!
              if (!b.isFireball) {
                // Determine collision side
                const overlapLeft = b.x + b.radius - brick.x;
                const overlapRight = brick.x + brick.width - (b.x - b.radius);
                const overlapTop = b.y + b.radius - brick.y;
                const overlapBottom = brick.y + brick.height - (b.y - b.radius);

                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                  b.vx = -b.vx;
                } else {
                  b.vy = -b.vy;
                }
                break;
              }
            }
          }

          // Ball Fell off Bottom
          if (b.y - b.radius > height) {
            st.balls.splice(bIdx, 1);
          }
        }

        // If all balls are lost
        if (st.balls.length === 0) {
          st.lives--;
          st.combo = 1;
          st.screenShake = 1.4;
          soundManager.playGameOver();
          setLives(st.lives);
          setCombo(1);

          if (st.lives <= 0) {
            st.isOver = true;
            onGameOver(st.score);
          } else {
            // Respawn single ball on paddle
            st.isLaunched = false;
            st.balls = [
              {
                x: p.x + p.width / 2,
                y: p.y - 12,
                vx: 0,
                vy: 0,
                radius: 7,
                isFireball: false,
              },
            ];
          }
        }

        // Check Level Complete (all bricks destroyed)
        const hasAliveBricks = st.bricks.some((br) => br.alive);
        if (!hasAliveBricks && st.bricks.length > 0) {
          soundManager.playPerfectCombo();
          st.level++;
          setLevel(st.level);
          st.bricks = generateLevelBricks(st.level);
          st.isLaunched = false;
          st.balls = [
            {
              x: p.x + p.width / 2,
              y: p.y - 12,
              vx: 0,
              vy: 0,
              radius: 7,
              isFireball: false,
            },
          ];
        }

        // Update Powerups
        for (let i = st.powerUps.length - 1; i >= 0; i--) {
          const pu = st.powerUps[i];
          pu.y += pu.vy;

          // Catch by paddle
          if (
            pu.y + 12 >= p.y &&
            pu.y <= p.y + p.height &&
            pu.x + 18 >= p.x &&
            pu.x - 18 <= p.x + p.width
          ) {
            soundManager.playPowerup();

            if (pu.type === 'MULTIBALL') {
              // Spawn 2 extra balls
              if (st.balls.length > 0) {
                const base = st.balls[0];
                st.balls.push({
                  x: base.x,
                  y: base.y,
                  vx: base.vx - 2.5,
                  vy: base.vy,
                  radius: 7,
                  isFireball: base.isFireball,
                });
                st.balls.push({
                  x: base.x,
                  y: base.y,
                  vx: base.vx + 2.5,
                  vy: base.vy,
                  radius: 7,
                  isFireball: base.isFireball,
                });
              }
            } else if (pu.type === 'FIREBALL') {
              st.fireballTimer = now + 9000;
              st.balls.forEach((b) => (b.isFireball = true));
            } else if (pu.type === 'WIDE') {
              p.width = p.baseWidth * 1.5;
              p.wideTimer = now + 10000;
            } else if (pu.type === 'SHIELD') {
              st.shieldTimer = now + 12000;
            } else if (pu.type === 'LASER') {
              p.hasLaser = true;
              p.laserTimer = now + 9000;
            }

            st.score += 50;
            setScore(st.score);
            st.powerUps.splice(i, 1);
          } else if (pu.y > height + 20) {
            st.powerUps.splice(i, 1);
          }
        }

        // Update Lasers
        for (let i = st.lasers.length - 1; i >= 0; i--) {
          const l = st.lasers[i];
          l.y += l.vy;

          // Check collision with bricks
          for (let bIdx = st.bricks.length - 1; bIdx >= 0; bIdx--) {
            const brick = st.bricks[bIdx];
            if (!brick.alive) continue;
            if (
              l.x >= brick.x &&
              l.x <= brick.x + brick.width &&
              l.y >= brick.y &&
              l.y <= brick.y + brick.height
            ) {
              brick.hp--;
              if (brick.hp <= 0) {
                brick.alive = false;
                createBrickParticles(brick.x, brick.y, brick.width, brick.height, brick.color);
                soundManager.playExplosion(false);
                st.score += brick.points;
                setScore(st.score);
              }
              st.lasers.splice(i, 1);
              break;
            }
          }

          if (l.y < -10) {
            st.lasers.splice(i, 1);
          }
        }
      }

      // Update Particles
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const pt = st.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.035;
        if (pt.alpha <= 0) {
          st.particles.splice(i, 1);
        }
      }

      // RENDER CANVAS
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.6, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Cyber Grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Floor Shield if active
      if (now < st.shieldTimer) {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(0, height - 8);
        ctx.lineTo(width, height - 8);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw Bricks
      st.bricks.forEach((br) => {
        if (!br.alive) return;
        ctx.fillStyle = br.color;
        ctx.shadowColor = br.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(br.x, br.y, br.width, br.height, 4);
        ctx.fill();

        // 3D Glass top sheen
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.fillRect(br.x, br.y, br.width, 3);
      });
      ctx.shadowBlur = 0;

      // Draw Powerups
      st.powerUps.forEach((pu) => {
        ctx.save();
        ctx.translate(pu.x, pu.y);
        ctx.fillStyle = pu.color;
        ctx.shadowColor = pu.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(-24, -10, 48, 20, 6);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pu.label, 0, 0);
        ctx.restore();
      });

      // Draw Paddle Lasers
      st.lasers.forEach((l) => {
        ctx.fillStyle = '#fde047';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        ctx.fillRect(l.x - 2, l.y, 4, 14);
      });
      ctx.shadowBlur = 0;

      // Draw Paddle
      const p = st.paddle;
      ctx.save();
      ctx.fillStyle = p.hasLaser ? '#fbbf24' : '#38bdf8';
      ctx.shadowColor = p.hasLaser ? '#fbbf24' : '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, 7);
      ctx.fill();

      // Paddle Top Chrome Highlight
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x + 4, p.y + 2, p.width - 8, 3);

      // Laser Barrels on paddle
      if (p.hasLaser) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(p.x + 10, p.y - 6, 4, 6);
        ctx.fillRect(p.x + p.width - 14, p.y - 6, 4, 6);
      }
      ctx.restore();

      // Draw Balls
      st.balls.forEach((b) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);

        if (b.isFireball) {
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#fb923c';
          ctx.shadowBlur = 18;
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
        }
        ctx.fill();
        ctx.restore();
      });

      // Draw Particles
      st.particles.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore(); // screen shake restore

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [gameState, onGameOver, generateLevelBricks, launchBall, fireLasers]);

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 rounded-t-2xl text-xs sm:text-sm text-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 uppercase text-[11px] font-bold">Skor</span>
            <span className="font-mono-num font-black text-sky-400 text-base">{score}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 uppercase text-[11px] font-bold">Seviye</span>
            <span className="font-mono-num font-bold text-slate-200">{level}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 uppercase text-[11px] font-bold mr-1">Can</span>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Heart
                key={idx}
                className={`w-4 h-4 transition-colors ${
                  idx < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeBuff && (
            <span className="text-amber-300 font-extrabold text-[11px] bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/50 flex items-center gap-1 animate-pulse">
              <Zap className="w-3 h-3 text-amber-400" /> {activeBuff}
            </span>
          )}

          {combo > 1 && !activeBuff && (
            <span className="text-sky-400 font-bold text-xs bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/40">
              {combo}x Kombo
            </span>
          )}

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
      <div className="relative w-full aspect-[6.5/5.3] max-h-[530px] bg-slate-950 border-x border-b border-slate-800 rounded-b-2xl overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain cursor-ew-resize touch-none"
        />

        {/* Visual launch prompt if ball waiting */}
        {gameState === 'PLAYING' && !stateRef.current.isLaunched && (
          <div className="absolute bottom-16 px-4 py-2 bg-slate-900/90 backdrop-blur rounded-full border border-sky-500/50 text-xs font-bold text-sky-300 pointer-events-none animate-pulse shadow-lg shadow-sky-950/80">
            Topu Fırlatmak İçin Tıkla veya Boşluk Tuşuna Bas!
          </div>
        )}

        {/* Game Over Modal Overlay */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm p-6 text-center animate-in fade-in duration-200">
            <span className="text-4xl sm:text-5xl font-black text-rose-500 mb-2 font-display">
              OYUN BİTTİ
            </span>
            <p className="text-sm text-slate-300 mb-6">Tüm plazma topları arenadan düştü!</p>

            <div className="flex items-center gap-6 mb-6 p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Toplam Skor</span>
                <span className="text-2xl font-black text-sky-400 font-mono-num">{score}</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">En Yüksek</span>
                <span className="text-2xl font-black text-amber-400 font-mono-num">
                  {Math.max(score, highScore)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onRestart}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                Tekrar Oyna
              </button>
              <button
                onClick={onOpenBriefing}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
              >
                <HelpCircle className="w-4 h-4" />
                Nasıl Oynanır?
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <MobileControls
        gameId="brick-breaker"
        onDirection={handleMobileDirection}
        onAction={launchBall}
        actionLabel="Topu Fırlat"
      />
    </div>
  );
};
