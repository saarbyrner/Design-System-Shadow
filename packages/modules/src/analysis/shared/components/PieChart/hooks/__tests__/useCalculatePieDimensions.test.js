import { renderHook } from '@testing-library/react-hooks';

import useCalculatePieDimensions from '../useCalculatePieDimensions';
import {
  defaultMargin,
  INNER_RADIUS_RATIO,
  PAD_ANGLE,
  PIE_SERIES_TYPES,
} from '../../constants';

describe('PieChart hooks | useCalculatePieDimensions', () => {
  const WIDTH = 1000;
  const HEIGHT = 1000;
  const mockProps = {
    width: WIDTH,
    height: HEIGHT,
    margin: { ...defaultMargin },
    type: PIE_SERIES_TYPES.pie,
  };

  it('returns the correct chart dimensions when type === pie', () => {
    const { result } = renderHook(() =>
      useCalculatePieDimensions({ ...mockProps })
    );

    expect(result.current.radius).toBe(450);
    expect(result.current.innerRadius).toBe(0);
    expect(result.current.centerY).toBe(450);
    expect(result.current.centerX).toBe(450);
    expect(result.current.padAngle).toBe(0);
  });

  it('returns the correct chart dimensions when type === donut', () => {
    const { result } = renderHook(() =>
      useCalculatePieDimensions({ ...mockProps, type: PIE_SERIES_TYPES.donut })
    );

    expect(result.current.radius).toBe(450);
    expect(result.current.innerRadius).toBe(450 * INNER_RADIUS_RATIO);
    expect(result.current.centerY).toBe(450);
    expect(result.current.centerX).toBe(450);
    expect(result.current.padAngle).toBe(PAD_ANGLE);
  });
});
