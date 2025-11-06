// Utility functions for the WebAssembly module

use wasm_bindgen::prelude::*;

/// Get the current timestamp in milliseconds
#[wasm_bindgen]
pub fn current_time_millis() -> f64 {
    js_sys::Date::now()
}

/// Simple random number generator (for patterns that need deterministic randomness)
pub struct SimpleRng {
    seed: u64,
}

impl SimpleRng {
    pub fn new(seed: u64) -> SimpleRng {
        SimpleRng { seed }
    }

    pub fn next(&mut self) -> u64 {
        self.seed = self.seed.wrapping_mul(1103515245).wrapping_add(12345);
        self.seed
    }

    pub fn next_float(&mut self) -> f64 {
        (self.next() % 1000) as f64 / 1000.0
    }
}

/// Performance measurement utilities
pub struct PerformanceTimer {
    start_time: f64,
}

impl PerformanceTimer {
    pub fn new() -> PerformanceTimer {
        PerformanceTimer {
            start_time: current_time_millis(),
        }
    }

    pub fn elapsed(&self) -> f64 {
        current_time_millis() - self.start_time
    }

    pub fn reset(&mut self) {
        self.start_time = current_time_millis();
    }
}

/// Memory usage estimation (rough approximation)
#[wasm_bindgen]
pub fn estimate_memory_usage() -> usize {
    // This is a very rough estimate
    // In a real application, you'd use performance.memory if available
    0 // Placeholder
}
