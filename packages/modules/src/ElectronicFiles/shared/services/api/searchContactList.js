// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  ContactsGridFilters,
  GridPagination,
  Meta,
  ExistingContact,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  defaultFilters,
  defaultPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactsGridSlice';

export type RequestResponse = {
  data: Array<ExistingContact>,
  meta: Meta,
};

export const endpoint = '/efax/contacts/search';

const searchContactList = async ({
  filters = defaultFilters,
  pagination = defaultPagination,
}: {
  filters: ContactsGridFilters,
  pagination: GridPagination,
}): Promise<RequestResponse> => {
  const { data } = await axios.post(endpoint, {
    filters,
    pagination,
  });

  return data;
};

export default searchContactList;
