import { renderHook, act } from '@testing-library/react-hooks';
import {
  useGetPaginatedAthleteEventsQuery,
  useUpdateAthleteEventsMutation,
  useUpdateAthleteAttendanceMutation,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi';
import data from '@kitman/modules/src/PlanningEvent/src/components/CustomEventsAthletesTab/utils/athleteEventsMock';
import useManageAthleteEventsGrid from '../useManageAthleteEventsGrid';

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi'
);

describe('useManageAthleteEventsGrid', () => {
  const mockRefetchFn = jest.fn();

  beforeEach(() => {
    useGetPaginatedAthleteEventsQuery.mockReturnValue({
      data: { athlete_events: data },
      isSuccess: true,
      isError: false,
      refetch: mockRefetchFn,
    });
    useUpdateAthleteEventsMutation.mockReturnValue([
      'updateAthleteEvents',
      { isSuccess: true, isError: false },
    ]);
    useUpdateAthleteAttendanceMutation.mockReturnValue([
      'updateAthleteAttendance',
      { isSuccess: true },
    ]);
  });
  it('returns initial data', async () => {
    const { result } = renderHook(() => useManageAthleteEventsGrid(1));

    expect(result.current).toHaveProperty('isError');
    expect(result.current.isError).toEqual(false);
    expect(result.current).toHaveProperty('isSuccess');
    expect(result.current.isSuccess).toEqual(true);
    expect(result.current).toHaveProperty('data');
    expect(result.current.data.athlete_events).toEqual(data);
    expect(result.current).toHaveProperty('nextId');
    expect(result.current.nextId).toEqual(null);
    expect(result.current).toHaveProperty('resetAthleteEventsGrid');
    expect(result.current).toHaveProperty('getNextAthleteEvents');
  });

  it('correctly sets next id to null when resetting grid', () => {
    const { result } = renderHook(() => useManageAthleteEventsGrid(1));
    act(() => result.current.resetAthleteEventsGrid());
    expect(result.current.nextId).toEqual(null);
    expect(mockRefetchFn).toHaveBeenCalled();
  });

  it('correctly sets next id when a paginated call is made', () => {
    const { result } = renderHook(() => useManageAthleteEventsGrid(1));
    act(() => result.current.getNextAthleteEvents(456));
    expect(result.current.nextId).toEqual(456);
  });
});
