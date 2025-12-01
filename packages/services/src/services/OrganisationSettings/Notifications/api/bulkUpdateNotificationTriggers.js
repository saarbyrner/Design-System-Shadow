// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { BulkNotificationTriggersUpdateRequestBody } from './types';

export const generateUpdateBulkUpdateNotificationTriggersUrl = () =>
  '/notification_triggers/bulk_update';

const bulkUpdateNotificationTriggers = async ({
  requestBody,
}: {
  requestBody: BulkNotificationTriggersUpdateRequestBody,
}): Promise<{}> => {
  const url = generateUpdateBulkUpdateNotificationTriggersUrl();
  const { data } = await axios.put(url, requestBody);

  return data;
};

export default bulkUpdateNotificationTriggers;
