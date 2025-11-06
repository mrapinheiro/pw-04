// Struct and implementation moved to lib.rs for wasm-bindgen compatibility

// Common Game of Life patterns
pub const GLIDER: &str = r#"
.O.
..O
OOO
"#;

pub const BLINKER: &str = r#"
OOO
"#;

pub const BEACON: &str = r#"
OO..
OO..
..OO
..OO
"#;

pub const PULSAR: &str = r#"
..OOO...OOO..

O....O.O....O

O....O.O....O

O....O.O....O

..OOO...OOO..

...............

..OOO...OOO..

O....O.O....O

O....O.O....O

O....O.O....O

..OOO...OOO..
"#;
