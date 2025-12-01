// @flow
import type { SendElectronicFileResponse } from '@kitman/modules/src/ElectronicFiles/shared/services/api/sendElectronicFile';

export const data: SendElectronicFileResponse = {
  id: 113,
  subject: 'Just a test subject',
  message: 'just a test message',
  status: 'created',
  include_cover_page: true,
};

export const response = {
  data,
};
