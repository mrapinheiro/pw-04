mod collatz;
mod utils;

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GameOfLife {
    width: usize,
    height: usize,
    cells: Vec<u8>,
}

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CollatzCalculator;

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    Ok(())
}

// Conway's Game of Life API
#[wasm_bindgen]
impl GameOfLife {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize) -> GameOfLife {
        let cells = vec![0; width * height];
        GameOfLife {
            width,
            height,
            cells,
        }
    }

    #[wasm_bindgen]
    pub fn tick(&mut self) {
        let mut new_cells = self.cells.clone();

        for y in 0..self.height {
            for x in 0..self.width {
                let idx = self.get_index(x, y);
                let live_neighbors = self.live_neighbor_count(x, y);

                let current_alive = self.cells[idx] == 1;

                // Conway's Game of Life rules:
                // 1. Any live cell with fewer than two live neighbors dies (underpopulation)
                // 2. Any live cell with two or three live neighbors lives on
                // 3. Any live cell with more than three live neighbors dies (overpopulation)
                // 4. Any dead cell with exactly three live neighbors becomes alive (reproduction)
                new_cells[idx] = match (current_alive, live_neighbors) {
                    (true, 2) | (true, 3) => 1,  // survives
                    (false, 3) => 1,             // born
                    _ => 0,                      // dies or stays dead
                };
            }
        }

        self.cells = new_cells;
    }

    #[wasm_bindgen]
    pub fn render(&self) -> Vec<u8> {
        self.cells.clone() // Already Vec<u8> with 0/1 values
    }

    #[wasm_bindgen]
    pub fn set_cell(&mut self, x: usize, y: usize, alive: bool) {
        if x < self.width && y < self.height {
            let idx = self.get_index(x, y);
            self.cells[idx] = if alive { 1 } else { 0 };
        }
    }

    #[wasm_bindgen]
    pub fn randomize(&mut self) {
        use js_sys::Math;
        for cell in &mut self.cells {
            *cell = if Math::random() < 0.3 { 1 } else { 0 }; // 30% chance of being alive
        }
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        for cell in &mut self.cells {
            *cell = 0;
        }
    }

    #[wasm_bindgen]
    pub fn load_pattern(&mut self, pattern: &str, x: usize, y: usize) {
        let lines: Vec<&str> = pattern.trim().lines().collect();

        for (dy, line) in lines.iter().enumerate() {
            for (dx, ch) in line.chars().enumerate() {
                let cell_x = x + dx;
                let cell_y = y + dy;

                if cell_x < self.width && cell_y < self.height {
                    let alive = ch == 'O' || ch == '1' || ch == '*';
                    self.set_cell(cell_x, cell_y, alive);
                }
            }
        }
    }

    // Helper methods
    fn get_index(&self, x: usize, y: usize) -> usize {
        y * self.width + x
    }

    fn live_neighbor_count(&self, x: usize, y: usize) -> u8 {
        let mut count = 0;

        // Check all 8 neighbors
        for dy in -1..=1 {
            for dx in -1..=1 {
                if dx == 0 && dy == 0 {
                    continue; // Skip the cell itself
                }

                let nx = x as isize + dx;
                let ny = y as isize + dy;

                // Check bounds
                if nx >= 0 && nx < self.width as isize && ny >= 0 && ny < self.height as isize {
                    let idx = self.get_index(nx as usize, ny as usize);
                    if self.cells[idx] == 1 {
                        count += 1;
                    }
                }
            }
        }

        count
    }
}

// Collatz Conjecture API
#[wasm_bindgen]
impl CollatzCalculator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> CollatzCalculator {
        CollatzCalculator
    }

    #[wasm_bindgen]
    pub fn calculate_sequence(&self, mut n: u64) -> Vec<u64> {
        let mut sequence = vec![n];

        while n != 1 {
            if n % 2 == 0 {
                n /= 2;
            } else {
                // Check for overflow before multiplication
                if n > u64::MAX / 3 {
                    break; // Prevent overflow
                }
                n = 3 * n + 1;
            }
            sequence.push(n);
        }

        sequence
    }

    #[wasm_bindgen]
    pub fn get_sequence_length(&self, n: u64) -> usize {
        if n == 0 {
            return 0;
        }

        let mut length = 1;
        let mut current = n;

        while current != 1 {
            if current % 2 == 0 {
                current /= 2;
            } else {
                // Check for overflow
                if current > u64::MAX / 3 {
                    break;
                }
                current = 3 * current + 1;
            }
            length += 1;
        }

        length
    }

    // Return an array instead of a tuple for wasm-bindgen compatibility
    #[wasm_bindgen]
    pub fn find_max_sequence_info(&self, limit: u64) -> Vec<u64> {
        let mut max_number = 1u64;
        let mut max_length = 1usize;

        for n in 1..=limit {
            let length = self.get_sequence_length(n);
            if length > max_length {
                max_length = length;
                max_number = n;
            }
        }

        vec![max_number, max_length as u64]
    }



    #[wasm_bindgen]
    pub fn calculate_multiple_sequences(&self, numbers: Vec<u64>) -> Vec<u64> {
        // Flatten the 2D vector into a 1D vector for wasm-bindgen compatibility
        // We'll use a simple encoding where each sequence is prefixed with its length
        let mut result = Vec::new();

        for number in numbers {
            let sequence = self.calculate_sequence(number);
            result.push(sequence.len() as u64); // sequence length
            result.extend(sequence); // sequence data
        }

        result
    }
}

// Performance testing utilities
#[wasm_bindgen]
pub fn benchmark_game_of_life(width: usize, height: usize, iterations: usize) -> f64 {
    let mut game = GameOfLife::new(width, height);
    game.randomize();

    let start = js_sys::Date::now();
    for _ in 0..iterations {
        game.tick();
    }
    let end = js_sys::Date::now();

    end - start
}

#[wasm_bindgen]
pub fn benchmark_collatz(limit: u64) -> f64 {
    let calculator = CollatzCalculator::new();

    let start = js_sys::Date::now();
    let _ = calculator.find_max_sequence_info(limit);
    let end = js_sys::Date::now();

    end - start
}
