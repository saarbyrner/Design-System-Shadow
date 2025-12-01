import { parseUserType } from '..';

describe('parseUserType', () => {
  it('should return "Match director" when the input is "matchdirector"', () => {
    expect(parseUserType('matchdirector')).toBe('Match director');
  });

  it('should return "Match director" when the input is "match_director"', () => {
    expect(parseUserType('match_director')).toBe('Match director');
  });

  it('should return "Match monitor" when the input is "matchmonitor"', () => {
    expect(parseUserType('matchmonitor')).toBe('Match monitor');
  });

  it('should return "Match monitor" when the input is "match_monitor"', () => {
    expect(parseUserType('match_monitor')).toBe('Match monitor');
  });

  it('should return the same string if the input does not match any special case', () => {
    expect(parseUserType('scout')).toBe('scout');
    expect(parseUserType('official')).toBe('official');
  });

  it('should return the same an empty if the input is null', () => {
    expect(parseUserType(null)).toBe('');
  });
});
