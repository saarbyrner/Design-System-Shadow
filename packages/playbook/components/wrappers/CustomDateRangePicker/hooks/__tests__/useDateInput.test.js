import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useDateInput } from '../useDateInput';

describe('useDateInput', () => {
  const mockUpdateDateRange = jest.fn();
  const defaultProps = {
    dateRange: [null, null],
    updateDateRange: mockUpdateDateRange,
    organisationLocale: 'en-US',
  };

  beforeEach(() => {
    mockUpdateDateRange.mockClear();
  });

  it('should initialize with empty input value', () => {
    const { result } = renderHook(() => useDateInput(defaultProps));

    expect(result.current.inputValue).toBe('');
  });

  it('should handle input change with valid numbers', () => {
    const { result } = renderHook(() => useDateInput(defaultProps));

    act(() => {
      result.current.handleInputChange({
        target: { value: '12252023' },
        preventDefault: jest.fn(),
      });
    });

    expect(result.current.inputValue).toMatch(/12\/25\/2023/);
  });

  it('should handle backspace key', () => {
    const { result } = renderHook(() => useDateInput(defaultProps));

    // First set some value
    act(() => {
      result.current.handleInputChange({
        target: { value: '12252023' },
        preventDefault: jest.fn(),
      });
    });

    // Then simulate backspace
    act(() => {
      result.current.handleInputKeyDown({
        key: 'Backspace',
        preventDefault: jest.fn(),
      });
    });

    expect(result.current.inputValue.length).toBeLessThan(10);
  });

  it('should clear input', () => {
    const { result } = renderHook(() => useDateInput(defaultProps));

    // First set some value
    act(() => {
      result.current.handleInputChange({
        target: { value: '12252023' },
        preventDefault: jest.fn(),
      });
    });

    // Then clear it
    act(() => {
      result.current.clearInput();
    });

    expect(result.current.inputValue).toBe('');
  });

  it('should update date range when input is cleared completely', () => {
    const { result } = renderHook(() => useDateInput(defaultProps));

    act(() => {
      result.current.handleInputKeyDown({
        key: 'Backspace',
        preventDefault: jest.fn(),
      });
    });

    expect(mockUpdateDateRange).toHaveBeenCalledWith([null, null]);
  });
});
