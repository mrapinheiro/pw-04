import React, { useEffect, useRef, useState, useCallback } from 'react';
import './GameOfLife.css';

// Import WebAssembly module
import init, { GameOfLife as WasmGameOfLife } from '../wasm/pkg/portfolio_wasm';

const GameOfLife = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOfLife, setGameOfLife] = useState(null);
  const [fps, setFps] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Canvas dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const CELL_SIZE = 4;
  const GRID_WIDTH = Math.floor(CANVAS_WIDTH / CELL_SIZE);
  const GRID_HEIGHT = Math.floor(CANVAS_HEIGHT / CELL_SIZE);

  useEffect(() => {
    // Load WebAssembly module
    const loadWasm = async () => {
      try {
        console.log('Loading WebAssembly module...');
        // Initialize WebAssembly module
        await init();
        console.log('WebAssembly module loaded successfully');

        // Create WebAssembly Game of Life instance
        const game = new WasmGameOfLife(GRID_WIDTH, GRID_HEIGHT);
        console.log('WebAssembly GameOfLife instance created:', game);
        console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(game)));
        game.randomize();
        setGameOfLife(game);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load WebAssembly module:', err);
        setError(`Failed to load WebAssembly simulation module: ${err.message}`);
        setIsLoading(false);

        // Fallback to JavaScript implementation
        try {
          console.log('Falling back to JavaScript implementation');
          const game = new JSGameOfLife(GRID_WIDTH, GRID_HEIGHT);
          console.log('JavaScript GameOfLife instance created:', game);
          console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(game)));
          game.randomize();
          setGameOfLife(game);
        } catch (fallbackErr) {
          console.error('JavaScript fallback also failed:', fallbackErr);
        }
      }
    };

    loadWasm();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // JavaScript fallback implementation (will be replaced by Wasm)
  class JSGameOfLife {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.cells = new Array(width * height).fill(false);
    }

    tick() {
      const newCells = [...this.cells];

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = this.getIndex(x, y);
          const liveNeighbors = this.liveNeighborCount(x, y);
          const currentAlive = this.cells[idx];

          // Conway's Game of Life rules
          newCells[idx] = (currentAlive && (liveNeighbors === 2 || liveNeighbors === 3)) ||
                         (!currentAlive && liveNeighbors === 3);
        }
      }

      this.cells = newCells;
    }

    render() {
      return this.cells.map(cell => cell ? 1 : 0);
    }

    setCell(x, y, alive) {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        const idx = this.getIndex(x, y);
        this.cells[idx] = alive;
      }
    }

    randomize() {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i] = Math.random() < 0.3;
      }
    }

    clear() {
      this.cells.fill(false);
    }

    loadPattern(pattern, startX, startY) {
      const lines = pattern.trim().split('\n');
      for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
          const char = lines[y][x];
          if (char === 'O' || char === '1' || char === '*') {
            this.setCell(startX + x, startY + y, true);
          }
        }
      }
    }

    getIndex(x, y) {
      return y * this.width + x;
    }

    liveNeighborCount(x, y) {
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;

          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
            if (this.cells[this.getIndex(nx, ny)]) {
              count++;
            }
          }
        }
      }
      return count;
    }
  }

  const draw = useCallback(() => {
    if (!gameOfLife || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw cells
    ctx.fillStyle = '#00ff00';
    const cellData = gameOfLife.render();

    // Handle both WebAssembly Uint8Array and JavaScript Array
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const idx = y * GRID_WIDTH + x;
        if (cellData[idx] === 1 || cellData[idx] === true) {
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }
  }, [gameOfLife]);

  const animate = useCallback(() => {
    if (!isPlaying || !gameOfLife) return;

    const startTime = performance.now();
    gameOfLife.tick();
    draw();
    const endTime = performance.now();

    // Calculate FPS
    const frameTime = endTime - startTime;
    setFps(Math.round(1000 / frameTime));

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, gameOfLife, draw]);

  useEffect(() => {
    if (isPlaying) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [gameOfLife]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStep = () => {
    if (gameOfLife) {
      gameOfLife.tick();
      draw();
    }
  };

  const handleRandomize = () => {
    if (gameOfLife) {
      gameOfLife.randomize();
      draw();
    }
  };

  const handleClear = () => {
    if (gameOfLife) {
      gameOfLife.clear();
      draw();
    }
  };

  const handleLoadGlider = () => {
    if (gameOfLife) {
      gameOfLife.clear();
      // Try both method names for compatibility
      if (typeof gameOfLife.loadPattern === 'function') {
        gameOfLife.loadPattern(`
.O.
..O
OOO
        `, 10, 10);
      } else if (typeof gameOfLife.load_pattern === 'function') {
        gameOfLife.load_pattern(`
.O.
..O
OOO
        `, 10, 10);
      } else {
        console.error('Neither loadPattern nor load_pattern method found on gameOfLife object');
        console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(gameOfLife)));
      }
      draw();
    }
  };

  if (isLoading) {
    return (
      <section id="game-of-life" className="section">
        <h2>Conway's Game of Life</h2>
        <p>Loading simulation...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="game-of-life" className="section">
        <h2>Conway's Game of Life</h2>
        <p className="error">{error}</p>
        <p>This simulation demonstrates WebAssembly's performance for compute-intensive tasks.</p>
      </section>
    );
  }

  return (
    <section id="game-of-life" className="section">
      <h2>Conway's Game of Life</h2>
      <p>
        A cellular automaton simulation powered by WebAssembly for high-performance computation.
        Each generation follows simple rules that create complex emergent behavior.
      </p>

      <div className="game-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleStep} disabled={isPlaying}>
          Step
        </button>
        <button onClick={handleRandomize}>
          Randomize
        </button>
        <button onClick={handleClear}>
          Clear
        </button>
        <button onClick={handleLoadGlider}>
          Load Glider
        </button>
        <span className="fps-display">FPS: {fps}</span>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="game-canvas"
        />
      </div>

      <div className="game-info">
        <h3>How it works:</h3>
        <ul>
          <li><strong>Live cells</strong> with 2-3 neighbors survive</li>
          <li><strong>Dead cells</strong> with exactly 3 neighbors become alive</li>
          <li>All other cells die or stay dead</li>
        </ul>
        <p>
          This simulation showcases WebAssembly's ability to handle compute-intensive tasks
          with near-native performance in the browser.
        </p>
      </div>
    </section>
  );
};

export default GameOfLife;
