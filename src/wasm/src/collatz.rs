// Struct and implementation moved to lib.rs for wasm-bindgen compatibility

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sequence_1() {
        let calc = CollatzCalculator::new();
        let sequence = calc.calculate_sequence(1);
        assert_eq!(sequence, vec![1]);
        assert_eq!(calc.get_sequence_length(1), 1);
    }

    #[test]
    fn test_sequence_2() {
        let calc = CollatzCalculator::new();
        let sequence = calc.calculate_sequence(2);
        assert_eq!(sequence, vec![2, 1]);
        assert_eq!(calc.get_sequence_length(2), 2);
    }

    #[test]
    fn test_sequence_3() {
        let calc = CollatzCalculator::new();
        let sequence = calc.calculate_sequence(3);
        assert_eq!(sequence, vec![3, 10, 5, 16, 8, 4, 2, 1]);
        assert_eq!(calc.get_sequence_length(3), 8);
    }

    #[test]
    fn test_sequence_4() {
        let calc = CollatzCalculator::new();
        let sequence = calc.calculate_sequence(4);
        assert_eq!(sequence, vec![4, 2, 1]);
        assert_eq!(calc.get_sequence_length(4), 3);
    }
}
