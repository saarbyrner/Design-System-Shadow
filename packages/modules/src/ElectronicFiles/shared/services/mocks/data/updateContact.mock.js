// @flow
import type { ExistingContact } from '@kitman/modules/src/ElectronicFiles/shared/types';
import { mockContact } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';

export const data: ExistingContact = mockContact;

export const response = {
  data,
};
