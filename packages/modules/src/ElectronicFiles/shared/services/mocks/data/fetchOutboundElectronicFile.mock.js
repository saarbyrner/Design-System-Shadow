// @flow
import {
  mockContact,
  mockAttachment,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import type { RequestResponse } from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchOutboundElectronicFile';

export const data: RequestResponse = {
  data: {
    id: 1,
    title: 'Title 0001',
    message: 'Message 0001',
    received_from: mockContact,
    sent_to: [mockContact],
    status: 'sent',
    date: '2024-03-24T00:00:00Z',
    attachments: [mockAttachment],
    archived: false,
    archived_at: null,
    archived_by: null,
  },
  meta: {
    next_id: 262,
    prev_id: 52,
  },
};

export const response = {
  data,
};
