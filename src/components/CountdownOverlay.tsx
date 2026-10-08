import React, { useEffect, useState } from 'react';
import { soundManager } from '../utils/audio';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number | string>(3);

  useEffect(() => {
    soundManager.playTick();
    const timer1 = setTimeout(() => {
      setCount(2);
      soundManager.playTick();
    }, 700);

    const timer2 = setTimeout(() => {
      setCount(1);
      soundManager.playTick();
    }, 1400);

    const timer3 = setTimeout(() => {
      setCount('BAŞLA!');
      soundManager.playGo();
    }, 2100);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm select-none pointer-events-none">
      <div className="relative">
        <span
          key={String(count)}
          className="block text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-300 to-amber-500 tracking-wider animate-in zoom-in-50 fade-in duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] font-display"
        >
          {count}
        </span>
      </div>
      <p className="mt-4 text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-300">
        Oyun Başlıyor...
      </p>
    </div>
  );
};
