// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  GridFilters,
  NavMeta,
  InboundElectronicFile,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import { defaultFilters } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';

export type RequestResponse = {
  data: ?InboundElectronicFile,
  meta: NavMeta,
};

export const generateEndpointUrl = (id: number) => `/efax/inbound_faxes/${id}`;

const fetchInboundElectronicFile = async ({
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

export default fetchInboundElectronicFile;
