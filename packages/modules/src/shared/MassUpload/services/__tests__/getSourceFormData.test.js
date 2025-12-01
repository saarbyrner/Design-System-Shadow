import { axios } from '@kitman/common/src/utils/services';

import { data as serverResponse } from '../mocks/handlers/getSourceFormData';
import getSourceFormData from '../getSourceFormData';

describe('getSourceFormData', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call the correct endpoint, with the correct data', async () => {
    const response = await getSourceFormData();

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith(
      '/workloads/import_workflow/source_form_data'
    );
  });
});
