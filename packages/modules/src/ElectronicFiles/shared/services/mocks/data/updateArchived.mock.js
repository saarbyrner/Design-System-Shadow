// @flow
import type { RequestResponse } from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateArchived';
import { data as mockInboundFiles } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';

export const data: RequestResponse = [mockInboundFiles.data[0]];

export const response = {
  data,
};
