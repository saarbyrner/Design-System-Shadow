import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { getWrapper } from '../../testUtils';
import useFilter from '../useFilter';

describe('TemplateDashboards|useFilter', () => {
  it('returns the initial state of a filter in the first render', () => {
    const { result } = renderHook(() => useFilter('timescope'), {
      wrapper: getWrapper(),
    });

    expect(result.current.filter).toStrictEqual({
      time_period: null,
    });
  });

  it('updates the filter value when calling setFilter', () => {
    const { result } = renderHook(() => useFilter('timescope'), {
      wrapper: getWrapper(),
    });

    expect(result.current.filter).toStrictEqual({
      time_period: null,
    });

    act(() => {
      result.current.setFilter({ time_period: 'this_season' });
    });

    expect(result.current.filter).toStrictEqual({ time_period: 'this_season' });
  });
});
