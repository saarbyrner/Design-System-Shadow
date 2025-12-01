import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { getWrapper } from '../../testUtils';
import useFilter from '../useFilter';

describe('BenchmarkReport|useFilter', () => {
  it('returns the initial state of a filter in the first render', () => {
    const { result } = renderHook(() => useFilter('training_variable_ids'), {
      wrapper: getWrapper(),
    });

    expect(result.current.filter).toStrictEqual([]);
  });

  it('updates the filter value when calling setFilter', () => {
    const { result } = renderHook(() => useFilter('training_variable_ids'), {
      wrapper: getWrapper(),
    });

    expect(result.current.filter).toStrictEqual([]);

    act(() => {
      result.current.setFilter([123]);
    });

    expect(result.current.filter).toStrictEqual([123]);
  });

  it('resets the filter value when calling clearFilters', () => {
    const { result } = renderHook(() => useFilter('training_variable_ids'), {
      wrapper: getWrapper(),
    });

    expect(result.current.filter).toStrictEqual([]);

    act(() => {
      result.current.setFilter([123]);
    });
    expect(result.current.filter).toStrictEqual([123]);

    act(() => {
      result.current.clearFilters();
    });
    expect(result.current.filter).toStrictEqual([]);
  });
});
