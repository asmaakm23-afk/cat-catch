import React from 'react';
import { Direction, Position } from '../types';

interface CatHeadProps {
  direction: Direction;
  hasShield: boolean;
}

export const CatHead: React.FC<CatHeadProps> = ({ direction, hasShield }) => {
  // Angle for rotation based on direction
  const rotationMap: Record<Direction, number> = {
    RIGHT: 0,
    DOWN: 90,
    LEFT: 180,
    UP: 270,
  };

  const angle = rotationMap[direction] ?? 0;

  return (
    <div
      className={`w-full h-full relative flex items-center justify-center transition-transform duration-100 ${
        hasShield ? 'filter drop-shadow-[0_0_6px_#8DB9DE]' : ''
      }`}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <svg
        viewBox="0 0 40 40"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft shield glow if active */}
        {hasShield && (
          <ellipse
            cx="20"
            cy="20"
            rx="18"
            ry="18"
            fill="none"
            stroke="#8DB9DE"
            strokeWidth="3.5"
            strokeDasharray="4 3"
            className="animate-pulse opacity-90"
          />
        )}

        {/* Outer Head Body */}
        <rect
          x="7"
          y="7"
          width="26"
          height="26"
          rx="11"
          fill="#805B46"
        />

        {/* Left Ear */}
        <path
          d="M8 12L3 3L14 7Z"
          fill="#805B46"
        />
        <path
          d="M7.5 10.5L4.5 4.5L12 7.5Z"
          fill="#F2A7C3"
        />

        {/* Right Ear */}
        <path
          d="M8 28L3 37L14 33Z"
          fill="#805B46"
        />
        <path
          d="M7.5 29.5L4.5 35.5L12 32.5Z"
          fill="#F2A7C3"
        />

        {/* Eyes (facing east/right by default) */}
        <ellipse cx="26" cy="14" rx="2.4" ry="2.8" fill="#FFFFFF" />
        <circle cx="27" cy="14" r="1.6" fill="#2C1B14" />
        <circle cx="27.5" cy="13.2" r="0.6" fill="#FFFFFF" />

        <ellipse cx="26" cy="26" rx="2.4" ry="2.8" fill="#FFFFFF" />
        <circle cx="27" cy="26" r="1.6" fill="#2C1B14" />
        <circle cx="27.5" cy="25.2" r="0.6" fill="#FFFFFF" />

        {/* Cheerful Pink Blush */}
        <ellipse cx="23" cy="10" rx="2.2" ry="1.4" fill="#F2A7C3" fillOpacity="0.8" />
        <ellipse cx="23" cy="30" rx="2.2" ry="1.4" fill="#F2A7C3" fillOpacity="0.8" />

        {/* Cute Pink Nose */}
        <path
          d="M31 18.5L33.5 20L31 21.5Z"
          fill="#F2A7C3"
        />

        {/* Whiskers (White, high contrast) */}
        {/* Upper Whiskers */}
        <line x1="28" y1="11" x2="36" y2="8" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="29" y1="13" x2="37" y2="13" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
        {/* Lower Whiskers */}
        <line x1="29" y1="27" x2="37" y2="27" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="28" y1="29" x2="36" y2="32" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />

        {/* Forehead Tabby Marking */}
        <path
          d="M17 18L13 20L17 22"
          stroke="#5C3D2E"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

interface CatBodyProps {
  curr: Position;
  prev: Position; // towards head
  next: Position; // towards tail
  hasShield: boolean;
  index: number;
}

export const CatBody: React.FC<CatBodyProps> = ({ curr, prev, next, hasShield, index }) => {
  // Calculate relative connections (-1, 0, 1)
  const dxPrev = prev.x - curr.x;
  const dyPrev = prev.y - curr.y;
  const dxNext = next.x - curr.x;
  const dyNext = next.y - curr.y;

  const connectsLeft = dxPrev === -1 || dxNext === -1;
  const connectsRight = dxPrev === 1 || dxNext === 1;
  const connectsUp = dyPrev === -1 || dyNext === -1;
  const connectsDown = dyPrev === 1 || dyNext === 1;

  // Stretchy segment with subtle alternating tabby striping
  const hasStripe = index % 2 === 0;

  return (
    <div
      className={`w-full h-full relative flex items-center justify-center ${
        hasShield ? 'filter drop-shadow-[0_0_5px_#8DB9DE]' : ''
      }`}
    >
      <svg
        viewBox="0 0 40 40"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield protective aura line */}
        {hasShield && (
          <rect
            x="4"
            y="4"
            width="32"
            height="32"
            rx="12"
            fill="none"
            stroke="#8DB9DE"
            strokeWidth="2.5"
            strokeDasharray="4 3"
            className="animate-pulse opacity-75"
          />
        )}

        {/* Center core rounded body */}
        <rect
          x="7"
          y="7"
          width="26"
          height="26"
          rx="9"
          fill="#805B46"
        />

        {/* Connectors to bridge between cells so the cat is one continuous stretchy body */}
        {connectsLeft && <rect x="0" y="7" width="10" height="26" fill="#805B46" />}
        {connectsRight && <rect x="30" y="7" width="10" height="26" fill="#805B46" />}
        {connectsUp && <rect x="7" y="0" width="26" height="10" fill="#805B46" />}
        {connectsDown && <rect x="7" y="30" width="26" height="10" fill="#805B46" />}

        {/* Subtle cute Tabby stripe accent on back */}
        {hasStripe && (
          <ellipse
            cx="20"
            cy="20"
            rx="5"
            ry="2.5"
            fill="#5C3D2E"
            transform={connectsUp || connectsDown ? 'rotate(90 20 20)' : ''}
          />
        )}

        {/* Cute subtle paw mark or fur highlight */}
        <circle cx="20" cy="20" r="1.6" fill="#9C725B" />
      </svg>
    </div>
  );
};

interface CatTailProps {
  curr: Position;
  prev: Position; // towards head
  hasShield: boolean;
}

export const CatTail: React.FC<CatTailProps> = ({ curr, prev, hasShield }) => {
  // Tail points away from the previous body segment
  const dx = curr.x - prev.x;
  const dy = curr.y - prev.y;

  let angle = 0;
  if (dx === 1) angle = 0; // pointing right
  else if (dx === -1) angle = 180; // pointing left
  else if (dy === 1) angle = 90; // pointing down
  else if (dy === -1) angle = 270; // pointing up

  return (
    <div
      className={`w-full h-full relative flex items-center justify-center ${
        hasShield ? 'filter drop-shadow-[0_0_5px_#8DB9DE]' : ''
      }`}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <svg
        viewBox="0 0 40 40"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield aura */}
        {hasShield && (
          <path
            d="M5 12C15 10 25 12 34 16C36 18 36 22 34 24C25 28 15 30 5 28"
            stroke="#8DB9DE"
            strokeWidth="3"
            strokeDasharray="4 3"
            fill="none"
            className="animate-pulse"
          />
        )}

        {/* Bridge towards previous segment (at left) */}
        <rect x="0" y="7" width="12" height="26" fill="#805B46" />

        {/* Tapering Tail Body */}
        <path
          d="M8 8C18 8 26 12 32 17C35 19 35 21 32 23C26 28 18 32 8 32Z"
          fill="#805B46"
        />

        {/* Cute White / Pink Tip of the Tail */}
        <path
          d="M26 14C29 16 33 18.5 33 20C33 21.5 29 24 26 26C28 23 28 17 26 14Z"
          fill="#F5EBDD"
        />

        {/* Tail stripe ring */}
        <path
          d="M18 10C20 15 20 25 18 30"
          stroke="#5C3D2E"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
