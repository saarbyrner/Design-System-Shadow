// @flow
import type { RequestResponse } from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateContactsArchived';
import { mockContact } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';

export const data: RequestResponse = [mockContact];

export const response = {
  data,
};
