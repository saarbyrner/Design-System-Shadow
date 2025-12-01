import { renderHook } from '@testing-library/react-hooks';
import useResponsivePitchView, {
  PITCH_VIEW_MAX_WIDTH,
} from '../useResponsivePitchView';

describe('useResponsivePitchView', () => {
  it('calculates cell size data correctly', () => {
    const { result } = renderHook(() =>
      useResponsivePitchView({
        initialWidth: 500,
        initialHeight: 600,
        columns: 10,
        rows: 8,
        pitchId: 'pitch',
        setField: jest.fn,
        pitchRef: {
          current: {
            offsetWidth: 500,
          },
        },
      })
    );

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(600);
    expect(result.current.cellSize).toBe(50);
  });

  it('sets width to max width if the pitch is larger than max width', () => {
    const { result } = renderHook(() =>
      useResponsivePitchView({
        initialWidth: 1000,
        initialHeight: 500,
        columns: 5,
        rows: 3,
        pitchId: 'pitch',
        setField: jest.fn,
        pitchRef: {
          current: {
            offsetWidth: 1000,
          },
        },
      })
    );

    expect(result.current.width).toBe(PITCH_VIEW_MAX_WIDTH);
  });
});
