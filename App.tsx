import React from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { HUD } from './components/HUD';
import { GameBoard } from './components/GameBoard';
import { Dpad } from './components/Dpad';
import { GameActionButton } from './components/GameActionButton';
import { StartModal } from './components/StartModal';
import { GameOverModal } from './components/GameOverModal';
import { FishIcon, MouseIcon, DogIcon, MilkIcon } from './components/ItemIcons';

export default function App() {
  const {
    status,
    countdownLabel,
    cat,
    direction,
    fish,
    mouse,
    milk,
    dogs,
    dogWarnings,
    score,
    bestScore,
    lives,
    hasShield,
    fishEaten,
    miceCaught,
    floatingNotices,
    isDamaged,
    soundEnabled,
    toggleSound,
    handleDirectionChange,
    togglePause,
    startNewGame,
    resumeGame,
  } = useGameEngine();

  return (
    <main
      id="cat-and-catch-app"
      className="h-[100dvh] max-h-[100dvh] w-full bg-[#F5EBDD] text-[#805B46] flex flex-col items-center justify-between p-2 sm:p-2.5 md:p-3 box-border select-none overflow-hidden"
    >
      {/* Top Brand Header */}
      <header className="w-full max-w-[760px] text-center shrink-0 select-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/70 backdrop-blur-xs rounded-full border border-[#8DB9DE]/30 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#F2A7C3]" />
          <h1 className="text-xs sm:text-sm font-extrabold text-[#805B46] tracking-tight font-['Fredoka',sans-serif]">
            Cat & Catch
          </h1>
          <span className="text-[10px] sm:text-xs text-[#8A8F98] font-medium hidden xs:inline">• 25 × 25 Grid</span>
        </div>
      </header>

      {/* Main Game Container */}
      <div className="w-full max-w-[760px] flex-1 flex flex-col items-center justify-center min-h-0 gap-1.5 sm:gap-2">
        {/* HUD Component with score, best score, lives, and shield status */}
        <HUD
          score={score}
          bestScore={bestScore}
          lives={lives}
          hasShield={hasShield}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onRestart={startNewGame}
          className="shrink-0"
        />

        {/* Central Arena: Desktop Side-by-Side / Mobile Stacked */}
        <div
          id="game-arena-container"
          className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-5 min-h-0 w-full"
        >
          {/* Grid Column (GameBoard + Compact Legend on Desktop) */}
          <div className="flex flex-col items-center shrink-0 gap-1.5">
            <GameBoard
              status={status}
              countdownLabel={countdownLabel}
              cat={cat}
              direction={direction}
              fish={fish}
              mouse={mouse}
              milk={milk}
              dogs={dogs}
              dogWarnings={dogWarnings}
              hasShield={hasShield}
              floatingNotices={floatingNotices}
              isDamaged={isDamaged}
              onDirectionChange={handleDirectionChange}
              onResume={resumeGame}
              style={{ width: 'var(--board-size)', height: 'var(--board-size)' }}
            />

            {/* Desktop Legend (placed directly beneath grid to mirror board width) */}
            <div
              id="desktop-compact-legend"
              className="hidden md:flex items-center justify-around bg-white/70 backdrop-blur-xs rounded-xl px-3 py-1 border border-[#8DB9DE]/25 text-xs text-[#805B46] select-none"
              style={{ width: 'var(--board-size)' }}
            >
              <div className="flex items-center gap-1" title="Fish: +10 pts, grows cat">
                <FishIcon size={16} />
                <span className="font-bold text-[11px]">+10</span>
              </div>
              <div className="flex items-center gap-1" title="Mouse: +30 pts bonus">
                <MouseIcon size={16} />
                <span className="font-bold text-[11px]">+30</span>
              </div>
              <div className="flex items-center gap-1" title="Dog: -20 pts penalty">
                <DogIcon size={16} />
                <span className="font-bold text-[11px] text-[#E05375]">-20</span>
              </div>
              <div className="flex items-center gap-1" title="Milk: Shield protection">
                <MilkIcon size={16} />
                <span className="font-bold text-[11px] text-[#2A527A]">Shield</span>
              </div>
            </div>
          </div>

          {/* Desktop Control Panel: Vertically Centered Beside the Grid */}
          <div
            id="desktop-control-panel"
            className="hidden md:flex flex-col items-center justify-center bg-white/85 backdrop-blur-xs rounded-2xl p-3.5 border border-[#8DB9DE]/30 shadow-xs shrink-0 w-[172px] lg:w-[180px] gap-2.5"
          >
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A8F98] select-none">
              Controls
            </div>

            {/* Directional Pad with consistent cross layout */}
            <Dpad
              onDirectionChange={handleDirectionChange}
              currentDirection={direction}
            />

            {/* Pause / Resume Button directly below arrows */}
            <div className="w-full mt-0.5">
              <GameActionButton
                status={status}
                onStart={startNewGame}
                onTogglePause={togglePause}
              />
            </div>
          </div>

          {/* Mobile Short Control Area: Directional Pad and Pause/Resume Side-by-Side */}
          <div
            id="mobile-controls-row"
            className="flex md:hidden items-center justify-between gap-3 w-full shrink-0 px-1"
            style={{ maxWidth: 'var(--board-size)' }}
          >
            {/* Pause / Resume Action Button */}
            <div className="flex-1 min-w-0">
              <GameActionButton
                status={status}
                onStart={startNewGame}
                onTogglePause={togglePause}
                compact
              />
            </div>

            {/* Directional Pad side-by-side with Pause Button (min 44px touch targets) */}
            <div className="shrink-0 flex items-center justify-center">
              <Dpad
                onDirectionChange={handleDirectionChange}
                currentDirection={direction}
              />
            </div>
          </div>

          {/* Mobile Compact Legend Strip */}
          <div
            id="mobile-compact-legend"
            className="flex md:hidden items-center justify-around bg-white/70 backdrop-blur-xs rounded-xl px-2.5 py-1 border border-[#8DB9DE]/25 text-xs text-[#805B46] select-none shrink-0 w-full"
            style={{ maxWidth: 'var(--board-size)' }}
          >
            <div className="flex items-center gap-1" title="Fish: +10 pts">
              <FishIcon size={14} />
              <span className="font-bold text-[10px]">+10</span>
            </div>
            <div className="flex items-center gap-1" title="Mouse: +30 pts">
              <MouseIcon size={14} />
              <span className="font-bold text-[10px]">+30</span>
            </div>
            <div className="flex items-center gap-1" title="Dog: -20 pts">
              <DogIcon size={14} />
              <span className="font-bold text-[10px] text-[#E05375]">-20</span>
            </div>
            <div className="flex items-center gap-1" title="Milk: Shield">
              <MilkIcon size={14} />
              <span className="font-bold text-[10px] text-[#2A527A]">Shield</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Footer Instructions */}
      <footer className="w-full max-w-[760px] text-center text-[10px] text-[#8A8F98] shrink-0 select-none py-0.5">
        <p>Arrow Keys / WASD • Space to Pause • Swipes & D-Pad on Mobile</p>
      </footer>

      {/* Start Game Modal */}
      {status === 'START' && (
        <StartModal onStart={startNewGame} bestScore={bestScore} />
      )}

      {/* Game Over / Victory Modal */}
      {(status === 'GAMEOVER' || status === 'VICTORY') && (
        <GameOverModal
          status={status}
          score={score}
          bestScore={bestScore}
          fishEaten={fishEaten}
          miceCaught={miceCaught}
          onPlayAgain={startNewGame}
        />
      )}
    </main>
  );
}
