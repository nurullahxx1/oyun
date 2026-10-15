import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../../types/game';
import { soundManager } from '../../utils/audio';
import {
  RotateCcw,
  Sparkles,
  Zap,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Hammer,
  HelpCircle,
  Play,
  Shuffle,
  Flame,
  Award
} from 'lucide-react';

interface Neon2048GameProps {
  gameState: GameState;
  onGameOver: (finalScore: number) => void;
  onRestart: () => void;
  onOpenBriefing: () => void;
  highScore: number;
}

type Board = (number | null)[][];

interface HistoryState {
  board: Board;
  score: number;
}

const GRID_SIZE = 4;

export const Neon2048Game: React.FC<Neon2048GameProps> = ({
  gameState,
  onGameOver,
  onRestart,
  onOpenBriefing,
  highScore,
}) => {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [highestTile, setHighestTile] = useState<number>(2);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [comboText, setComboText] = useState<string | null>(null);

  // Boosters
  const [undoCount, setUndoCount] = useState<number>(3);
  const [hammerCount, setHammerCount] = useState<number>(2);
  const [shuffleCount, setShuffleCount] = useState<number>(1);
  const [isHammerActive, setIsHammerActive] = useState<boolean>(false);

  // Win condition state
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [dismissedWin, setDismissedWin] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Touch tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Create initial empty board with 2 random tiles
  function createInitialBoard(): Board {
    const empty: Board = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null));
    spawnTile(empty);
    spawnTile(empty);
    return empty;
  }

  // Spawn random tile (90% chance 2, 10% chance 4) in an empty cell
  function spawnTile(grid: Board): boolean {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === null) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length === 0) return false;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  // Initialize or reset game
  const initGame = useCallback(() => {
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setScore(0);
    setMoves(0);
    setHighestTile(2);
    setHistory([]);
    setUndoCount(3);
    setHammerCount(2);
    setShuffleCount(1);
    setIsHammerActive(false);
    setHasWon(false);
    setDismissedWin(false);
    setIsPaused(false);
    setComboText(null);
  }, []);

  // Sync with gameState changes
  useEffect(() => {
    if (gameState === 'PLAYING') {
      initGame();
    }
  }, [gameState, initGame]);

  // Check if board has any available moves
  const canMove = useCallback((b: Board): boolean => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (b[r][c] === null) return true;
        // Check horizontal neighbor
        if (c + 1 < GRID_SIZE && b[r][c] === b[r][c + 1]) return true;
        // Check vertical neighbor
        if (r + 1 < GRID_SIZE && b[r][c] === b[r + 1][c]) return true;
      }
    }
    return false;
  }, []);

  // Core movement logic: slides and merges row
  function slideAndMergeRow(row: (number | null)[]): {
    newRow: (number | null)[];
    points: number;
    merges: number;
    maxMerged: number;
  } {
    // 1. Filter non-null
    const filtered = row.filter((val): val is number => val !== null);
    const newRow: (number | null)[] = [];
    let points = 0;
    let merges = 0;
    let maxMerged = 0;

    let i = 0;
    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const mergedVal = filtered[i] * 2;
        newRow.push(mergedVal);
        points += mergedVal;
        merges++;
        if (mergedVal > maxMerged) maxMerged = mergedVal;
        i += 2;
      } else {
        newRow.push(filtered[i]);
        i++;
      }
    }

    while (newRow.length < GRID_SIZE) {
      newRow.push(null);
    }

    return { newRow, points, merges, maxMerged };
  }

  // Execute directional move
  const handleMove = useCallback(
    (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (gameState !== 'PLAYING' || isPaused || isHammerActive) return;

      setBoard((prevBoard) => {
        // Deep copy board
        const nextBoard: Board = prevBoard.map((row) => [...row]);
        let turnPoints = 0;
        let totalMerges = 0;
        let maxMergedVal = 0;

        if (direction === 'LEFT') {
          for (let r = 0; r < GRID_SIZE; r++) {
            const res = slideAndMergeRow(nextBoard[r]);
            nextBoard[r] = res.newRow;
            turnPoints += res.points;
            totalMerges += res.merges;
            if (res.maxMerged > maxMergedVal) maxMergedVal = res.maxMerged;
          }
        } else if (direction === 'RIGHT') {
          for (let r = 0; r < GRID_SIZE; r++) {
            const reversed = [...nextBoard[r]].reverse();
            const res = slideAndMergeRow(reversed);
            nextBoard[r] = res.newRow.reverse();
            turnPoints += res.points;
            totalMerges += res.merges;
            if (res.maxMerged > maxMergedVal) maxMergedVal = res.maxMerged;
          }
        } else if (direction === 'UP') {
          for (let c = 0; c < GRID_SIZE; c++) {
            const col = [nextBoard[0][c], nextBoard[1][c], nextBoard[2][c], nextBoard[3][c]];
            const res = slideAndMergeRow(col);
            for (let r = 0; r < GRID_SIZE; r++) {
              nextBoard[r][c] = res.newRow[r];
            }
            turnPoints += res.points;
            totalMerges += res.merges;
            if (res.maxMerged > maxMergedVal) maxMergedVal = res.maxMerged;
          }
        } else if (direction === 'DOWN') {
          for (let c = 0; c < GRID_SIZE; c++) {
            const col = [nextBoard[3][c], nextBoard[2][c], nextBoard[1][c], nextBoard[0][c]];
            const res = slideAndMergeRow(col);
            const reversed = res.newRow.reverse();
            for (let r = 0; r < GRID_SIZE; r++) {
              nextBoard[r][c] = reversed[r];
            }
            turnPoints += res.points;
            totalMerges += res.merges;
            if (res.maxMerged > maxMergedVal) maxMergedVal = res.maxMerged;
          }
        }

        // Check if anything actually changed
        let changed = false;
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (prevBoard[r][c] !== nextBoard[r][c]) {
              changed = true;
              break;
            }
          }
          if (changed) break;
        }

        if (!changed) {
          return prevBoard; // Invalid move
        }

        // Save history for Undo
        setHistory((prevHist) => [
          ...prevHist.slice(-5),
          { board: prevBoard.map((row) => [...row]), score },
        ]);

        // Spawn a new tile
        spawnTile(nextBoard);

        // Sound & feedback
        if (totalMerges > 0) {
          soundManager.playMerge(maxMergedVal);
          if (totalMerges >= 2) {
            setComboText(`${totalMerges}x Kombo Füzyon!`);
            setTimeout(() => setComboText(null), 1200);
          }
        } else {
          soundManager.playSlide();
        }

        // Update score & highest tile
        const newScore = score + turnPoints;
        setScore(newScore);
        setMoves((m) => m + 1);

        // Calculate max tile
        let currentMax = highestTile;
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            const val = nextBoard[r][c];
            if (val && val > currentMax) {
              currentMax = val;
            }
          }
        }
        setHighestTile(currentMax);

        // Check 2048 Win
        if (currentMax >= 2048 && !hasWon && !dismissedWin) {
          setHasWon(true);
          soundManager.playWinFanfare();
        }

        // Check Game Over
        if (!canMove(nextBoard)) {
          soundManager.playGameOver();
          onGameOver(newScore);
        }

        return nextBoard;
      });
    },
    [gameState, isPaused, isHammerActive, score, highestTile, hasWon, dismissedWin, canMove, onGameOver]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;

      // Avoid scrolling the page with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.key === 'p' || e.key === 'P') {
        setIsPaused((prev) => !prev);
        return;
      }

      if (e.key === 'z' || e.key === 'Z') {
        handleUndo();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleMove('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleMove]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    const minSwipeDist = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDist) {
        if (deltaX > 0) handleMove('RIGHT');
        else handleMove('LEFT');
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDist) {
        if (deltaY > 0) handleMove('DOWN');
        else handleMove('UP');
      }
    }
    touchStartRef.current = null;
  };

  // Booster 1: Undo
  const handleUndo = () => {
    if (undoCount <= 0 || history.length === 0 || isPaused) return;
    const last = history[history.length - 1];
    setBoard(last.board);
    setScore(last.score);
    setHistory((prev) => prev.slice(0, -1));
    setUndoCount((prev) => prev - 1);
    soundManager.playSlide();
  };

  // Booster 2: Toggle Hammer mode
  const handleActivateHammer = () => {
    if (hammerCount <= 0 || isPaused) return;
    setIsHammerActive((prev) => !prev);
  };

  // Apply hammer to a specific tile
  const handleTileClick = (r: number, c: number) => {
    if (!isHammerActive || board[r][c] === null) return;
    soundManager.playHammer();
    setBoard((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = null;
      return copy;
    });
    setHammerCount((prev) => prev - 1);
    setIsHammerActive(false);
  };

  // Booster 3: Shuffle
  const handleShuffle = () => {
    if (shuffleCount <= 0 || isPaused) return;
    setBoard((prev) => {
      const values: number[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (prev[r][c] !== null) {
            values.push(prev[r][c]!);
          }
        }
      }
      // Shuffle values array
      for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
      }
      // Put back into board
      const newBoard: Board = Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(null));
      let idx = 0;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (idx < values.length) {
            newBoard[r][c] = values[idx++];
          }
        }
      }
      return newBoard;
    });
    setShuffleCount((prev) => prev - 1);
    soundManager.playPowerup();
  };

  // Tile visual styling by value
  const getTileStyle = (val: number | null) => {
    if (!val) return 'bg-slate-900/60 border-slate-800/80';
    switch (val) {
      case 2:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-900/40';
      case 4:
        return 'bg-teal-950/80 text-teal-200 border-teal-500/60 shadow-sm shadow-teal-900/40';
      case 8:
        return 'bg-cyan-950/90 text-cyan-200 border-cyan-400/70 shadow-md shadow-cyan-950/60 font-black';
      case 16:
        return 'bg-sky-950 text-sky-200 border-sky-400 shadow-md shadow-sky-900/60 font-black';
      case 32:
        return 'bg-indigo-950 text-indigo-200 border-indigo-400 shadow-lg shadow-indigo-950/80 font-black';
      case 64:
        return 'bg-purple-950 text-purple-200 border-purple-400 shadow-lg shadow-purple-950/80 font-black';
      case 128:
        return 'bg-fuchsia-950 text-fuchsia-200 border-fuchsia-400 shadow-lg shadow-fuchsia-900/80 font-black ring-1 ring-fuchsia-400/50';
      case 256:
        return 'bg-rose-950 text-rose-200 border-rose-400 shadow-lg shadow-rose-900/80 font-black ring-1 ring-rose-400/60';
      case 512:
        return 'bg-amber-950 text-amber-200 border-amber-400 shadow-xl shadow-amber-950/90 font-black ring-2 ring-amber-400/60';
      case 1024:
        return 'bg-yellow-950 text-yellow-100 border-yellow-300 shadow-xl shadow-yellow-900/90 font-black ring-2 ring-yellow-300 animate-pulse';
      case 2048:
        return 'bg-gradient-to-br from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 border-white shadow-2xl font-black ring-4 ring-amber-300 animate-pulse';
      default:
        // 4096+
        return 'bg-gradient-to-tr from-rose-500 via-purple-500 to-sky-400 text-white border-white shadow-2xl font-black ring-4 ring-purple-400';
    }
  };

  const getTileFontSize = (val: number | null) => {
    if (!val) return 'text-xl sm:text-2xl';
    if (val >= 1024) return 'text-xl sm:text-2xl font-black';
    if (val >= 128) return 'text-2xl sm:text-3xl font-black';
    return 'text-3xl sm:text-4xl font-extrabold';
  };

  return (
    <div className="relative w-full aspect-[4/3] min-h-[480px] max-h-[620px] bg-slate-950 flex flex-col items-center justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top HUD: Score, Best, Highest Tile, Controls */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {/* Current Score */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Skor
            </span>
            <span className="text-lg sm:text-xl font-black text-white font-mono-num">
              {score.toLocaleString('tr-TR')}
            </span>
          </div>

          {/* High Score */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow">
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              <Trophy className="w-3 h-3" />
              <span>Rekor</span>
            </div>
            <span className="text-lg sm:text-xl font-black text-amber-300 font-mono-num">
              {Math.max(highScore, score).toLocaleString('tr-TR')}
            </span>
          </div>

          {/* Highest Tile Badge */}
          <div className="hidden sm:flex flex-col bg-slate-900/90 border border-emerald-500/30 rounded-xl px-3 py-1.5 shadow">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              En Yüksek
            </span>
            <span className="text-lg font-black text-emerald-300 font-mono-num">
              {highestTile}
            </span>
          </div>
        </div>

        {/* Action icons: Restart, Pause, Info */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Duraklat (P)"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <span className="font-mono text-xs font-bold px-0.5">II</span>}
          </button>
          <button
            onClick={onRestart}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenBriefing}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Nasıl Oynanır?"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Floating Combo / Alert Message */}
      {comboText && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-rose-950/60 animate-bounce">
          {comboText}
        </div>
      )}

      {/* Hammer Active Banner */}
      {isHammerActive && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg ring-2 ring-rose-400 animate-pulse flex items-center gap-2">
          <Hammer className="w-3.5 h-3.5" />
          <span>Kırmak İstediğin Bloğa Tıkla!</span>
        </div>
      )}

      {/* Main 2048 Game Grid Container */}
      <div
        ref={boardContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative my-auto w-full max-w-[340px] sm:max-w-[380px] aspect-square p-2.5 sm:p-3 bg-slate-900/90 border-2 border-slate-800 rounded-2xl shadow-2xl shadow-slate-950 flex flex-col justify-between touch-none"
      >
        {/* Subtle grid background glow */}
        <div className="absolute inset-0 bg-radial from-emerald-500/5 to-transparent rounded-2xl pointer-events-none" />

        {/* 4x4 Grid Cells */}
        <div className="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-2.5 w-full h-full relative z-10">
          {board.map((row, r) =>
            row.map((val, c) => {
              const isFilled = val !== null;
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleTileClick(r, c)}
                  className={`relative flex items-center justify-center rounded-xl border transition-all duration-150 select-none ${getTileStyle(
                    val
                  )} ${isHammerActive && isFilled ? 'cursor-pointer hover:ring-2 hover:ring-rose-400 hover:scale-105' : ''}`}
                >
                  {isFilled && (
                    <span
                      className={`font-mono-num tracking-tight transition-transform duration-150 ${getTileFontSize(
                        val
                      )}`}
                    >
                      {val}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Boosters Toolbar & Quick Mobile Direction Controls */}
      <div className="w-full max-w-md flex flex-col gap-2 z-10">
        {/* Practical Boosters */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* Undo Booster */}
          <button
            onClick={handleUndo}
            disabled={undoCount <= 0 || history.length === 0 || isPaused}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              undoCount > 0 && history.length > 0
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-300 hover:bg-slate-800 hover:border-emerald-400 active:scale-95'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Geri Al</span>
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono-num flex items-center justify-center">
              {undoCount}
            </span>
          </button>

          {/* Hammer Booster */}
          <button
            onClick={handleActivateHammer}
            disabled={hammerCount <= 0 || isPaused}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              isHammerActive
                ? 'bg-rose-600 border-rose-400 text-white ring-2 ring-rose-400 animate-pulse'
                : hammerCount > 0
                ? 'bg-slate-900 border-rose-500/40 text-rose-300 hover:bg-slate-800 hover:border-rose-400 active:scale-95'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Balyoz</span>
            <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono-num flex items-center justify-center">
              {hammerCount}
            </span>
          </button>

          {/* Shuffle Booster */}
          <button
            onClick={handleShuffle}
            disabled={shuffleCount <= 0 || isPaused}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              shuffleCount > 0
                ? 'bg-slate-900 border-sky-500/40 text-sky-300 hover:bg-slate-800 hover:border-sky-400 active:scale-95'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Karıştır</span>
            <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-mono-num flex items-center justify-center">
              {shuffleCount}
            </span>
          </button>
        </div>

        {/* Mini Mobile Controls (visible on touch/small screens) */}
        <div className="flex sm:hidden items-center justify-center gap-3 pt-1">
          <button
            onClick={() => handleMove('LEFT')}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 active:bg-sky-500 active:text-white"
            aria-label="Sol"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handleMove('UP')}
              className="w-10 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 active:bg-sky-500 active:text-white"
              aria-label="Yukarı"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleMove('DOWN')}
              className="w-10 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 active:bg-sky-500 active:text-white"
              aria-label="Aşağı"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => handleMove('RIGHT')}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 active:bg-sky-500 active:text-white"
            aria-label="Sağ"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2048 Victory Modal (when user reaches 2048 first time) */}
      {hasWon && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-xl shadow-amber-500/20 mb-3 animate-bounce">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-1">
            2048 FÜZYONU BAŞARILDI!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mb-5">
            Tebrikler! Efsanevi 2048 neon bloğunu yarattın. İster yeni rekor için oynamaya devam et, ister yeniden başla!
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setHasWon(false);
                setDismissedWin(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Devam Et (4096 Hedefi)</span>
            </button>
            <button
              onClick={() => {
                setHasWon(false);
                onRestart();
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              Yeniden Başla
            </button>
          </div>
        </div>
      )}

      {/* Paused Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-2xl font-black text-white font-display mb-2">OYUN DURAKLATILDI</h3>
          <p className="text-xs text-slate-400 mb-5">Devam etmek için butona tıkla veya P tuşuna bas.</p>
          <button
            onClick={() => setIsPaused(false)}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Devam Et</span>
          </button>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3">
            <RotateCcw className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-1">
            HAMLE KALMADI
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Tüm hücreler doldu ve birleşecek blok kalmadı.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 w-full max-w-xs mb-5 flex justify-around">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Skorun</span>
              <span className="text-xl font-black text-white font-mono-num">
                {score.toLocaleString('tr-TR')}
              </span>
            </div>
            <div className="border-l border-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">En Yüksek Küp</span>
              <span className="text-xl font-black text-emerald-400 font-mono-num">
                {highestTile}
              </span>
            </div>
            <div className="border-l border-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Hamle</span>
              <span className="text-xl font-black text-amber-300 font-mono-num">
                {moves}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onRestart}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Oyna</span>
            </button>
            <button
              onClick={onOpenBriefing}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Kurallar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
