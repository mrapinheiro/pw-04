import React, { useState } from 'react';
import GameOfLife from './GameOfLife';
import CollatzVisualizer from './CollatzVisualizer';
import './Demos.css';

const Demos = () => {
  const [activeDemo, setActiveDemo] = useState('game-of-life');

  const demos = [
    {
      id: 'game-of-life',
      title: "Conway's Game of Life",
      description: 'A cellular automaton simulation demonstrating emergent complexity from simple rules.',
      component: <GameOfLife />
    },
    {
      id: 'collatz',
      title: 'Collatz Conjecture Visualizer',
      description: 'Interactive exploration of mathematical sequences and number theory.',
      component: <CollatzVisualizer />
    }
  ];

  return (
    <section id="demos" className="section">
      <h2>Technical Demonstrations</h2>
      <p>
        Explore interactive demonstrations showcasing advanced web technologies and computational concepts.
        These examples highlight the power of modern web development and mathematical visualization.
      </p>

      <div className="demo-selector">
        {demos.map((demo) => (
          <button
            key={demo.id}
            className={`demo-tab ${activeDemo === demo.id ? 'active' : ''}`}
            onClick={() => setActiveDemo(demo.id)}
          >
            {demo.title}
          </button>
        ))}
      </div>

      <div className="demo-description">
        {demos.find(demo => demo.id === activeDemo)?.description}
      </div>

      <div className="demo-content">
        {demos.find(demo => demo.id === activeDemo)?.component}
      </div>

      <div className="demo-footer">
        <h3>Technology Behind the Scenes</h3>
        <div className="tech-stack">
          <div className="tech-item">
            <h4>WebAssembly (Wasm)</h4>
            <p>
              High-performance binary instruction format that allows code written in languages like Rust
              to run in the browser with near-native speed.
            </p>
          </div>
          <div className="tech-item">
            <h4>React + Canvas API</h4>
            <p>
              Modern JavaScript framework combined with HTML5 Canvas for real-time graphics rendering
              and interactive user interfaces.
            </p>
          </div>
          <div className="tech-item">
            <h4>Computational Mathematics</h4>
            <p>
              Implementation of cellular automata and number theory algorithms demonstrating
              complex behavior from simple rules.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demos;
