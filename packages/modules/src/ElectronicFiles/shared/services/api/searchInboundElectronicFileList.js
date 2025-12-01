// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  GridFilters,
  GridPagination,
  Meta,
  InboundElectronicFile,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  defaultFilters,
  defaultPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';

export type RequestResponse = {
  data: Array<InboundElectronicFile>,
  meta: Meta,
};

export const endpoint = '/efax/inbound_faxes/search';

const searchInboundElectronicFileList = async ({
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

export default searchInboundElectronicFileList;
