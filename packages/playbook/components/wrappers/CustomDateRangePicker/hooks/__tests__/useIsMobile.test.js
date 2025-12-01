import { useMediaQuery, useTheme } from '@mui/material';
import { renderHook } from '@testing-library/react-hooks';
import { useIsMobile } from '../useIsMobile';

// Mock the Material-UI hooks
jest.mock('@mui/material', () => ({
  useMediaQuery: jest.fn(),
  useTheme: jest.fn(),
}));

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default theme mock
    useTheme.mockReturnValue({
      breakpoints: {
        down: jest.fn().mockReturnValue('(max-width:599.95px)'),
      },
    });
  });

  it('should return true for mobile viewport', () => {
    useMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
    expect(useMediaQuery).toHaveBeenCalledWith('(max-width:599.95px)');
  });

  it('should return false for desktop viewport', () => {
    useMediaQuery.mockReturnValue(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
    expect(useMediaQuery).toHaveBeenCalledWith('(max-width:599.95px)');
  });
});
