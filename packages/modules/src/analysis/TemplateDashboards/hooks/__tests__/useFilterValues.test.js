import { renderHook } from '@testing-library/react-hooks';
import { getWrapper } from '../../testUtils';
import useFilterValues from '../useFilterValues';

describe('TemplateDashboards|useFilterValues', () => {
  it('returns the filter values supplied in the hook based on the key', () => {
    const { result } = renderHook(() => useFilterValues(['timescope']), {
      wrapper: getWrapper(),
    });

    expect(result.current).toStrictEqual({
      timescope: {
        time_period: null,
      },
    });
  });
});
