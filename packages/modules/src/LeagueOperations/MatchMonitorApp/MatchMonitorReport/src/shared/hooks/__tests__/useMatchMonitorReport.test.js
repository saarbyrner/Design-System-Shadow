import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import {
  onMatchMonitorReportChange,
  onReset,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice';
import { useFetchMatchMonitorReportQuery } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services';
import { useGetPlanningEventQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/planningEventApi';
import { mockGame as mockedEvent } from '@kitman/modules/src/shared/FixtureScheduleView/__tests__/mockFixtureGame';
import mockMatchReport from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/data/match_monitor_report';

import useMatchMonitorReport from '../useMatchMonitorReport';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services',
  () => ({
    useFetchMatchMonitorReportQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/planningEventApi',
  () => ({
    useGetPlanningEventQuery: jest.fn(),
  })
);

describe('useMatchMonitorReport', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useGetPlanningEventQuery.mockReturnValue({
      data: mockedEvent,
      isLoading: false,
      isError: false,
      isSuccess: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch onMatchMonitorReportChange when data is fetched successfully', async () => {
    useFetchMatchMonitorReportQuery.mockReturnValue({
      data: mockMatchReport,
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    // Render hook
    const { result } = renderHook(() => useMatchMonitorReport());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasFailed).toBe(false);
    expect(result.current.isSuccess).toBe(true);

    // Check that the action is dispatched with correct payload
    expect(dispatchMock).toHaveBeenCalledWith(
      onMatchMonitorReportChange({
        game_monitor_report_athletes:
          mockMatchReport.game_monitor_report_athletes,
        game_monitor_report_unregistered_athletes:
          mockMatchReport.game_monitor_report_unregistered_athletes,
        notes: mockMatchReport.notes,
        monitor_issue: mockMatchReport.monitor_issue,
        submitted_by_id: mockMatchReport.submitted_by_id,
      })
    );
  });

  it('should call onReset when no additional user data is available', () => {
    useFetchMatchMonitorReportQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });

    const { result } = renderHook(() => useMatchMonitorReport());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasFailed).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(dispatchMock).toHaveBeenCalledWith(onReset());
  });
});
