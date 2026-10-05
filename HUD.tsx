import React from 'react';
import { Volume2, VolumeX, RotateCcw, Trophy, Shield, Heart } from 'lucide-react';

interface HUDProps {
  score: number;
  bestScore: number;
  lives: number;
  hasShield: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  className?: string;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  bestScore,
  lives,
  hasShield,
  soundEnabled,
  onToggleSound,
  onRestart,
  className = '',
}) => {
  return (
    <header
      id="game-hud"
      className={`w-full bg-white/90 backdrop-blur-xs rounded-2xl shadow-xs border border-[#8DB9DE]/30 px-3 py-1.5 sm:px-4 sm:py-2 select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Left: Score & Best Score */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#8A8F98] font-bold block leading-none">
              Score
            </span>
            <span
              id="current-score"
              className="text-xl sm:text-2xl font-extrabold text-[#805B46] tracking-tight font-['Fredoka',sans-serif] leading-tight"
            >
              {score}
            </span>
          </div>

          <div className="h-6 w-px bg-[#F5EBDD]" />

          <div className="flex items-center gap-1.5 bg-[#F5EBDD]/60 px-2 py-0.5 rounded-lg">
            <Trophy size={14} className="text-[#805B46]" />
            <div>
              <span className="text-[9px] uppercase font-bold text-[#8A8F98] block leading-none">
                Best
              </span>
              <span
                id="best-score"
                className="text-xs sm:text-sm font-bold text-[#805B46] leading-none font-['Fredoka',sans-serif]"
              >
                {bestScore}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Lives Counter and Shield Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Lives Counter with cute hearts */}
          <div className="flex items-center gap-1" title={`${lives} lives remaining`}>
            <span className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-wide hidden xs:inline">
              Lives:
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[1, 2, 3].map((heartIndex) => {
                const active = heartIndex <= lives;
                return (
                  <Heart
                    key={heartIndex}
                    size={18}
                    className={`transition-all ${
                      active
                        ? 'fill-[#F2A7C3] text-[#805B46] scale-100'
                        : 'text-[#8A8F98] opacity-30 scale-75'
                    }`}
                    strokeWidth={1.8}
                  />
                );
              })}
            </div>
          </div>

          {/* Shield Status Indicator */}
          <div
            id="shield-hud-indicator"
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
              hasShield
                ? 'bg-[#8DB9DE]/25 text-[#2A527A] border border-[#8DB9DE]'
                : 'bg-[#F5EBDD]/50 text-[#8A8F98]'
            }`}
            title={hasShield ? 'Shield Active: Blocks next dog penalty' : 'No shield active (drink milk)'}
          >
            <Shield
              size={13}
              className={hasShield ? 'fill-[#8DB9DE] text-[#2A527A]' : 'text-[#8A8F98]'}
            />
            <span className="whitespace-nowrap font-medium text-[10px] sm:text-[11px]">
              {hasShield ? 'Shield' : 'None'}
            </span>
          </div>
        </div>

        {/* Right: Sound Toggle and Quick Restart */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-[#F5EBDD]/80 hover:bg-[#F5EBDD] text-[#805B46] transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#8DB9DE] cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-[#8A8F98]" />}
          </button>

          <button
            id="restart-game-btn"
            onClick={onRestart}
            aria-label="Restart game"
            title="Restart game"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-[#F5EBDD]/80 hover:bg-[#F2A7C3]/20 text-[#805B46] transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#8DB9DE] cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
