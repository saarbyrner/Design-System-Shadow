import { colors } from '@kitman/common/src/variables';
import getContrastingColor from '../getContrastingColor';

describe('getContrastingColor', () => {
  it('should return black for light background colors', () => {
    expect(getContrastingColor(colors.white)).toBe(colors.black_100);
    expect(getContrastingColor(colors.yellow_100_10)).toBe(colors.black_100);
  });

  it('should return white for dark background colors', () => {
    expect(getContrastingColor(colors.black_100)).toBe(colors.white);
    expect(getContrastingColor(colors.blue_400)).toBe(colors.white);
  });
});
