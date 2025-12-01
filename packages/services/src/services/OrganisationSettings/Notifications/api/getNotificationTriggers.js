// @flow

import { axios } from '@kitman/common/src/utils/services';
import type { NotificationTriggersResponse } from './types';

export const GET_NOTIFICATION_TRIGGERS_URL = '/notification_triggers';

const getNotificationTriggers =
  async (): Promise<NotificationTriggersResponse> => {
    const { data } = await axios.get(GET_NOTIFICATION_TRIGGERS_URL);

    return data;
  };

export default getNotificationTriggers;
