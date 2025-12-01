// @flow

import { useGetEventsUpdatesQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/fixturesAPI';
import { useEffect, useState } from 'react';
import type { EventDetails } from '@kitman/services/src/services/leaguefixtures/getEventsUpdates';
import useIsTabActive from '@kitman/common/src/hooks/useIsTabActive';

type Params = {
  eventIds: number[],
  interval: number,
  skip: boolean,
};

type UseFixturesPooling = {
  data: Array<EventDetails>,
  fulfilledTimeStamp: number | null,
};

export const MIN_EVENTS_REFRESH_INTERVAL_SECONDS = 30;

const toMs = (sec: number) => sec * 1000;

export const getPollingInterval = (seconds: number): number => {
  if (!seconds) {
    return 0;
  }

  if (seconds < MIN_EVENTS_REFRESH_INTERVAL_SECONDS) {
    // eslint-disable-next-line no-console
    console.warn(
      '[schedule_page_refresh_interval_seconds]: ' +
        `Provided interval (${seconds}s) is below the minimum allowed (${MIN_EVENTS_REFRESH_INTERVAL_SECONDS}s). ` +
        'Using minimum interval instead.'
    );

    return toMs(MIN_EVENTS_REFRESH_INTERVAL_SECONDS);
  }

  return toMs(seconds);
};

export const useFixturesPooling = ({
  eventIds,
  interval,
  skip,
}: Params): UseFixturesPooling => {
  const [isErrorOccurred, setIsErrorOccurred] = useState(false);
  const isTabActive = useIsTabActive();
  const isEventsPresent = !!eventIds.length;
  const pollingInterval = getPollingInterval(interval);

  const {
    data = [],
    isError,
    fulfilledTimeStamp,
  } = useGetEventsUpdatesQuery(
    {
      eventIds,
    },
    {
      pollingInterval,
      skip:
        skip ||
        !isTabActive ||
        !pollingInterval ||
        !isEventsPresent ||
        isErrorOccurred,
    }
  );

  useEffect(() => {
    if (isError) {
      setIsErrorOccurred(true);
    }
  }, [isError]);

  return {
    data,
    fulfilledTimeStamp,
  };
};
