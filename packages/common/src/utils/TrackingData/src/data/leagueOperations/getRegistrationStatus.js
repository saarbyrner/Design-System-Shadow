// @flow

import type {
  RegistrationStatusData,
  RegistrationStatusEventData,
} from '@kitman/common/src/utils/TrackingData/src/types/leagueOperations';

export const getRegistrationStatus = ({
  status,
  annotation,
}: RegistrationStatusData): RegistrationStatusEventData => {
  const getAnnotations = annotation ? { Annotations: Boolean(annotation) } : {};

  return {
    ...getAnnotations,
    Status: [status],
  };
};

export default getRegistrationStatus;
