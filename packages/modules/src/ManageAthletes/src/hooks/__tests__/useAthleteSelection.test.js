import { renderHook } from '@testing-library/react-hooks';
import TestRenderer from 'react-test-renderer';
import useAthleteSelection from '../useAthleteSelection';

describe('useBulkActions hook', () => {
  const { act } = TestRenderer;
  it('returns the initial data properly', () => {
    const { result } = renderHook(() => useAthleteSelection());

    expect(result.current).toHaveProperty('selectedAthleteIds');
    expect(result.current).toHaveProperty('setSelectedAthleteIds');
    expect(result.current).toHaveProperty('toggleSingleAthleteSelection');

    expect(result.current.selectedAthleteIds).toEqual([]);
  });

  it('updates one athlete properly', () => {
    const exampleAthlete = { id: 123 };
    const { result } = renderHook(() => useAthleteSelection());

    act(() => {
      result.current.toggleSingleAthleteSelection(exampleAthlete, true);
    });

    expect(result.current.selectedAthleteIds.length).toEqual(1);
    expect(result.current.selectedAthleteIds).toEqual([exampleAthlete]);

    act(() => {
      result.current.toggleSingleAthleteSelection(exampleAthlete, false);
    });

    expect(result.current.selectedAthleteIds.length).toEqual(0);
  });

  it('sets the selected athlete ids', () => {
    const additionalAthleteIds = [1, 2, 3];
    const { result } = renderHook(() => useAthleteSelection());

    act(() => {
      result.current.setSelectedAthleteIds(additionalAthleteIds);
    });

    expect(result.current.selectedAthleteIds.length).toEqual(
      additionalAthleteIds.length
    );
    expect(result.current.selectedAthleteIds).toEqual(additionalAthleteIds);
  });
});
