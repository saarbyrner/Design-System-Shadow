/* eslint-disable camelcase */
// @flow
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import _last from 'lodash/last';
import {
  onMatchMonitorReportChange,
  onReset,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice';
import { useFetchMatchMonitorReportQuery } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services';
import { useGetPlanningEventQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/planningEventApi';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

const useMatchMonitorReport = () => {
  const dispatch = useDispatch();
  const pathname = useLocationPathname();
  const eventId = parseInt(_last(pathname.split('/')), 10);

  const {
    data: matchReport,
    isLoading: isReportLoading,
    isError: isReportError,
    isSuccess: isReportSuccess,
  } = useFetchMatchMonitorReportQuery(eventId, {
    skip: !eventId,
  });

  const {
    data: eventData,
    isLoading: isEventLoading,
    isError: isEventError,
    isSuccess: isEventSuccess,
  } = useGetPlanningEventQuery(
    {
      eventId,
    },
    {
      skip: !eventId,
    }
  );

  useEffect(() => {
    if (matchReport) {
      const {
        game_monitor_report_athletes,
        game_monitor_report_unregistered_athletes,
        notes,
        monitor_issue,
        submitted_by_id,
        submitted,
        updated_at,
      } = matchReport;
      dispatch(
        onMatchMonitorReportChange({
          game_monitor_report_athletes,
          game_monitor_report_unregistered_athletes,
          notes,
          monitor_issue,
          submitted_by_id,
          submitted,
          updated_at,
        })
      );
    } else {
      dispatch(onReset());
    }
  }, [matchReport, dispatch]);

  return {
    isLoading: isReportLoading || isEventLoading,
    hasFailed: isReportError || isEventError,
    isSuccess: isEventSuccess && isReportSuccess,
    event: eventData?.event,
  };
};

export default useMatchMonitorReport;
