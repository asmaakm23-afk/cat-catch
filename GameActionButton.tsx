import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { GameStatus } from '../types';

interface GameActionButtonProps {
  status: GameStatus;
  onStart: () => void;
  onTogglePause: () => void;
  className?: string;
  compact?: boolean;
}

export const GameActionButton: React.FC<GameActionButtonProps> = ({
  status,
  onStart,
  onTogglePause,
  className = '',
  compact = false,
}) => {
  const baseButtonClass =
    'w-full min-h-[44px] h-11 sm:h-12 px-4 rounded-xl sm:rounded-2xl font-extrabold text-sm sm:text-base transition-transform active:scale-95 flex items-center justify-center gap-2 font-[\'Fredoka\',sans-serif] shadow-xs cursor-pointer select-none';

  if (status === 'START') {
    return (
      <button
        id="action-start-btn"
        onClick={onStart}
        className={`${baseButtonClass} bg-[#8DB9DE] hover:bg-[#7ba9d0] text-white ${className}`}
        aria-label="Start Game"
      >
        <Play size={18} className="fill-white shrink-0" />
        <span>{compact ? 'Start' : 'Start Game'}</span>
      </button>
    );
  }

  if (status === 'PLAYING') {
    return (
      <button
        id="action-pause-btn"
        onClick={onTogglePause}
        className={`${baseButtonClass} bg-white hover:bg-[#F5EBDD] text-[#805B46] border-2 border-[#8DB9DE]/50 ${className}`}
        aria-label="Pause Game"
      >
        <Pause size={18} className="fill-[#805B46] shrink-0" />
        <span>{compact ? 'Pause' : 'Pause Game'}</span>
      </button>
    );
  }

  if (status === 'PAUSED') {
    return (
      <button
        id="action-resume-btn"
        onClick={onTogglePause}
        className={`${baseButtonClass} bg-[#8DB9DE] hover:bg-[#7ba9d0] text-white ring-2 ring-[#8DB9DE]/40 animate-pulse ${className}`}
        aria-label="Resume Game"
      >
        <Play size={18} className="fill-white shrink-0" />
        <span>{compact ? 'Resume' : 'Resume Game'}</span>
      </button>
    );
  }

  if (status === 'COUNTDOWN') {
    return (
      <button
        id="action-countdown-btn"
        disabled
        className={`${baseButtonClass} bg-[#F5EBDD] text-[#8A8F98] border border-[#8DB9DE]/30 opacity-80 cursor-not-allowed ${className}`}
      >
        <span>Ready...</span>
      </button>
    );
  }

  // GAMEOVER or VICTORY
  return (
    <button
      id="action-restart-btn"
      onClick={onStart}
      className={`${baseButtonClass} bg-[#8DB9DE] hover:bg-[#7ba9d0] text-white ${className}`}
      aria-label="Play Again"
    >
      <RotateCcw size={18} className="shrink-0" />
      <span>Play Again</span>
    </button>
  );
};
