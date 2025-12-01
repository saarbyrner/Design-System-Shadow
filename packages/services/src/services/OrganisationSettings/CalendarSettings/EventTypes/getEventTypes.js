// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { CustomEventTypeResponse } from './utils/types';
import { customEventTypesUrlBase } from './utils/consts';

export const getEventTypes = async (): Promise<
  Array<CustomEventTypeResponse>
> => {
  const { data } = await axios.get(customEventTypesUrlBase);

  return data;
};
