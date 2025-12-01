// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { InboundElectronicFile } from '@kitman/modules/src/ElectronicFiles/shared/types';

export const endpoint = '/efax/inbound_faxes/archive';

export type RequestResponse = Array<InboundElectronicFile>;

const updateArchived = async ({
  archived,
  inboundElectronicFileIds,
}: {
  archived: boolean,
  inboundElectronicFileIds: Array<number>,
}): Promise<RequestResponse> => {
  const { data } = await axios.patch(endpoint, {
    archived,
    inbound_fax_ids: inboundElectronicFileIds,
  });

  return data;
};

export default updateArchived;
