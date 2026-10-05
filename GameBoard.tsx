import React, { useRef, useMemo } from 'react';
import {
  Position,
  Direction,
  MouseItem,
  MilkItem,
  DogHazard,
  DogWarning,
  FloatingNotice,
  GameStatus,
  GRID_SIZE,
} from '../types';
import { CatHead, CatBody, CatTail } from './CatCell';
import { FishIcon, MouseIcon, DogIcon, MilkIcon, PawWarningIcon } from './ItemIcons';

interface GameBoardProps {
  status: GameStatus;
  countdownLabel: string;
  cat: Position[];
  direction: Direction;
  fish: Position;
  mouse: MouseItem | null;
  milk: MilkItem | null;
  dogs: DogHazard[];
  dogWarnings: DogWarning[];
  hasShield: boolean;
  floatingNotices: FloatingNotice[];
  isDamaged: boolean;
  onDirectionChange: (dir: Direction) => void;
  onResume: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  status,
  countdownLabel,
  cat,
  direction,
  fish,
  mouse,
  milk,
  dogs,
  dogWarnings,
  hasShield,
  floatingNotices,
  isDamaged,
  onDirectionChange,
  onResume,
  className,
  style,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Handle Touch Swipes for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // Prevent default touch movement scrolling while swiping on the board
    if (touchStartRef.current) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - touchStartRef.current.x;
    const dy = endY - touchStartRef.current.y;

    const minSwipeDistance = 25; // px

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (Math.abs(dx) >= minSwipeDistance) {
        if (dx > 0) {
          onDirectionChange('RIGHT');
        } else {
          onDirectionChange('LEFT');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(dy) >= minSwipeDistance) {
        if (dy > 0) {
          onDirectionChange('DOWN');
        } else {
          onDirectionChange('UP');
        }
      }
    }

    touchStartRef.current = null;
  };

  // Pre-calculate coordinate lookups for fast cell rendering
  const cellContentMap = useMemo(() => {
    const map = new Map<string, React.ReactNode>();

    // 1. Dog Warnings
    dogWarnings.forEach((w) => {
      map.set(
        `${w.position.x},${w.position.y}`,
        <PawWarningIcon size={22} />
      );
    });

    // 2. Dogs
    dogs.forEach((d) => {
      const progress = d.remainingMs / d.duration;
      map.set(
        `${d.position.x},${d.position.y}`,
        <DogIcon size={22} progress={progress} />
      );
    });

    // 3. Milk
    if (milk) {
      const progress = milk.remainingMs / milk.duration;
      map.set(
        `${milk.position.x},${milk.position.y}`,
        <MilkIcon size={22} progress={progress} />
      );
    }

    // 4. Mouse
    if (mouse) {
      const progress = mouse.remainingMs / mouse.duration;
      const secondsLeft = Math.ceil(mouse.remainingMs / 1000);
      map.set(
        `${mouse.position.x},${mouse.position.y}`,
        <MouseIcon size={22} progress={progress} secondsLeft={secondsLeft} />
      );
    }

    // 5. Fish
    map.set(`${fish.x},${fish.y}`, <FishIcon size={22} />);

    // 6. Cat Segments
    if (cat.length > 0) {
      // Head
      const head = cat[0];
      map.set(
        `${head.x},${head.y}`,
        <CatHead direction={direction} hasShield={hasShield} />
      );

      // Body segments
      for (let i = 1; i < cat.length - 1; i++) {
        const curr = cat[i];
        const prev = cat[i - 1];
        const next = cat[i + 1];
        map.set(
          `${curr.x},${curr.y}`,
          <CatBody
            curr={curr}
            prev={prev}
            next={next}
            hasShield={hasShield}
            index={i}
          />
        );
      }

      // Tail
      if (cat.length > 1) {
        const tail = cat[cat.length - 1];
        const prev = cat[cat.length - 2];
        map.set(
          `${tail.x},${tail.y}`,
          <CatTail curr={tail} prev={prev} hasShield={hasShield} />
        );
      }
    }

    return map;
  }, [dogWarnings, dogs, milk, mouse, fish, cat, direction, hasShield]);

  // Generate cell elements for the enlarged grid
  const cells = useMemo(() => {
    const list = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x},${y}`;
        const content = cellContentMap.get(key);
        // Alternate subtle checkerboard for high clarity on subtle blue grid
        const isEven = (x + y) % 2 === 0;

        list.push(
          <div
            key={key}
            data-coord={`${x},${y}`}
            className={`relative flex items-center justify-center border-[0.5px] border-[#8DB9DE]/20 ${
              isEven ? 'bg-[#FFFFFF]' : 'bg-[#FAFCFF]'
            }`}
          >
            {content}
          </div>
        );
      }
    }
    return list;
  }, [cellContentMap]);

  return (
    <div
      className={`relative select-none ${className || ''}`}
      style={style}
    >
      {/* Main Game Board Card */}
      <div
        id="game-board-card"
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative aspect-square w-full bg-white rounded-3xl p-2 sm:p-3 shadow-md border-2 transition-all duration-200 overflow-hidden touch-none ${
          isDamaged
            ? 'border-[#F2A7C3] ring-4 ring-[#F2A7C3]/50 animate-shake'
            : hasShield
            ? 'border-[#8DB9DE] ring-2 ring-[#8DB9DE]/30'
            : 'border-[#8DB9DE]/40'
        }`}
      >
        {/* Enlarged Grid Canvas */}
        <div
          className="grid w-full h-full rounded-2xl overflow-hidden shadow-inner bg-white border border-[#8DB9DE]/30"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {cells}
        </div>


        {/* Damage Red / Pink Flash Overlay */}
        {isDamaged && (
          <div
            className="absolute inset-0 bg-[#F2A7C3]/30 pointer-events-none rounded-3xl animate-pulse"
            aria-hidden="true"
          />
        )}

        {/* Floating Text/Score Notices */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingNotices.map((notice) => {
            const leftPercent = ((notice.x + 0.5) / GRID_SIZE) * 100;
            const topPercent = ((notice.y + 0.5) / GRID_SIZE) * 100;

            const colorClass =
              notice.type === 'score-plus'
                ? 'bg-[#8DB9DE] text-white'
                : notice.type === 'score-minus'
                ? 'bg-[#F2A7C3] text-[#805B46]'
                : notice.type === 'shield'
                ? 'bg-[#2A527A] text-white'
                : 'bg-[#E05375] text-white';

            return (
              <div
                key={notice.id}
                className={`absolute px-2 py-0.5 rounded-full text-xs font-bold shadow-md transform -translate-x-1/2 -translate-y-full animate-float-fade ${colorClass}`}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                }}
              >
                {notice.text}
              </div>
            );
          })}
        </div>

        {/* Countdown Overlay (3... 2... 1... GO!) */}
        {status === 'COUNTDOWN' && (
          <div
            id="countdown-overlay"
            className="absolute inset-0 bg-white/70 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center z-20 pointer-events-none"
          >
            <span className="text-6xl sm:text-7xl font-extrabold text-[#805B46] tracking-tight font-['Fredoka',sans-serif] animate-bounce drop-shadow-sm">
              {countdownLabel}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#8A8F98] mt-2 uppercase tracking-wider">
              Get Ready!
            </span>
          </div>
        )}

        {/* Paused Overlay */}
        {status === 'PAUSED' && (
          <div
            id="paused-overlay"
            className="absolute inset-0 bg-white/85 backdrop-blur-[3px] rounded-3xl flex flex-col items-center justify-center z-20"
          >
            <div className="text-center p-6 max-w-xs">
              <span className="inline-block px-3 py-1 bg-[#F5EBDD] text-[#805B46] font-bold text-xs uppercase tracking-widest rounded-full mb-2">
                Paused
              </span>
              <h2 className="text-3xl font-extrabold text-[#805B46] font-['Fredoka',sans-serif] mb-2">
                Cat Nap Time
              </h2>
              <p className="text-sm text-[#8A8F98] mb-5">
                The stretchy cat is resting. Press resume or hit Spacebar to continue.
              </p>
              <button
                id="resume-overlay-btn"
                onClick={onResume}
                className="w-full py-3 px-6 bg-[#8DB9DE] hover:bg-[#7ba9d0] text-white font-bold rounded-2xl shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                Resume Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
