import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Direction,
  Position,
  GameStatus,
  MouseItem,
  MilkItem,
  DogHazard,
  DogWarning,
  FloatingNotice,
  GameStats,
  GRID_SIZE,
} from '../types';
import { sounds } from '../utils/audio';

const INITIAL_LIVES = 3;
const BASE_SPEED = 150; // ms per tick
const MIN_SPEED = 75; // max speed limit
const SPEED_STEP = 2.5; // speed increase per fish

const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const DIRECTION_DELTAS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function useGameEngine() {
  // Game state
  const [status, setStatus] = useState<GameStatus>('START');
  const [countdown, setCountdown] = useState<number>(3);
  const [countdownLabel, setCountdownLabel] = useState<string>('3');

  // Cat representation: index 0 is head, last index is tail (centered on 25x25 grid)
  const [cat, setCat] = useState<Position[]>([
    { x: 12, y: 12 },
    { x: 11, y: 12 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');

  // Items
  const [fish, setFish] = useState<Position>({ x: 18, y: 12 });
  const [mouse, setMouse] = useState<MouseItem | null>(null);
  const [milk, setMilk] = useState<MilkItem | null>(null);
  const [dogWarnings, setDogWarnings] = useState<DogWarning[]>([]);
  const [dogs, setDogs] = useState<DogHazard[]>([]);

  // Player Stats
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem('cat_and_catch_best_score');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [lives, setLives] = useState<number>(INITIAL_LIVES);
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [fishEaten, setFishEaten] = useState<number>(0);
  const [miceCaught, setMiceCaught] = useState<number>(0);
  const [dogsDodgedOrHit, setDogsDodgedOrHit] = useState<number>(0);

  // Visual effects
  const [floatingNotices, setFloatingNotices] = useState<FloatingNotice[]>([]);
  const [isDamaged, setIsDamaged] = useState<boolean>(false);

  // Sound preference
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => sounds.isEnabled());

  // Refs for loop state and safe input buffering
  const catRef = useRef<Position[]>(cat);
  catRef.current = cat;

  const directionRef = useRef<Direction>(direction);
  directionRef.current = direction;

  const inputQueueRef = useRef<Direction[]>([]);
  const lastProcessedDirectionRef = useRef<Direction>(direction);

  const fishRef = useRef<Position>(fish);
  fishRef.current = fish;

  const mouseRef = useRef<MouseItem | null>(mouse);
  mouseRef.current = mouse;

  const milkRef = useRef<MilkItem | null>(milk);
  milkRef.current = milk;

  const dogsRef = useRef<DogHazard[]>(dogs);
  dogsRef.current = dogs;

  const dogWarningsRef = useRef<DogWarning[]>(dogWarnings);
  dogWarningsRef.current = dogWarnings;

  const hasShieldRef = useRef<boolean>(hasShield);
  hasShieldRef.current = hasShield;

  const scoreRef = useRef<number>(score);
  scoreRef.current = score;

  const livesRef = useRef<number>(lives);
  livesRef.current = lives;

  const fishEatenRef = useRef<number>(fishEaten);
  fishEatenRef.current = fishEaten;

  const statusRef = useRef<GameStatus>(status);
  statusRef.current = status;

  // Timers for spawns (in ms till next attempt)
  const nextMouseSpawnRef = useRef<number>(randomRange(8000, 14000));
  const nextMilkSpawnRef = useRef<number>(randomRange(15000, 25000));
  const nextDogSpawnRef = useRef<number>(randomRange(6000, 10000));

  // Sound toggle
  const toggleSound = useCallback(() => {
    const next = !sounds.isEnabled();
    sounds.setEnabled(next);
    setSoundEnabledState(next);
  }, []);

  // Floating notice generator
  const addNotice = useCallback((text: string, x: number, y: number, type: FloatingNotice['type']) => {
    const id = `${Date.now()}_${Math.random()}`;
    setFloatingNotices((prev) => [...prev, { id, text, x, y, type, createdAt: Date.now() }]);
    setTimeout(() => {
      setFloatingNotices((prev) => prev.filter((n) => n.id !== id));
    }, 1200);
  }, []);

  // Safe empty cell finder
  const getEmptyCells = useCallback((excludeFrontOfCat: boolean = false): Position[] => {
    const occupied = new Set<string>();

    // Cat segments
    catRef.current.forEach((segment) => occupied.add(`${segment.x},${segment.y}`));

    // Fish
    if (fishRef.current) {
      occupied.add(`${fishRef.current.x},${fishRef.current.y}`);
    }

    // Mouse
    if (mouseRef.current) {
      occupied.add(`${mouseRef.current.position.x},${mouseRef.current.position.y}`);
    }

    // Milk
    if (milkRef.current) {
      occupied.add(`${milkRef.current.position.x},${milkRef.current.position.y}`);
    }

    // Dogs
    dogsRef.current.forEach((d) => occupied.add(`${d.position.x},${d.position.y}`));

    // Warnings
    dogWarningsRef.current.forEach((w) => occupied.add(`${w.position.x},${w.position.y}`));

    // For dogs: avoid spawning in front of the cat's head (up to 2 cells)
    if (excludeFrontOfCat && catRef.current.length > 0) {
      const head = catRef.current[0];
      const dir = directionRef.current;
      const delta = DIRECTION_DELTAS[dir];
      for (let step = 1; step <= 2; step++) {
        const frontX = head.x + delta.x * step;
        const frontY = head.y + delta.y * step;
        occupied.add(`${frontX},${frontY}`);
      }
    }

    const empties: Position[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!occupied.has(`${x},${y}`)) {
          empties.push({ x, y });
        }
      }
    }
    return empties;
  }, []);

  // Spawn a fish in empty cell
  const spawnFish = useCallback(() => {
    const empties = getEmptyCells();
    if (empties.length > 0) {
      const idx = Math.floor(Math.random() * empties.length);
      setFish(empties[idx]);
    }
  }, [getEmptyCells]);

  // Safe directional input handler with buffer queue
  const handleDirectionChange = useCallback((newDir: Direction) => {
    // If game is paused or not playing, spacebar handles pause, but don't queue invalid moves
    if (statusRef.current !== 'PLAYING') return;

    // Buffer at most 2 inputs to prevent queue backlog
    if (inputQueueRef.current.length >= 2) return;

    // Determine what direction we will be facing before this queued move takes place
    const referenceDir =
      inputQueueRef.current.length > 0
        ? inputQueueRef.current[inputQueueRef.current.length - 1]
        : lastProcessedDirectionRef.current;

    // Reject direct 180-degree reversal
    if (newDir === referenceDir || newDir === OPPOSITE_DIRECTIONS[referenceDir]) {
      return;
    }

    inputQueueRef.current.push(newDir);
  }, []);

  // Update best score helper
  const checkAndSaveBestScore = useCallback((currentScore: number) => {
    setBestScore((prevBest) => {
      if (currentScore > prevBest) {
        localStorage.setItem('cat_and_catch_best_score', String(currentScore));
        return currentScore;
      }
      return prevBest;
    });
  }, []);

  // Start / Restart Countdown
  const startCountdown = useCallback((fromLivesReset: boolean = false) => {
    setStatus('COUNTDOWN');
    setCountdown(3);
    setCountdownLabel('3');
    sounds.playCountdown(false);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        setCountdownLabel(String(count));
        sounds.playCountdown(false);
      } else if (count === 0) {
        setCountdown(0);
        setCountdownLabel('GO!');
        sounds.playCountdown(true);
      } else {
        clearInterval(interval);
        setStatus('PLAYING');
        // Reset timers slightly so hazards don't instantly fire
        nextMouseSpawnRef.current = randomRange(6000, 10000);
        nextDogSpawnRef.current = randomRange(5000, 8000);
        nextMilkSpawnRef.current = randomRange(10000, 18000);
      }
    }, 850);
  }, []);

  // Start new game completely
  const startNewGame = useCallback(() => {
    const initialCat: Position[] = [
      { x: 12, y: 12 },
      { x: 11, y: 12 },
      { x: 10, y: 12 },
    ];
    setCat(initialCat);
    catRef.current = initialCat;

    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    lastProcessedDirectionRef.current = 'RIGHT';
    inputQueueRef.current = [];

    setScore(0);
    setLives(INITIAL_LIVES);
    setHasShield(false);
    setFishEaten(0);
    setMiceCaught(0);
    setDogsDodgedOrHit(0);

    setMouse(null);
    setMilk(null);
    setDogs([]);
    setDogWarnings([]);

    // Spawn initial fish safe from cat
    const initialFish = { x: 18, y: 12 };
    setFish(initialFish);

    startCountdown();
  }, [startCountdown]);

  // Reset cat and board after losing life (preserves score)
  const resetAfterLifeLoss = useCallback(() => {
    const initialCat: Position[] = [
      { x: 12, y: 12 },
      { x: 11, y: 12 },
      { x: 10, y: 12 },
    ];
    setCat(initialCat);
    catRef.current = initialCat;

    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    lastProcessedDirectionRef.current = 'RIGHT';
    inputQueueRef.current = [];

    // Clear dogs and warnings so player doesn't spawn into hazard
    setDogs([]);
    setDogWarnings([]);
    setMouse(null);
    setMilk(null);
    setHasShield(false);

    // Make sure fish is not on cat
    const occupied = new Set(initialCat.map((c) => `${c.x},${c.y}`));
    if (occupied.has(`${fishRef.current.x},${fishRef.current.y}`)) {
      setFish({ x: 18, y: 12 });
    }

    startCountdown(true);
  }, [startCountdown]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (statusRef.current === 'PLAYING') {
      setStatus('PAUSED');
    } else if (statusRef.current === 'PAUSED') {
      setStatus('PLAYING');
    }
  }, []);

  // Main Movement Tick
  const runGameTick = useCallback(() => {
    if (statusRef.current !== 'PLAYING') return;

    // Pop queued direction if available
    let currentDir = directionRef.current;
    if (inputQueueRef.current.length > 0) {
      const nextDir = inputQueueRef.current.shift()!;
      // Re-verify against last processed direction
      if (nextDir !== OPPOSITE_DIRECTIONS[lastProcessedDirectionRef.current]) {
        currentDir = nextDir;
        setDirection(nextDir);
        directionRef.current = nextDir;
      }
    }
    lastProcessedDirectionRef.current = currentDir;

    const currentCat = catRef.current;
    const head = currentCat[0];
    const delta = DIRECTION_DELTAS[currentDir];
    const newHead: Position = {
      x: head.x + delta.x,
      y: head.y + delta.y,
    };

    // 1. Check Wall Collision
    const hitWall =
      newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE;

    // 2. Check Self Collision (cat body, excluding the tail that will move unless growing)
    const hitSelf = currentCat.slice(0, -1).some(
      (segment) => segment.x === newHead.x && segment.y === newHead.y
    );

    if (hitWall || hitSelf) {
      sounds.playLifeLost();
      setIsDamaged(true);
      setTimeout(() => setIsDamaged(false), 500);

      const currentLives = livesRef.current - 1;
      setLives(currentLives);
      livesRef.current = currentLives;

      addNotice(
        hitWall ? 'Wall Bump! -1 Life' : 'Tail Tangle! -1 Life',
        Math.max(1, Math.min(GRID_SIZE - 2, head.x)),
        Math.max(1, Math.min(GRID_SIZE - 2, head.y)),
        'life-lost'
      );

      if (currentLives <= 0) {
        setStatus('GAMEOVER');
        checkAndSaveBestScore(scoreRef.current);
        sounds.playGameOver();
      } else {
        resetAfterLifeLoss();
      }
      return;
    }

    // 3. Movement and item checks
    let willGrow = false;
    let newScore = scoreRef.current;

    // Fish collision
    if (newHead.x === fishRef.current.x && newHead.y === fishRef.current.y) {
      willGrow = true;
      newScore += 10;
      setScore(newScore);
      scoreRef.current = newScore;
      checkAndSaveBestScore(newScore);

      const nextFishCount = fishEatenRef.current + 1;
      setFishEaten(nextFishCount);
      fishEatenRef.current = nextFishCount;

      sounds.playFish();
      addNotice('+10 Fish', newHead.x, newHead.y, 'score-plus');
      spawnFish();
    }

    // Mouse collision
    if (mouseRef.current && newHead.x === mouseRef.current.position.x && newHead.y === mouseRef.current.position.y) {
      newScore += 30;
      setScore(newScore);
      scoreRef.current = newScore;
      checkAndSaveBestScore(newScore);

      setMiceCaught((m) => m + 1);
      sounds.playMouse();
      addNotice('+30 Mouse Bonus!', newHead.x, newHead.y, 'score-plus');
      setMouse(null);
    }

    // Milk collision
    if (milkRef.current && newHead.x === milkRef.current.position.x && newHead.y === milkRef.current.position.y) {
      setHasShield(true);
      hasShieldRef.current = true;
      sounds.playMilk();
      addNotice('Shield Activated!', newHead.x, newHead.y, 'shield');
      setMilk(null);
    }

    // Dog hazard collision
    const dogIndex = dogsRef.current.findIndex(
      (d) => d.position.x === newHead.x && d.position.y === newHead.y
    );
    if (dogIndex !== -1) {
      const collidedDog = dogsRef.current[dogIndex];
      // Remove the dog immediately
      setDogs((prev) => prev.filter((_, idx) => idx !== dogIndex));

      if (hasShieldRef.current) {
        // Shield absorbs dog
        setHasShield(false);
        hasShieldRef.current = false;
        sounds.playShieldBlock();
        addNotice('Shield Protected! 0 Penalty', newHead.x, newHead.y, 'shield');
      } else {
        // Penalty: -20 points with minimum 0
        newScore = Math.max(0, newScore - 20);
        setScore(newScore);
        scoreRef.current = newScore;
        sounds.playDog();
        addNotice('-20 Dog Penalty', newHead.x, newHead.y, 'score-minus');
        setDogsDodgedOrHit((d) => d + 1);
      }
    }

    // Update cat body
    const nextCat: Position[] = [newHead, ...currentCat];
    if (!willGrow) {
      nextCat.pop();
    }
    setCat(nextCat);
    catRef.current = nextCat;

    // Victory check: cat filled entire grid
    if (nextCat.length >= GRID_SIZE * GRID_SIZE) {
      setStatus('VICTORY');
      sounds.playVictory();
      checkAndSaveBestScore(newScore);
    }
  }, [addNotice, checkAndSaveBestScore, resetAfterLifeLoss, spawnFish]);

  // Movement loop timer based on current fish eaten speed
  useEffect(() => {
    if (status !== 'PLAYING') return;

    const currentSpeed = Math.max(
      MIN_SPEED,
      BASE_SPEED - fishEaten * SPEED_STEP
    );

    const intervalId = setInterval(() => {
      runGameTick();
    }, currentSpeed);

    return () => clearInterval(intervalId);
  }, [status, fishEaten, runGameTick]);

  // Secondary high-rate loop (50ms) for item expirations, warnings, and spawn intervals
  useEffect(() => {
    if (status !== 'PLAYING') return;

    const dt = 50;
    const intervalId = setInterval(() => {
      // 1. Decrement Mouse timer
      setMouse((prev) => {
        if (!prev) return null;
        const remaining = prev.remainingMs - dt;
        if (remaining <= 0) {
          return null; // Expired
        }
        return { ...prev, remainingMs: remaining };
      });

      // 2. Decrement Milk timer
      setMilk((prev) => {
        if (!prev) return null;
        const remaining = prev.remainingMs - dt;
        if (remaining <= 0) {
          return null; // Expired
        }
        return { ...prev, remainingMs: remaining };
      });

      // 3. Decrement Dogs duration (uncollected dogs disappear after 10s)
      setDogs((prev) => {
        return prev
          .map((dog) => ({ ...dog, remainingMs: dog.remainingMs - dt }))
          .filter((dog) => dog.remainingMs > 0);
      });

      // 4. Progress Dog Warnings (1 second warning before spawn)
      setDogWarnings((prevWarnings) => {
        const remainingWarnings: DogWarning[] = [];
        const dogsToSpawn: Position[] = [];

        prevWarnings.forEach((w) => {
          const nextRemaining = w.remainingMs - dt;
          if (nextRemaining <= 0) {
            // Check if cell is still unoccupied before spawning
            const pos = w.position;
            const isCatThere = catRef.current.some((c) => c.x === pos.x && c.y === pos.y);
            const isFishThere = fishRef.current.x === pos.x && fishRef.current.y === pos.y;
            const isMouseThere = mouseRef.current?.position.x === pos.x && mouseRef.current?.position.y === pos.y;
            const isMilkThere = milkRef.current?.position.x === pos.x && milkRef.current?.position.y === pos.y;
            const isDogThere = dogsRef.current.some((d) => d.position.x === pos.x && d.position.y === pos.y);

            if (!isCatThere && !isFishThere && !isMouseThere && !isMilkThere && !isDogThere) {
              dogsToSpawn.push(pos);
            }
          } else {
            remainingWarnings.push({ ...w, remainingMs: nextRemaining });
          }
        });

        if (dogsToSpawn.length > 0) {
          setDogs((prevDogs) => {
            const addedDogs: DogHazard[] = dogsToSpawn.map((pos) => ({
              id: `${Date.now()}_${Math.random()}`,
              position: pos,
              duration: 10000,
              remainingMs: 10000,
            }));
            // Limit to max 3 dogs
            return [...prevDogs, ...addedDogs].slice(-3);
          });
        }

        return remainingWarnings;
      });

      // 5. Check item spawns
      // Mouse spawn (every 8-14s, max 1 mouse)
      if (!mouseRef.current) {
        nextMouseSpawnRef.current -= dt;
        if (nextMouseSpawnRef.current <= 0) {
          nextMouseSpawnRef.current = randomRange(8000, 14000);
          const empties = getEmptyCells();
          if (empties.length > 0) {
            const chosen = empties[Math.floor(Math.random() * empties.length)];
            setMouse({
              position: chosen,
              spawnTime: Date.now(),
              duration: 6000,
              remainingMs: 6000,
            });
          }
        }
      }

      // Milk spawn (every 15-25s, max 1 milk, only if cat doesn't already have shield)
      if (!milkRef.current && !hasShieldRef.current) {
        nextMilkSpawnRef.current -= dt;
        if (nextMilkSpawnRef.current <= 0) {
          nextMilkSpawnRef.current = randomRange(15000, 25000);
          const empties = getEmptyCells();
          if (empties.length > 0) {
            const chosen = empties[Math.floor(Math.random() * empties.length)];
            setMilk({
              position: chosen,
              spawnTime: Date.now(),
              duration: 8000,
              remainingMs: 8000,
            });
          }
        }
      }

      // Dog spawn (every 6-10s, max 3 dogs + pending warnings)
      const totalDogs = dogsRef.current.length + dogWarningsRef.current.length;
      if (totalDogs < 3) {
        nextDogSpawnRef.current -= dt;
        if (nextDogSpawnRef.current <= 0) {
          nextDogSpawnRef.current = randomRange(6000, 10000);
          // Avoid spawning directly in front of the cat's head!
          const empties = getEmptyCells(true);
          if (empties.length > 0) {
            const chosen = empties[Math.floor(Math.random() * empties.length)];
            setDogWarnings((prev) => [
              ...prev,
              {
                id: `${Date.now()}_${Math.random()}`,
                position: chosen,
                remainingMs: 1000, // 1 second paw print warning
              },
            ]);
          }
        }
      }
    }, dt);

    return () => clearInterval(intervalId);
  }, [status, getEmptyCells]);

  // Tab visibility change: auto-pause when hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && statusRef.current === 'PLAYING') {
        setStatus('PAUSED');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Keyboard navigation & Spacebar pause/resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default scroll for game controls
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }

      if (e.code === 'Space') {
        if (statusRef.current === 'PLAYING') {
          setStatus('PAUSED');
        } else if (statusRef.current === 'PAUSED') {
          setStatus('PLAYING');
        } else if (statusRef.current === 'START' || statusRef.current === 'GAMEOVER' || statusRef.current === 'VICTORY') {
          startNewGame();
        }
        return;
      }

      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          handleDirectionChange('UP');
          break;
        case 'ArrowDown':
        case 'KeyS':
          handleDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
        case 'KeyA':
          handleDirectionChange('LEFT');
          break;
        case 'ArrowRight':
        case 'KeyD':
          handleDirectionChange('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionChange, startNewGame]);

  return {
    status,
    countdown,
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
    dogsDodgedOrHit,
    floatingNotices,
    isDamaged,
    soundEnabled,
    toggleSound,
    handleDirectionChange,
    togglePause,
    startNewGame,
    resumeGame: () => setStatus('PLAYING'),
  };
}
