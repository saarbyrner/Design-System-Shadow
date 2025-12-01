// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { InboundElectronicFile } from '@kitman/modules/src/ElectronicFiles/shared/types';

export const endpoint = '/efax/inbound_faxes/update_viewed';

export type RequestResponse = {
  updated: Array<InboundElectronicFile>,
  unread: number,
};

const updateViewed = async ({
  viewed,
  inboundElectronicFileIds,
}: {
  viewed: boolean,
  inboundElectronicFileIds: Array<number>,
}): Promise<RequestResponse> => {
  const { data } = await axios.patch(endpoint, {
    viewed,
    inbound_fax_ids: inboundElectronicFileIds,
  });

  return data;
};

export default updateViewed;
