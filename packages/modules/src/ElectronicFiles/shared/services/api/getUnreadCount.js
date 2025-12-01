// @flow
import { axios } from '@kitman/common/src/utils/services';

export const endpoint = '/efax/inbound_faxes/unread';

export type RequestResponse = {
  unread: number,
};

const getUnreadCount = async (): Promise<RequestResponse> => {
  const { data } = await axios.get(endpoint);

  return data;
};

export default getUnreadCount;
