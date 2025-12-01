import { colors } from '@kitman/common/src/variables';
import { severityFontColor } from '../severityLabelColour';

describe('severityFontColor', () => {
  it('should return white color for "severe" severity', () => {
    expect(severityFontColor('severe')).toBe(colors.white);
  });

  it('should return grey_400 color for "mild" severity', () => {
    expect(severityFontColor('mild')).toBe(colors.grey_400);
  });

  it('should return grey_400 color for "moderate" severity', () => {
    expect(severityFontColor('moderate')).toBe(colors.grey_400);
  });

  it('should return grey_400 color for "none" severity', () => {
    expect(severityFontColor('none')).toBe(colors.grey_400);
  });

  it('should return grey_400 color for an unknown severity string', () => {
    expect(severityFontColor('unknown')).toBe(colors.grey_400);
  });

  it('should return grey_400 color for an empty string severity', () => {
    expect(severityFontColor('')).toBe(colors.grey_400);
  });
});
