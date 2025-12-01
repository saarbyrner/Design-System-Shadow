// @flow
import type { RequestResponse } from '@kitman/modules/src/ElectronicFiles/shared/services/api/searchContactList';
import { mockContact } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';

export const data: RequestResponse = {
  data: [mockContact],
  meta: {
    current_page: 1,
    next_page: 2,
    prev_page: null,
    total_count: 1,
    total_pages: 1,
  },
};

export const response = {
  data,
};
