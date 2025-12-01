// @flow
import {
  mockContact,
  mockAttachment,
  mockAllocations,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import type { RequestResponse } from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchInboundElectronicFile';

export const data: RequestResponse = {
  data: {
    id: 1,
    title: 'Endorsement',
    received_from: mockContact,
    destination_fax_number: mockContact.fax_number,
    sent_to: mockContact,
    originating_fax_number: mockContact.fax_number,
    viewed: false,
    status: 'STORED',
    date: '2024-04-03T14:50:31Z',
    attachment: mockAttachment,
    efax_allocations: mockAllocations,
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
