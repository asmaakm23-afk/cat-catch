import React from 'react';
import { RotateCcw, Trophy, Award, Sparkles } from 'lucide-react';
import { GameStatus } from '../types';

interface GameOverModalProps {
  status: GameStatus;
  score: number;
  bestScore: number;
  fishEaten: number;
  miceCaught: number;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  status,
  score,
  bestScore,
  fishEaten,
  miceCaught,
  onPlayAgain,
}) => {
  const isVictory = status === 'VICTORY';
  const isNewHighScore = score > 0 && score >= bestScore;

  return (
    <div
      id="game-over-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#805B46]/40 backdrop-blur-xs select-none"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border-2 border-[#8DB9DE]/50 text-center relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Decorative background blurs */}
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none ${
            isVictory ? 'bg-[#F2A7C3]/30' : 'bg-[#8DB9DE]/25'
          }`}
        />

        {/* Mascot / Icon Badge */}
        <div className="flex justify-center mb-3">
          <div
            className={`w-18 h-18 rounded-2xl flex items-center justify-center shadow-inner border ${
              isVictory
                ? 'bg-[#F2A7C3]/30 border-[#F2A7C3]'
                : 'bg-[#F5EBDD] border-[#8DB9DE]/40'
            }`}
          >
            {isVictory ? (
              <Sparkles size={38} className="text-[#805B46] animate-spin" />
            ) : (
              <Trophy size={38} className="text-[#805B46]" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-[#805B46] tracking-tight font-['Fredoka',sans-serif]">
          {isVictory ? 'Cat-tastic Victory!' : 'Game Over'}
        </h2>
        <p className="text-sm text-[#8A8F98] mt-1">
          {isVictory
            ? 'Incredible! The stretchy cat filled the whole board!'
            : 'Out of lives! Your cat curled up for a nap.'}
        </p>

        {/* New High Score Callout */}
        {isNewHighScore && (
          <div className="my-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2A7C3]/30 border border-[#F2A7C3] rounded-full text-xs font-bold text-[#805B46]">
            <Award size={14} />
            New High Score!
          </div>
        )}

        {/* Stats Card */}
        <div className="bg-[#F5EBDD]/70 rounded-2xl p-4 my-4 border border-[#8DB9DE]/25 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#8A8F98] font-semibold">Final Score</span>
            <span
              id="gameover-final-score"
              className="text-2xl font-extrabold text-[#805B46] font-['Fredoka',sans-serif]"
            >
              {score}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm border-t border-[#805B46]/10 pt-2">
            <span className="text-[#8A8F98] font-semibold">Best Score</span>
            <span className="font-bold text-[#805B46] font-['Fredoka',sans-serif] text-base">
              {bestScore}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-[#8A8F98] pt-1">
            <span>Fish Eaten: <strong className="text-[#805B46]">{fishEaten}</strong></span>
            <span>Mice Caught: <strong className="text-[#805B46]">{miceCaught}</strong></span>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          id="play-again-btn"
          onClick={onPlayAgain}
          autoFocus
          className="w-full py-3.5 px-6 bg-[#8DB9DE] hover:bg-[#7ba9d0] text-white font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 font-['Fredoka',sans-serif] focus:outline-none focus:ring-4 focus:ring-[#8DB9DE]/40"
        >
          <RotateCcw size={20} />
          Play Again
        </button>

        <span className="block text-[11px] text-[#8A8F98] mt-3">
          Tip: Press <kbd className="px-1.5 py-0.5 bg-[#F5EBDD] rounded border border-[#8DB9DE]/30 text-[#805B46] font-mono">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-[#F5EBDD] rounded border border-[#8DB9DE]/30 text-[#805B46] font-mono">Enter</kbd> to restart quickly
        </span>
      </div>
    </div>
  );
};
