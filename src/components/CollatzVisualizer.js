import React, { useState, useEffect, useRef } from 'react';
import './CollatzVisualizer.css';

// Import WebAssembly module
import init, { CollatzCalculator } from '../wasm/pkg/portfolio_wasm';

const CollatzVisualizer = () => {
  const canvasRef = useRef(null);
  const [currentNumber, setCurrentNumber] = useState(27);
  const [sequence, setSequence] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [maxSequenceLength, setMaxSequenceLength] = useState(0);
  const [maxNumber, setMaxNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Canvas dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;

  useEffect(() => {
    // Load WebAssembly module
    const loadWasm = async () => {
      try {
        // Initialize WebAssembly module
        await init();
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load WebAssembly module:', err);
        setError('Failed to load WebAssembly calculation module');
        setIsLoading(false);
      }
    };

    loadWasm();
  }, []);

  // JavaScript fallback implementation (will be replaced by Wasm)
  const calculateCollatzSequence = (n) => {
    if (n <= 0) return [0];

    const seq = [n];
    let current = n;

    while (current !== 1) {
      if (current % 2 === 0) {
        current = current / 2;
      } else {
        // Prevent overflow for very large numbers
        if (current > Number.MAX_SAFE_INTEGER / 3) {
          seq.push(Infinity);
          break;
        }
        current = 3 * current + 1;
      }
      seq.push(current);
    }

    return seq;
  };

  const findMaxSequenceInRange = (limit) => {
    let maxLen = 0;
    let maxNum = 1;

    for (let i = 1; i <= limit; i++) {
      const seq = calculateCollatzSequence(i);
      if (seq.length > maxLen) {
        maxLen = seq.length;
        maxNum = i;
      }
    }

    return { number: maxNum, length: maxLen };
  };

  const calculateSequence = async () => {
    if (isCalculating) return;

    setIsCalculating(true);
    try {
      // Use WebAssembly module for calculation
      const calculator = new CollatzCalculator();
      const seq = calculator.calculate_sequence(currentNumber);

      // Convert from Uint8Array to regular array for display
      const sequenceArray = Array.from(seq);
      setSequence(sequenceArray);
      drawSequence(sequenceArray);
    } catch (err) {
      console.error('Error calculating sequence:', err);
      // Fallback to JavaScript implementation
      const seq = calculateCollatzSequence(currentNumber);
      setSequence(seq);
      drawSequence(seq);
    } finally {
      setIsCalculating(false);
    }
  };

  const findMaxSequence = async () => {
    if (isCalculating) return;

    setIsCalculating(true);
    try {
      // Use WebAssembly module for finding max sequence
      const calculator = new CollatzCalculator();
      const limit = Math.min(currentNumber, 10000); // Allow higher limit with Wasm
      const result = calculator.find_max_sequence_info(limit);

      setMaxNumber(result[0]); // First element is the number
      setMaxSequenceLength(result[1]); // Second element is the length

      // Calculate and display the sequence for the number with max length
      const seq = calculator.calculate_sequence(result[0]);
      const sequenceArray = Array.from(seq);
      setSequence(sequenceArray);
      setCurrentNumber(result[0]);
      drawSequence(sequenceArray);
    } catch (err) {
      console.error('Error finding max sequence:', err);
      // Fallback to JavaScript implementation
      const limit = Math.min(currentNumber, 1000);
      const result = findMaxSequenceInRange(limit);
      setMaxNumber(result.number);
      setMaxSequenceLength(result.length);

      const seq = calculateCollatzSequence(result.number);
      setSequence(seq);
      setCurrentNumber(result.number);
      drawSequence(seq);
    } finally {
      setIsCalculating(false);
    }
  };

  const drawSequence = (seq) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (seq.length === 0) return;

    // Find min and max values for scaling
    const values = seq.filter(val => isFinite(val));
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, CANVAS_HEIGHT - 50);
    ctx.lineTo(CANVAS_WIDTH - 50, CANVAS_HEIGHT - 50);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Step', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
    ctx.save();
    ctx.translate(20, CANVAS_HEIGHT / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Value', 0, 0);
    ctx.restore();

    // Draw sequence
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const stepWidth = (CANVAS_WIDTH - 100) / (seq.length - 1);

    seq.forEach((value, index) => {
      const x = 50 + index * stepWidth;
      let y;

      if (!isFinite(value)) {
        // Handle overflow
        y = 60;
      } else {
        // Scale Y coordinate (invert so higher values are at top)
        const scale = (CANVAS_HEIGHT - 100) / (maxVal - minVal || 1);
        y = CANVAS_HEIGHT - 50 - ((value - minVal) * scale);
      }

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = '#007bff';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.stroke();

    // Draw value labels for some points
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    for (let i = 0; i < seq.length; i += Math.max(1, Math.floor(seq.length / 10))) {
      const x = 50 + i * stepWidth;
      const value = seq[i];
      if (isFinite(value)) {
        ctx.fillText(value.toString(), x, CANVAS_HEIGHT - 35);
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      calculateSequence();
    }
  }, [isLoading, calculateSequence]);

  const handleNumberChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setCurrentNumber(value);
    }
  };

  const handleCalculate = () => {
    calculateSequence();
  };

  if (isLoading) {
    return (
      <section id="collatz-visualizer" className="section">
        <h2>Collatz Conjecture Visualizer</h2>
        <p>Loading calculation module...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="collatz-visualizer" className="section">
        <h2>Collatz Conjecture Visualizer</h2>
        <p className="error">{error}</p>
        <p>This visualizer demonstrates WebAssembly's number crunching capabilities.</p>
      </section>
    );
  }

  return (
    <section id="collatz-visualizer" className="section">
      <h2>Collatz Conjecture Visualizer</h2>
      <p>
        Explore the Collatz conjecture through interactive visualization.
        This mathematical sequence demonstrates WebAssembly's ability to perform complex calculations efficiently.
      </p>

      <div className="collatz-controls">
        <div className="input-group">
          <label htmlFor="number-input">Starting Number:</label>
          <input
            id="number-input"
            type="number"
            value={currentNumber}
            onChange={handleNumberChange}
            min="1"
            max="1000000"
            disabled={isCalculating}
          />
        </div>

        <div className="button-group">
          <button onClick={handleCalculate} disabled={isCalculating}>
            {isCalculating ? 'Calculating...' : 'Calculate Sequence'}
          </button>
          <button onClick={findMaxSequence} disabled={isCalculating}>
            {isCalculating ? 'Searching...' : 'Find Max in Range'}
          </button>
        </div>
      </div>

      <div className="sequence-info">
        <div className="info-item">
          <strong>Sequence Length:</strong> {sequence.length}
        </div>
        {maxSequenceLength > 0 && (
          <div className="info-item">
            <strong>Max Length Found:</strong> {maxSequenceLength} (for number {maxNumber})
          </div>
        )}
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="collatz-canvas"
        />
      </div>

      <div className="sequence-display">
        <h3>Sequence:</h3>
        <div className="sequence-numbers">
          {sequence.slice(0, 50).map((num, index) => (
            <span key={index} className="sequence-number">
              {isFinite(num) ? num : '?'}
              {index < sequence.length - 1 && ', '}
            </span>
          ))}
          {sequence.length > 50 && <span>... ({sequence.length - 50} more)</span>}
        </div>
      </div>

      <div className="collatz-info">
        <h3>About the Collatz Conjecture:</h3>
        <p>
          The Collatz conjecture states that for any positive integer, repeatedly applying the rules
          "if even, divide by 2; if odd, multiply by 3 and add 1" will eventually reach 1.
        </p>
        <p>
          While this conjecture remains unproven, WebAssembly enables efficient computation of these
          sequences for mathematical exploration and visualization.
        </p>
      </div>
    </section>
  );
};

export default CollatzVisualizer;
