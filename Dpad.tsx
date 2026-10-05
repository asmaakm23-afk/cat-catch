import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '../types';

interface DpadProps {
  onDirectionChange: (dir: Direction) => void;
  currentDirection: Direction;
  className?: string;
}

export const Dpad: React.FC<DpadProps> = ({ onDirectionChange, currentDirection, className }) => {
  const triggerDirection = (dir: Direction, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    onDirectionChange(dir);
  };

  const buttonBaseClass =
    'w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#8DB9DE] shadow-xs border cursor-pointer';

  return (
    <div
      id="game-dpad"
      className={`flex flex-col items-center select-none ${className || ''}`}
      aria-label="Directional Controls"
    >
      {/* Row 1: Up Arrow */}
      <div className="flex justify-center w-full">
        <button
          id="dpad-up-btn"
          aria-label="Move Up"
          onPointerDown={(e) => triggerDirection('UP', e)}
          className={`${buttonBaseClass} ${
            currentDirection === 'UP'
              ? 'bg-[#8DB9DE] text-white border-[#8DB9DE]'
              : 'bg-white text-[#805B46] border-[#8DB9DE]/30 hover:bg-[#F5EBDD]'
          }`}
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.4} />
        </button>
      </div>

      {/* Row 2: Left Arrow, Center Decorative Paw, Right Arrow */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-1.5 sm:my-2">
        <button
          id="dpad-left-btn"
          aria-label="Move Left"
          onPointerDown={(e) => triggerDirection('LEFT', e)}
          className={`${buttonBaseClass} ${
            currentDirection === 'LEFT'
              ? 'bg-[#8DB9DE] text-white border-[#8DB9DE]'
              : 'bg-white text-[#805B46] border-[#8DB9DE]/30 hover:bg-[#F5EBDD]'
          }`}
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.4} />
        </button>

        {/* Center decorative paw container with same dimensions */}
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-[#F5EBDD]/50 border border-[#8DB9DE]/20"
          aria-hidden="true"
        >
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F2A7C3]/70 block" />
        </div>

        <button
          id="dpad-right-btn"
          aria-label="Move Right"
          onPointerDown={(e) => triggerDirection('RIGHT', e)}
          className={`${buttonBaseClass} ${
            currentDirection === 'RIGHT'
              ? 'bg-[#8DB9DE] text-white border-[#8DB9DE]'
              : 'bg-white text-[#805B46] border-[#8DB9DE]/30 hover:bg-[#F5EBDD]'
          }`}
        >
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.4} />
        </button>
      </div>

      {/* Row 3: Down Arrow */}
      <div className="flex justify-center w-full">
        <button
          id="dpad-down-btn"
          aria-label="Move Down"
          onPointerDown={(e) => triggerDirection('DOWN', e)}
          className={`${buttonBaseClass} ${
            currentDirection === 'DOWN'
              ? 'bg-[#8DB9DE] text-white border-[#8DB9DE]'
              : 'bg-white text-[#805B46] border-[#8DB9DE]/30 hover:bg-[#F5EBDD]'
          }`}
        >
          <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
};
