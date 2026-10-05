import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { FishIcon, MouseIcon, DogIcon, MilkIcon, PawWarningIcon } from './ItemIcons';

interface StartModalProps {
  onStart: () => void;
  bestScore: number;
}

export const StartModal: React.FC<StartModalProps> = ({ onStart, bestScore }) => {
  return (
    <div
      id="start-screen-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#805B46]/30 backdrop-blur-xs select-none"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-xl border-2 border-[#8DB9DE]/40 text-center relative overflow-hidden">
        {/* Decorative background paw accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#F2A7C3]/15 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#8DB9DE]/15 pointer-events-none" />

        {/* Title & Mascot Header */}
        <div className="flex flex-col items-center mb-3">
          <div className="w-16 h-16 rounded-2xl bg-[#F5EBDD] flex items-center justify-center mb-3 shadow-inner border border-[#8DB9DE]/30">
            <svg viewBox="0 0 40 40" className="w-12 h-12" fill="none">
              {/* Cat Face Icon */}
              <rect x="7" y="7" width="26" height="26" rx="11" fill="#805B46" />
              {/* Ears */}
              <path d="M8 12L3 3L14 7Z" fill="#805B46" />
              <path d="M7.5 10.5L4.5 4.5L12 7.5Z" fill="#F2A7C3" />
              <path d="M32 12L37 3L26 7Z" fill="#805B46" />
              <path d="M32.5 10.5L35.5 4.5L28 7.5Z" fill="#F2A7C3" />
              {/* Eyes */}
              <ellipse cx="14" cy="20" rx="2.5" ry="3" fill="#FFFFFF" />
              <circle cx="14" cy="20" r="1.6" fill="#2C1B14" />
              <ellipse cx="26" cy="20" rx="2.5" ry="3" fill="#FFFFFF" />
              <circle cx="26" cy="20" r="1.6" fill="#2C1B14" />
              {/* Blush */}
              <circle cx="11" cy="24" r="2.2" fill="#F2A7C3" fillOpacity="0.8" />
              <circle cx="29" cy="24" r="2.2" fill="#F2A7C3" fillOpacity="0.8" />
              {/* Nose */}
              <path d="M18.5 23L21.5 23L20 25Z" fill="#F2A7C3" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#805B46] tracking-tight font-['Fredoka',sans-serif]">
            Cat & Catch
          </h1>
          <p className="text-sm text-[#8A8F98] mt-1.5 max-w-xs mx-auto leading-relaxed">
            Guide the stretchy cat across the grid. Catch fish and mice, grab milk for shields, and dodge barking dogs!
          </p>
        </div>

        {/* Item Legend */}
        <div className="bg-[#F5EBDD]/60 rounded-2xl p-3 sm:p-4 my-4 text-left border border-[#8DB9DE]/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8F98] block mb-2.5">
            Rules & Item Legend
          </span>

          <div className="space-y-2.5 text-xs text-[#805B46]">
            {/* Fish */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0 border border-[#8DB9DE]/30">
                <FishIcon size={22} />
              </div>
              <div>
                <span className="font-bold text-[#2A527A] block">Fish (+10 pts)</span>
                <span className="text-[#8A8F98]">Always 1 on board. Eating it grows your cat by 1 segment.</span>
              </div>
            </div>

            {/* Mouse */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0 border border-[#8DB9DE]/30">
                <MouseIcon size={22} progress={0.7} />
              </div>
              <div>
                <span className="font-bold text-[#805B46] block">Mouse (+30 pts bonus)</span>
                <span className="text-[#8A8F98]">Quick snack! Appears for 6 seconds. Doesn’t grow cat.</span>
              </div>
            </div>

            {/* Dog */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0 border border-[#8DB9DE]/30">
                <DogIcon size={22} />
              </div>
              <div>
                <span className="font-bold text-[#E05375] block">Dog Hazard (-20 pts)</span>
                <span className="text-[#8A8F98]">Stationary warning paw appears for 1s first. Leaves after 10s.</span>
              </div>
            </div>

            {/* Milk */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0 border border-[#8DB9DE]/30">
                <MilkIcon size={22} />
              </div>
              <div>
                <span className="font-bold text-[#2A527A] block">Milk (Protective Shield)</span>
                <span className="text-[#8A8F98]">Grants a blue shield that absorbs 1 dog penalty.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls info */}
        <div className="text-[11px] text-[#8A8F98] mb-5">
          <span className="font-semibold text-[#805B46]">Controls:</span> Arrow keys or WASD • Spacebar to pause • Swipes & D-Pad on touch
        </div>

        {/* Best Score if existing */}
        {bestScore > 0 && (
          <div className="mb-4 text-xs font-bold text-[#805B46] bg-[#F5EBDD] inline-block px-3 py-1 rounded-full">
            Best Score: {bestScore}
          </div>
        )}

        {/* Big Cozy Play Button */}
        <button
          id="start-game-btn"
          onClick={onStart}
          autoFocus
          className="w-full py-3.5 px-6 bg-[#8DB9DE] hover:bg-[#7ba9d0] text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2 font-['Fredoka',sans-serif] focus:outline-none focus:ring-4 focus:ring-[#8DB9DE]/40"
        >
          <Play size={22} className="fill-white" />
          Play Game
        </button>
      </div>
    </div>
  );
};
