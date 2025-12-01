// @flow
import type { SplitConfig } from '@kitman/services/src/services/medical/scanning/splitDocument';

const mockSplitConfig: SplitConfig = {
  range_assignments: [
    {
      range: '1-2',
      athlete_id: 3,
      athlete: {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
      },
      medical_attachment_category_ids: [4, 5],
      document_date: '2024-02-07T00:00:00Z',
      file_name: 'testFilename',
    },
  ],
};

export default mockSplitConfig;
