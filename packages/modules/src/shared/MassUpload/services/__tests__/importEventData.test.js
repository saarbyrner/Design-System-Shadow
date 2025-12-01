import { axios } from '@kitman/common/src/utils/services';

import { data as serverResponse } from '../mocks/handlers/importEventData';
import importEventData from '../importEventData';

describe('importEventData', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const payload = {
    event: { id: 1 },
    sourceData: {
      type: 'FILE',
      fileData: {
        file: new File([''], 'test.csv', { type: 'text/csv' }),
        source: 'custom',
      },
    },
  };

  it('should call the correct endpoint, with the correct data', async () => {
    const response = await importEventData(payload);

    expect(response).toEqual(serverResponse);
    expect(request.mock.calls[0][0]).toEqual(
      '/workloads/import_workflow/perform'
    );
  });
});
