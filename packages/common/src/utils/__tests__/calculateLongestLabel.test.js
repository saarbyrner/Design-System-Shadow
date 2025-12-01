import calculateLongestLabel from '../calculateLongestLabel';

describe('calculateLongestLabel', () => {
  it('should return the longest label when it is provided', () => {
    const longestLabelValue = 'Short';
    const label = 'Very Long Label';
    const result = calculateLongestLabel(longestLabelValue, label);
    expect(result).toBe(label);
  });

  it('should return the original longestLabelValue when label is not provided', () => {
    const longestLabelValue = 'Short';
    const result = calculateLongestLabel(longestLabelValue);
    expect(result).toBe(longestLabelValue);
  });

  it('should return the original longestLabelValue when label is shorter', () => {
    const longestLabelValue = 'Long Label';
    const label = 'Short';
    const result = calculateLongestLabel(longestLabelValue, label);
    expect(result).toBe(longestLabelValue);
  });

  it('should return the original longestLabelValue when label lengths are equal', () => {
    const longestLabelValue = 'Equal Length';
    const label = 'Equal Length';
    const result = calculateLongestLabel(longestLabelValue, label);
    expect(result).toBe(longestLabelValue);
  });
});
