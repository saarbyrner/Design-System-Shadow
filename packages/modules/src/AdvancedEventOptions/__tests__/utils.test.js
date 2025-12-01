import isValidTemperature from '../utils';

describe('isValidTemperature', () => {
  describe('when the unit is Celsius', () => {
    it('validates the input correctly', () => {
      expect(isValidTemperature('70', 'C')).toBe(true);
      expect(isValidTemperature('71', 'C')).toBe(false);
      expect(isValidTemperature('-100', 'C')).toBe(true);
      expect(isValidTemperature('-110', 'C')).toBe(false);

      expect(isValidTemperature(70, 'C')).toBe(true);
      expect(isValidTemperature(71, 'C')).toBe(false);
      expect(isValidTemperature(-100, 'C')).toBe(true);
      expect(isValidTemperature(-110, 'C')).toBe(false);
    });
  });

  describe('when the unit is Fahrenheit', () => {
    it('validates the input correctly', () => {
      expect(isValidTemperature('140', 'F')).toBe(true);
      expect(isValidTemperature('141', 'F')).toBe(false);
      expect(isValidTemperature('-148', 'F')).toBe(true);
      expect(isValidTemperature('-149', 'F')).toBe(false);

      expect(isValidTemperature(140, 'F')).toBe(true);
      expect(isValidTemperature(141, 'F')).toBe(false);
      expect(isValidTemperature(-148, 'F')).toBe(true);
      expect(isValidTemperature(-149, 'F')).toBe(false);
    });
  });
});
