import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/planningEvent/parseFile';

import parseFile from '../parseFile';

describe('parseFile', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const params = {
    file: new File([''], 'test.csv', { type: 'text/csv' }),
    source: 'custom',
  };

  it('should call the correct endpoint, with the correct data', async () => {
    const response = await parseFile(params);

    expect(request.mock.calls[0][0]).toEqual(
      '/workloads/import_workflow/parse_file'
    );
    expect(response).toEqual(serverResponse);
  });
});
