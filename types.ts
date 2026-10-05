export const GRID_SIZE = 25;

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export type GameStatus = 'START' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY';

export interface MouseItem {
  position: Position;
  spawnTime: number;
  duration: number; // 6000ms
  remainingMs: number;
}

export interface MilkItem {
  position: Position;
  spawnTime: number;
  duration: number; // 8000ms
  remainingMs: number;
}

export interface DogWarning {
  id: string;
  position: Position;
  remainingMs: number; // 1000ms warning
}

export interface DogHazard {
  id: string;
  position: Position;
  duration: number; // 10000ms
  remainingMs: number;
}

export interface FloatingNotice {
  id: string;
  text: string;
  x: number; // board x (0-19)
  y: number; // board y (0-19)
  type: 'score-plus' | 'score-minus' | 'shield' | 'life-lost';
  createdAt: number;
}

export interface GameStats {
  score: number;
  bestScore: number;
  lives: number;
  hasShield: boolean;
  fishEaten: number;
  miceCaught: number;
  dogsDodgedOrHit: number;
}
