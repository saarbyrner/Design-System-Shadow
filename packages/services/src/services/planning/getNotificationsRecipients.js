// @flow
import { axios } from '@kitman/common/src/utils/services';

export type NotificationRecipient = {
  id: number,
  name: string,
  association_id: number,
  email: string,
};

export const notificationsrecipientsRequestUrl = `/planning_hub/association_contacts`;

const getNotificationsRecipients = async (): Promise<
  Array<NotificationRecipient>
> => {
  const { data } = await axios.get(notificationsrecipientsRequestUrl);

  return data;
};

export default getNotificationsRecipients;
