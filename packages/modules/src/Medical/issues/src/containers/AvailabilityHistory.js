import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import {
  useGetInjuryStatusesQuery,
  useGetReopeningReasonsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { AvailabilityHistoryTranslated as AvailabilityHistory } from '@kitman/modules/src/Medical/issues/src/components/AvailabilityHistory';

const AvailabilityHistoryContainer = (props) => {
  const {
    data: injuryStatuses = [],
    error: injuryStatusesError,
    isLoading: isInjuryStatusesLoading,
  } = useGetInjuryStatusesQuery();

  const {
    data: reopeningReasons = [],
    error: reopeningReasonsError,
    isLoading: isReopeningReasonsLoading,
  } = useGetReopeningReasonsQuery(null, {
    skip: !window.featureFlags['reason-for-reopening'],
  });

  if (injuryStatusesError || reopeningReasonsError) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isInjuryStatusesLoading || isReopeningReasonsLoading) {
    return <DelayedLoadingFeedback />;
  }

  return (
    <AvailabilityHistory
      injuryStatuses={injuryStatuses}
      reopeningReasons={reopeningReasons}
      {...props}
    />
  );
};

export default AvailabilityHistoryContainer;
