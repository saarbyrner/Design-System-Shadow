// @flow
import { axios } from '@kitman/common/src/utils/services';
import { createUpdateEventTypesUrl } from './utils/helpers';
import type {
  CustomEventTypeUpdate,
  CustomEventTypeResponse,
} from './utils/types';

export const updateEventType = async (
  event: CustomEventTypeUpdate
): Promise<CustomEventTypeResponse> => {
  const url = createUpdateEventTypesUrl(event.id);
  const { data } = await axios.put(url, { ...event });
  return data;
};
