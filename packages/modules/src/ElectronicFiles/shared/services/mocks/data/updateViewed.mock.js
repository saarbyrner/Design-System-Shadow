// @flow
import type { RequestResponse } from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateViewed';
import { data as mockInboundFiles } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';

export const data: RequestResponse = {
  updated: [mockInboundFiles.data[0]],
  unread: 1,
};

export const response = {
  data,
};
