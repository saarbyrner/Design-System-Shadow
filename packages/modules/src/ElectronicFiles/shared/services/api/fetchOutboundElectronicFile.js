// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  GridFilters,
  NavMeta,
  OutboundElectronicFile,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import { defaultFilters } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';

export type RequestResponse = {
  data: ?OutboundElectronicFile,
  meta: NavMeta,
};

export const generateEndpointUrl = (id: number) =>
  `/efax/outbound_messages/${id}`;

const fetchOutboundElectronicFile = async ({
  id,
  filters = defaultFilters,
}: {
  id: number,
  filters: GridFilters,
}): Promise<RequestResponse> => {
  const { data } = filters
    ? await axios.post(generateEndpointUrl(id), {
        filters,
      })
    : await axios.get(generateEndpointUrl(id));

  return data;
};

export default fetchOutboundElectronicFile;
