// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  GridFilters,
  GridPagination,
  Meta,
  OutboundElectronicFile,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  defaultFilters,
  defaultPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';

export const endpoint = '/efax/outbound_messages/search';

export type RequestResponse = {
  data: Array<OutboundElectronicFile>,
  meta: Meta,
};

const searchOutboundElectronicFileList = async ({
  filters = defaultFilters,
  pagination = defaultPagination,
}: {
  filters: GridFilters,
  pagination: GridPagination,
}): Promise<RequestResponse> => {
  const { data } = await axios.post(endpoint, {
    filters,
    pagination,
  });

  return data;
};

export default searchOutboundElectronicFileList;
