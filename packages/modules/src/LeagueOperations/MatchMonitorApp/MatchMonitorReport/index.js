// @flow
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import useMatchMonitorReport from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/hooks/useMatchMonitorReport';
import { MatchMonitorReportTranslated as MatchMonitorReport } from './src/App';

export default () => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();
  const {
    isLoading: isReportLoading,
    hasFailed: hasReportFailed,
    isSuccess: isReportSuccess,
    event,
  } = useMatchMonitorReport();

  if (hasFailed || hasReportFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading || isReportLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess && isReportSuccess) {
    return <MatchMonitorReport event={event} />;
  }

  return null;
};
