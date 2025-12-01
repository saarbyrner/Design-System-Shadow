// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  NewCustomEventType,
  CustomEventTypeResponse,
} from './utils/types';
import { customEventTypesUrlBase } from './utils/consts';

export const createEventType = async (
  event: NewCustomEventType
): Promise<CustomEventTypeResponse> => {
  // squads are not used right now
  const {
    // squads,
    ...restEvent
  } = event;

  const { data } = await axios.post(customEventTypesUrlBase, restEvent);

  return data;
};
