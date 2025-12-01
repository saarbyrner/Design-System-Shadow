// @flow
import type { InboundElectronicFile } from '@kitman/modules/src/ElectronicFiles/shared/types';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';

export const data: InboundElectronicFile = {
  ...inboundData.data[0],
  efax_allocations: [
    {
      id: 2,
      athlete_id: 13,
      athlete: {
        id: 3392,
        firstname: 'Phil',
        lastname: 'Funk',
      },
      range: '1,4,5-7',
      file_name: 'testing/testing-0.pdf',
      document_date: '2024-02-07T00:00:00Z',
      medical_attachment_category_ids: [2, 3, 4],
    },
  ],
};

export const response = {
  data,
};
