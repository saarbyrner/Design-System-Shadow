// @flow
import { axios } from '@kitman/common/src/utils/services';

const getTSOEvents = async (
  startDate: string,
  endDate: string,
  abortSignal?: AbortSignal
) => {
  if (window.featureFlags['tso-event-management']) {
    const { data } = await axios.post(
      '/calendar/tso_events',
      {
        start: startDate,
        end: endDate,
      },
      { signal: abortSignal }
    );

    return data;
  }
  return [];
};

export default getTSOEvents;
