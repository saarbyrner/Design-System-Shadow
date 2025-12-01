// Unit its for getCurrentAge function
import getCurrentAge from '../getCurrentAge';

describe('getCurrentAge', () => {
  const mockDate = new Date(2024, 0, 1); // Mock date: January 1, 2024

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return "-" when birthDate is null', () => {
    const birthDate = null;
    const age = getCurrentAge(birthDate);
    expect(age).toBe('-');
  });

  it('should return "-" when birthDate is undefined', () => {
    const birthDate = undefined;
    const age = getCurrentAge(birthDate);
    expect(age).toBe('-');
  });

  it('should calculate age correctly for format YYYY-MM-DD', () => {
    const birthDate = '1990-01-01';
    const age = getCurrentAge(birthDate);
    expect(typeof age).toBe('string');
    expect(age).toBe('34');
  });

  it('should calculate age correctly for format MM/DD/YYYY', () => {
    const birthDate = '01/01/1990';
    const age = getCurrentAge(birthDate);
    expect(typeof age).toBe('string');
    expect(age).toBe('34');
  });

  it('should calculate age correctly for format DD-MM-YYYY', () => {
    const birthDate = '01-01-1990';
    const age = getCurrentAge(birthDate);
    expect(typeof age).toBe('string');
    expect(age).toBe('34');
  });

  it('should calculate age correctly for format DD MMMM YYYY', () => {
    const birthDate = '01 January 1990';
    const age = getCurrentAge(birthDate);
    expect(typeof age).toBe('string');
    expect(age).toBe('34');
  });

  it('should throw an error for unsupported date format', () => {
    const birthDate = '1990/01/01';
    expect(() => getCurrentAge(birthDate)).toThrow('Unsupported date format');
  });
});
