// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { NotificationTriggersUpdateRequestBody } from './types';

export const generateUpdateNotificationTriggersUrl = (id: number) =>
  `/notification_triggers/${id}`;

const updateNotificationTriggers = async ({
  id,
  requestBody,
}: {
  id: number,
  requestBody: NotificationTriggersUpdateRequestBody,
}): Promise<{}> => {
  const url = generateUpdateNotificationTriggersUrl(id);
  const { data } = await axios.put(url, requestBody);

  return data;
};

export default updateNotificationTriggers;
